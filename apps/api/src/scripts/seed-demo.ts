import { supabase } from '@forgeiq/shared';
import crypto from 'crypto';

const MOCK_MANUFACTURERS = [
  'Schneider Electric',
  'Siemens',
  'ABB',
  'Omron',
  'Phoenix Contact',
  'Rockwell Automation'
];

const MOCK_PRODUCTS = [
  { mfg: 'Schneider Electric', mpn: 'LC1D09M7', desc: 'TeSys D contactor - 3P(3 NO) - AC-3 - <= 440 V 9 A - 220 V AC coil', cat: 'Electrical > Contactors', attrs: { 'Coil Voltage': ['220', 'V', 98], 'Current Rating': ['9', 'A', 99], 'Number of Poles': ['3', null, 95] }, source: 'https://se.com/product/LC1D09M7', review: false },
  { mfg: 'Siemens', mpn: '3RT2015-1BB41', desc: 'Power contactor, AC-3 7 A, 3 kW / 400 V 1 NO, 24 V DC', cat: 'Electrical > Contactors', attrs: { 'Coil Voltage': ['24', 'V', 96], 'Current Rating': ['7', 'A', 98], 'Power Rating': ['3', 'kW', 94] }, source: 'https://mall.industry.siemens.com/mall/en/ww/Catalog/Product/3RT2015-1BB41', review: false },
  { mfg: 'ABB', mpn: 'AF09-30-10-13', desc: 'AF09-30-10-13 100-250V50/60HZ-DC Contactor', cat: 'Electrical > Contactors', attrs: { 'Coil Voltage': ['100-250', 'V', 85], 'Current Rating': ['9', 'A', 92], 'Number of Poles': ['3', null, 90] }, source: 'https://new.abb.com/products/1SBL137001R1310/af09-30-10-13', review: false },
  { mfg: 'Omron', mpn: 'E2E-X5ME1', desc: 'Proximity Sensor, Inductive, 5mm, NPN, Pre-wired', cat: 'Sensors > Proximity Sensors', attrs: { 'Sensing Distance': ['5', 'mm', 99], 'Output Type': ['NPN', null, 99], 'Connection Type': ['Pre-wired', null, 98] }, source: 'https://automation.omron.com/en/us/products/family/E2E', review: false },
  { mfg: 'Phoenix Contact', mpn: '2903147', desc: 'Power supply unit - TRIO-PS-2G/1AC/24DC/5', cat: 'Power Supplies', attrs: { 'Output Voltage': ['24', 'V', 97], 'Output Current': ['5', 'A', 98], 'Input Phase': ['1', null, 92] }, source: 'https://www.phoenixcontact.com/product/2903147', review: false },
  { mfg: 'Rockwell Automation', mpn: '1756-EN2T', desc: 'ControlLogix EtherNet/IP Bridge Module', cat: 'Automation > PLCs', attrs: { 'Communication Protocol': ['EtherNet/IP', null, 99], 'Module Type': ['Bridge', null, 88] }, source: 'https://www.rockwellautomation.com/en-us/products/hardware/allen-bradley/programmable-controllers/1756-en2t.html', review: false },
  
  // Review required items
  { mfg: 'Schneider Electric', mpn: 'GV2ME14', desc: 'Motor circuit breaker, TeSys GV2, 3P, 6-10 A, thermal magnetic, screw clamp terminals', cat: 'Electrical > Circuit Breakers', attrs: { 'Current Range': ['6-10', 'A', 82], 'Trip Type': ['THERMAL_MAG', null, 75] }, source: 'https://se.com/product/GV2ME14', review: true, reviewMsg: 'Value "THERMAL_MAG" is not in the allowed List of Values for Trip Type (expected "Thermal Magnetic").' },
  { mfg: 'ABB', mpn: 'ACS355-03E-05A6-4', desc: 'Machinery drive, 400V, 3-phase, 5.6A, 2.2kW', cat: 'Drives > AC Drives', attrs: { 'Input Phase': ['3', null, 95], 'Power Rating': ['2.2', 'W', 40] }, source: 'https://new.abb.com/products/3AUA0000058189/acs355-03e-05a6-4', review: true, reviewMsg: 'Unusual unit conversion. Extracted "kW" but mapped to "W" without multiplication.' },
  { mfg: 'Siemens', mpn: '6ES7214-1AG40-0XB0', desc: 'SIMATIC S7-1200, CPU 1214C, compact CPU, DC/DC/DC', cat: 'Automation > PLCs', attrs: { 'Input Voltage': ['24', 'V', 65], 'Output Type': ['Relay', null, 30] }, source: 'Demo Evidence Source', review: true, reviewMsg: 'Low confidence extraction for Output Type. Model conflicted between Transistor and Relay.' },
  
  // Some more normal items to fill it out
  { mfg: 'Omron', mpn: 'G2R-1-SND DC24(S)', desc: 'Relay, Plug-in, SPDT, 10A, 24VDC, w/ Diode & LED', cat: 'Electrical > Relays', attrs: { 'Coil Voltage': ['24', 'V', 96], 'Contact Form': ['SPDT', null, 98], 'Current Rating': ['10', 'A', 97] }, source: 'https://automation.omron.com/product/G2R', review: false },
  { mfg: 'Phoenix Contact', mpn: '3208100', desc: 'Feed-through terminal block - PT 1,5/S - 3208100', cat: 'Connectors > Terminal Blocks', attrs: { 'Cross Section': ['1.5', 'mm²', 98], 'Number of Connections': ['2', null, 99], 'Color': ['Gray', null, 99] }, source: 'https://www.phoenixcontact.com/product/3208100', review: false },
  { mfg: 'Rockwell Automation', mpn: '20F1ANC205JA0NNN', desc: 'PowerFlex 753 AC Drive, 400 VAC, 3 PH, 205 Amps, 110 kW', cat: 'Drives > AC Drives', attrs: { 'Input Voltage': ['400', 'V', 99], 'Input Phase': ['3', null, 99], 'Current Rating': ['205', 'A', 99], 'Power Rating': ['110', 'kW', 99] }, source: 'Demo Evidence Source', review: false },
  { mfg: 'Schneider Electric', mpn: 'XB4BA31', desc: 'Push button, metal, flush, green, Ø22, spring return, 1NO', cat: 'Control > Push Buttons', attrs: { 'Color': ['Green', null, 98], 'Mounting Diameter': ['22', 'mm', 99], 'Contact Type': ['1 NO', null, 97] }, source: 'https://se.com/product/XB4BA31', review: false },
  { mfg: 'Siemens', mpn: '3SU1150-0AB20-1CA0', desc: 'Pushbutton, 22 mm, round, metal, shiny, red, pushbutton, flat', cat: 'Control > Push Buttons', attrs: { 'Color': ['Red', null, 99], 'Mounting Diameter': ['22', 'mm', 99] }, source: 'https://mall.industry.siemens.com/product/3SU1150', review: false },
  { mfg: 'ABB', mpn: '1SCA104723R1001', desc: 'OT16F3 switch-disconnector', cat: 'Electrical > Switches', attrs: { 'Current Rating': ['16', 'A', 94], 'Number of Poles': ['3', null, 95] }, source: 'Demo Evidence Source', review: false }
];

export async function seedDemoData() {
  console.log('Seeding demo data...');

  // 1. Create Manufacturers
  const mfgMap = new Map();
  for (const mfg of MOCK_MANUFACTURERS) {
    const { data } = await supabase.from('manufacturers').insert({ manufacturer_name: `${mfg} (Demo)` }).select().single();
    if (data) mfgMap.set(mfg, data.id);
  }

  // 2. Create Dataset
  const { data: dataset } = await supabase.from('datasets').insert({
    name: 'Industrial Components — UniHack Demo',
    source_filename: 'demo_unihack.csv',
    file_type: 'text/csv',
    row_count: MOCK_PRODUCTS.length,
    status: 'COMPLETED'
  }).select().single();

  if (!dataset) throw new Error('Failed to create dataset');

  // 3. Create Jobs
  await supabase.from('processing_jobs').insert({
    dataset_id: dataset.id,
    job_type: 'ENRICHMENT',
    status: 'COMPLETED',
    total_rows: MOCK_PRODUCTS.length,
    processed_rows: MOCK_PRODUCTS.length,
    failed_rows: 0,
    review_rows: MOCK_PRODUCTS.filter(p => p.review).length,
    progress_pct: 100,
    started_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date().toISOString()
  });

  // Second running job just for visuals
  const { data: job2Dataset } = await supabase.from('datasets').insert({
    name: 'Motor Control Components — Demo Run',
    source_filename: 'motor_controls.csv',
    row_count: 500,
    status: 'PROCESSING'
  }).select().single();

  if (job2Dataset) {
    await supabase.from('processing_jobs').insert({
      dataset_id: job2Dataset.id,
      job_type: 'ENRICHMENT',
      status: 'PROCESSING',
      total_rows: 500,
      processed_rows: 335,
      progress_pct: 67,
      started_at: new Date().toISOString()
    });
  }

  // 4. Products & Details
  for (let i = 0; i < MOCK_PRODUCTS.length; i++) {
    const p = MOCK_PRODUCTS[i];
    
    // source_product
    const { data: src } = await supabase.from('source_products').insert({
      dataset_id: dataset.id,
      source_row_number: i + 1,
      raw_json: { mfg: p.mfg, mpn: p.mpn, desc: p.desc },
      raw_hash: crypto.randomBytes(16).toString('hex')
    }).select().single();

    // product
    const { data: prod } = await supabase.from('products').insert({
      dataset_id: dataset.id,
      manufacturer_id: mfgMap.get(p.mfg),
      mpn: p.mpn,
      source_product_id: src?.id,
      processing_status: p.review ? 'REVIEW_REQUIRED' : 'VALIDATED'
    }).select().single();

    if (!prod) continue;

    // classification
    await supabase.from('classifications').insert({
      product_id: prod.id,
      department: p.cat.split(' > ')[0],
      category: p.cat.split(' > ')[1] || p.cat,
      confidence_score: 95
    });

    // attributes & evidence
    let attrIndex = 1;
    for (const [label, [val, uom, conf]] of Object.entries(p.attrs)) {
      const { data: attr } = await supabase.from('product_attributes').insert({
        product_id: prod.id,
        attribute_label: label,
        raw_value: val,
        normalized_value: val,
        uom: uom,
        normalized_uom: uom,
        confidence: conf,
        attribute_slot: attrIndex++
      }).select().single();

      if (attr) {
        await supabase.from('evidence').insert({
          product_id: prod.id,
          attribute_id: attr.id,
          source_url: p.source,
          snippet: `Technical Data: ${label} is ${val}${uom ? ' ' + uom : ''}`,
          confidence_score: conf
        });

        // Validation Results
        if (p.review && label === Object.keys(p.attrs)[0]) { // Attach review to first attribute
           await supabase.from('validation_results').insert({
             product_id: prod.id,
             attribute_id: attr.id,
             field_name: label,
             rule_id: 'R-001',
             status: 'OPEN',
             severity: 'ERROR',
             message: p.reviewMsg
           });
        }
      }
    }
  }

  console.log('Demo data seeded successfully!');
}

export async function resetDemoData() {
  console.log('Removing demo data...');
  
  const { data: datasets } = await supabase.from('datasets').select('id').or('name.like.%Demo%,name.like.%Demo Run%');
  if (datasets && datasets.length > 0) {
    const ids = datasets.map(d => d.id);
    
    // Because of foreign keys and cascade deletes (assuming they exist, otherwise we delete manually)
    // We will attempt manual deletes in reverse order to be safe if cascade isn't set up.
    for (const dId of ids) {
       const { data: prods } = await supabase.from('products').select('id').eq('dataset_id', dId);
       if (prods && prods.length > 0) {
         const pIds = prods.map(p => p.id);
         await supabase.from('validation_results').delete().in('product_id', pIds);
         await supabase.from('evidence').delete().in('product_id', pIds);
         await supabase.from('product_attributes').delete().in('product_id', pIds);
         await supabase.from('classifications').delete().in('product_id', pIds);
       }
       await supabase.from('products').delete().eq('dataset_id', dId);
       await supabase.from('source_products').delete().eq('dataset_id', dId);
       await supabase.from('processing_jobs').delete().eq('dataset_id', dId);
    }
    
    await supabase.from('datasets').delete().in('id', ids);
  }
  
  await supabase.from('manufacturers').delete().like('manufacturer_name', '% (Demo)');
  console.log('Demo data removed.');
}

if (require.main === module) {
  const action = process.argv[2];
  if (action === 'reset') {
    resetDemoData().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
  } else {
    seedDemoData().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
  }
}
