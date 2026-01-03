/**
 * Currency formatting utilities for Tanzania Shillings (TZS)
 * 
 * IMPORTANT: The database stores prices as whole TZS (not cents)
 * Example: 1500000 in database = TZS 1,500,000
 */

/**
 * Format price to TZS currency format
 * @param price - Price stored in database (whole TZS, not cents)
 * @param compact - Whether to use compact notation for large numbers
 * @returns Formatted price string (e.g., "TSh 1,500,000")
 */
export function formatTZS(price: number, compact = false): string {
  // Price is stored as whole TZS, not cents
  const priceValue = price;

  if (compact && priceValue >= 1_000_000) {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(priceValue);
  }

  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceValue);
}

/**
 * Format price with compact notation
 */
export function formatTZSCompact(price: number): string {
  return formatTZS(price, true);
}
