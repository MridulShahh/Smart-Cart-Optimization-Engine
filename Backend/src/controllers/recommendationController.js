const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  calculateRecommendations
} = require("../services/recommendationService");

exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const products = await Product.find();

    const recommendations =
      calculateRecommendations(
        cart.items,
        products
      );

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};