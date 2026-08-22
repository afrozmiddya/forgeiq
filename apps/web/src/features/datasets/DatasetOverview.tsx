import { useEffect, useState } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { Database, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const DatasetRow: FC<{ dataset: any }> = ({ dataset }) => {
  const [status, setStatus] = useState(dataset.status);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (status === 'COMPLETED') return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/datasets/${dataset.id}/status`);
        if (res.data.success && res.data.progress) {
          setProgress(res.data.progress);
          setStatus(res.data.progress.status);
        }
      } catch (err) {
        console.error('Polling failed', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dataset.id, status]);

  const p = progress || {
    processedRows: 0,
    totalRows: dataset.rowCount || 1000,
    failedRows: 0,
    reviewRows: 0
  };

  const percentage = Math.round((p.processedRows / p.totalRows) * 100);
  
  // Fake detailed metrics since DB isn't populated (Phase 4 mock up)
  // We compute deterministic but mock-ish values based on progress for now
  const enrichment = status === 'COMPLETED' ? 87.6 : (percentage * 0.87);
  const validation = status === 'COMPLETED' ? 94.2 : (percentage * 0.94);
  const quality = status === 'COMPLETED' ? 91.4 : (percentage * 0.91);
  const sourceCvg = status === 'COMPLETED' ? 89.8 : (percentage * 0.89);

  return (
    <div className="bg-[#111111] hover:bg-[#161616] border border-neutral-800/60 p-6 flex flex-col gap-6 transition mb-4 rounded-xl shadow-lg">
      
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-100 uppercase tracking-widest">{dataset.name}</h3>
          <p className="text-sm text-neutral-500 mt-1">{p.totalRows.toLocaleString()} Products</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 tracking-wider
            ${status === 'PROCESSING' ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 
              status === 'COMPLETED' ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 
              'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20'}`}
          >
            {status === 'COMPLETED' ? <CheckCircle className="w-4 h-4"/> : <Clock className="w-4 h-4 animate-pulse"/>}
            {status}
          </span>
          {status === 'COMPLETED' && (
            <a 
              href={`http://localhost:4000/api/datasets/${dataset.id}/export`}
              download
              className="px-4 py-1.5 rounded-lg bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/20 text-xs font-bold uppercase transition"
            >
              Export Output
            </a>
          )}
          <Link to={`/app/dataset/${dataset.id}/review`} className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-xs font-bold uppercase transition">
            Review Queue
          </Link>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 border-t border-neutral-800/60 pt-6">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Quality Score</p>
          <p className="text-2xl font-light text-purple-400">{quality.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Enrichment</p>
          <p className="text-2xl font-light text-neutral-200">{enrichment.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Validation</p>
          <p className="text-2xl font-light text-neutral-200">{validation.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Evidence</p>
          <p className="text-2xl font-light text-neutral-200">{sourceCvg.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Review</p>
          <p className="text-2xl font-light text-yellow-500">{p.reviewRows}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Failed</p>
          <p className="text-2xl font-light text-red-400">{p.failedRows}</p>
        </div>
      </div>

      {/* Processing Pipeline Row */}
      <div className="border-t border-neutral-800/60 pt-6">
        <p className="text-xs font-semibold text-neutral-500 mb-4 tracking-wider uppercase">Pipeline Stage</p>
        <div className="hidden md:flex items-center justify-between text-xs font-medium">
          <div className={`flex items-center gap-2 ${percentage > 0 ? 'text-green-500' : 'text-neutral-600'}`}>
            {percentage > 0 ? '✓' : '○'} Ingestion
          </div>
          <div className="h-px bg-neutral-800 flex-1 mx-4"></div>
          
          <div className={`flex items-center gap-2 ${percentage > 10 ? 'text-green-500' : percentage > 0 ? 'text-blue-400' : 'text-neutral-600'}`}>
            {percentage > 10 ? '✓' : percentage > 0 ? '◉' : '○'} Identity Resolution
          </div>
          <div className="h-px bg-neutral-800 flex-1 mx-4"></div>
          
          <div className={`flex items-center gap-2 ${percentage > 30 ? 'text-green-500' : percentage > 10 ? 'text-blue-400' : 'text-neutral-600'}`}>
            {percentage > 30 ? '✓' : percentage > 10 ? '◉' : '○'} MFR Mapping
          </div>
          <div className="h-px bg-neutral-800 flex-1 mx-4"></div>
          
          <div className={`flex items-center gap-2 ${percentage > 50 ? 'text-green-500' : percentage > 30 ? 'text-blue-400' : 'text-neutral-600'}`}>
            {percentage > 50 ? '✓' : percentage > 30 ? '◉' : '○'} Taxonomy
          </div>
          <div className="h-px bg-neutral-800 flex-1 mx-4"></div>

          <div className={`flex items-center gap-2 ${percentage > 70 ? 'text-green-500' : percentage > 50 ? 'text-blue-400' : 'text-neutral-600'}`}>
            {percentage > 70 ? '✓' : percentage > 50 ? '◉' : '○'} AI Enrichment
          </div>
          <div className="h-px bg-neutral-800 flex-1 mx-4"></div>

          <div className={`flex items-center gap-2 ${percentage > 90 ? 'text-green-500' : percentage > 70 ? 'text-blue-400' : 'text-neutral-600'}`}>
            {percentage > 90 ? '✓' : percentage > 70 ? '◉' : '○'} Validation
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden flex">
          <div className="bg-blue-500 h-1.5 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          {p.failedRows > 0 && (
            <div className="bg-red-500 h-1.5 transition-all duration-500" style={{ width: `${(p.failedRows / p.totalRows) * 100}%` }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

const DatasetOverview: FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/datasets');
        if (response.data.success) {
          setDatasets(response.data.datasets);
        }
      } catch (err) {
        console.error('Failed to fetch datasets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Datasets</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage and monitor uploaded product catalogues.</p>
        </div>
        <Link to="/app/upload" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-medium transition shadow-sm shadow-blue-900/20">
          Upload Dataset
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading datasets..." />
      ) : datasets.length === 0 ? (
        <EmptyState 
          title="No datasets found"
          description="Upload your first product catalogue to begin the enrichment pipeline."
          icon={Database}
          actionText="Upload Dataset"
          actionHref="/app/upload"
        />
      ) : (
        <div className="grid gap-4">
          {datasets.map((dataset) => (
            <DatasetRow key={dataset.id} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasetOverview;
