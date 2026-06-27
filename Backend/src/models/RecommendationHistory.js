const mongoose = require('mongoose');

const RecommendationHistorySchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  recommendedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  recommendationScore: {
    type: Number,
    required: true
  },
  accepted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecommendationHistory', RecommendationHistorySchema);
