const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const mockProducts = require('./src/data/mockProducts.json');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    
    console.log("Connected! Wiping all products...");
    await Product.deleteMany({});
    
    console.log(`Database wiped. Inserting ${mockProducts.length} mock products...`);
    
    // Clean up IDs before inserting so Mongoose generates new ObjectIds or uses string IDs
    // Wait, the schema has `_id` as default ObjectId.
    // If the mock products have string IDs like "mock-id-10", Mongoose will throw CastError if we try to insert them as _id if _id is ObjectId.
    // Let's remove the _id from the mock products before inserting so MongoDB auto-generates real ObjectIds.
    const cleanedProducts = mockProducts.map(p => {
      const { _id, ...rest } = p;
      
      // Fix popularity if it's a string
      if (typeof rest.popularity === 'string') {
        if (rest.popularity === 'High') rest.popularity = 90;
        else if (rest.popularity === 'Medium') rest.popularity = 50;
        else if (rest.popularity === 'Low') rest.popularity = 10;
        else rest.popularity = parseInt(rest.popularity) || 50;
      }
      
      // Ensure name exists
      if (!rest.name) {
        rest.name = rest.productName;
      }
      
      return rest;
    });
    
    await Product.insertMany(cleanedProducts);
    console.log("Successfully seeded database with mock products!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
