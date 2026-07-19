const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { getRecommendations } = require("../engine/recommendationEngine");
const { explainRecommendation } = require("../ai/explainRecommendation");

// GET /:userId — fetch recommendations based on user's server-side cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    const cartProductIds = cart.items.map((item) => item.product);
    const recommendations = await getRecommendations(cartProductIds);

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /cart — fetch recommendations based on cart product IDs sent from frontend
router.post("/cart", async (req, res) => {
  try {
    const { cartProductIds } = req.body;

    if (!cartProductIds || !Array.isArray(cartProductIds) || cartProductIds.length === 0) {
      return res.status(400).json({ success: false, error: "cartProductIds array is required" });
    }

    const recommendations = await getRecommendations(cartProductIds);

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /explain — AI explanation for a recommendation
router.post("/explain", async (req, res) => {
  try {
    const { cartProductId, recommendedProductId } = req.body;

    if (!cartProductId || !recommendedProductId) {
      return res.status(400).json({ success: false, error: "Both product IDs are required" });
    }

    const cartProduct = await Product.findById(cartProductId);
    const recommended = await Product.findById(recommendedProductId);

    if (!cartProduct || !recommended) {
      return res.status(404).json({ success: false, error: "Products not found" });
    }

    const explanation = await explainRecommendation(
      cartProduct.productName || cartProduct.name,
      recommended.productName || recommended.name
    );

    return res.json({
      success: true,
      data: {
        explanation,
        cartProduct: { _id: cartProduct._id, productName: cartProduct.productName },
        recommendedProduct: { _id: recommended._id, productName: recommended.productName },
      },
    });
  } catch (error) {
    console.error("Explanation error:", error);
    return res.status(500).json({ success: false, error: "Failed to generate explanation" });
  }
});

// POST /accept — record that a user accepted a recommendation
router.post("/accept", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: "productId is required" });
    }

    await Product.findByIdAndUpdate(productId, { $inc: { recommendationAcceptances: 1 } });

    return res.json({ success: true, message: "Recommendation acceptance recorded" });
  } catch (error) {
    console.error("Accept recommendation error:", error);
    return res.status(500).json({ success: false, error: "Failed to record acceptance" });
  }
});

module.exports = router;