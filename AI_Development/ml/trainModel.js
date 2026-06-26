// ml/trainModel.js
// Trains a tiny linear regression model using our own seeded relationship data
// Run with: node ml/trainModel.js

const MLR = require('ml-regression-multivariate-linear');
const fs = require('fs');

// ─── Training data ──────────────────────────────────────────────────────
// ─── Training data ──────────────────────────────────────────────────────
// Each row = [relationshipScore, popularityScore, ratingScore, priceScore]
// Each label = the "ideal" score WE believe this product deserves (0 to 1)

const inputs = [
  // ── Original real-world pairings (Laptop, Mobile, Camera) ──
  [1.0, 1.0, 0.90, 1.0],   // Laptop -> Wireless Mouse
  [0.9, 1.0, 0.86, 0.8],   // Laptop -> Laptop Bag
  [0.9, 0.6, 0.94, 0.5],   // Laptop -> Mechanical Keyboard
  [0.8, 0.6, 0.82, 0.8],   // Laptop -> Laptop Stand
  [0.7, 0.6, 0.88, 0.8],   // Laptop -> USB Hub
  [0.6, 0.6, 0.84, 0.5],   // Laptop -> Webcam
  [1.0, 1.0, 0.84, 1.0],   // Mobile -> Earphones
  [1.0, 1.0, 0.80, 1.0],   // Mobile -> Charger
  [0.9, 1.0, 0.82, 1.0],   // Mobile -> Phone Case
  [0.8, 1.0, 0.78, 1.0],   // Mobile -> Screen Protector
  [0.7, 1.0, 0.88, 0.5],   // Mobile -> Power Bank
  [1.0, 0.6, 0.90, 1.0],   // Camera -> Memory Card
  [0.9, 0.3, 0.86, 0.5],   // Camera -> Camera Bag
  [0.8, 0.3, 0.84, 0.5],   // Camera -> Tripod
  [0.9, 0.3, 0.80, 0.8],   // Headphones -> Headphone Stand
  [0.7, 1.0, 0.88, 0.5],   // Headphones -> Power Bank
  [0.9, 0.6, 0.86, 0.8],   // Keyboard -> Mouse Pad
  [0.8, 0.3, 0.80, 0.8],   // Keyboard -> Wrist Rest
  [0.7, 0.6, 0.88, 0.5],   // Keyboard -> USB Hub

  // ── Bad-fit examples (low relationship AND low rating together) ──
  [0.1, 0.3, 0.30, 0.2],
  [0.2, 0.6, 0.35, 0.5],
  [0.0, 0.3, 0.20, 0.2],
  [0.1, 0.3, 0.40, 0.2],
  [0.2, 0.3, 0.50, 0.2],

  // ── CONTROLLED SET 1: relationship fixed at 0.9, only rating varies ──
  [0.9, 0.6, 0.95, 0.5],   // high rating
  [0.9, 0.6, 0.60, 0.5],   // medium rating
  [0.9, 0.6, 0.30, 0.5],   // low rating

  // ── CONTROLLED SET 2: relationship fixed at 0.9, only popularity varies ──
  [0.9, 1.0, 0.80, 0.5],   // high popularity
  [0.9, 0.6, 0.80, 0.5],   // medium popularity
  [0.9, 0.3, 0.80, 0.5],   // low popularity

  // ── CONTROLLED SET 3: relationship fixed at 0.9, only price varies ──
  [0.9, 0.6, 0.80, 1.0],   // very affordable
  [0.9, 0.6, 0.80, 0.5],   // moderately priced
  [0.9, 0.6, 0.80, 0.2],   // expensive relative to cart item

  // ── CONTROLLED SET 4: relationship fixed at 0.5 (medium), rating varies ──
  [0.5, 0.6, 0.95, 0.5],
  [0.5, 0.6, 0.60, 0.5],
  [0.5, 0.6, 0.30, 0.5],
];

const labels = [
  [0.95], [0.90], [0.80], [0.75], [0.70], [0.60],
  [0.95], [0.93], [0.88], [0.80], [0.70],
  [0.85], [0.70], [0.65],
  [0.65], [0.68],
  [0.75], [0.62], [0.65],

  [0.05], [0.15], [0.02], [0.10], [0.15],

  // Controlled Set 1 — rating effect: higher rating -> meaningfully higher score
  [0.78], [0.65], [0.52],

  // Controlled Set 2 — popularity effect: higher popularity -> meaningfully higher score
  [0.78], [0.68], [0.58],

  // Controlled Set 3 — price effect: cheaper relative price -> meaningfully higher score
  [0.78], [0.68], [0.55],

  // Controlled Set 4 — same rating effect, but at a lower relationship baseline
  [0.55], [0.45], [0.35],
];
// ─── Train the model ────────────────────────────────────────────────────

console.log('🧠 Training model on', inputs.length, 'examples...');

const mlr = new MLR(inputs, labels);

console.log('✅ Training complete!');
console.log('\n📊 Learned weights (compare to our hand-picked 40/30/20/10):');
console.log(mlr.weights);

// ─── Save the trained model to a file so we can reuse it later ────────────

fs.writeFileSync('ml/trainedModel.json', JSON.stringify(mlr.toJSON()));
console.log('\n💾 Model saved to ml/trainedModel.json');

// ─── Quick test: predict a brand new example ───────────────────────────

const testInput = [[0.9, 0.6, 0.94, 0.5]]; // Laptop -> Mechanical Keyboard
const prediction = mlr.predict(testInput);
console.log('\n🔮 Test prediction for Laptop->Keyboard:', prediction[0][0].toFixed(3));
console.log('   (We originally guessed 0.80 for this one)');

// Test 2: Mobile -> Phone Case (should be a strong recommendation)
const test2 = [[0.9, 1.0, 0.82, 1.0]];
console.log('🔮 Mobile -> Phone Case:', mlr.predict(test2)[0][0].toFixed(3));

// Test 3: A clearly bad fit (low relationship, low rating)
const test3 = [[0.1, 0.6, 0.30, 0.5]];
console.log('🔮 Bad fit example:', mlr.predict(test3)[0][0].toFixed(3));