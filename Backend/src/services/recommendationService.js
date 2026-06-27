const Relationship = require("../models/Relationship");

const calculateRecommendations = async (cartProducts, allProducts) => {
  const cartProductIds = cartProducts.map(item => item.product._id.toString());
  const recommendations = [];

  // Fetch all explicit relationships where the source product is in the cart
  const explicitRelationships = await Relationship.find({
    productId: { $in: cartProductIds }
  });

  for (const product of allProducts) {
    // Skip products already in cart
    if (cartProductIds.includes(product._id.toString())) {
      continue;
    }

    let relationshipScore = 0;

    // Check explicit relationships first
    const explicitRel = explicitRelationships.find(
      r => r.relatedProductId.toString() === product._id.toString()
    );

    if (explicitRel) {
      relationshipScore = explicitRel.relationshipScore; // e.g. 100
    } else {
      // Fallback to basic category/tag matching
      for (const cartItem of cartProducts) {
        const cartProduct = cartItem.product;
        if (cartProduct.category === product.category) {
          relationshipScore += 50; 
        }
        const commonTags = cartProduct.tags?.filter(tag => product.tags?.includes(tag)) || [];
        relationshipScore += commonTags.length * 10;
      }
      // Cap at 100
      relationshipScore = Math.min(100, relationshipScore);
    }

    // Popularity score (max 100)
    const popularityScore = Math.min(100, product.popularity || 0);
    
    // Rating score (max 100)
    const ratingScore = (product.rating || 0) * 20;

    // Price compatibility
    const avgCartPrice = cartProducts.reduce((sum, item) => sum + item.product.price, 0) / cartProducts.length;
    const priceDifference = Math.abs(avgCartPrice - product.price);
    // Formula to keep it within 0-100. A big diff means 0 score.
    const priceScore = Math.max(0, 100 - (priceDifference / avgCartPrice) * 100);

    // Final weighted score: 40% Relationship, 30% Popularity, 20% Rating, 10% Price
    const finalScore = 
      (relationshipScore * 0.4) + 
      (popularityScore * 0.3) + 
      (ratingScore * 0.2) + 
      (priceScore * 0.1);

    recommendations.push({
      product,
      score: finalScore
    });
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, 3);
};

module.exports = { calculateRecommendations };