// index.js
// Server entry point — run with: npm run dev

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

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
    const Product = mongoose.model('Product');
    const testProduct = await Product.findOne({ name: 'Laptop' });

    if (!testProduct) {
      return res.status(404).json({ error: 'Test product not found. Did you run seed.js?' });
    }

    const recommendations = await getRecommendations([testProduct._id]);
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