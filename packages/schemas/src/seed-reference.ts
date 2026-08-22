import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from apps/api since it contains SUPABASE_URL and KEY
config({ path: resolve(__dirname, '../../../apps/api/.env') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY. Make sure apps/api/.env is configured.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedReferenceData() {
  console.log('Seeding Taxonomy Reference Data...');

  // 1. Insert Taxonomy Categories
  const categories = [
    { department: 'Tools', class: 'Power Tools', fine: 'Drills', classpath: 'Tools > Power Tools > Drills' },
    { department: 'Tools', class: 'Power Tools', fine: 'Saws', classpath: 'Tools > Power Tools > Saws' },
    { department: 'Plumbing', class: 'Fixtures', fine: 'Faucets', classpath: 'Plumbing > Fixtures > Faucets' }
  ];

  for (const cat of categories) {
    await supabase.from('taxonomy_values').upsert({
      department: cat.department,
      class: cat.class,
      fine: cat.fine,
      classpath: cat.classpath,
      source_version: '1.0',
      active: true
    }, { onConflict: 'id', ignoreDuplicates: true }); // Depending on unique constraints
  }

  console.log('Seeding LOVs...');
  
  // 2. Insert LOV values
  const lovs = [
    { classpath: 'Tools > Power Tools > Drills', leaf_node: 'Drills', attribute_label: 'Color', attribute_value: 'Yellow', normalized_label: 'Color', normalized_value: 'Yellow', filtering: true, active: true },
    { classpath: 'Tools > Power Tools > Drills', leaf_node: 'Drills', attribute_label: 'Color', attribute_value: 'Red', normalized_label: 'Color', normalized_value: 'Red', filtering: true, active: true },
    { classpath: 'Tools > Power Tools > Drills', leaf_node: 'Drills', attribute_label: 'Voltage', attribute_value: '20V MAX', normalized_label: 'Voltage', normalized_value: '20V', filtering: true, active: true },
    { classpath: 'Tools > Power Tools > Drills', leaf_node: 'Drills', attribute_label: 'Voltage', attribute_value: '18V', normalized_label: 'Voltage', normalized_value: '18V', filtering: true, active: true }
  ];

  for (const lov of lovs) {
    await supabase.from('lov_values').upsert(lov, { onConflict: 'id', ignoreDuplicates: true });
  }

  console.log('Seeding UOM Rules...');

  // 3. Insert UOM Rules
  const uoms = [
    { measurement_type: 'Voltage', approved_abbreviation: 'V', capture_form: 'Numeric + V', example: '20 V', active: true },
    { measurement_type: 'Weight', approved_abbreviation: 'kg', capture_form: 'Numeric + kg', example: '1.15 kg', active: true }
  ];

  for (const uom of uoms) {
    await supabase.from('uom_values').upsert(uom, { onConflict: 'id', ignoreDuplicates: true });
  }

  console.log('Reference Data Seeding Complete!');
}

seedReferenceData().catch(console.error);
