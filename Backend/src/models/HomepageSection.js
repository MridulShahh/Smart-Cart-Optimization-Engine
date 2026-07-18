const mongoose = require('mongoose');

const HomepageSectionSchema = new mongoose.Schema({
  sectionType: { 
    type: String, 
    enum: ['featured', 'trending', 'latest', 'topSelling', 'offers', 'testimonials'], 
    required: true 
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('HomepageSection', HomepageSectionSchema);
