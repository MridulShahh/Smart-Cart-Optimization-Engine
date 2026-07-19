const Product = require("../models/Product");
const Order = require("../models/Order");
const RecommendationHistory = require("../models/RecommendationHistory");

/**
 * GET /api/analytics/recommendations
 * Returns:
 *   - mostRecommended: top products by recommendationCount
 *   - mostAccepted: top products by recommendationAcceptances
 *   - totalRecommendationRevenue: sum of revenue from isRecommendation items
 *   - acceptanceRate: overall acceptance rate
 */
exports.getRecommendationAnalytics = async (req, res) => {
  try {
    // ── Most Recommended Products (by recommendationCount) ──────────────
    const mostRecommended = await Product.find({ recommendationCount: { $gt: 0 } })
      .sort({ recommendationCount: -1 })
      .limit(10)
      .select("productName name price image recommendationCount recommendationAcceptances rating");

    // ── Most Accepted Recommendations ───────────────────────────────────
    const mostAccepted = await Product.find({ recommendationAcceptances: { $gt: 0 } })
      .sort({ recommendationAcceptances: -1 })
      .limit(10)
      .select("productName name price image recommendationCount recommendationAcceptances rating");

    // ── Additional Revenue Generated from Recommendations ───────────────
    const revenueAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.isRecommendation": true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalItems: { $sum: "$items.quantity" },
        },
      },
    ]);

    const totalRecommendationRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
    const totalRecommendedItemsSold = revenueAgg.length > 0 ? revenueAgg[0].totalItems : 0;

    // ── Revenue per recommended product (for the chart) ─────────────────
    const revenueByProduct = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.isRecommendation": true } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$productInfo.productName" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          unitsSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // ── Overall Acceptance Rate ─────────────────────────────────────────
    const totalRecommendations = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$recommendationCount" } } },
    ]);
    const totalAcceptances = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$recommendationAcceptances" } } },
    ]);

    const recCount = totalRecommendations.length > 0 ? totalRecommendations[0].total : 0;
    const accCount = totalAcceptances.length > 0 ? totalAcceptances[0].total : 0;
    const acceptanceRate = recCount > 0 ? Math.round((accCount / recCount) * 1000) / 10 : 0;

    // ── Acceptance rate per product (for the bar chart) ──────────────────
    const acceptanceByProduct = mostRecommended.map((p) => ({
      name: p.productName || p.name,
      recommended: p.recommendationCount,
      accepted: p.recommendationAcceptances,
      rate: p.recommendationCount > 0
        ? Math.round((p.recommendationAcceptances / p.recommendationCount) * 100)
        : 0,
    }));

    // ── RecommendationHistory stats (time-series, last 6 months) ────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historyByMonth = await RecommendationHistory.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: 1 },
          accepted: { $sum: { $cond: [{ $eq: ["$accepted", true] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      success: true,
      data: {
        mostRecommended,
        mostAccepted,
        totalRecommendationRevenue,
        totalRecommendedItemsSold,
        acceptanceRate,
        acceptanceByProduct,
        revenueByProduct,
        historyByMonth,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch analytics" });
  }
};
