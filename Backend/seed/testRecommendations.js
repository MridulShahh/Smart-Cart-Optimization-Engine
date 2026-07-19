require('dotenv').config();
const mongoose = require('mongoose');
const { getRecommendations } = require('../src/engine/recommendationEngine');
const Product = require('../src/models/Product');

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const laptop = await Product.findOne({ name: 'Laptop' });
    const sneakers = await Product.findOne({ name: 'Sneakers' });

    if (!laptop || !sneakers) {
      console.log('❌ Test products not found');
      process.exit(1);
    }

    console.log('🧪 Testing Recommendations for: LAPTOP');
    const laptopRecs = await getRecommendations([laptop._id]);
    laptopRecs.forEach(r => {
      console.log(`- [${r.score.toFixed(2)}] ${r.productName} (Factors: rel=${r.factors.relScore}, cat=${r.factors.catScore}, pop=${r.factors.popScore}, rating=${r.factors.ratingScore}, price=${r.factors.priceScore})`);
    });

    console.log('\n🧪 Testing Recommendations for: SNEAKERS');
    const sneakerRecs = await getRecommendations([sneakers._id]);
    sneakerRecs.forEach(r => {
      console.log(`- [${r.score.toFixed(2)}] ${r.productName} (Factors: rel=${r.factors.relScore}, cat=${r.factors.catScore}, pop=${r.factors.popScore}, rating=${r.factors.ratingScore}, price=${r.factors.priceScore})`);
    });

    mongoose.disconnect();
  } catch (err) {
    console.error('Test error:', err);
    mongoose.disconnect();
  }
}

runTest();
