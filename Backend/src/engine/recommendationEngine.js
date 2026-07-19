// engine/recommendationEngine.js
// Multi-Stage Ranking Recommendation Engine

const mongoose = require('mongoose');
const { explainRecommendation } = require('../ai/explainRecommendation');
const Product = require("../models/Product");
const Relationship = require("../models/Relationship");
const RecommendationHistory = require("../models/RecommendationHistory");
const Category = require("../models/Category");
const CATEGORY_MAP = require("./categoryRelationshipMap");

// ─── Helper: convert popularity into a number (0 to 1) ──────────────────────
function getPopularityScore(popularity) {
  const numValue = Number(popularity);
  if (numValue === 3) return 1.0;
  if (numValue === 2) return 0.6;
  if (numValue === 1) return 0.3;

  if (popularity === 'High')   return 1.0;
  if (popularity === 'Medium') return 0.6;
  if (numValue > 3) return Math.min(1.0, numValue / 100); // normalize if it's a raw count
  return 0.3;
}

// ─── Helper: score how reasonable the price is vs the cart item ────────────
function getPriceScore(candidatePrice, cartAvgPrice) {
  const ratio = candidatePrice / cartAvgPrice;
  if (ratio <= 0.15) return 1.0;
  if (ratio <= 0.3) return 0.8;
  if (ratio <= 0.5) return 0.5;
  if (ratio <= 1.0) return 0.2;
  return 0.0;
}

// ─── Stage 1: Candidate Filtering (Hard Gate) ──────────────────────────────
async function getFilteredCandidates(cartProducts, cartProductIds) {
  const cartCategories = [...new Set(cartProducts.map(p => p.category?.name).filter(Boolean))];
  const cartSubcategories = [...new Set(cartProducts.map(p => p.subcategory).filter(Boolean))];
  
  // Get explicitly related product IDs
  const relationships = await Relationship.find({ productId: { $in: cartProductIds } });
  const relatedIds = relationships.map(r => r.relatedProductId.toString());
  
  cartProducts.forEach(p => {
    if (p.relatedProducts && p.relatedProducts.length > 0) {
      p.relatedProducts.forEach(id => relatedIds.push(id.toString()));
    }
  });

  // Calculate allowed cross-categories based on category map
  const allowedCategories = new Set(cartCategories);
  const allowedSubcategoriesForCross = new Set();

  for (const catName of cartCategories) {
    const mapEntry = CATEGORY_MAP[catName];
    if (mapEntry) {
      if (mapEntry.allowedCrossCategories) {
        mapEntry.allowedCrossCategories.forEach(c => allowedCategories.add(c));
      }
    }
  }

  for (const sub of cartSubcategories) {
    // Find subcategory in map to see if it allows anything specifically
    for (const catKey of Object.keys(CATEGORY_MAP)) {
      const cat = CATEGORY_MAP[catKey];
      if (cat.subcategories && cat.subcategories[sub]) {
        cat.subcategories[sub].forEach(s => allowedSubcategoriesForCross.add(s));
      }
    }
  }

  // Fetch all active, in-stock products not in cart
  const allCandidates = await Product.find({
    _id: { $nin: cartProductIds },
    isActive: true,
    stock: { $gt: 0 }
  }).populate("category").populate("brand");

  // Filter candidates
  const filtered = allCandidates.filter(candidate => {
    const candidateId = candidate._id.toString();
    const candidateCategory = candidate.category?.name;
    const candidateSubcategory = candidate.subcategory;

    // Condition 1: Explicit relationship
    if (relatedIds.includes(candidateId)) return true;

    // Condition 2: Same Category
    if (cartCategories.includes(candidateCategory)) return true;

    // Condition 3: Same Subcategory
    if (candidateSubcategory && cartSubcategories.includes(candidateSubcategory)) return true;

    // Condition 4: Allowed by Category Map (Allowed Cross Category)
    if (allowedCategories.has(candidateCategory)) return true;

    // Condition 5: Allowed by Subcategory mapping
    if (candidateSubcategory && allowedSubcategoriesForCross.has(candidateSubcategory)) return true;

    return false; // Reject otherwise
  });

  return { filtered, relationships };
}

// ─── Stage 2: Weighted Scoring ───────────────────────────────────────────────
function scoreCandidate(candidate, cartProducts, relationships, cartAvgPrice) {
  const candidateIdStr = candidate._id.toString();
  
  // 1. Product Relationship Score (40%)
  let relScore = 0.0;
  
  // Check explicit relationship table
  const explicitRel = relationships.find(r => r.relatedProductId.toString() === candidateIdStr);
  if (explicitRel) {
    relScore = explicitRel.relationshipScore || 1.0;
  } else {
    // Check embedded relatedProducts array
    const inRelatedArray = cartProducts.some(p => p.relatedProducts?.some(id => id.toString() === candidateIdStr));
    if (inRelatedArray) {
      relScore = 0.9;
    } else {
      // Check if it's in the allowed cross-subcategory map
      const candidateSub = candidate.subcategory;
      if (candidateSub) {
        let isCrossSub = false;
        for (const p of cartProducts) {
          const pSub = p.subcategory;
          const pCat = p.category?.name;
          if (pCat && CATEGORY_MAP[pCat] && CATEGORY_MAP[pCat].subcategories && CATEGORY_MAP[pCat].subcategories[pSub]) {
            if (CATEGORY_MAP[pCat].subcategories[pSub].includes(candidateSub)) {
              isCrossSub = true;
              break;
            }
          }
        }
        if (isCrossSub) relScore = 0.6;
      }
    }
  }

  // 2. Category Match (25%)
  let catScore = 0.0;
  const candidateCat = candidate.category?.name;
  const candidateSub = candidate.subcategory;
  
  const sameSub = cartProducts.some(p => p.subcategory && p.subcategory === candidateSub);
  const sameCat = cartProducts.some(p => p.category?.name === candidateCat);
  
  if (sameSub) {
    catScore = 1.0;
  } else if (sameCat) {
    catScore = 0.7;
  } else {
    // Allowed cross category
    catScore = 0.3;
  }

  // 3. Popularity (15%)
  const popScore = getPopularityScore(candidate.popularity);

  // 4. Rating (10%)
  const ratingScore = (candidate.rating || 0) / 5.0;

  // 5. Price Compatibility (10%)
  const priceScore = getPriceScore(candidate.price, cartAvgPrice);

  // Final Weighted Score calculation
  const finalScore = (relScore * 0.40) + (catScore * 0.25) + (popScore * 0.15) + (ratingScore * 0.10) + (priceScore * 0.10);

  return {
    score: finalScore,
    factors: { relScore, catScore, popScore, ratingScore, priceScore }
  };
}

// ─── Stage 3: Hard Constraint Rejection ─────────────────────────────────────
function passHardConstraints(candidate, scoreData, cartAvgPrice) {
  // Reject if price ratio > 5x of cart average (unless explicitly related)
  const ratio = candidate.price / cartAvgPrice;
  if (ratio > 5.0 && scoreData.factors.relScore < 0.9) {
    return false;
  }
  return true;
}

// ─── Main Engine ────────────────────────────────────────────────────────────
async function getRecommendations(cartProductIds) {
  if (!cartProductIds || cartProductIds.length === 0) return [];

  // Fetch cart products with populated categories and brands
  const cartProducts = await Product.find({ _id: { $in: cartProductIds } }).populate("category").populate("brand");
  if (cartProducts.length === 0) return [];

  const cartAvgPrice = cartProducts.reduce((sum, p) => sum + p.price, 0) / cartProducts.length;

  // Stage 1: Candidate Filtering
  const { filtered: candidates, relationships } = await getFilteredCandidates(cartProducts, cartProductIds);

  const scoredCandidates = [];

  for (const candidate of candidates) {
    // Stage 2: Scoring
    const scoreData = scoreCandidate(candidate, cartProducts, relationships, cartAvgPrice);
    
    // Stage 3: Constraints
    if (passHardConstraints(candidate, scoreData, cartAvgPrice)) {
      scoredCandidates.push({
        productId: candidate._id,
        productName: candidate.name || candidate.productName,
        price: candidate.price,
        rating: candidate.rating,
        popularity: candidate.popularity,
        image: candidate.image,
        brand: candidate.brand,
        category: candidate.category,
        score: Math.round(scoreData.score * 100) / 100,
        scoringMethod: 'Multi-Stage Deterministic',
        factors: scoreData.factors
      });
    }
  }

  // Sort descending by score
  scoredCandidates.sort((a, b) => b.score - a.score);
  const topRecommendations = scoredCandidates.slice(0, 5); // Return top 5

  // Record history
  for (const item of topRecommendations) {
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

  return topRecommendations;
}

module.exports = { getRecommendations };