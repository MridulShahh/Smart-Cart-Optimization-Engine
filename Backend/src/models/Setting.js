const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be string, number, object, etc.
  type: { type: String, enum: ['string', 'boolean', 'json', 'number'], default: 'string' },
  group: { type: String, enum: ['general', 'seo', 'payment', 'shipping', 'social'], default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
