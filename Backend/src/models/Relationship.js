const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  relatedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  relationshipScore: Number
});

module.exports = mongoose.model("Relationship", relationshipSchema);