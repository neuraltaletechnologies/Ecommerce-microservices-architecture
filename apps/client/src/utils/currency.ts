/**
 * Currency utility functions for Neuraltale E-commerce
 * Handles conversion between USD and Tanzanian Shillings (TZS)
 * 
 * IMPORTANT: The database stores prices as whole numbers in TZS (not cents)
 * Example: 1500000 in database = TZS 1,500,000
 */

// Exchange rate: 1 USD = 2300 TZS (approximate)
export const USD_TO_TZS_RATE = 2300;

/**
 * Convert USD amount to TZS
 * @param usdAmount - Amount in USD
 * @returns Amount in TZS
 */
export function convertUsdToTzs(usdAmount: number): number {
  return usdAmount * USD_TO_TZS_RATE;
}

/**
 * Convert TZS amount to USD
 * @param tzsAmount - Amount in TZS
 * @returns Amount in USD
 */
export function convertTzsToUsd(tzsAmount: number): number {
  return tzsAmount / USD_TO_TZS_RATE;
}

/**
 * Format TZS amount with proper formatting
 * @param amount - Amount in TZS (whole number, not cents)
 * @param fromUsd - Whether to convert from USD first (default: false)
 * @returns Formatted TZS string with proper currency symbol
 */
export function formatTzs(amount: number, fromUsd: boolean = false): string {
  // Price is stored as whole TZS, not cents
  const tzsAmount = fromUsd ? convertUsdToTzs(amount) : amount;
  
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tzsAmount);
}

/**
 * Format USD amount with proper formatting
 * @param amount - Amount in USD
 * @returns Formatted USD string
 */
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Get price display for UI components
 * @param usdPrice - Price in USD (base price)
 * @returns Object with both USD and TZS formatted prices
 */
export function getPriceDisplay(usdPrice: number) {
  return {
    usd: formatUsd(usdPrice),
    tzs: formatTzs(usdPrice, true),
    tzsAmount: convertUsdToTzs(usdPrice),
    usdAmount: usdPrice
  };
}

/**
 * Calculate savings in TZS
 * @param originalUsdPrice - Original price in USD
 * @param discountedUsdPrice - Discounted price in USD
 * @returns Savings amount in TZS
 */
export function calculateSavingsTzs(originalUsdPrice: number, discountedUsdPrice: number): number {
  return convertUsdToTzs(originalUsdPrice - discountedUsdPrice);
}

/**
 * Format savings display
 * @param originalUsdPrice - Original price in USD
 * @param discountedUsdPrice - Discounted price in USD
 * @returns Formatted savings string
 */
export function formatSavings(originalUsdPrice: number, discountedUsdPrice: number): string {
  const savings = calculateSavingsTzs(originalUsdPrice, discountedUsdPrice);
  return `SAVE ${formatTzs(savings)}`;
}