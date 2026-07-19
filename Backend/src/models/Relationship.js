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
  relationshipScore: Number,
  type: { 
    type: String, 
    enum: ['accessory', 'complementary', 'frequently_bought_together', 'same_collection', 'upgrade'],
    default: 'complementary' 
  }
});

module.exports = mongoose.model("Relationship", relationshipSchema);