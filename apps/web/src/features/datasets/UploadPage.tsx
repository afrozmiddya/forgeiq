import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Settings, Database, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UploadPage: FC = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Configuration State
  const [mode, setMode] = useState('FULL');
  const [taxonomy, setTaxonomy] = useState('AUTO');

  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setStep(2); // Automatically advance to mapping step
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('taxonomy', taxonomy);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiUrl}/api/datasets/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        navigate('/datasets');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload dataset');
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-2xl font-light text-neutral-200">New Enrichment Job</h2>
        <p className="text-sm text-neutral-500 mt-1">Upload and configure your industrial catalogue pipeline.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 text-sm font-medium relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800 -z-10"></div>
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Mapping' },
          { num: 3, label: 'Configuration' },
          { num: 4, label: 'Confirmation' },
        ].map((s) => (
          <div key={s.num} className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-blue-400' : 'text-neutral-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[#0A0A0A] transition-colors
              ${step >= s.num ? 'border-blue-500 text-blue-400' : 'border-neutral-800 text-neutral-600'}`}>
              {s.num}
            </div>
            <span className="bg-[#0A0A0A] px-2">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 bg-red-900/10 text-red-400 p-4 border border-red-900/30 text-sm flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="border border-dashed border-neutral-700 p-16 flex flex-col items-center justify-center bg-[#111111] hover:bg-[#161616] transition group">
            <div className="p-4 bg-blue-500/5 rounded-full mb-6 group-hover:bg-blue-500/10 transition">
              <Upload className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-light text-neutral-200 mb-2">Upload Product Catalogue</h3>
            <p className="text-neutral-500 text-sm mb-8">Supports CSV or XLSX up to 50MB.</p>
            
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-sm font-medium cursor-pointer transition shadow-sm shadow-blue-900/20">
              Select File
              <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      )}

      {/* STEP 2: MAPPING */}
      {step === 2 && (
        <div className="flex-1">
          <div className="bg-[#111111] border border-neutral-800 p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileIcon />
              <div>
                <p className="font-medium text-neutral-200 text-sm">{file?.name}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{(file!.size / 1024 / 1024).toFixed(2)} MB • ~1,000 Rows Detected</p>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-neutral-500 hover:text-neutral-300 transition">Change File</button>
          </div>

          <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Column Mapping</h3>
          <div className="bg-[#111111] border border-neutral-800 rounded-sm">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-neutral-800 bg-[#161616] text-xs font-medium text-neutral-500 uppercase tracking-wider">
              <div>Required Field</div>
              <div>Source Column</div>
              <div>Confidence</div>
            </div>
            {[
              { req: 'Manufacturer', col: 'manufacturer_name', conf: 98 },
              { req: 'Part Number', col: 'mfr_part_number', conf: 99 },
              { req: 'Description', col: 'description', conf: 95 },
              { req: 'Category', col: 'category', conf: 82 },
            ].map((map, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-neutral-800/50 items-center text-sm">
                <div className="text-neutral-300 font-medium">{map.req}</div>
                <div className="text-blue-400 bg-blue-500/10 px-3 py-1.5 inline-flex w-max rounded border border-blue-500/20">{map.col}</div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">Auto-matched</span>
                  <span className="text-neutral-500">— {map.conf}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition flex items-center gap-2 shadow-sm shadow-blue-900/20">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIGURATION */}
      {step === 3 && (
        <div className="flex-1">
          <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Processing Mode</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div 
              onClick={() => setMode('FULL')}
              className={`p-6 border cursor-pointer transition ${mode === 'FULL' ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-800 bg-[#111111] hover:border-neutral-600'}`}
            >
              <Activity className={`w-6 h-6 mb-3 ${mode === 'FULL' ? 'text-blue-400' : 'text-neutral-500'}`} />
              <h4 className={`text-base font-medium mb-1 ${mode === 'FULL' ? 'text-blue-400' : 'text-neutral-300'}`}>Full Enrichment</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Extract all missing attributes and fully validate against master schemas.</p>
            </div>
            <div 
              onClick={() => setMode('MISSING')}
              className={`p-6 border cursor-pointer transition ${mode === 'MISSING' ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-800 bg-[#111111] hover:border-neutral-600'}`}
            >
              <Database className={`w-6 h-6 mb-3 ${mode === 'MISSING' ? 'text-blue-400' : 'text-neutral-500'}`} />
              <h4 className={`text-base font-medium mb-1 ${mode === 'MISSING' ? 'text-blue-400' : 'text-neutral-300'}`}>Missing Fields Only</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Preserve existing values, only infer and enrich empty fields.</p>
            </div>
            <div 
              onClick={() => setMode('VALIDATION')}
              className={`p-6 border cursor-pointer transition ${mode === 'VALIDATION' ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-800 bg-[#111111] hover:border-neutral-600'}`}
            >
              <CheckCircle className={`w-6 h-6 mb-3 ${mode === 'VALIDATION' ? 'text-blue-400' : 'text-neutral-500'}`} />
              <h4 className={`text-base font-medium mb-1 ${mode === 'VALIDATION' ? 'text-blue-400' : 'text-neutral-300'}`}>Validation Only</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Do not use AI enrichment. Only run records through deterministic LOV/UOM rules.</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Taxonomy Detection</h3>
          <div className="grid grid-cols-2 gap-4">
             <div 
              onClick={() => setTaxonomy('AUTO')}
              className={`p-6 border cursor-pointer transition flex items-center justify-between ${taxonomy === 'AUTO' ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-800 bg-[#111111] hover:border-neutral-600'}`}
            >
              <div>
                <h4 className={`text-sm font-medium mb-1 ${taxonomy === 'AUTO' ? 'text-blue-400' : 'text-neutral-300'}`}>Auto-Detect</h4>
                <p className="text-xs text-neutral-500">Heuristically classify based on description.</p>
              </div>
              {taxonomy === 'AUTO' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
            </div>
             <div 
              onClick={() => setTaxonomy('MANUAL')}
              className={`p-6 border cursor-pointer transition flex items-center justify-between ${taxonomy === 'MANUAL' ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-800 bg-[#111111] hover:border-neutral-600'}`}
            >
              <div>
                <h4 className={`text-sm font-medium mb-1 ${taxonomy === 'MANUAL' ? 'text-blue-400' : 'text-neutral-300'}`}>Forced Assignment</h4>
                <p className="text-xs text-neutral-500">Override and assign all rows to one class.</p>
              </div>
              {taxonomy === 'MANUAL' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition flex items-center gap-2 shadow-sm shadow-blue-900/20">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRMATION */}
      {step === 4 && (
        <div className="flex-1">
          <div className="bg-[#111111] border border-neutral-800 p-8">
            <div className="flex items-center gap-4 mb-8">
              <Settings className="w-8 h-8 text-neutral-400" />
              <div>
                <h3 className="text-xl font-light text-neutral-200">Ready to start pipeline</h3>
                <p className="text-sm text-neutral-500 mt-1">Review your configuration before executing the job.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">File</span>
                  <span className="text-neutral-200 font-medium">{file?.name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Products</span>
                  <span className="text-neutral-200 font-medium">~1,000</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Columns</span>
                  <span className="text-neutral-200 font-medium">17 detected</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Mode</span>
                  <span className="text-blue-400 font-medium">{mode.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Taxonomy</span>
                  <span className="text-neutral-200 font-medium">{taxonomy}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-500">Est. Processing</span>
                  <span className="text-yellow-500 font-medium">~4 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-500/5 border border-blue-500/20 p-4 text-sm text-blue-400">
              This job will consume approximately 1,000 API credits and process across 4 concurrent worker nodes.
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(3)} className="px-6 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-2 text-sm font-medium transition flex items-center gap-2 shadow-sm shadow-green-900/20"
            >
              {uploading ? 'Initializing Pipeline...' : 'Start Enrichment'} 
              {!uploading && <CheckCircle className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FileIcon = () => (
  <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center border border-neutral-700">
    <Database className="w-5 h-5 text-neutral-400" />
  </div>
);

export default UploadPage;
