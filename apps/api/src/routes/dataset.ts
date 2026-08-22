import { Router } from 'express';
import multer from 'multer';
import { DELIVERY_SCHEMA, renderDeliveryRow } from '@forgeiq/schemas/src/delivery-schema';
import { supabase } from '@forgeiq/shared';
import crypto from 'crypto';

const router = Router();
const upload = multer({ dest: 'uploads/' });

import fs from 'fs';
import { parse } from 'csv-parse';

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records: any[] = await new Promise((resolve, reject) => {
      parse(fileContent, { columns: true, skip_empty_lines: true }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const { data: dataset, error } = await supabase
      .from('datasets')
      .insert({
        name: req.file.originalname,
        source_filename: req.file.originalname,
        file_type: req.file.mimetype || 'text/csv',
        row_count: records.length,
        status: 'UPLOADED',
      })
      .select()
      .single();

    if (error) throw error;

    // Insert source products
    const sourceRecords = records.map((rec, idx) => ({
      dataset_id: dataset.id,
      source_row_number: idx + 1,
      raw_json: rec,
      raw_hash: crypto.createHash('md5').update(JSON.stringify(rec)).digest('hex')
    }));

    // Insert in batches if needed, but for MVP doing all at once is fine for small files
    await supabase.from('source_products').insert(sourceRecords);

    if (error) throw error;

    await supabase.from('processing_jobs').insert({
      dataset_id: dataset.id,
      job_type: 'ENRICHMENT',
      status: 'PENDING',
      total_rows: records.length,
      processed_rows: 0,
      failed_rows: 0,
      review_rows: 0,
      progress_pct: 0,
      started_at: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      dataset
    });
  } catch (err: any) {
    console.error('Error uploading dataset:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data: datasets, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      datasets
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/status', async (req, res) => {
  const datasetId = req.params.id;
  
  try {
    const { data: job, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .eq('dataset_id', datasetId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found for a moment

    res.status(200).json({
      success: true,
      progress: job || {
        datasetId,
        status: 'PENDING',
        totalRows: 0,
        processedRows: 0,
        failedRows: 0,
        reviewRows: 0,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/export', async (req, res) => {
  const datasetId = req.params.id;
  
  try {
    // 1. Fetch all products. Normally we'd filter by dataset via source_products,
    // but for MVP we fetch all processed products or just top 1000.
    const { data: products, error: prodErr } = await supabase.from('products').select('*');
    if (prodErr) throw prodErr;

    const { data: allAttrs, error: attrErr } = await supabase.from('product_attributes').select('*');
    if (attrErr) throw attrErr;
    
    const { data: classifications } = await supabase.from('classifications').select('*');
    const { data: manufacturers } = await supabase.from('manufacturers').select('*');

    const csvHeaders = DELIVERY_SCHEMA.map(f => f.name).join(',');
    const rows = [];

    for (const prod of (products || [])) {
      const prodAttrs = (allAttrs || []).filter(a => a.product_id === prod.id);
      const prodClass = (classifications || []).find(c => c.product_id === prod.id);
      const mfg = (manufacturers || []).find(m => m.id === prod.manufacturer_id);
      
      const enrichedRow: any = {
        MANUFACTURER_NAME: mfg?.manufacturer_name || '',
        MANUFACTURER_PART_NUMBER: prod.mpn || '',
        Dept: prodClass?.department || '',
      };
      
      prodAttrs.forEach((attr) => {
         const slot = attr.attribute_slot;
         if (slot) {
           enrichedRow[`ATTRIBUTE_LABEL ${slot}`] = attr.attribute_label;
           enrichedRow[`ATTRIBUTE_VALUE ${slot}`] = attr.normalized_value || attr.raw_value;
           enrichedRow[`ATTRIBUTE_UOM ${slot}`] = attr.normalized_uom || attr.uom || '';
         }
      });

      // Convert to 252-column schema array
      const formattedArray = renderDeliveryRow(enrichedRow);
      
      const csvRow = formattedArray.map(val => {
        if (val === null || val === undefined) return '';
        const strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      }).join(',');

      rows.push(csvRow);
    }

    const csvContent = `${csvHeaders}\n${rows.join('\n')}`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="enriched_${datasetId}.csv"`);
    res.status(200).send(csvContent);
  } catch (err: any) {
    console.error('Export error:', err);
    res.status(500).send('Error generating export');
  }
});

export default router;
