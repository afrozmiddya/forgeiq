/**
 * Normalizes a part number or SKU.
 * Removes whitespace, special characters, and converts to uppercase.
 */
export function normalizePartNumber(raw: string | undefined | null): string {
  if (!raw) return '';
  // Convert to uppercase
  let normalized = raw.toUpperCase();
  // Remove all non-alphanumeric characters
  normalized = normalized.replace(/[^A-Z0-9]/g, '');
  return normalized;
}
