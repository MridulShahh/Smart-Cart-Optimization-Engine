const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  position: { type: String, enum: ['hero', 'sidebar', 'popup', 'mid-section'], default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
