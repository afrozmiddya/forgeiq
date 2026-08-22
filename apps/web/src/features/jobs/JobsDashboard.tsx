import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Activity } from 'lucide-react';

export const JobsDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase.from('processing_jobs').select('*, datasets(name)').order('created_at', { ascending: false }).limit(20);
      if (data) setJobs(data);
      setLoading(false);
    }
    fetchJobs();
    
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner message="Loading enrichment jobs..." />;

  if (jobs.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col justify-center">
        <EmptyState 
          title="No enrichment jobs yet"
          description="Upload a product catalogue to start the enrichment pipeline."
          icon={Activity}
          actionText="Upload Dataset"
          actionHref="/app/upload"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrichment Jobs</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} onClick={() => setSelectedJob(job)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{job.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.datasets?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${job.progress_pct || 0}%` }}></div>
                    </div>
                    <span className="text-xs">{job.processed_rows || 0} / {job.total_rows || 0} rows</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">{job.failed_rows || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500 font-medium">{job.review_rows || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Simple inline details if selected */}
      {selectedJob && (
        <div className="mt-8 bg-white rounded-lg shadow p-6 border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Job Details: {selectedJob.id}</h2>
            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">Close</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500 uppercase">Dataset</p>
              <p className="font-medium">{selectedJob.datasets?.name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <p className="font-medium">{selectedJob.status}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500 uppercase">Started</p>
              <p className="font-medium">{new Date(selectedJob.started_at).toLocaleTimeString()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500 uppercase">Completed</p>
              <p className="font-medium">{selectedJob.completed_at ? new Date(selectedJob.completed_at).toLocaleTimeString() : '---'}</p>
            </div>
          </div>
          <h3 className="font-medium mb-3">Pipeline Stages</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Upload & Parse</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Identity Resolution</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Source Discovery</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Taxonomy Classification</li>
            <li className="flex items-center gap-2">
              <span className={selectedJob.status === 'COMPLETED' ? "text-green-500" : "text-blue-500 animate-pulse"}>
                {selectedJob.status === 'COMPLETED' ? '✓' : '●'}
              </span> 
              AI Enrichment & Validation
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
