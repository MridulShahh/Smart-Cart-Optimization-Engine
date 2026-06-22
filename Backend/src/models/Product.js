const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true }, // copy of productName for backwards compatibility
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  popularity: { type: Number, default: 0 },   // for recommendation scoring
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  tags: [{ type: String }],                    // used in recommendation logic
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
