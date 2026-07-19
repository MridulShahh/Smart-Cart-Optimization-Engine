// ai/explainRecommendation.js
// Uses Gemini AI to generate a 1-sentence explanation for why a product is recommended

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function explainRecommendation(cartItemName, recommendedProductName, factors, attempt = 1) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let contextString = "";
    if (factors) {
      contextString = `
Context for why this was recommended:
- Product Relationship Score: ${factors.relScore} (0-1)
- Category Match Score: ${factors.catScore} (0-1)
- Popularity Score: ${factors.popScore} (0-1)
- Rating Score: ${factors.ratingScore} (0-1)
- Price Compatibility Score: ${factors.priceScore} (0-1)`;
    }

    const prompt = `A customer added "${cartItemName}" to their cart. We are recommending "${recommendedProductName}".
${contextString}

Based on these specific factors, in exactly one sentence, explain why "${recommendedProductName}" is a useful addition.
Be specific, friendly, and helpful. Do not start with "I". Do not list the scores directly, but use them to formulate a natural reason (e.g. if category match is high, mention they belong together; if popularity is high, mention it's a popular choice).`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();

  } catch (err) {
    if (attempt < 3) {
      await wait(3000 * attempt);
      return explainRecommendation(cartItemName, recommendedProductName, attempt + 1);
    }
    console.log('⚠️ Gemini fallback used after 3 attempts:', err.message);
    return `${recommendedProductName} pairs well with ${cartItemName} and is highly rated by customers.`;
  }
}

module.exports = { explainRecommendation };