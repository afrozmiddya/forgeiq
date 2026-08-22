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

async function seed() {
  console.log('Seeding Demo Dataset and Job...');

  // 1. Insert Dataset
  const { data: dataset, error: dsErr } = await supabase.from('datasets').insert({
    name: 'Demo Dataset',
    source_filename: 'demo_catalog_500.csv',
    file_type: 'csv',
    status: 'PROCESSING',
    row_count: 5
  }).select().single();

  if (dsErr) {
    console.error('Error inserting dataset:', dsErr);
    return;
  }
  console.log('Created Dataset:', dataset.id);

  // 2. Insert Dirty Source Products
  const dirtyRecords = [
    {
      dataset_id: dataset.id,
      source_row_number: 1,
      raw_json: { mfg: 'De walt', part: 'DCD 708 C2', voltage: '20 volts', weight: '1.15kgs', color: 'Neon Pink', desc: 'DEWALT cordless drill...' },
      raw_hash: 'hash1'
    },
    {
      dataset_id: dataset.id,
      source_row_number: 2,
      raw_json: { mfg: 'Milwaukeee', part: 'M18 Fuel', desc: 'Cordless drill set', voltage: '18V', color: 'Red' },
      raw_hash: 'hash2'
    },
    {
      dataset_id: dataset.id,
      source_row_number: 3,
      raw_json: { mfg: '', part: 'XPH12', desc: 'Makita drill bare tool 18v' },
      raw_hash: 'hash3'
    },
    {
      dataset_id: dataset.id,
      source_row_number: 4,
      raw_json: { mfg: 'Bosch', part: 'GSR18V', desc: 'Drill 18 volts', color: 'Blue' },
      raw_hash: 'hash4'
    },
    {
      dataset_id: dataset.id,
      source_row_number: 5,
      raw_json: { mfg: 'DEWALT', part: 'DCD708C2', voltage: '20V', weight: '1.15kg', desc: 'Duplicate to test identity' },
      raw_hash: 'hash5'
    }
  ];

  for (const rec of dirtyRecords) {
    await supabase.from('source_products').insert(rec);
  }

  // 3. Insert Processing Job
  const { data: job, error: jobErr } = await supabase.from('processing_jobs').insert({
    dataset_id: dataset.id,
    status: 'PENDING',
    total_rows: 5,
    processed_rows: 0,
    failed_rows: 0,
    progress_pct: 0
  }).select().single();

  if (jobErr) {
    console.error('Error inserting processing job:', jobErr);
    return;
  }
  console.log('Created Processing Job:', job.id);

  console.log('\nSeed complete! Run the worker to process this job:');
  console.log('cd apps/worker && pnpm start');
}

seed().catch(console.error);
