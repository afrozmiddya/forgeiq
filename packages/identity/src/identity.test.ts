import { describe, it, expect } from 'vitest';
import { normalizePartNumber } from './part-number';
import { normalizeGTIN } from './upc-ean';
import { generateDeterministicId } from './uuid-generator';

describe('normalizePartNumber', () => {
  it('should remove special characters and spaces', () => {
    expect(normalizePartNumber(' AB-123 / CD ')).toBe('AB123CD');
  });

  it('should uppercase letters', () => {
    expect(normalizePartNumber('xyZ-99')).toBe('XYZ99');
  });

  it('should handle null or undefined', () => {
    expect(normalizePartNumber(null)).toBe('');
    expect(normalizePartNumber(undefined)).toBe('');
  });
});

describe('normalizeGTIN', () => {
  it('should remove non-numeric chars', () => {
    expect(normalizeGTIN('UPC: 123-456-789012')).toBe('123456789012');
  });

  it('should pad to 12 if less than 12 digits', () => {
    expect(normalizeGTIN('12345')).toBe('000000012345');
  });

  it('should pad to 14 if 13 digits (EAN)', () => {
    expect(normalizeGTIN('1234567890123')).toBe('01234567890123');
  });
});

describe('generateDeterministicId', () => {
  it('should generate same UUID for identical inputs', () => {
    const id1 = generateDeterministicId('DEWALT', 'DCB205');
    const id2 = generateDeterministicId('dewalt', 'dcb-205');
    expect(id1).toBe(id2);
  });

  it('should follow UUID v4 format', () => {
    const id = generateDeterministicId('BRAND', '123');
    // UUID v4 regex
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should throw if both inputs resolve to empty strings', () => {
    expect(() => generateDeterministicId('---', '')).toThrow();
  });
});
