const Cart = require("../models/Cart");
const Product = require("../models/Product");
const RecommendationHistory = require("../models/RecommendationHistory");
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

    const recommendations = await calculateRecommendations(cart.items, products);

    // Save recommendations to history (but don't wait for it to finish)
    const historyDocs = recommendations.map(r => ({
      cartId: cart._id,
      recommendedProductId: r.product._id,
      recommendationScore: r.score,
      accepted: false
    }));
    RecommendationHistory.insertMany(historyDocs).catch(console.error);

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

exports.explainRecommendation = async (req, res) => {
  try {
    const { cartProducts, recommendedProduct } = req.body;
    
    if (!cartProducts || !recommendedProduct) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const cartNames = cartProducts.map(p => p.name || p.productName).join(", ");
    const recName = recommendedProduct.name || recommendedProduct.productName;

    let explanation = "";

    // Simulated AI response (in production, use OpenAI / Gemini API here)
    if (process.env.GEMINI_API_KEY) {
      // Mocking fetch to Gemini for now, fallback to rule-based explanation
      // A real implementation would call the Gemini REST API or SDK
    }
    
    // Fallback explanation generator
    explanation = `The ${recName} is recommended because customers frequently purchase it along with ${cartNames}. It is a highly rated product that pairs perfectly with your current cart.`;

    res.json({
      success: true,
      explanation
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.acceptRecommendation = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    
    // Find the latest history record for this cart and product and mark it accepted
    const history = await RecommendationHistory.findOneAndUpdate(
      { cartId, recommendedProductId: productId },
      { accepted: true },
      { new: true, sort: { createdAt: -1 } }
    );
    
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};