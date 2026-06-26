const mongoose = require("mongoose");

const recommendationHistorySchema = new mongoose.Schema({
  cartId: mongoose.Schema.Types.ObjectId,
  recommendedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  recommendationScore: Number,
  accepted: {
    type: Boolean,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "RecommendationHistory",
  recommendationHistorySchema
);