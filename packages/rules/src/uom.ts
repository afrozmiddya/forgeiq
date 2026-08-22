// Mock list of accepted UOMs
const ACCEPTED_UOMS = new Set([
  'in', 'cm', 'mm', 'ft', 'm',
  'lbs', 'kg', 'g', 'oz',
  'V', 'A', 'W', 'Hz',
  'gal', 'L', 'ml'
]);

export function isValidUOM(uom: string): boolean {
  if (!uom) return true; // Empty UOM is valid unless required by schema
  return ACCEPTED_UOMS.has(uom.toLowerCase().trim());
}
