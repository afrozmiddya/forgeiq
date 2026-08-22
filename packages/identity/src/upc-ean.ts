/**
 * Normalizes UPC, EAN, or GTIN.
 * Strips non-numeric characters and left-pads to a standardized GTIN-14 format if applicable,
 * or keeps raw if it's standard 12 (UPC) or 13 (EAN).
 */
export function normalizeGTIN(raw: string | undefined | null): string {
  if (!raw) return '';
  // Remove non-numeric characters
  let normalized = raw.replace(/[^0-9]/g, '');
  
  if (normalized.length === 0) return '';
  
  // Basic GTIN padding rules
  if (normalized.length < 12) {
    normalized = normalized.padStart(12, '0');
  } else if (normalized.length === 13) {
    normalized = normalized.padStart(14, '0');
  }
  
  return normalized;
}
