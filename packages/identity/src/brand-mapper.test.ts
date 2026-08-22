import { describe, it, expect } from 'vitest';
import { resolveBrand } from './brand-mapper';
import { stringSimilarity } from './levenshtein';

describe('Levenshtein Similarity', () => {
  it('should return 1 for exact match', () => {
    expect(stringSimilarity('DEWALT', 'DEWALT')).toBe(1);
  });

  it('should calculate proper partial similarity', () => {
    // "dewalt" vs "dewolt" -> 1 character difference in 6 length = 5/6 = 0.8333
    expect(stringSimilarity('dewalt', 'dewolt')).toBeCloseTo(0.833, 2);
  });
});

describe('resolveBrand', () => {
  it('resolves exact match', () => {
    const res = resolveBrand('DEWALT');
    expect(res.canonicalName).toBe('DEWALT');
    expect(res.matchType).toBe('EXACT');
  });

  it('resolves exact match with messy casing', () => {
    const res = resolveBrand('  DeWaLt  ');
    expect(res.canonicalName).toBe('DEWALT');
    expect(res.matchType).toBe('EXACT');
  });

  it('resolves known alias', () => {
    const res = resolveBrand('DWT');
    expect(res.canonicalName).toBe('DEWALT');
    expect(res.matchType).toBe('ALIAS');
  });

  it('resolves fuzzy match', () => {
    // "Bosh" instead of "BOSCH" -> 1 char diff in 5
    const res = resolveBrand('Bosh');
    expect(res.canonicalName).toBe('BOSCH');
    expect(res.matchType).toBe('FUZZY');
  });

  it('returns NONE for unrecognized brands', () => {
    const res = resolveBrand('UNKNOWN_BRAND_XYZ');
    expect(res.canonicalName).toBeNull();
    expect(res.matchType).toBe('NONE');
  });
});
