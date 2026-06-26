// seed/seed.js
// Run this file once to fill your database with sample data
// Command: node seed/seed.js

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => {
    console.log(' Connection failed:', err.message);
    process.exit(1);
  });

// ─── Schemas ──────────────────────────────────────────────────────────────────

const productSchema = new mongoose.Schema({
  productName : String,
  category    : String,
  brand       : String,
  price       : Number,
  rating      : Number,       // 1.0 to 5.0
  popularity  : String,       // "High", "Medium", "Low"
  createdAt   : { type: Date, default: Date.now }
});

const relationshipSchema = new mongoose.Schema({
  productId        : mongoose.Schema.Types.ObjectId,
  relatedProductId : mongoose.Schema.Types.ObjectId,
  relationshipScore: Number   // 0.0 to 1.0
});

const Product      = mongoose.model('Product',      productSchema);
const Relationship = mongoose.model('Relationship', relationshipSchema);

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  try {

    // Step 1 — Clear old data so we start fresh every time
    console.log('\n🗑️  Clearing old data...');
    await Product.deleteMany({});
    await Relationship.deleteMany({});
    console.log(' Old data cleared');

    // ── Step 2 — Insert Products ────────────────────────────────────────────

    console.log('\n📦 Inserting products...');

    const products = await Product.insertMany([

      // ── Electronics ──
      {
        productName : 'Laptop',
        category    : 'Electronics',
        brand       : 'Dell',
        price       : 60000,
        rating      : 4.5,
        popularity  : 'High'
      },
      {
        productName : 'Mobile Phone',
        category    : 'Electronics',
        brand       : 'Samsung',
        price       : 25000,
        rating      : 4.4,
        popularity  : 'High'
      },
      {
        productName : 'Camera',
        category    : 'Electronics',
        brand       : 'Canon',
        price       : 45000,
        rating      : 4.6,
        popularity  : 'Medium'
      },
      {
        productName : 'Headphones',
        category    : 'Electronics',
        brand       : 'Sony',
        price       : 3000,
        rating      : 4.3,
        popularity  : 'High'
      },
      {
        productName : 'Mechanical Keyboard',
        category    : 'Electronics',
        brand       : 'Logitech',
        price       : 2000,
        rating      : 4.7,
        popularity  : 'Medium'
      },
      {
        productName : 'Webcam',
        category    : 'Electronics',
        brand       : 'Logitech',
        price       : 3500,
        rating      : 4.2,
        popularity  : 'Medium'
      },

      // ── Accessories ──
      {
        productName : 'Wireless Mouse',
        category    : 'Accessories',
        brand       : 'Logitech',
        price       : 500,
        rating      : 4.5,
        popularity  : 'High'
      },
      {
        productName : 'Laptop Bag',
        category    : 'Accessories',
        brand       : 'Skybags',
        price       : 1200,
        rating      : 4.3,
        popularity  : 'High'
      },
      {
        productName : 'Laptop Stand',
        category    : 'Accessories',
        brand       : 'AmazonBasics',
        price       : 800,
        rating      : 4.1,
        popularity  : 'Medium'
      },
      {
        productName : 'USB Hub',
        category    : 'Accessories',
        brand       : 'Anker',
        price       : 600,
        rating      : 4.4,
        popularity  : 'Medium'
      },
      {
        productName : 'Earphones',
        category    : 'Accessories',
        brand       : 'boAt',
        price       : 800,
        rating      : 4.2,
        popularity  : 'High'
      },
      {
        productName : 'Charger',
        category    : 'Accessories',
        brand       : 'Anchor',
        price       : 400,
        rating      : 4.0,
        popularity  : 'High'
      },
      {
        productName : 'Phone Case',
        category    : 'Accessories',
        brand       : 'Spigen',
        price       : 300,
        rating      : 4.1,
        popularity  : 'High'
      },
      {
        productName : 'Screen Protector',
        category    : 'Accessories',
        brand       : 'Spigen',
        price       : 200,
        rating      : 3.9,
        popularity  : 'High'
      },
      {
        productName : 'Power Bank',
        category    : 'Accessories',
        brand       : 'Mi',
        price       : 1500,
        rating      : 4.4,
        popularity  : 'High'
      },
      {
        productName : 'Memory Card',
        category    : 'Accessories',
        brand       : 'SanDisk',
        price       : 700,
        rating      : 4.5,
        popularity  : 'Medium'
      },
      {
        productName : 'Camera Bag',
        category    : 'Accessories',
        brand       : 'Lowepro',
        price       : 2000,
        rating      : 4.3,
        popularity  : 'Low'
      },
      {
        productName : 'Tripod',
        category    : 'Accessories',
        brand       : 'Joby',
        price       : 1800,
        rating      : 4.2,
        popularity  : 'Low'
      },
      {
        productName : 'Headphone Stand',
        category    : 'Accessories',
        brand       : 'Knox',
        price       : 600,
        rating      : 4.0,
        popularity  : 'Low'
      },
      {
        productName : 'Mouse Pad',
        category    : 'Accessories',
        brand       : 'Corsair',
        price       : 350,
        rating      : 4.3,
        popularity  : 'Medium'
      },
      {
        productName : 'Wrist Rest',
        category    : 'Accessories',
        brand       : 'Fellowes',
        price       : 450,
        rating      : 4.0,
        popularity  : 'Low'
      },

    ]);

    console.log(`✅ ${products.length} products inserted`);

    // ── Helper: find product by name ────────────────────────────────────────
    function find(name) {
      const p = products.find(p => p.productName === name);
      if (!p) throw new Error(`Product not found: ${name}`);
      return p._id;
    }

    // ── Step 3 — Insert Relationships ───────────────────────────────────────

    console.log('\n🔗 Inserting product relationships...');

    const relationships = await Relationship.insertMany([

      // Laptop relationships
      { productId: find('Laptop'), relatedProductId: find('Wireless Mouse'),       relationshipScore: 1.0 },
      { productId: find('Laptop'), relatedProductId: find('Mechanical Keyboard'),  relationshipScore: 0.9 },
      { productId: find('Laptop'), relatedProductId: find('Laptop Bag'),           relationshipScore: 0.9 },
      { productId: find('Laptop'), relatedProductId: find('Laptop Stand'),         relationshipScore: 0.8 },
      { productId: find('Laptop'), relatedProductId: find('USB Hub'),              relationshipScore: 0.7 },
      { productId: find('Laptop'), relatedProductId: find('Webcam'),               relationshipScore: 0.6 },

      // Mobile Phone relationships
      { productId: find('Mobile Phone'), relatedProductId: find('Earphones'),        relationshipScore: 1.0 },
      { productId: find('Mobile Phone'), relatedProductId: find('Charger'),          relationshipScore: 1.0 },
      { productId: find('Mobile Phone'), relatedProductId: find('Phone Case'),       relationshipScore: 0.9 },
      { productId: find('Mobile Phone'), relatedProductId: find('Screen Protector'), relationshipScore: 0.8 },
      { productId: find('Mobile Phone'), relatedProductId: find('Power Bank'),       relationshipScore: 0.7 },

      // Camera relationships
      { productId: find('Camera'), relatedProductId: find('Memory Card'),  relationshipScore: 1.0 },
      { productId: find('Camera'), relatedProductId: find('Camera Bag'),   relationshipScore: 0.9 },
      { productId: find('Camera'), relatedProductId: find('Tripod'),       relationshipScore: 0.8 },

      // Headphones relationships
      { productId: find('Headphones'), relatedProductId: find('Headphone Stand'), relationshipScore: 0.9 },
      { productId: find('Headphones'), relatedProductId: find('Power Bank'),      relationshipScore: 0.7 },

      // Keyboard relationships
      { productId: find('Mechanical Keyboard'), relatedProductId: find('Mouse Pad'),   relationshipScore: 0.9 },
      { productId: find('Mechanical Keyboard'), relatedProductId: find('Wrist Rest'),  relationshipScore: 0.8 },
      { productId: find('Mechanical Keyboard'), relatedProductId: find('USB Hub'),     relationshipScore: 0.7 },

    ]);

    console.log(`✅ ${relationships.length} relationships inserted`);

    // ── Step 4 — Verify by printing a summary ───────────────────────────────

    console.log('\n📊 Summary:');
    console.log(`   Products     : ${await Product.countDocuments()}`);
    console.log(`   Relationships: ${await Relationship.countDocuments()}`);

    console.log('\n🎉 Seed complete! Your database is ready.\n');
    mongoose.disconnect();

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    mongoose.disconnect();
    process.exit(1);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────
seed();