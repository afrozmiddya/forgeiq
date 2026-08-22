export type FieldSource = 'AI' | 'SYSTEM' | 'RAW' | 'REFERENCE';

export interface DeliveryField {
  position: number;
  name: string;
  source: FieldSource;
  transformer?: string;
  validator?: string;
}

export const DELIVERY_SCHEMA: DeliveryField[] = [
  { position: 0, name: 'MFR URL', source: 'RAW' },
  { position: 1, name: 'Ref URL 1', source: 'RAW' },
  { position: 2, name: 'Ref URL 2', source: 'RAW' },
  { position: 3, name: 'Ref URL 3', source: 'RAW' },
  { position: 4, name: 'Ref URL 4', source: 'RAW' },
  { position: 5, name: 'Ref URL 5', source: 'RAW' },
  { position: 6, name: 'PART_NUMBER', source: 'RAW' },
  { position: 7, name: 'Dept', source: 'AI' },
  { position: 8, name: 'Class', source: 'AI' },
  { position: 9, name: 'Fine', source: 'AI' },
  { position: 10, name: 'SKU - MY_PART_NUMBER', source: 'RAW' },
  { position: 11, name: 'Mfg_Part_Num', source: 'RAW' },
  { position: 12, name: 'Part_Desc', source: 'RAW' },
  { position: 13, name: 'E1_Brand', source: 'RAW' },
  { position: 14, name: 'Unilog_Brand', source: 'RAW' },
  { position: 15, name: 'DIB_Brand', source: 'RAW' },
  { position: 16, name: 'Part_Manuf', source: 'RAW' },
  { position: 17, name: 'MANUFACTURER_NAME', source: 'AI' },
  { position: 18, name: 'BRAND_NAME', source: 'AI' },
  { position: 19, name: 'TRADE_NAME', source: 'AI' },
  { position: 20, name: 'MANUFACTURER_PART_NUMBER', source: 'AI' },
  { position: 21, name: 'ALTERNATE_PART_NUMBER', source: 'AI' },
  { position: 22, name: 'Classpath', source: 'AI' },
  { position: 23, name: 'MOBILE_DESC', source: 'AI' },
  { position: 24, name: 'INVOICE_DESC', source: 'AI' },
  { position: 25, name: 'SHORT_DESC', source: 'AI' },
  { position: 26, name: 'LONG_DESC1', source: 'AI' },
  { position: 27, name: 'RETAIL_DESC', source: 'AI' },
  { position: 28, name: 'MARKETING_DESCRIPTION', source: 'AI' },
  { position: 29, name: 'ITEM_FEATURES_1', source: 'AI' },
  { position: 30, name: 'ITEM_FEATURES_2', source: 'AI' },
  { position: 31, name: 'ITEM_FEATURES_3', source: 'AI' },
  { position: 32, name: 'ITEM_FEATURES_4', source: 'AI' },
  { position: 33, name: 'ITEM_FEATURES_5', source: 'AI' },
  { position: 34, name: 'ITEM_FEATURES_6', source: 'AI' },
  { position: 35, name: 'ITEM_FEATURES_7', source: 'AI' },
  { position: 36, name: 'ITEM_FEATURES_8', source: 'AI' },
  { position: 37, name: 'ITEM_FEATURES_9', source: 'AI' },
  { position: 38, name: 'ITEM_FEATURES_10', source: 'AI' },
  { position: 39, name: 'ITEM_FEATURES_11', source: 'AI' },
  { position: 40, name: 'ITEM_FEATURES_12', source: 'AI' },
  { position: 41, name: 'ITEM_FEATURES_13', source: 'AI' },
  { position: 42, name: 'ITEM_FEATURES_14', source: 'AI' },
  { position: 43, name: 'ITEM_FEATURES_15', source: 'AI' },
  { position: 44, name: 'ITEM_FEATURES_16', source: 'AI' },
  { position: 45, name: 'ITEM_FEATURES_17', source: 'AI' },
  { position: 46, name: 'ITEM_FEATURES_18', source: 'AI' },
  { position: 47, name: 'ITEM_FEATURES_19', source: 'AI' },
  { position: 48, name: 'ITEM_FEATURES_20', source: 'AI' },
  { position: 49, name: 'With', source: 'AI' },
  { position: 50, name: 'Standard/Approvals', source: 'AI' },
  { position: 51, name: 'Prop 65', source: 'AI' },
  { position: 52, name: 'Application', source: 'AI' },
  { position: 53, name: 'Includes', source: 'AI' },
  { position: 54, name: 'Product Name', source: 'AI' },
  ...Array.from({ length: 50 }, (_, i) => [
    { position: 55 + i * 3, name: `ATTRIBUTE_LABEL ${i + 1}`, source: 'AI' as FieldSource },
    { position: 56 + i * 3, name: `ATTRIBUTE_VALUE ${i + 1}`, source: 'AI' as FieldSource },
    { position: 57 + i * 3, name: `ATTRIBUTE_UOM ${i + 1}`, source: 'AI' as FieldSource },
  ]).flat(),
  { position: 205, name: 'UPC', source: 'AI' },
  { position: 206, name: 'EAN', source: 'AI' },
  { position: 207, name: 'GTIN', source: 'AI' },
  { position: 208, name: 'UNSPSC', source: 'AI' },
  { position: 209, name: 'Warranty', source: 'AI' },
  { position: 210, name: 'List Price', source: 'AI' },
  { position: 211, name: 'Selling Qty', source: 'AI' },
  { position: 212, name: 'Selling UOM', source: 'AI' },
  { position: 213, name: 'Standard Packaging Information', source: 'AI' },
  { position: 214, name: 'LENGTH', source: 'AI' },
  { position: 215, name: 'LENGTH_UOM', source: 'AI' },
  { position: 216, name: 'HEIGHT', source: 'AI' },
  { position: 217, name: 'HEIGHT_UOM', source: 'AI' },
  { position: 218, name: 'WIDTH', source: 'AI' },
  { position: 219, name: 'WIDTH_UOM', source: 'AI' },
  { position: 220, name: 'WEIGHT', source: 'AI' },
  { position: 221, name: 'WEIGHT_UOM', source: 'AI' },
  { position: 222, name: 'VOLUME', source: 'AI' },
  { position: 223, name: 'VOLUME_UOM', source: 'AI' },
  { position: 224, name: 'Product Image', source: 'AI' },
  { position: 225, name: 'Alternate Image 1', source: 'AI' },
  { position: 226, name: 'Alternate Image 2', source: 'AI' },
  { position: 227, name: 'Alternate Image 3', source: 'AI' },
  { position: 228, name: 'Alternate Image 4', source: 'AI' },
  { position: 229, name: 'SDS', source: 'AI' },
  { position: 230, name: 'SDS_1', source: 'AI' },
  { position: 231, name: 'Warranty Information', source: 'AI' },
  { position: 232, name: 'Catalog', source: 'AI' },
  { position: 233, name: 'Specification Sheet', source: 'AI' },
  { position: 234, name: 'Instruction/Installation Manual', source: 'AI' },
  { position: 235, name: 'Service Manual', source: 'AI' },
  { position: 236, name: 'Owners/User Manual', source: 'AI' },
  { position: 237, name: 'Line Drawing', source: 'AI' },
  { position: 238, name: 'MTR', source: 'AI' },
  { position: 239, name: 'RoHS', source: 'AI' },
  { position: 240, name: 'Full Engineering Drawing', source: 'AI' },
  { position: 241, name: 'Energy Star Guide', source: 'AI' },
  { position: 242, name: 'Technical Bulletin', source: 'AI' },
  { position: 243, name: 'Submittal', source: 'AI' },
  { position: 244, name: 'Compatibility Chart', source: 'AI' },
  { position: 245, name: 'Size Chart', source: 'AI' },
  { position: 246, name: 'Product Label/Insert', source: 'AI' },
  { position: 247, name: 'Video Link', source: 'AI' },
  { position: 248, name: 'Video Link 1', source: 'AI' },
  { position: 249, name: 'Country Of Origin', source: 'AI' },
  { position: 250, name: 'Discontinued', source: 'AI' },
  { position: 251, name: 'Actual Image (Yes/No)', source: 'AI' },
];

export function renderDeliveryRow(product: any): string[] {
  // Validate exact length
  if (DELIVERY_SCHEMA.length !== 252) {
    throw new Error(`Schema mismatch: expected 252 fields, got ${DELIVERY_SCHEMA.length}`);
  }

  // Ensure deterministic array output
  const row = new Array(252).fill('');
  
  // Implementation of mapping product properties to exact schema locations
  for (const field of DELIVERY_SCHEMA) {
    row[field.position] = product[field.name] || '';
  }

  return row;
}
