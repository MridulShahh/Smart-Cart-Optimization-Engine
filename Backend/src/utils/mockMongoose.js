const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../data/db.json');

// Ensure db directory exists
if (!fs.existsSync(path.dirname(dbFilePath))) {
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
}

let db = {
  Product: [],
  User: [],
  Cart: [],
  Order: [],
  RecommendationHistory: [],
  Relationship: []
};

if (fs.existsSync(dbFilePath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  } catch (e) {
    console.error('Failed to load JSON database, resetting:', e);
  }
}

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2), 'utf8');
}

function generateId() {
  return Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
}

const schemas = {};
const models = {};

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
    this.preHooks = {};
    this.methods = {};
  }
  
  pre(hookName, fn) {
    if (!this.preHooks[hookName]) {
      this.preHooks[hookName] = [];
    }
    this.preHooks[hookName].push(fn);
    return this;
  }
}

Schema.Types = {
  ObjectId: String
};

class QueryHelper {
  constructor(promise) {
    this.promise = promise;
    this.populatePaths = [];
  }
  
  populate(path) {
    this.populatePaths.push(path);
    return this;
  }
  
  select(fields) {
    return this;
  }
  
  then(onResolve, onReject) {
    return this.promise.then(async (result) => {
      if (result) {
        if (Array.isArray(result)) {
          const populatedList = [];
          for (let item of result) {
            const populatedItem = await this._applyPopulate(item);
            populatedList.push(populatedItem);
          }
          return populatedList;
        } else {
          return await this._applyPopulate(result);
        }
      }
      return result;
    }).then(onResolve, onReject);
  }
  
  async _applyPopulate(item) {
    if (!item) return item;
    const populated = JSON.parse(JSON.stringify(item));
    const modelName = populated._modelName;
    if (modelName && models[modelName]) {
      Object.setPrototypeOf(populated, models[modelName].prototype);
      const schema = schemas[modelName];
      if (schema && schema.methods) {
        for (const [key, fn] of Object.entries(schema.methods)) {
          populated[key] = fn.bind(populated);
        }
      }
    }
    
    for (const pathStr of this.populatePaths) {
      if (pathStr === 'items.product' && populated.items) {
        for (let subItem of populated.items) {
          if (subItem.product && typeof subItem.product === 'string') {
            const ProductModel = models['Product'];
            const prod = await ProductModel.findById(subItem.product);
            if (prod) subItem.product = prod;
          }
        }
      } else if (pathStr === 'product' && populated.product && typeof populated.product === 'string') {
        const ProductModel = models['Product'];
        const prod = await ProductModel.findById(populated.product);
        if (prod) populated.product = prod;
      } else if (pathStr === 'user' && populated.user && typeof populated.user === 'string') {
        const UserModel = models['User'];
        const user = await UserModel.findById(populated.user);
        if (user) populated.user = user;
      }
    }
    return populated;
  }
}

function matchQuery(item, query) {
  if (!query) return true;
  for (const [key, val] of Object.entries(query)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('$ne' in val) {
        if (item[key] === val['$ne']) return false;
      }
      if ('$in' in val) {
        if (!val['$in'].includes(item[key])) return false;
      }
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

function createModel(modelName, schema) {
  schemas[modelName] = schema;
  
  if (!db[modelName]) {
    db[modelName] = [];
  }
  
  class MongooseModel {
    static modelName = modelName;
    
    constructor(data) {
      Object.assign(this, data);
      this._modelName = modelName;
      if (!this._id) {
        this._id = generateId();
      }
      if (schema && schema.methods) {
        for (const [key, fn] of Object.entries(schema.methods)) {
          this[key] = fn.bind(this);
        }
      }
    }

    isModified(path) {
      if (path === 'password') {
        return this.password && (typeof this.password === 'string') && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$');
      }
      return true;
    }
    
    async save() {
      if (schema && schema.preHooks && schema.preHooks['save']) {
        for (const hook of schema.preHooks['save']) {
          await new Promise((resolve, reject) => {
            hook.call(this, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
      
      const index = db[modelName].findIndex(item => item._id === this._id);
      const plainData = JSON.parse(JSON.stringify(this));
      plainData._modelName = modelName;
      
      if (index > -1) {
        db[modelName][index] = plainData;
      } else {
        db[modelName].push(plainData);
      }
      saveDb();
      return this;
    }
    
    async deleteOne() {
      db[modelName] = db[modelName].filter(item => item._id !== this._id);
      saveDb();
      return { deletedCount: 1 };
    }
    
    async populate(pathStr) {
      // Populate references on instance (e.g. await cart.populate("items.product"))
      if (pathStr === 'items.product' && this.items) {
        for (let subItem of this.items) {
          if (subItem.product && typeof subItem.product === 'string') {
            const ProductModel = models['Product'];
            if (ProductModel) {
              const prod = await ProductModel.findById(subItem.product);
              if (prod) subItem.product = prod;
            }
          }
        }
      } else if (pathStr === 'product' && this.product && typeof this.product === 'string') {
        const ProductModel = models['Product'];
        if (ProductModel) {
          const prod = await ProductModel.findById(this.product);
          if (prod) this.product = prod;
        }
      }
      return this;
    }
    
    static find(query) {
      const promise = Promise.resolve(
        db[modelName]
          .filter(item => matchQuery(item, query))
          .map(item => new MongooseModel(item))
      );
      return new QueryHelper(promise);
    }
    
    static findOne(query) {
      const found = db[modelName].find(item => matchQuery(item, query));
      const promise = Promise.resolve(found ? new MongooseModel(found) : null);
      return new QueryHelper(promise);
    }
    
    static findById(id) {
      const found = db[modelName].find(item => item._id === id);
      const promise = Promise.resolve(found ? new MongooseModel(found) : null);
      return new QueryHelper(promise);
    }
    
    static countDocuments(query) {
      const count = db[modelName].filter(item => matchQuery(item, query)).length;
      return Promise.resolve(count);
    }
    
    static async create(data) {
      const inst = new MongooseModel(data);
      await inst.save();
      return inst;
    }

    static findByIdAndUpdate(id, update, options) {
      const found = db[modelName].find(item => item._id === id);
      if (found) {
        // Handle MongoDB update operators
        if (update && update.$inc) {
          for (const [key, val] of Object.entries(update.$inc)) {
            found[key] = (found[key] || 0) + val;
          }
        } else if (update && update.$set) {
          Object.assign(found, update.$set);
        } else {
          // Plain update (no operators)
          const cleanUpdate = { ...update };
          delete cleanUpdate.$inc;
          delete cleanUpdate.$set;
          Object.assign(found, cleanUpdate);
        }
        saveDb();
        return Promise.resolve(new MongooseModel(found));
      }
      return Promise.resolve(null);
    }

    static findByIdAndDelete(id) {
      const found = db[modelName].find(item => item._id === id);
      if (found) {
        db[modelName] = db[modelName].filter(item => item._id !== id);
        saveDb();
        return Promise.resolve(new MongooseModel(found));
      }
      return Promise.resolve(null);
    }
    
    static async insertMany(items) {
      const saved = [];
      for (const item of items) {
        const inst = new MongooseModel(item);
        await inst.save();
        saved.push(inst);
      }
      return saved;
    }
    
    static async deleteMany(query) {
      const initialLength = db[modelName].length;
      db[modelName] = db[modelName].filter(item => !matchQuery(item, query));
      saveDb();
      return { deletedCount: initialLength - db[modelName].length };
    }
  }
  
  models[modelName] = MongooseModel;
  return MongooseModel;
}

const mockMongoose = {
  Schema,
  model: createModel,
  connect: async (uri) => {
    console.log(`[MOCK MONGOOSE] Simulated connection successful to local JSON file`);
    return true;
  },
  connection: {
    on: () => {},
    once: () => {}
  }
};

module.exports = mockMongoose;
