import React, { useState } from 'react';
import { DELIVERY_SCHEMA } from '@forgeiq/schemas/src/delivery-schema';
import { Search, Download, Filter } from 'lucide-react';

export const SchemaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRequired, setFilterRequired] = useState<string>('all');

  const filteredSchema = DELIVERY_SCHEMA.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (field.description && field.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterRequired === 'all') return matchesSearch;
    if (filterRequired === 'required') return matchesSearch && field.required;
    if (filterRequired === 'optional') return matchesSearch && !field.required;
    return matchesSearch;
  });

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Field Name,Type,Required,Description\n"
      + DELIVERY_SCHEMA.map(f => `${f.name},${f.type},${f.required ? 'YES' : 'NO'},"${f.description || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "forgeiq_delivery_schema.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-light text-slate-100">252-Column Delivery Contract</h1>
          <p className="text-slate-400 mt-2">
            The canonical schema for final commerce-ready product exports.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-medium">
            Valid: {DELIVERY_SCHEMA.length} / 252 fields
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Download className="w-4 h-4" /> Download Schema
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-200px)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/30">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search schema columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-slate-950 border border-slate-700 rounded-lg py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterRequired}
              onChange={(e) => setFilterRequired(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition appearance-none"
            >
              <option value="all">All Fields</option>
              <option value="required">Required Only</option>
              <option value="optional">Optional Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs border-b border-slate-800 sticky top-0 z-10 backdrop-blur">
              <tr>
                <th className="px-6 py-4 font-medium">Field Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Required</th>
                <th className="px-6 py-4 font-medium w-1/2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredSchema.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No fields match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredSchema.map((field, index) => (
                  <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-400">{field.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 border border-slate-700">
                        {field.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {field.required ? (
                        <span className="text-amber-400 text-xs font-medium bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">YES</span>
                      ) : (
                        <span className="text-slate-500 text-xs">NO</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{field.description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
