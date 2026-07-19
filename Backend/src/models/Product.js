const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true }, // copy of productName for backwards compatibility
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, trim: true },
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
  targetGender: { type: String, enum: ['male', 'female', 'unisex', 'kids'], default: 'unisex' },
  ageGroup: { type: String, enum: ['all', 'kids', 'teens', 'adults', 'seniors'], default: 'all' },
  material: { type: String, trim: true },
  style: { type: String, trim: true },
  color: { type: String, trim: true },
  accessoryType: { type: String, trim: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  recommendationCount: { type: Number, default: 0 },
  recommendationAcceptances: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate slug
ProductSchema.pre('save', function() {
  if (this.isModified('productName')) {
    const slugify = require('slugify');
    this.slug = slugify(this.productName, { lower: true, strict: true });
    this.name = this.productName; // Sync name for backward compat
  }
});

module.exports = mongoose.model('Product', ProductSchema);
