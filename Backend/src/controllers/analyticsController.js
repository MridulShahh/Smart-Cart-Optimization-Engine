const Product = require("../models/Product");
const Cart = require("../models/Cart");
const RecommendationHistory = require("../models/RecommendationHistory");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeCarts = await Cart.countDocuments();
    const totalRecommendations = await RecommendationHistory.countDocuments();
    const acceptedRecommendations = await RecommendationHistory.countDocuments({ accepted: true });

    let acceptanceRate = 0;
    if (totalRecommendations > 0) {
      acceptanceRate = ((acceptedRecommendations / totalRecommendations) * 100).toFixed(1);
    }

    // Top recommended products
    const topRecommendedAggr = await RecommendationHistory.aggregate([
      { $group: { _id: "$recommendedProductId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // We will populate manually for mock mongoose compatibility
    const topRecommended = [];
    for (const item of topRecommendedAggr) {
      const product = await Product.findById(item._id);
      if (product) {
        topRecommended.push({ product, count: item.count });
      }
    }

    // Most accepted recommendations
    const mostAcceptedAggr = await RecommendationHistory.aggregate([
      { $match: { accepted: true } },
      { $group: { _id: "$recommendedProductId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const mostAccepted = [];
    for (const item of mostAcceptedAggr) {
      const product = await Product.findById(item._id);
      if (product) {
        mostAccepted.push({ product, count: item.count });
      }
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        activeCarts,
        totalRecommendations,
        acceptedRecommendations,
        acceptanceRate,
        topRecommended,
        mostAccepted
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
