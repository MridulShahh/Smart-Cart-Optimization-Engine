const calculateRecommendations = (cartProducts, allProducts) => {
  const cartProductIds = cartProducts.map(
    item => item.product._id.toString()
  );

  const recommendations = [];

  for (const product of allProducts) {
    // Skip products already in cart
    if (cartProductIds.includes(product._id.toString())) {
      continue;
    }

    let relationshipScore = 0;

    // Compare with products in cart
    for (const cartItem of cartProducts) {
      const cartProduct = cartItem.product;

      // Same category = strong relationship
      if (cartProduct.category === product.category) {
        relationshipScore += 100;
      }

      // Matching tags = extra relationship
      const commonTags =
        cartProduct.tags?.filter(tag =>
          product.tags?.includes(tag)
        ) || [];

      relationshipScore += commonTags.length * 20;
    }

    // Normalize values
    const popularityScore = product.popularity || 0;
    const ratingScore = (product.rating || 0) * 20;

    // Price compatibility
    const avgCartPrice =
      cartProducts.reduce(
        (sum, item) => sum + item.product.price,
        0
      ) / cartProducts.length;

    const priceDifference = Math.abs(
      avgCartPrice - product.price
    );

    const priceScore = Math.max(
      0,
      100 - priceDifference / 100
    );

    const finalScore =
      relationshipScore * 0.4 +
      popularityScore * 0.3 +
      ratingScore * 0.2 +
      priceScore * 0.1;

    recommendations.push({
      product,
      score: finalScore
    });
  }

  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, 3);
};

module.exports = { calculateRecommendations };
