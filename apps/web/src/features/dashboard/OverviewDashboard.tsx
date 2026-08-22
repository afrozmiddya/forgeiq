import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CheckCircle, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

interface DashboardMetrics {
  totalProducts: number;
  enrichmentRate: number;
  validationRate: number;
  sourceCoverage: number;
  reviewRequired: number;
  qualityScore: number;
}

const MetricCard: FC<{ title: string; value: string | number; icon: any; color: string; subtitle?: string }> = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-[#111111] border border-neutral-800/60 p-6 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
      <div className={`p-2 bg-neutral-900 rounded ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div>
      <p className="text-3xl font-light text-neutral-100">{value}</p>
      {subtitle && <p className="text-xs text-neutral-500 mt-2">{subtitle}</p>}
    </div>
  </div>
);

export const OverviewDashboard: FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/metrics');
        if (response.data.success) {
          setMetrics(response.data.metrics);
        }
      } catch (err) {
        console.error('Failed to fetch metrics', err);
        // Fallback to empty state if API fails
        setMetrics({
          totalProducts: 0,
          enrichmentRate: 0,
          validationRate: 0,
          sourceCoverage: 0,
          reviewRequired: 0,
          qualityScore: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="p-8 text-neutral-500">Loading overview...</div>;
  }

  const m = metrics || {
    totalProducts: 0,
    enrichmentRate: 0,
    validationRate: 0,
    sourceCoverage: 0,
    reviewRequired: 0,
    qualityScore: 0
  };

  const hasData = m.totalProducts > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-2xl font-light text-neutral-200">Executive Overview</h2>
        <p className="text-sm text-neutral-500 mt-1">Platform intelligence metrics across all datasets.</p>
      </div>

      {!hasData ? (
        <div className="border border-neutral-800 p-12 bg-[#111111] text-center mb-8 flex flex-col items-center">
          <Activity className="w-10 h-10 text-neutral-600 mb-4" />
          <h3 className="text-lg font-medium text-neutral-300 mb-2">No Active Data</h3>
          <p className="text-sm text-neutral-500 max-w-md">
            ForgeIQ requires datasets to generate intelligence metrics. Head over to the Datasets tab to upload your first industrial catalogue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricCard title="Total Products" value={m.totalProducts.toLocaleString()} icon={Box} color="text-blue-400" />
          <MetricCard title="Enrichment Rate" value={`${m.enrichmentRate.toFixed(1)}%`} icon={Activity} color="text-blue-400" />
          <MetricCard title="Validation Rate" value={`${m.validationRate.toFixed(1)}%`} icon={CheckCircle} color="text-green-500" />
          <MetricCard title="Source Coverage" value={`${m.sourceCoverage.toFixed(1)}%`} icon={ShieldCheck} color="text-green-500" />
          <MetricCard title="Review Required" value={m.reviewRequired.toLocaleString()} icon={AlertTriangle} color="text-yellow-500" />
          <MetricCard title="Average Quality Score" value={m.qualityScore.toFixed(1)} icon={Activity} color="text-purple-400" />
        </div>
      )}

      {/* Placeholder for Recent Datasets or other widgets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-neutral-800/60 p-6 min-h-[300px]">
          <h3 className="text-sm font-medium text-neutral-400 mb-6">Enrichment Coverage</h3>
          {!hasData ? (
            <div className="text-xs text-neutral-600 italic">No data available.</div>
          ) : (
            <div className="space-y-4">
              {/* Simulate attribute coverage visualization */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300">Identity</span>
                <span className="text-blue-400">0%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300">Manufacturer</span>
                <span className="text-blue-400">0%</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-[#111111] border border-neutral-800/60 p-6 min-h-[300px]">
          <h3 className="text-sm font-medium text-neutral-400 mb-6">Quality Distribution</h3>
          {!hasData ? (
            <div className="text-xs text-neutral-600 italic">No data available.</div>
          ) : (
             <div className="h-48 border border-neutral-800/50 rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
               <span className="text-sm text-neutral-500 mb-2">Validation Distribution</span>
               <div className="w-full h-2 bg-neutral-800 rounded-full flex overflow-hidden">
                 <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
                 <div className="bg-yellow-500 h-full" style={{ width: '12%' }}></div>
                 <div className="bg-red-500 h-full" style={{ width: '3%' }}></div>
               </div>
               <div className="w-full flex justify-between text-xs text-neutral-500 mt-2">
                 <span>85% PASS</span>
                 <span>12% WARN</span>
                 <span>3% FAIL</span>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
