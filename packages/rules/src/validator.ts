import { isValidLOV } from './lov';
import { isValidUOM } from './uom';
import { ValidationResult, ValidationError } from './types';

// Simplified representation of the 252-column schema fields
export interface ProductAttributeRow {
  fields: Record<string, any>;
  attributes: { label: string, value: string, uom: string }[];
}

export function validateProductRow(row: ProductAttributeRow): ValidationResult {
  const errors: ValidationError[] = [];

  // Check character limits on common text fields
  const descFields = ['Part_Desc', 'MOBILE_DESC', 'INVOICE_DESC', 'SHORT_DESC', 'LONG_DESC1'];
  for (const field of descFields) {
    if (row.fields[field] && typeof row.fields[field] === 'string' && row.fields[field].length > 4000) {
      errors.push({
        code: 'ERR_CHAR_LIMIT_EXCEEDED',
        field,
        message: `Field ${field} exceeds character limit.`
      });
    }
  }

  // Check marketing description limits
  if (row.fields['Marketing_Description'] && typeof row.fields['Marketing_Description'] === 'string' && row.fields['Marketing_Description'].length > 2000) {
    errors.push({
      code: 'ERR_CHAR_LIMIT_EXCEEDED',
      field: 'Marketing_Description',
      message: 'Marketing Description exceeds 2000 character limit.'
    });
  }

  // Basic semantic check
  if (row.fields['Voltage'] && !String(row.fields['Voltage']).match(/^\d+(\.\d+)?$/)) {
    errors.push({
      code: 'ERR_SEMANTIC_INVALID',
      field: 'Voltage',
      message: 'Voltage must be a numeric value before UOM.'
    });
  }

  // Validate UOM fields
  const uomFields = ['LENGTH_UOM', 'HEIGHT_UOM', 'WIDTH_UOM', 'WEIGHT_UOM', 'VOLUME_UOM'];
  for (const field of uomFields) {
    if (row.fields[field] && !isValidUOM(row.fields[field])) {
      errors.push({
        code: 'ERR_INVALID_UOM',
        field,
        message: `Invalid UOM format for ${field}: ${row.fields[field]}`
      });
    }
  }

  // Validate Attributes (LOV and UOM)
  for (let i = 0; i < row.attributes.length; i++) {
    const attr = row.attributes[i];
    
    // Check LOV constraint
    if (attr.label && attr.value && !isValidLOV(attr.label, attr.value)) {
      errors.push({
        code: 'ERR_NOT_IN_LOV',
        field: `ATTRIBUTE_VALUE ${i + 1}`,
        message: `Value "${attr.value}" is not permitted for attribute "${attr.label}"`
      });
    }

    // Check attribute UOM constraint
    if (attr.uom && !isValidUOM(attr.uom)) {
      errors.push({
        code: 'ERR_INVALID_UOM',
        field: `ATTRIBUTE_UOM ${i + 1}`,
        message: `Invalid attribute UOM format: ${attr.uom}`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
