const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  relatedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  relationshipScore: {
    type: Number,
    required: true,
    default: 100 // Base score for an explicit relationship
  }
});

module.exports = mongoose.model('Relationship', RelationshipSchema);
