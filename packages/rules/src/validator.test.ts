import { describe, it, expect } from 'vitest';
import { validateProductRow } from './validator';

describe('Rules Engine - Validator', () => {
  it('passes a fully compliant product row', () => {
    const validRow = {
      fields: {
        'Part_Desc': 'A standard faucet',
        'LENGTH_UOM': 'in'
      },
      attributes: [
        { label: 'Material', value: 'Brass', uom: '' }
      ]
    };
    
    const result = validateProductRow(validRow);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('fails if UOM is invalid', () => {
    const invalidRow = {
      fields: {
        'WEIGHT_UOM': 'unknown_unit'
      },
      attributes: []
    };
    
    const result = validateProductRow(invalidRow);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].code).toBe('ERR_INVALID_UOM');
    expect(result.errors[0].field).toBe('WEIGHT_UOM');
  });

  it('fails if attribute value violates LOV', () => {
    const invalidRow = {
      fields: {},
      attributes: [
        { label: 'Color', value: 'Neon Pink', uom: '' } // Neon Pink is not in mock Color LOV
      ]
    };
    
    const result = validateProductRow(invalidRow);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].code).toBe('ERR_NOT_IN_LOV');
    expect(result.errors[0].message).toContain('Neon Pink');
  });
});
