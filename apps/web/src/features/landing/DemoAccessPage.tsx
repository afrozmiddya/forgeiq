import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight } from 'lucide-react';

export const DemoAccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoAccess = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-neutral-200">
      <div className="max-w-md w-full bg-[#111111] border border-neutral-800 rounded-xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Hexagon className="w-12 h-12 text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">ForgeIQ Workspace</h2>
        <p className="text-neutral-400 mb-8">
          Enter the demo workspace to explore the product enrichment pipeline and evaluate the platform.
        </p>
        
        <button 
          onClick={handleDemoAccess}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111111]"
        >
          Continue to Demo
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <p className="mt-6 text-xs text-neutral-500">
          This is an evaluator demo environment. No credentials required.
        </p>
      </div>
    </div>
  );
};
