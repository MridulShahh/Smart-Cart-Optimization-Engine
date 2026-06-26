const mongoose = require("mongoose");

const ProductRelationshipSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  relatedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  relationshipScore: {
    type: Number,
    default: 100
  }
});

module.exports = mongoose.model(
  "ProductRelationship",
  ProductRelationshipSchema
);