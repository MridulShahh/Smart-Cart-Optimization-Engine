# AI Development — Recommendation Engine API

Built by Student 3 (Recommendation and AI Developer). This module scores candidate products, ranks the top 3, generates AI explanations, and tracks recommendation performance.

## Setup

```bash
cd AI_Development
npm install
```

Create a `.env` file (see `.env.example`):

```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
USE_ML_SCORING=true
```

Run locally:

```bash
npm run dev
```

---

## Endpoints

### `GET /recommendations/:cartId`

Returns the top 3 recommended products for a given cart, each with a score, scoring method used, and an AI-generated explanation.

**Example request:**
```
GET /recommendations/6a33f5b1a67c034d40c33efb
```

**Example response:**
```json
[
  {
    "productId": "6a342fd16f6c2dadbb4079bf",
    "productName": "Wireless Mouse",
    "price": 1500,
    "rating": 4.4,
    "popularity": 80,
    "score": 0.75,
    "scoringMethod": "Manual Formula",
    "explanation": "Wireless Mouse pairs well with Laptop and is highly rated by customers."
  },
  {
    "productId": "6a342fef6f6c2dadbb4079c0",
    "productName": "Mechanical Keyboard",
    "price": 3500,
    "rating": 4.6,
    "popularity": 75,
    "score": 0.73,
    "scoringMethod": "Manual Formula",
    "explanation": "Mechanical Keyboard pairs well with Laptop and is highly rated by customers."
  },
  {
    "productId": "6a34302e6f6c2dadbb4079c2",
    "productName": "Laptop Bag",
    "price": 2000,
    "rating": 4.3,
    "popularity": 70,
    "score": 0.72,
    "scoringMethod": "Manual Formula",
    "explanation": "Laptop Bag pairs well with Laptop and is highly rated by customers."
  }
]
```

**Notes:**
- Returns `[]` if the cart is empty or no relationships exist for its products — no error thrown.
- Each call also automatically logs a history record per recommendation (see Analytics below).
- `scoringMethod` reflects the current value of `USE_ML_SCORING` — `"ML Model"` or `"Manual Formula"`.
- Each request makes up to 3 calls to the Gemini API (one per recommendation). If Gemini is rate-limited or temporarily unavailable, the `explanation` field falls back to a safe template sentence instead of failing the request.

---

### `POST /recommendations/:historyId/accept`

Marks a specific recommendation as accepted. Call this when a customer adds a recommended product to their cart.

**Example request:**
```
POST /recommendations/6a361f7f56676448f165c036/accept
```

**Example response:**
```json
{
  "message": "Marked as accepted",
  "record": {
    "_id": "6a361f7f56676448f165c036",
    "cartId": "6a33f5b1a67c034d40c33efb",
    "recommendedProductId": "6a342fd16f6c2dadbb4079bf",
    "recommendationScore": 0.75,
    "accepted": true,
    "createdAt": "2026-06-23T11:40:00.000Z"
  }
}
```

`historyId` is the `_id` of a record in the `recommendationhistories` collection — not the product's own ID. Each `/recommendations/:cartId` call creates one history record per returned item; use that record's `_id` here.

---

### `GET /analytics/recommendations`

Returns aggregate stats across all recommendations ever logged.

**Example response:**
```json
{
  "totalRecommendations": 12,
  "totalAccepted": 3,
  "acceptanceRate": "25%",
  "mostRecommendedProducts": [
    { "productName": "Wireless Mouse", "timesRecommended": 4 },
    { "productName": "Laptop Bag", "timesRecommended": 3 },
    { "productName": "Mechanical Keyboard", "timesRecommended": 2 }
  ]
}
```

---

## How scoring works

Each candidate product gets a score between 0 and 1, based on four factors:

| Factor | Manual Formula Weight | What it measures |
|---|---|---|
| Relationship score | 40% | How strongly linked to the cart item (from `relationships` collection) |
| Popularity | 30% | How popular the product is |
| Rating | 20% | Product rating, normalized to 0–1 |
| Price compatibility | 10% | How reasonable the price is relative to the cart item |

The **ML Model** mode uses a trained linear regression model (`ml/trainedModel.json`) instead of these fixed weights, learned from labeled training examples in `ml/trainModel.js`. Switch between the two by setting `USE_ML_SCORING=true` or `false` in `.env` — no code changes or redeploy needed if set via your hosting platform's environment variables.

---

## Data this module expects

**Product** — `name`, `category`, `price`, `rating`, `popularity` (Number), `stock`, `description`, `tags`, `createdAt`

**Relationship** — `productId`, `relatedProductId`, `relationshipScore` (0–1). Seeded via `seed/seedRealRelationships.js`.

**Cart** — `userId`, `items: [{ product, quantity, price }]`, `totalPrice`, `totalItems`. This module reads `items[].product` to know which products are in the cart.

**RecommendationHistory** — created automatically by this module: `cartId`, `recommendedProductId`, `recommendationScore`, `accepted`, `createdAt`.

---

## Known limitations

- Gemini's free tier allows 20 requests/day. Heavy testing can exhaust this; the system falls back gracefully to template explanations when it does.
- `cartId` in `RecommendationHistory` currently stores the first product ID in the cart as a stand-in, not the actual cart's `_id` — fine for analytics aggregation by product, but worth revisiting if per-cart history lookups are needed later.
