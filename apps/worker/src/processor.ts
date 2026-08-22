import { generateDeterministicId } from '@forgeiq/identity/src/uuid-generator';
import { resolveBrand } from '@forgeiq/identity/src/brand-mapper';
import { classifyProduct } from '@forgeiq/ai/src/classifier';
import { executeExtraction } from '@forgeiq/ai/src/llm-client';
import { validateProductRow } from '@forgeiq/rules/src/validator';
import { fetchSpecs } from '@forgeiq/scraper/src/browser';
import { parseScrapedPayload } from '@forgeiq/scraper/src/parser';
import { supabase } from '@forgeiq/shared';
import type { JobChunk } from './orchestrator';

export class ChunkProcessor {
  async process(chunk: JobChunk): Promise<void> {
    console.log(`\n[Pipeline] Starting pipeline for job ${chunk.jobId} (Records: ${chunk.startIndex} to ${chunk.endIndex})`);
    
    let processedCount = 0;
    let failedCount = 0;
    
    for (const record of chunk.records) {
      console.log(`\n--- Processing Record ID: ${record.id} ---`);
      try {
        // 1. Identity Resolution
        const brandMatch = resolveBrand(record.rawMfg);
        const mfg = brandMatch.canonicalName || record.rawMfg;
        const uuid = generateDeterministicId(mfg, record.rawPart);
        
        // Upsert Product
        const { data: product, error: productErr } = await supabase.from('products').upsert({
          id: uuid,
          mpn: record.rawPart,
          product_type: 'Unknown',
          status: 'PROCESSED',
          overall_confidence: 0.85,
        }).select().single();
        if (productErr) throw productErr;

        // 2. Taxonomy Classification
        const taxonomy = await classifyProduct(record.title || record.rawPart, record.description || '');
        await supabase.from('classifications').insert({
          product_id: uuid,
          department: taxonomy.categoryName,
          confidence: 0.90,
          source: 'AI_CLASSIFIER'
        });

        // Fetch Dynamic Attributes for Category (Phase F)
        const { data: lovs } = await supabase.from('lov_values').select('attribute_label').eq('classpath', taxonomy.classpath);
        
        // Build a dynamic JSON schema string for the LLM
        let dynamicSchema: Record<string, string | string[]> = { 
          "Part_Desc": "string", 
          "Weight": "number", 
          "WEIGHT_UOM": "string",
          "Marketing_Description": "string (under 2000 chars)",
          "Features": ["string"],
          "Digital_Assets": ["string (URLs)"]
        };
        if (lovs && lovs.length > 0) {
          const uniqueLabels = Array.from(new Set(lovs.map(l => l.attribute_label)));
          uniqueLabels.forEach(label => {
             if (label) dynamicSchema[label] = "string";
          });
        }

        // 3. LLM Extraction
        const promptCtx = {
          title: `${mfg} ${record.rawPart}`,
          description: record.description || '',
          taxonomy: taxonomy,
          schema: JSON.stringify(dynamicSchema)
        };

        const extraction = await executeExtraction(promptCtx);
        const extractedFields = extraction.parsed || {};
        
        // Upsert Product Attributes
        let slot = 1;
        for (const [key, value] of Object.entries(extractedFields)) {
          if (value) {
            await supabase.from('product_attributes').upsert({
              product_id: uuid,
              attribute_slot: slot++,
              attribute_label: key,
              raw_value: String(value),
              normalized_value: String(value),
              confidence: 0.88,
            }, { onConflict: 'product_id,attribute_slot' });
          }
        }

        // 4. Rules Engine Validation
        const validationRow = {
          fields: extractedFields,
          attributes: []
        };
        const validation = validateProductRow(validationRow);
        
        for (const err of validation.errors) {
          await supabase.from('validation_results').insert({
            product_id: uuid,
            field_name: err.field,
            rule_id: err.code,
            severity: 'ERROR',
            status: 'OPEN',
            message: err.message
          });
        }
        
        if (!validation.isValid) {
          // 5. Fallback Scraper
          const scrapeResult = await fetchSpecs(mfg, record.rawPart);
          if (scrapeResult.success) {
            const recoveredData = parseScrapedPayload(scrapeResult);
            // Insert evidence
            await supabase.from('evidence').insert({
              product_id: uuid,
              claim: 'Scraped Specs',
              evidence_text: JSON.stringify(recoveredData),
              support_type: 'SCRAPER',
              evidence_confidence: 0.95
            });
          }
        }
        
        processedCount++;
      } catch (err) {
        console.error(`[Pipeline Error] Failed to process record ${record.id}`, err);
        failedCount++;
      }
    }

    // Update job progress
    const { data: job } = await supabase.from('processing_jobs').select('processed_rows,failed_rows,total_rows').eq('id', chunk.jobId).single();
    if (job) {
      const newProcessed = job.processed_rows + processedCount;
      const newFailed = job.failed_rows + failedCount;
      const progressPct = Math.round(((newProcessed + newFailed) / (job.total_rows || 1)) * 100);
      
      const newStatus = (newProcessed + newFailed >= (job.total_rows || 1)) ? 'COMPLETED' : 'PROCESSING';
      
      await supabase.from('processing_jobs').update({
        processed_rows: newProcessed,
        failed_rows: newFailed,
        progress_pct: progressPct,
        status: newStatus,
        completed_at: newStatus === 'COMPLETED' ? new Date().toISOString() : null
      }).eq('id', chunk.jobId);
    }
    
    console.log(`\n[Pipeline] Completed chunk. Successfully processed: ${processedCount}/${chunk.records.length}\n`);
  }
}
