import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, ArrowRight, ShieldCheck, Activity, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';

export const ReviewPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewQueue() {
      try {
        const { data: validationResults, error: valErr } = await supabase
          .from('validation_results')
          .select('product_id')
          .eq('severity', 'ERROR')
          .eq('status', 'OPEN')
          .limit(10);
          
        if (valErr) throw valErr;

        if (validationResults && validationResults.length > 0) {
          // Simplistic mock-like mapping for MVP
          const productIds = Array.from(new Set(validationResults.map(v => v.product_id)));
          
          const enrichedRecords = await Promise.all(productIds.map(async (pid) => {
             const { data: product } = await supabase.from('products').select('*').eq('id', pid).single();
             const { data: attrs } = await supabase.from('product_attributes').select('*').eq('product_id', pid);
             const { data: errors } = await supabase.from('validation_results').select('*').eq('product_id', pid).eq('status', 'OPEN');
             
             const extracted: Record<string, string> = {};
             if (attrs) {
               attrs.forEach(a => { extracted[a.attribute_label] = a.normalized_value || a.raw_value; });
             }

             return {
               id: pid,
               status: 'NEEDS_REVIEW',
               raw: {
                 manufacturer: product?.mpn || 'Unknown',
                 part_num: product?.mpn || 'Unknown',
                 description: 'Sample description from source'
               },
               extracted,
               errors: (errors || []).map(e => ({ field: e.field_name, code: e.rule_id, message: e.message }))
             };
          }));
          
          setRecords(enrichedRecords);
        }
      } catch (err) {
        console.error('Error fetching review queue:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviewQueue();
  }, []);

  const currentRecord = records[currentIndex];

  const handleNext = () => {
    if (currentIndex < records.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Simulate clearing queue
      setRecords([]);
    }
  };

  const handleApprove = async () => {
    if (currentRecord) {
      // Mark validation rules as closed
      await supabase.from('validation_results').update({ status: 'CLOSED' }).eq('product_id', currentRecord.id);
    }
    handleNext();
  };

  if (loading) {
    return <div className="p-10 text-neutral-500 flex justify-center items-center h-full">Loading queue...</div>;
  }

  if (!currentRecord) {
    return (
      <div className="p-10 h-full flex flex-col justify-center">
        <EmptyState 
          title="Review Queue Clear"
          description="All records have been reviewed and validated. No pending items require human intervention."
          icon={Check}
          actionText="Return to Datasets"
          actionHref="/app/datasets"
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-light text-neutral-100 uppercase tracking-widest">Human-in-the-Loop Review</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Record {currentIndex + 1} of {records.length} requiring attention.
          </p>
        </div>
        
        {/* Filters Mock */}
        <div className="flex gap-4">
          <select className="bg-[#111111] border border-neutral-800 text-neutral-300 text-sm px-4 py-2 outline-none">
            <option>View: Validation Errors</option>
            <option>View: Low Confidence</option>
            <option>View: All Records</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleNext} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-6 py-2 text-sm font-medium uppercase tracking-wider transition">
              Skip
            </button>
            <button onClick={handleApprove} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium uppercase tracking-wider flex items-center gap-2 transition shadow-sm shadow-blue-900/20">
              <Check className="w-4 h-4"/> Approve
            </button>
          </div>
        </div>
      </div>

      {currentRecord.errors.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-500 font-medium text-sm uppercase tracking-wider">Validation Rule Violation</h4>
            <ul className="mt-2 space-y-1">
              {currentRecord.errors.map((err, i) => (
                <li key={i} className="text-sm text-yellow-500/80">{err.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        {/* RAW SIDE */}
        <div className="bg-[#111111] border border-neutral-800/60 flex flex-col">
          <div className="bg-[#161616] px-6 py-4 border-b border-neutral-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Original Client Data</h3>
          </div>
          <div className="p-6 overflow-auto bg-[#0A0A0A]">
            <div className="space-y-4">
              {Object.entries(currentRecord.raw).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs text-neutral-600 uppercase tracking-wider block mb-1">{key}</label>
                  <div className="text-sm text-neutral-300 font-mono bg-[#111111] border border-neutral-800 p-3">{value as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXTRACTED SIDE */}
        <div className="bg-[#111111] border border-neutral-800/60 flex flex-col">
          <div className="bg-[#161616] px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider">ForgeIQ Enriched Output</h3>
            </div>
          </div>
          <div className="p-6 overflow-auto">
            <div className="space-y-4">
              {Object.entries(currentRecord.extracted).map(([key, value]) => {
                const hasError = currentRecord.errors.some(e => e.field === key);
                return (
                  <div key={key} className={`p-4 border transition ${hasError ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-[#0A0A0A] border-neutral-800 hover:border-neutral-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`text-xs font-medium uppercase tracking-wider ${hasError ? 'text-yellow-500' : 'text-neutral-500'}`}>{key}</label>
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                        <ShieldCheck className="w-3 h-3" /> View Evidence
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                       <input 
                         type="text" 
                         defaultValue={value as string} 
                         className={`flex-1 bg-transparent border-b ${hasError ? 'border-yellow-500/50 text-yellow-100' : 'border-neutral-700 text-neutral-200'} focus:outline-none focus:border-blue-500 py-1 text-sm transition`}
                       />
                       {hasError && <X className="w-4 h-4 text-yellow-500 shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
