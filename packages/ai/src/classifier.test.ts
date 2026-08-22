import { describe, it, expect } from 'vitest';
import { classifyProduct } from './classifier';

describe('classifyProduct', () => {
  it('classifies faucets correctly based on title', () => {
    const result = classifyProduct('Delta Kitchen Faucet Chrome', 'A standard sink tap.');
    expect(result.categoryId).toBe('TAX-001');
    expect(result.categoryName).toBe('FAUCETS');
    expect(result.method).toBe('KEYWORD_HEURISTIC');
  });

  it('classifies fittings correctly based on description', () => {
    const result = classifyProduct('Copper Component', 'A 1/2 inch pipe fitting for water.');
    expect(result.categoryName).toBe('FITTINGS');
  });

  it('returns UNCLASSIFIED for unknown objects', () => {
    const result = classifyProduct('Unknown Gizmo', 'This does something weird.');
    expect(result.categoryId).toBe('UNCLASSIFIED');
    expect(result.method).toBe('UNCLASSIFIED');
  });
});
