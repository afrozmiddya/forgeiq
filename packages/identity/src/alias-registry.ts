/**
 * A hardcoded dictionary of known bad inputs to canonical manufacturer values.
 * This overrides any fuzzy matching.
 */
export const ALIAS_REGISTRY: Record<string, string> = {
  '3m company': '3M',
  '3 m': '3M',
  'dewalt ind': 'DEWALT',
  'de walt': 'DEWALT',
  'dwt': 'DEWALT',
  'milwaukee tool': 'MILWAUKEE',
  'milwaukee elec': 'MILWAUKEE',
  'ge': 'GENERAL ELECTRIC',
};

/**
 * Normalizes a raw brand string for registry lookup (lowercase, stripped whitespace).
 */
export function normalizeForLookup(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, ' ');
}
