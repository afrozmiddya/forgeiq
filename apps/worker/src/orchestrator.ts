import { supabase } from '@forgeiq/shared';
import crypto from 'crypto';

export interface JobChunk {
  jobId: string;
  datasetId: string;
  startIndex: number;
  endIndex: number;
  records: any[];
}

export class JobOrchestrator {
  private queue: JobChunk[] = [];
  
  async pollAndSlice(): Promise<void> {
    console.log('[Orchestrator] Polling for new PENDING jobs...');
    
    // Find one pending job
    const { data: job, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .eq('status', 'PENDING')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Orchestrator] Error polling jobs:', error);
      return;
    }

    if (job) {
      console.log(`[Orchestrator] Found PENDING job ${job.id}! Slicing into chunks...`);
      
      // Update to PROCESSING
      await supabase
        .from('processing_jobs')
        .update({ status: 'PROCESSING', started_at: new Date().toISOString() })
        .eq('id', job.id);

      const totalRecords = job.total_rows || 250; 
      
      const { data: sourceProducts } = await supabase
        .from('source_products')
        .select('*')
        .eq('dataset_id', job.dataset_id);

      const actualRecords = (sourceProducts || []).map(sp => ({
        id: sp.id,
        rawMfg: sp.raw_json.mfg || sp.raw_json.Manufacturer || sp.raw_json.brand || '',
        rawPart: sp.raw_json.part || sp.raw_json.MPN || sp.raw_json['Part Number'] || '',
        title: sp.raw_json.title || `${sp.raw_json.mfg || ''} ${sp.raw_json.part || ''}`,
        description: sp.raw_json.desc || sp.raw_json.description || ''
      }));

      // No fallback. If actualRecords is empty, we process 0 rows.
      const recordsToProcess = actualRecords;

      for (let i = 0; i < recordsToProcess.length; i += 100) {
        const chunk = recordsToProcess.slice(i, i + 100);
        this.queue.push({
          jobId: job.id,
          datasetId: job.dataset_id,
          startIndex: i,
          endIndex: i + chunk.length,
          records: chunk
        });
        console.log(`[Orchestrator] Created chunk ${i} to ${i + chunk.length} (size: ${chunk.length})`);
      }
    }
  }

  claimNextChunk(): JobChunk | undefined {
    return this.queue.shift();
  }
}
