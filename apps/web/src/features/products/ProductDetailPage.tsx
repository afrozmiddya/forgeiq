import { FC, useState, useEffect } from 'react';
import { Box, ShieldCheck, AlertTriangle, CheckCircle, ExternalLink, Activity, ChevronRight, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ProductDetailPage: FC = () => {
  const [selectedAttr, setSelectedAttr] = useState<any | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch the first product to simulate a detail view
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .limit(1)
          .single();
          
        if (prodErr && prodErr.code !== 'PGRST116') throw prodErr;

        if (prodData) {
          setProduct(prodData);
          
          const { data: attrData, error: attrErr } = await supabase
            .from('product_attributes')
            .select('*')
            .eq('product_id', prodData.id)
            .order('attribute_slot', { ascending: true });
            
          if (attrErr) throw attrErr;
          
          setAttributes(attrData || []);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, []);

  if (loading) {
    return <div className="p-8 text-neutral-500">Loading product data...</div>;
  }

  if (!product) {
    return <div className="p-8 text-neutral-500">No products found in the database. Upload a dataset to begin.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 uppercase tracking-wider font-medium">
        <span>Products</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-300">{product.mpn}</span>
      </div>

      {/* Header */}
      <div className="bg-[#111111] border border-neutral-800/60 p-8 flex items-start justify-between mb-6">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Box className="w-8 h-8 text-neutral-600" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-neutral-100 mb-2">Unknown Manufacturer {product.mpn}</h1>
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <span>Manufacturer: <strong className="text-neutral-200">Unknown</strong></span>
              <span>Part Number: <strong className="text-neutral-200">{product.mpn}</strong></span>
              <span>Category: <strong className="text-blue-400">{product.product_type}</strong></span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">Quality Score</p>
          <p className="text-4xl font-light text-purple-400">{Math.round(product.overall_confidence * 100)}</p>
        </div>
      </div>

      {/* Attribute Table */}
      <div className="flex-1 bg-[#111111] border border-neutral-800/60 flex flex-col">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-medium text-neutral-200">Enriched Attributes</h3>
          <span className="text-xs text-neutral-500">Click any attribute to view evidence and validation reasoning.</span>
        </div>
        <div className="grid grid-cols-5 p-4 border-b border-neutral-800 bg-[#161616] text-xs font-medium text-neutral-500 uppercase tracking-wider">
          <div>Attribute</div>
          <div>Value</div>
          <div>Source</div>
          <div>Confidence</div>
          <div>Validation</div>
        </div>
        <div className="flex-1 overflow-auto">
          {attributes.map((attr, idx) => (
            <div 
              key={attr.id || idx} 
              onClick={() => setSelectedAttr(attr)}
              className="grid grid-cols-5 p-4 border-b border-neutral-800/50 items-center text-sm hover:bg-[#161616] cursor-pointer transition group"
            >
              <div className="text-neutral-300 font-medium group-hover:text-blue-400 transition">{attr.attribute_label}</div>
              <div className={attr.validation_status === 'FAILED' ? 'text-red-400 font-medium' : 'text-neutral-200 font-medium'}>{attr.normalized_value || attr.raw_value}</div>
              <div className="text-neutral-400 truncate pr-4">AI Extraction</div>
              <div>
                <span className={`px-2 py-1 text-xs rounded border ${(attr.confidence || 0) * 100 > 90 ? 'text-green-400 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                  {Math.round((attr.confidence || 0) * 100)}%
                </span>
              </div>
              <div>
                {attr.validation_status === 'PASSED' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : attr.validation_status === 'FAILED' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Drawer (Phase 7 & 10) */}
      {selectedAttr && (
        <div className="absolute right-0 top-0 bottom-0 w-[450px] bg-[#111111] border-l border-neutral-800 shadow-2xl flex flex-col z-50 transform transition-transform animate-in slide-in-from-right">
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Why was this value selected?</p>
              <h3 className="text-xl font-light text-neutral-200">{selectedAttr.attribute_label}</h3>
            </div>
            <button onClick={() => setSelectedAttr(null)} className="text-neutral-500 hover:text-white transition">✕</button>
          </div>
          
          <div className="p-6 flex-1 overflow-auto space-y-8">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">Extracted Value</p>
              <div className="text-2xl font-light text-neutral-200">{selectedAttr.normalized_value || selectedAttr.raw_value}</div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">Confidence</p>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-light text-green-400">{Math.round((selectedAttr.confidence || 0) * 100)}%</div>
                <p className="text-xs text-neutral-400 max-w-[200px]">Confidence derived from extraction pipeline.</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Evidence Source
              </p>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-blue-400">AI Extraction Pipeline</span>
                  <a href="#" className="text-neutral-500 hover:text-blue-400 transition">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-neutral-300 italic border-l-2 border-blue-500/50 pl-3 py-1">
                  Extracted from context based on rules.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Validation Results
              </p>
              
              {selectedAttr.validation_status === 'PASSED' ? (
                <div className="space-y-2 text-sm text-neutral-300">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Validation passed</div>
                </div>
              ) : selectedAttr.validation_status === 'FAILED' ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-sm text-sm">
                  <div className="flex items-start gap-3 text-yellow-500">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-medium mb-1">VALIDATION_FAILED</p>
                      <p className="text-yellow-500/80">Value failed one or more validation rules.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-neutral-300">
                  <div className="flex items-center gap-2 text-neutral-500">Pending validation</div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 border-t border-neutral-800 bg-[#0A0A0A] flex gap-3">
             <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 px-4 py-2 text-sm font-medium transition">Edit Value</button>
             {selectedAttr.validation_status === 'FAILED' && (
               <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm font-medium transition">Accept Override</button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
