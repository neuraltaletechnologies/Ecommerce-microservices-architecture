/**
 * Format a price value to Tanzania Shillings (TZS) currency
 * 
 * IMPORTANT: The database stores prices as whole numbers in TZS (not cents)
 * Example: 1500000 in database = TZS 1,500,000
 * 
 * @param price - Price in TZS (whole number, not cents)
 * @param compact - Whether to use compact notation (e.g., 1.5M instead of 1,500,000)
 * @returns Formatted price string (e.g., "TZS 1,500,000" or "TZS 1.5M")
 */
export function formatTZS(price: number, compact = false): string {
  // Price is stored as whole TZS, not cents
  const priceValue = price;

  if (compact && priceValue >= 1000000) {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      notation: 'compact',
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
 * Format a price value to Tanzania Shillings without decimal places
 * @param price - Price in TZS (whole number)
 * @returns Formatted price string (e.g., "TZS 1,500,000")
 */
export function formatTZSCompact(price: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
