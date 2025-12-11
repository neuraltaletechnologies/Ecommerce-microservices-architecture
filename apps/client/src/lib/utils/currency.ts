/**
 * Format a price value to Tanzania Shillings (TZS) currency
 * @param priceInCents - Price in cents (e.g., 119999 = TZS 1,199.99)
 * @param compact - Whether to use compact notation (e.g., 1.2M instead of 1,200,000)
 * @returns Formatted price string (e.g., "TZS 1,199.99" or "TZS 1.2M")
 */
export function formatTZS(priceInCents: number, compact = false): string {
  const priceInShillings = priceInCents / 100;

  if (compact && priceInShillings >= 1000000) {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(priceInShillings);
  }

  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInShillings);
}

/**
 * Format a price value to Tanzania Shillings without decimal places
 * @param priceInCents - Price in cents
 * @returns Formatted price string (e.g., "TZS 1,200")
 */
export function formatTZSCompact(priceInCents: number): string {
  const priceInShillings = priceInCents / 100;
  
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInShillings);
}
