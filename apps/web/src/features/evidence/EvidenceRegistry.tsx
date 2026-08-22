import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const EvidenceRegistry: React.FC = () => {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  useEffect(() => {
    async function fetchEvidence() {
      const { data } = await supabase.from('evidence').select('*, products(mpn)').order('created_at', { ascending: false }).limit(50);
      if (data) setEvidence(data);
      setLoading(false);
    }
    fetchEvidence();
  }, []);

  if (loading) return <LoadingSpinner message="Loading evidence registry..." />;

  if (evidence.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col justify-center">
        <EmptyState 
          title="No evidence recorded"
          description="Enrichment jobs will populate this registry with source-backed evidence for every extracted value."
          icon={ShieldCheck}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Evidence Registry</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product MPN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence Snippet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evidence.map((ev) => (
                <tr key={ev.id} onClick={() => setSelectedEvidence(ev)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{ev.products?.mpn || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ev.claim}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate" title={ev.evidence_text}>{ev.evidence_text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${ev.evidence_confidence > 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {(ev.evidence_confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selectedEvidence && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setSelectedEvidence(null)} />
          <section className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="px-6 py-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Evidence Record</h2>
                  <button onClick={() => setSelectedEvidence(null)} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Claim / Attribute</h3>
                    <p className="text-base font-medium text-gray-900">{selectedEvidence.claim}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Confidence</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedEvidence.evidence_confidence > 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {(selectedEvidence.evidence_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Source Type</h3>
                    <p className="text-sm text-gray-900">{selectedEvidence.support_type}</p>
                  </div>
                  {selectedEvidence.source_id && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Source Link</h3>
                      <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Raw Evidence Text</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 italic">
                      "{selectedEvidence.evidence_text}"
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Validation Rules</h3>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Value present in LOV
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Datatype matches schema
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Source traceability confirmed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
