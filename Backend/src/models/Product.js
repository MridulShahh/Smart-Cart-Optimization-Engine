const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  popularity: { type: Number, default: 0 },   // for recommendation scoring
  stock: { type: Number, default: 0 },
  description: { type: String },
  tags: [{ type: String }],                    // used in recommendation logic
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
