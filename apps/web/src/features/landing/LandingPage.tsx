import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, ArrowRight, CheckCircle2, ShieldCheck, Database, Layers, CheckSquare } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b border-neutral-800/50 bg-[#0A0A0A]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold tracking-widest text-white">FORGE<span className="text-blue-500 font-light">IQ</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-neutral-400 hover:text-white transition">How it Works</a>
            <Link to="/demo" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition">
              Launch ForgeIQ
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1 - HERO */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <ShieldCheck className="w-4 h-4" />
          <span>Manufacturer-first • Evidence-backed • Validation-driven</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
          From Product Data to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Product Intelligence.</span>
        </h1>
        
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ForgeIQ transforms limited manufacturer and part-number data into validated, taxonomy-driven, commerce-ready product information — with evidence behind every value.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link to="/demo" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-lg">
            Launch ForgeIQ <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#how-it-works" className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition text-lg">
            See How It Works
          </a>
        </div>
      </section>

      {/* SECTION 2 - PROBLEM */}
      <section className="py-20 bg-[#111111] border-y border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The Industrial Catalogue Problem</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Industrial companies receive incomplete, dirty data. Enriching it manually is slow and error-prone.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-neutral-500 font-medium">
            <div className="px-6 py-4 bg-neutral-900 rounded-lg border border-neutral-800 text-center w-full md:w-auto">Incomplete Data</div>
            <ArrowRight className="hidden md:block w-6 h-6 text-neutral-700" />
            <div className="px-6 py-4 bg-neutral-900 rounded-lg border border-neutral-800 text-center w-full md:w-auto">Scattered Sources</div>
            <ArrowRight className="hidden md:block w-6 h-6 text-neutral-700" />
            <div className="px-6 py-4 bg-neutral-900 rounded-lg border border-neutral-800 text-center w-full md:w-auto">Inconsistent Attributes</div>
            <ArrowRight className="hidden md:block w-6 h-6 text-neutral-700" />
            <div className="px-6 py-4 bg-neutral-900 rounded-lg border border-neutral-800 text-center w-full md:w-auto">Validation Problems</div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-xl font-medium text-blue-400">ForgeIQ automates the pipeline.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW FORGEIQ WORKS */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Enrichment Pipeline</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Upload', desc: 'Ingest raw CSV/XLSX catalogues with minimal data.' },
            { step: '02', title: 'Identify', desc: 'Resolve canonical manufacturer and part numbers.' },
            { step: '03', title: 'Discover Sources', desc: 'Scrape manufacturer technical PDFs and websites.' },
            { step: '04', title: 'Classify', desc: 'Map to a deep 14,000-category industrial taxonomy.' },
            { step: '05', title: 'Enrich', desc: 'Extract category-specific attributes via AI.' },
            { step: '06', title: 'Validate', desc: 'Apply UOM normalizations and LOV constraints.' },
            { step: '07', title: 'Review', desc: 'Human-in-the-loop queue for low-confidence outputs.' },
            { step: '08', title: 'Export', desc: 'Generate the final 252-column commerce contract.' },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition">
              <span className="text-sm font-bold text-blue-500 mb-2 block">{item.step}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 - CORE CAPABILITIES */}
      <section className="py-24 bg-[#111111] border-y border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Core Capabilities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <Layers className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Dynamic Taxonomy</h3>
                <p className="text-sm text-neutral-400">Classifies products to a leaf-level category, pulling down category-specific attribute schemas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Manufacturer-First Sources</h3>
                <p className="text-sm text-neutral-400">Prioritizes official manufacturer documentation and captures the source URL as evidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <CheckSquare className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">LOV Validation</h3>
                <p className="text-sm text-neutral-400">Validates extracted attributes against a strict List of Values and UOM normalization constraints.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <Database className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Evidence Per Attribute</h3>
                <p className="text-sm text-neutral-400">Maintains an Evidence Registry linking every enriched value back to the raw source text.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <CheckCircle2 className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">Human Review</h3>
                <p className="text-sm text-neutral-400">A dedicated queue for resolving validation errors and reviewing low-confidence AI inferences.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <FileText className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-1">252-Column Export</h3>
                <p className="text-sm text-neutral-400">Outputs the exact 252-column delivery contract expected by industrial commerce evaluators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - EVIDENCE-FIRST DIFFERENTIATOR */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6">ForgeIQ does not simply generate a value. It records why the value was selected.</h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              Black-box AI is not acceptable for enterprise product data. Every attribute generated by ForgeIQ is backed by a traceable piece of evidence, stored securely in the Evidence Registry.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Source URL captured</li>
              <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Raw evidence snippet recorded</li>
              <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Deterministic validation score</li>
            </ul>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Attribute: Voltage</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">98% CONFIDENCE</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-neutral-500 uppercase">Value</label>
                  <p className="text-lg text-white font-medium">120</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase">UOM</label>
                  <p className="text-lg text-white font-medium">V</p>
                </div>
              </div>
              
              <div className="space-y-4 bg-black/50 p-4 rounded-lg">
                <div>
                  <label className="text-xs text-neutral-500 uppercase">Source</label>
                  <p className="text-sm text-blue-400">Manufacturer Technical PDF</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase">Evidence Snippet</label>
                  <p className="text-sm text-neutral-300 italic">"...rated voltage: 120 V at 60Hz..."</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase">Validation</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-emerald-400 font-medium">PASS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - FINAL CTA */}
      <section className="py-32 bg-blue-600 border-t border-blue-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Build a catalogue you can trust.</h2>
          <p className="text-blue-100 text-lg mb-10">Start enriching your data with the ForgeIQ pipeline.</p>
          <div className="flex justify-center gap-4">
            <Link to="/demo" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-neutral-100 transition shadow-lg">
              Launch ForgeIQ
            </Link>
            <a href="#how-it-works" className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition">
              Explore the workflow
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Polyfill for FileText in lucide-react if not already defined above
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
