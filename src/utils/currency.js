import i18n from '../i18n/config';

/**
 * Format currency based on current language
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const language = i18n.language;
  const isHebrew = language === 'he';
  
  // Parse amount if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return isHebrew ? '₪0' : '$0';
  }
  
  // Format number with comma separator
  const formattedAmount = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  if (!showSymbol) {
    return formattedAmount;
  }
  
  // Return with appropriate currency symbol
  return isHebrew ? `₪${formattedAmount}` : `$${formattedAmount}`;
};

/**
 * Get currency symbol based on current language
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => {
  const language = i18n.language;
  return language === 'he' ? '₪' : '$';
};

/**
 * Get currency code based on current language
 * @returns {string} Currency code (USD or ILS)
 */
export const getCurrencyCode = () => {
  const language = i18n.language;
  return language === 'he' ? 'ILS' : 'USD';
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string with symbol
 * @returns {number} Numeric value
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and spaces
  const cleanString = currencyString
    .replace(/[$₪]/g, '')
    .replace(/,/g, '')
    .trim();
  
  return parseFloat(cleanString) || 0;
};