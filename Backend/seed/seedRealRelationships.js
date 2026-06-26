// seed/seedRealRelationships.js
// Adds relationships using Student 2's real 16-product catalog
// Run with: node seed/seedRealRelationships.js

require('dotenv').config();
const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  productId        : mongoose.Schema.Types.ObjectId,
  relatedProductId : mongoose.Schema.Types.ObjectId,
  relationshipScore: Number
});

const Relationship = mongoose.models.Relationship || mongoose.model('Relationship', relationshipSchema);

async function run() {
  try {
    const productsCollection = mongoose.connection.collection('products');

    const allProducts = await productsCollection.find({}).toArray();
    console.log(`📦 Found ${allProducts.length} products in database`);

    const findId = (name) => {
      const p = allProducts.find(p => p.name === name);
      if (!p) {
        console.log(`⚠️  Product not found: "${name}" — skipping`);
        return null;
      }
      return p._id;
    };

    const pairs = [
      ['Laptop', 'Wireless Mouse', 0.95],
      ['Laptop', 'Mechanical Keyboard', 0.90],
      ['Laptop', 'Laptop Bag', 0.90],
      ['Laptop', 'Monitor', 0.75],
      ['Laptop', 'Webcam', 0.65],
      ['Laptop', 'USB Hub', 0.70],
      ['Laptop', 'SSD 512GB', 0.70],
      ['Laptop', 'Laptop Charger', 0.85],
      ['Laptop', 'External Hard Drive 1TB', 0.60],
      ['Wireless Mouse', 'Gaming Mouse Pad', 0.80],
      ['Gaming Mouse', 'Gaming Mouse Pad', 0.90],
      ['Gaming Mouse', 'Mechanical Keyboard', 0.75],
      ['Mechanical Keyboard', 'Gaming Mouse Pad', 0.65],
      ['Mechanical Keyboard', 'Wireless Mouse', 0.80],
      ['Monitor', 'Webcam', 0.55],
      ['Monitor', 'USB Hub', 0.60],
      ['Headphones', 'Bluetooth Speaker', 0.50],
      ['Headphones', 'Webcam Pro', 0.40],
      ['Webcam', 'Webcam Pro', 0.30],
      ['Webcam Pro', 'Monitor', 0.60],
      ['USB Hub', 'External Hard Drive 1TB', 0.70],
      ['USB Hub', 'SSD 512GB', 0.65],
      ['SSD 512GB', 'External Hard Drive 1TB', 0.55],
      ['WiFi Router', 'Laptop', 0.45],
      ['Bluetooth Speaker', 'WiFi Router', 0.30],
    ];

    let inserted = 0;
    let skipped = 0;

    for (const [productName, relatedName, score] of pairs) {
      const productId = findId(productName);
      const relatedProductId = findId(relatedName);

      if (!productId || !relatedProductId) {
        skipped++;
        continue;
      }

      await Relationship.create({ productId, relatedProductId, relationshipScore: score });
      inserted++;
    }

    console.log(`\n✅ Inserted ${inserted} relationships`);
    if (skipped > 0) console.log(`⚠️  Skipped ${skipped} pairs`);

    mongoose.disconnect();

  } catch (err) {
    console.error('❌ Error:', err.message);
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