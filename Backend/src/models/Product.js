const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true }, // copy of productName for backwards compatibility
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Percentage discount
  rating: { type: Number, default: 0, min: 0, max: 5 },
  popularity: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String }, // Primary image
  images: [{ type: String }], // Gallery
  specifications: [{
    name: { type: String },
    value: { type: String }
  }],
  tags: [{ type: String }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  recommendationCount: { type: Number, default: 0 },
  recommendationAcceptances: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('productName')) {
    const slugify = require('slugify');
    this.slug = slugify(this.productName, { lower: true, strict: true });
    this.name = this.productName; // Sync name for backward compat
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
