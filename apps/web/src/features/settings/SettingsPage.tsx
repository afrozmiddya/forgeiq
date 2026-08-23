import React from 'react';
import { Database, Server, Cpu, Layers } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Workspace */}
        <div className="bg-[#111111] p-6 rounded-xl shadow border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Workspace</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Workspace Name</p>
              <p className="font-medium text-neutral-200">UniHack Demo Workspace</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Environment</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">Demonstration</span>
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-[#111111] p-6 rounded-xl shadow border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold">AI Provider</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Provider</p>
              <p className="font-medium text-neutral-200">Google Gemini</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Model</p>
              <p className="font-medium text-neutral-200">gemini-2.5-flash</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Connection Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-emerald-400">Configured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-[#111111] p-6 rounded-xl shadow border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold">Pipeline Configuration</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Default Processing Mode</p>
              <p className="font-medium text-neutral-200">Autonomous (Queue on Error)</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Batch Size</p>
              <p className="font-medium text-neutral-200">100 rows per chunk</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Retry Policy</p>
              <p className="font-medium text-neutral-200">3 retries with exponential backoff</p>
            </div>
          </div>
        </div>

        {/* Reference Data & System Health */}
        <div className="bg-[#111111] p-6 rounded-xl shadow border border-neutral-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold">System Health & Reference Data</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-400">Taxonomy Rules</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">Loaded</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-400">LOV Constrains</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">Loaded</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-400">Database API</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-400">Worker Daemon</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">Online</span>
            </div>
          </div>
        </div>

        {/* Demo Control */}
        <div className="bg-[#111111] p-6 border border-blue-900/30 flex flex-col justify-between shadow shadow-blue-900/10 col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-neutral-100">Demo Control (UniHack)</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              Inject or clear a realistic, connected demonstration dataset to populate the ForgeIQ prototype without breaking the database schema.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                    await fetch(apiUrl + '/api/demo/seed', { method: 'POST' });
                    alert('Demo data seeded successfully. Refreshing...');
                    window.location.reload();
                  } catch (e) { alert('Error seeding demo data'); }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium uppercase tracking-wider transition shadow-sm shadow-blue-900/20"
              >
                Load Demo Data
              </button>
              <button 
                onClick={async () => {
                  try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                    await fetch(apiUrl + '/api/demo/reset', { method: 'POST' });
                    alert('Demo data reset successfully. Refreshing...');
                    window.location.reload();
                  } catch (e) { alert('Error resetting demo data'); }
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-red-400 px-6 py-2 text-sm font-medium uppercase tracking-wider transition"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
