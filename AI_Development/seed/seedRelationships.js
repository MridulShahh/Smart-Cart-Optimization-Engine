// seed/seedRelationships.js
// Adds a second test product + one relationship, WITHOUT deleting existing data
// Run with: node seed/seedRelationships.js

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log(' Connection failed:', err.message);
    process.exit(1);
  });

const relationshipSchema = new mongoose.Schema({
  productId        : mongoose.Schema.Types.ObjectId,
  relatedProductId : mongoose.Schema.Types.ObjectId,
  relationshipScore: Number
});

const Relationship = mongoose.models.Relationship || mongoose.model('Relationship', relationshipSchema);

async function run() {
  try {
    const productsCollection = mongoose.connection.collection('products');

    // Step 1 — Find Apple's real ID
    const apple = await productsCollection.findOne({ name: 'Apple' });
    if (!apple) {
      console.log('Apple not found, stopping.');
      mongoose.disconnect();
      return;
    }
    console.log('Found Apple:', apple._id);

    // Step 2 — Insert a second product: "Fruit Basket" (using their schema format)
    const result = await productsCollection.insertOne({
      name: 'Fruit Basket',
      category: 'Fruits',
      price: 300,
      rating: 4.6,
      popularity: '3',     // their format: string number, 3 = High
      stock: 50,
      tags: ['gift', 'fresh'],
      createdAt: new Date(),
      __v: 0
    });
    const fruitBasketId = result.insertedId;
    console.log('Inserted Fruit Basket:', fruitBasketId);

    // Step 3 — Create a relationship: Apple → Fruit Basket
    await Relationship.create({
      productId: apple._id,
      relatedProductId: fruitBasketId,
      relationshipScore: 0.8
    });
    console.log('Relationship created: Apple → Fruit Basket');

    mongoose.disconnect();

  } catch (err) {
    console.error('Error:', err.message);
    mongoose.disconnect();
  }
}

run();