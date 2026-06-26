// ai/explainRecommendation.js
// Uses Gemini AI to generate a 1-sentence explanation for why a product is recommended

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function explainRecommendation(cartItemName, recommendedProductName, attempt = 1) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `A customer added "${cartItemName}" to their cart.
In exactly one sentence, explain why "${recommendedProductName}" is a useful addition.
Be specific, friendly, and helpful. Do not start with "I".`;

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