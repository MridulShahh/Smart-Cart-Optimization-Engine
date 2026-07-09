export const currencies = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN", label: "₹ INR" },
  USD: { symbol: "$", rate: 0.012, locale: "en-US", label: "$ USD" },
  EUR: { symbol: "€", rate: 0.011, locale: "de-DE", label: "€ EUR" },
  GBP: { symbol: "£", rate: 0.0095, locale: "en-GB", label: "£ GBP" },
};

/**
 * Convert an INR price to the selected currency and format it.
 * @param {number} priceInINR - The price in Indian Rupees.
 * @param {string} currencyCode - Target currency code (INR, USD, EUR, GBP).
 * @returns {string} Formatted price string with symbol.
 */
export const formatPrice = (priceInINR, currencyCode = "INR") => {
  const curr = currencies[currencyCode] || currencies.INR;
  const converted = priceInINR * curr.rate;

  // For INR, use no decimals. For others, use 2 decimals.
  const formatted =
    currencyCode === "INR"
      ? Math.round(converted).toLocaleString(curr.locale)
      : converted.toLocaleString(curr.locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return `${curr.symbol}${formatted}`;
};

export default currencies;
