const Cart = require("../models/Cart");
const { getRecommendations } = require("../engine/recommendationEngine");

exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Extract only product IDs from cart
    const cartProductIds = cart.items.map(item => item.product);

    const recommendations = await getRecommendations(cartProductIds);

    res.status(200).json({
      success: true,
      recommendations,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};