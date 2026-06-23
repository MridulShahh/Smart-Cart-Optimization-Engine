// engine/recommendationEngine.js
// This is the core scoring logic — the "brain" of your recommendation system

const MLR = require('ml-regression-multivariate-linear');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { explainRecommendation } = require('../ai/explainRecommendation');

// ─── Load the trained ML model once when the server starts ────────────────
const modelPath = path.join(__dirname, '..', 'ml', 'trainedModel.json');
const modelJSON = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));
const trainedModel = MLR.load(modelJSON);

// ─── Schemas ────────────────────────────────────────────────────────────────

const productSchema = new mongoose.Schema({
  name        : String,
  category    : String,
  price       : Number,
  rating      : Number,
  popularity  : Number,
  stock       : Number,
  description : String,
  tags        : [String],
  createdAt   : { type: Date, default: Date.now }
});

const relationshipSchema = new mongoose.Schema({
  productId        : mongoose.Schema.Types.ObjectId,
  relatedProductId : mongoose.Schema.Types.ObjectId,
  relationshipScore: Number
});

const recommendationHistorySchema = new mongoose.Schema({
  cartId              : mongoose.Schema.Types.ObjectId,
  recommendedProductId: mongoose.Schema.Types.ObjectId,
  recommendationScore : Number,
  accepted            : { type: Boolean, default: null },
  createdAt           : { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Relationship = mongoose.models.Relationship || mongoose.model('Relationship', relationshipSchema);
const RecommendationHistory = mongoose.models.RecommendationHistory || mongoose.model('RecommendationHistory', recommendationHistorySchema);

// ─── Helper: convert popularity into a number ───────────────────────────────

function getPopularityScore(popularity) {
  const numValue = Number(popularity);
  if (numValue === 3) return 1.0;
  if (numValue === 2) return 0.6;
  if (numValue === 1) return 0.3;

  if (popularity === 'High')   return 1.0;
  if (popularity === 'Medium') return 0.6;
  return 0.3;
}

// ─── Helper: score how reasonable the price is vs the cart item ────────────

function getPriceScore(candidatePrice, cartItemPrice) {
  const ratio = candidatePrice / cartItemPrice;
  if (ratio <= 0.1) return 1.0;
  if (ratio <= 0.3) return 0.8;
  if (ratio <= 0.6) return 0.5;
  return 0.2;
}

// ─── Manual formula scoring (the original hand-picked weights) ─────────────

function getManualScore(relationshipScore, popularityScore, ratingScore, priceScore) {
  return (
    (relationshipScore * 0.40) +
    (popularityScore   * 0.30) +
    (ratingScore        * 0.20) +
    (priceScore         * 0.10)
  );
}

// ─── Main function: get top recommendations for a list of cart product IDs ─

async function getRecommendations(cartProductIds) {

  const cartProducts = await Product.find({ _id: { $in: cartProductIds } });

  if (cartProducts.length === 0) {
    return [];
  }

  const avgCartPrice = cartProducts.reduce((sum, p) => sum + p.price, 0) / cartProducts.length;

  const relationships = await Relationship.find({
    productId: { $in: cartProductIds }
  });

  const scoredCandidates = [];

  for (const rel of relationships) {

    const alreadyInCart = cartProductIds.some(
      id => id.toString() === rel.relatedProductId.toString()
    );
    if (alreadyInCart) continue;

    const candidate = await Product.findById(rel.relatedProductId);
    if (!candidate) continue;

    const relationshipScore = rel.relationshipScore;
    const popularityScore   = getPopularityScore(candidate.popularity);
    const ratingScore       = candidate.rating / 5;
    const priceScore        = getPriceScore(candidate.price, avgCartPrice);

    // Check the flag to decide which scoring method to use
    const useML = process.env.USE_ML_SCORING === 'true';

    let finalScore;
    if (useML) {
      const mlPrediction = trainedModel.predict([[relationshipScore, popularityScore, ratingScore, priceScore]]);
      finalScore = Math.max(0, Math.min(1, mlPrediction[0][0]));
    } else {
      finalScore = getManualScore(relationshipScore, popularityScore, ratingScore, priceScore);
    }

    scoredCandidates.push({
      productId    : candidate._id,
      productName  : candidate.name,
      price        : candidate.price,
      rating       : candidate.rating,
      popularity   : candidate.popularity,
      score        : Math.round(finalScore * 100) / 100,
      scoringMethod: useML ? 'ML Model' : 'Manual Formula'
    });
  }

  const uniqueCandidates = [];
  const seenIds = new Set();

  for (const c of scoredCandidates) {
    if (!seenIds.has(c.productId.toString())) {
      seenIds.add(c.productId.toString());
      uniqueCandidates.push(c);
    }
  }

  uniqueCandidates.sort((a, b) => b.score - a.score);
  const top3 = uniqueCandidates.slice(0, 3);

  const cartItemName = cartProducts[0].name;

for (const item of top3) {
  item.explanation = await explainRecommendation(cartItemName, item.productName);
  await new Promise(resolve => setTimeout(resolve, 2500));
}

  for (const item of top3) {
    try {
      await RecommendationHistory.create({
        cartId: cartProductIds[0],
        recommendedProductId: item.productId,
        recommendationScore: item.score,
        accepted: null
      });
    } catch (err) {
      console.log('⚠️ Failed to save recommendation history:', err.message);
    }
  }

  return top3;
}

module.exports = { getRecommendations };