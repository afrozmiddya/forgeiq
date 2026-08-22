import { DELIVERY_SCHEMA, renderDeliveryRow } from './delivery-schema';

async function testDeliverySchema() {
  console.log('Testing delivery schema length:', DELIVERY_SCHEMA.length);
  if (DELIVERY_SCHEMA.length !== 252) {
    throw new Error('Schema is not exactly 252 columns!');
  }
  
  const mockProduct = {
    'MFR URL': 'https://example.com',
    'Part_Desc': 'Test Description',
  };
  
  const rendered = renderDeliveryRow(mockProduct);
  
  if (rendered.length !== 252) {
    throw new Error(`Rendered array length is ${rendered.length}, expected 252.`);
  }
  
  if (rendered[0] !== 'https://example.com') {
    throw new Error('Mapping for MFR URL failed.');
  }
  
  if (rendered[12] !== 'Test Description') {
    throw new Error('Mapping for Part_Desc failed.');
  }

  console.log('✅ Delivery Schema contract satisfied: exactly 252 columns');
}

testDeliverySchema().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
