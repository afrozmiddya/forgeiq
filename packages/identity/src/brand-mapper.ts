import { stringSimilarity } from './levenshtein';
import { ALIAS_REGISTRY, normalizeForLookup } from './alias-registry';

// Mocked canonical master list until DB is available
export const MOCK_MASTER_MANUFACTURERS = [
  'DEWALT',
  '3M',
  'MILWAUKEE',
  'GENERAL ELECTRIC',
  'MAKITA',
  'BOSCH',
  'RIDGID',
  'KLEIN TOOLS',
  'RYOBI',
  'STANLEY'
];

export interface MatchResult {
  canonicalName: string | null;
  confidence: number;
  matchType: 'EXACT' | 'ALIAS' | 'FUZZY' | 'NONE';
}

/**
 * Resolves a messy raw brand string to a canonical manufacturer name.
 * 
 * 1. Checks Exact Match (case insensitive)
 * 2. Checks Alias Registry
 * 3. Checks Fuzzy Match (Levenshtein similarity > 0.8)
 */
export function resolveBrand(raw: string | undefined | null, masterList = MOCK_MASTER_MANUFACTURERS): MatchResult {
  if (!raw) return { canonicalName: null, confidence: 0, matchType: 'NONE' };

  const lookup = normalizeForLookup(raw);

  // 1. Exact Match
  const exactMatch = masterList.find(m => normalizeForLookup(m) === lookup);
  if (exactMatch) {
    return { canonicalName: exactMatch, confidence: 1.0, matchType: 'EXACT' };
  }

  // 2. Alias Registry Match
  if (ALIAS_REGISTRY[lookup]) {
    const canonicalAlias = ALIAS_REGISTRY[lookup];
    // Ensure alias maps to a known master if we are strictly validating
    return { canonicalName: canonicalAlias, confidence: 1.0, matchType: 'ALIAS' };
  }

  // 3. Fuzzy Match
  let bestMatch: string | null = null;
  let highestScore = 0;

  for (const master of masterList) {
    const score = stringSimilarity(lookup, normalizeForLookup(master));
    if (score > highestScore) {
      highestScore = score;
      bestMatch = master;
    }
  }

  // Threshold for acceptable fuzzy match
  if (highestScore >= 0.8 && bestMatch) {
    return { canonicalName: bestMatch, confidence: highestScore, matchType: 'FUZZY' };
  }

  return { canonicalName: null, confidence: 0, matchType: 'NONE' };
}
