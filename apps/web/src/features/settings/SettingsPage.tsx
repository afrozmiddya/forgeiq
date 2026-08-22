import React from 'react';
import { Database, Server, Cpu, Layers } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Workspace */}
        <div className="bg-white p-6 rounded-xl shadow border border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Workspace</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Workspace Name</p>
              <p className="font-medium text-neutral-900">ForgeIQ Demo Environment</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Environment</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Production</span>
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-white p-6 rounded-xl shadow border border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold">AI Provider</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Provider</p>
              <p className="font-medium text-neutral-900">Google Gemini</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Model</p>
              <p className="font-medium text-neutral-900">gemini-2.5-flash</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Connection Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-emerald-600">Configured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-white p-6 rounded-xl shadow border border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold">Pipeline Configuration</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Default Processing Mode</p>
              <p className="font-medium text-neutral-900">Autonomous (Queue on Error)</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Batch Size</p>
              <p className="font-medium text-neutral-900">100 rows per chunk</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Retry Policy</p>
              <p className="font-medium text-neutral-900">3 retries with exponential backoff</p>
            </div>
          </div>
        </div>

        {/* Reference Data & System Health */}
        <div className="bg-white p-6 rounded-xl shadow border border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold">System Health & Reference Data</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Taxonomy Rules</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Loaded</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">LOV Constrains</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Loaded</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Database API</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-600">Worker Daemon</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Online</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
