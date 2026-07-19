// seed/seedExtendedRelationships.js
require('dotenv').config();
const mongoose = require('mongoose');

const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const Brand = require('../src/models/Brand');
const Relationship = require('../src/models/Relationship');

async function ensureCategory(name) {
  let cat = await Category.findOne({ name });
  if (!cat) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    cat = await Category.create({ name, slug });
  }
  return cat;
}

async function ensureBrand(name) {
  let brand = await Brand.findOne({ name });
  if (!brand) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    brand = await Brand.create({ name, slug });
  }
  return brand;
}

async function ensureProduct(data, catId, brandId) {
  let p = await Product.findOne({ name: data.name });
  if (!p) {
    p = await Product.create({
      productName: data.name,
      name: data.name,
      category: catId,
      subcategory: data.subcategory,
      brand: brandId,
      price: data.price,
      rating: data.rating,
      popularity: data.popularity,
      stock: 100,
      isActive: true
    });
  } else {
    // Update existing
    p.category = catId;
    p.subcategory = data.subcategory;
    p.brand = brandId; // fix missing brand
    if (!p.productName) p.productName = data.name; // fix missing productName
    p.price = data.price;
    await p.save();
  }
  return p;
}

async function run() {
  try {
    console.log("🌱 Seeding Extended Relationships & Products...");

    const electronicsCat = await ensureCategory("Electronics");
    const fashionCat = await ensureCategory("Fashion");
    const beautyCat = await ensureCategory("Beauty");
    const homeCat = await ensureCategory("Home");
    const kitchenCat = await ensureCategory("Kitchen");

    const genericBrand = await ensureBrand("Generic");

    // Product definitions
    const productsData = [
      // Electronics - Laptops
      { name: 'Laptop', cat: electronicsCat, sub: 'Laptops', price: 60000, rating: 4.8, pop: 90 },
      { name: 'Mouse', cat: electronicsCat, sub: 'Laptops', price: 500, rating: 4.5, pop: 85 },
      { name: 'Keyboard', cat: electronicsCat, sub: 'Laptops', price: 1000, rating: 4.2, pop: 80 },
      { name: 'Laptop Bag', cat: electronicsCat, sub: 'Laptops', price: 1200, rating: 4.6, pop: 70 },
      { name: 'Cooling Pad', cat: electronicsCat, sub: 'Laptops', price: 800, rating: 4.0, pop: 50 },
      { name: 'USB Hub', cat: electronicsCat, sub: 'Laptops', price: 600, rating: 4.4, pop: 65 },
      { name: 'External SSD', cat: electronicsCat, sub: 'Laptops', price: 5000, rating: 4.9, pop: 60 },
      { name: 'Monitor', cat: electronicsCat, sub: 'Laptops', price: 12000, rating: 4.7, pop: 40 },
      
      // Electronics - Mobile
      { name: 'Mobile Phone', cat: electronicsCat, sub: 'Mobile Phones', price: 40000, rating: 4.7, pop: 95 },
      { name: 'Charger', cat: electronicsCat, sub: 'Mobile Phones', price: 800, rating: 4.6, pop: 90 },
      { name: 'Screen Protector', cat: electronicsCat, sub: 'Mobile Phones', price: 200, rating: 4.1, pop: 88 },
      { name: 'Phone Case', cat: electronicsCat, sub: 'Mobile Phones', price: 400, rating: 4.5, pop: 85 },
      { name: 'Earbuds', cat: electronicsCat, sub: 'Mobile Phones', price: 2000, rating: 4.8, pop: 92 },
      { name: 'Power Bank', cat: electronicsCat, sub: 'Mobile Phones', price: 1500, rating: 4.5, pop: 75 },

      // Fashion
      { name: 'Sneakers', cat: fashionCat, sub: 'Sneakers', price: 3000, rating: 4.6, pop: 85 },
      { name: 'Sports Socks', cat: fashionCat, sub: 'Sneakers', price: 300, rating: 4.4, pop: 70 },
      { name: 'Shoe Cleaner', cat: fashionCat, sub: 'Sneakers', price: 400, rating: 4.2, pop: 50 },
      { name: 'Shoe Bag', cat: fashionCat, sub: 'Sneakers', price: 250, rating: 4.0, pop: 40 },
      { name: 'Insoles', cat: fashionCat, sub: 'Sneakers', price: 500, rating: 4.3, pop: 30 },
      { name: 'Shoe Laces', cat: fashionCat, sub: 'Sneakers', price: 100, rating: 4.1, pop: 20 },

      { name: 'Jeans', cat: fashionCat, sub: 'Jeans', price: 2000, rating: 4.5, pop: 80 },
      { name: 'Belt', cat: fashionCat, sub: 'Jeans', price: 500, rating: 4.3, pop: 60 },
      { name: 'T-Shirt', cat: fashionCat, sub: 'Jeans', price: 800, rating: 4.4, pop: 85 },

      { name: 'Shirt', cat: fashionCat, sub: 'Shirts', price: 1500, rating: 4.4, pop: 70 },
      { name: 'Tie', cat: fashionCat, sub: 'Shirts', price: 400, rating: 4.2, pop: 40 },
      { name: 'Formal Pants', cat: fashionCat, sub: 'Shirts', price: 1800, rating: 4.5, pop: 65 },
      { name: 'Blazer', cat: fashionCat, sub: 'Shirts', price: 5000, rating: 4.7, pop: 50 },

      // Beauty
      { name: 'Shampoo', cat: beautyCat, sub: 'Shampoo', price: 400, rating: 4.4, pop: 75 },
      { name: 'Conditioner', cat: beautyCat, sub: 'Shampoo', price: 400, rating: 4.3, pop: 70 },
      { name: 'Hair Serum', cat: beautyCat, sub: 'Shampoo', price: 600, rating: 4.5, pop: 60 },
      { name: 'Hair Mask', cat: beautyCat, sub: 'Shampoo', price: 800, rating: 4.6, pop: 50 },

      // Home
      { name: 'Dining Table', cat: homeCat, sub: 'Dining Table', price: 25000, rating: 4.8, pop: 40 },
      { name: 'Dining Chairs', cat: homeCat, sub: 'Dining Table', price: 8000, rating: 4.6, pop: 35 },
      { name: 'Table Cover', cat: homeCat, sub: 'Dining Table', price: 1000, rating: 4.2, pop: 50 },
      { name: 'Placemats', cat: homeCat, sub: 'Dining Table', price: 500, rating: 4.1, pop: 45 },

      // Kitchen
      { name: 'Mixer', cat: kitchenCat, sub: 'Mixer', price: 3500, rating: 4.5, pop: 60 },
      { name: 'Grinder Jar', cat: kitchenCat, sub: 'Mixer', price: 800, rating: 4.3, pop: 40 },
      { name: 'Cleaning Brush', cat: kitchenCat, sub: 'Mixer', price: 150, rating: 4.0, pop: 30 },
    ];

    const productMap = {};
    for (const d of productsData) {
      const p = await ensureProduct(d, d.cat._id, genericBrand._id);
      productMap[p.name] = p;
    }

    // Now seed relationships
    const pairs = [
      // Laptop
      ['Laptop', 'Mouse', 0.95, 'accessory'],
      ['Laptop', 'Keyboard', 0.90, 'accessory'],
      ['Laptop', 'Laptop Bag', 0.85, 'accessory'],
      ['Laptop', 'Cooling Pad', 0.80, 'accessory'],
      ['Laptop', 'USB Hub', 0.75, 'accessory'],
      ['Laptop', 'External SSD', 0.70, 'accessory'],
      ['Laptop', 'Monitor', 0.65, 'complementary'],
      
      // Mobile
      ['Mobile Phone', 'Charger', 0.98, 'accessory'],
      ['Mobile Phone', 'Screen Protector', 0.95, 'accessory'],
      ['Mobile Phone', 'Phone Case', 0.90, 'accessory'],
      ['Mobile Phone', 'Earbuds', 0.85, 'complementary'],
      ['Mobile Phone', 'Power Bank', 0.80, 'accessory'],

      // Fashion
      ['Sneakers', 'Sports Socks', 0.95, 'frequently_bought_together'],
      ['Sneakers', 'Shoe Cleaner', 0.85, 'accessory'],
      ['Sneakers', 'Shoe Bag', 0.80, 'accessory'],
      ['Sneakers', 'Insoles', 0.75, 'accessory'],
      ['Sneakers', 'Shoe Laces', 0.70, 'accessory'],

      ['Jeans', 'Belt', 0.90, 'accessory'],
      ['Jeans', 'T-Shirt', 0.85, 'complementary'],
      ['Jeans', 'Sneakers', 0.80, 'complementary'],

      ['Shirt', 'Tie', 0.95, 'accessory'],
      ['Shirt', 'Formal Pants', 0.90, 'complementary'],
      ['Shirt', 'Blazer', 0.85, 'complementary'],

      // Beauty
      ['Shampoo', 'Conditioner', 0.98, 'frequently_bought_together'],
      ['Shampoo', 'Hair Serum', 0.85, 'complementary'],
      ['Shampoo', 'Hair Mask', 0.80, 'complementary'],

      // Home
      ['Dining Table', 'Dining Chairs', 0.98, 'complementary'],
      ['Dining Table', 'Table Cover', 0.90, 'accessory'],
      ['Dining Table', 'Placemats', 0.85, 'accessory'],

      // Kitchen
      ['Mixer', 'Grinder Jar', 0.95, 'accessory'],
      ['Mixer', 'Cleaning Brush', 0.80, 'accessory']
    ];

    await Relationship.deleteMany({}); // Clear old relationships to ensure clean slate

    let inserted = 0;
    for (const [p1, p2, score, type] of pairs) {
      const prod1 = productMap[p1];
      const prod2 = productMap[p2];

      if (prod1 && prod2) {
        await Relationship.create({
          productId: prod1._id,
          relatedProductId: prod2._id,
          relationshipScore: score,
          type: type || 'complementary'
        });
        inserted++;
      }
    }

    console.log(`✅ Seeded ${Object.keys(productMap).length} products`);
    console.log(`✅ Inserted ${inserted} explicit relationships`);

    mongoose.disconnect();

  } catch (err) {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    run();
  })
  .catch(err => {
    console.log('❌ Connection failed:', err.message);
    process.exit(1);
  });
