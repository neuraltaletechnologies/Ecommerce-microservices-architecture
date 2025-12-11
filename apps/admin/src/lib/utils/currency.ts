/**
 * Currency formatting utilities for Tanzania Shillings (TZS)
 */

/**
 * Format price in cents to TZS currency format
 * @param priceInCents - Price stored in database (in cents)
 * @param compact - Whether to use compact notation for large numbers
 * @returns Formatted price string (e.g., "TSh 1,199,990")
 */
export function formatTZS(priceInCents: number, compact = false): string {
  const priceInShillings = priceInCents / 100;

  if (compact && priceInShillings >= 1_000_000) {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      notation: 'compact',
      minimumFractionDigits: 0,
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
 * Format price with compact notation
 */
export function formatTZSCompact(priceInCents: number): string {
  return formatTZS(priceInCents, true);
}
