// index.js
// Server entry point — run with: npm run dev

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const cartItemSchema = new mongoose.Schema({
  product : mongoose.Schema.Types.ObjectId,
  quantity: Number,
  price   : Number
});

const cartSchema = new mongoose.Schema({
  userId     : String,
  items      : [cartItemSchema],
  totalPrice : Number,
  totalItems : Number
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

// ─── Connect to MongoDB ────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection failed:', err.message));

// ─── Health check route ─────────────────────────────────────────────
app.get('/test', (req, res) => {
  res.json({ message: 'Student 3 server is running!' });
});

// ─── Recommendation route ───────────────────────────────────────────
const { getRecommendations } = require('./engine/recommendationEngine');

app.get('/recommendations/:cartId', async (req, res) => {
  try {
    const Cart = mongoose.model('Cart');

    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.json([]); // empty cart, nothing to recommend
    }

    // Extract just the product IDs from the cart's items array
    const cartProductIds = cart.items.map(item => item.product);

    const recommendations = await getRecommendations(cartProductIds);
    res.json(recommendations);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Mark a recommendation as accepted ──────────────────────────────
app.post('/recommendations/:historyId/accept', async (req, res) => {
  try {
    const RecommendationHistory = mongoose.model('RecommendationHistory');

    const updated = await RecommendationHistory.findByIdAndUpdate(
      req.params.historyId,
      { accepted: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Recommendation history record not found' });
    }

    res.json({ message: 'Marked as accepted', record: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Analytics route ─────────────────────────────────────────────────
app.get('/analytics/recommendations', async (req, res) => {
  try {
    const RecommendationHistory = mongoose.model('RecommendationHistory');
    const Product = mongoose.model('Product');

    const totalRecommendations = await RecommendationHistory.countDocuments();
    const totalAccepted = await RecommendationHistory.countDocuments({ accepted: true });

    const acceptanceRate = totalRecommendations > 0
      ? Math.round((totalAccepted / totalRecommendations) * 100)
      : 0;

    const mostRecommended = await RecommendationHistory.aggregate([
      { $group: { _id: '$recommendedProductId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const mostRecommendedWithNames = await Promise.all(
      mostRecommended.map(async (item) => {
        const product = await Product.findById(item._id);
        return {
          productName: product ? (product.productName || product.name) : 'Unknown',
          timesRecommended: item.count
        };
      })
    );

    res.json({
      totalRecommendations,
      totalAccepted,
      acceptanceRate: `${acceptanceRate}%`,
      mostRecommendedProducts: mostRecommendedWithNames
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});