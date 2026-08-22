import type { FC, ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  BarChart, 
  Database, 
  FileText, 
  Box, 
  CheckSquare, 
  ShieldCheck, 
  Activity,
  Layers,
  Settings,
  Hexagon
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/app', label: 'Overview', icon: BarChart },
  { path: '/app/datasets', label: 'Datasets', icon: Database },
  { path: '/app/jobs', label: 'Enrichment Jobs', icon: Activity },
  { path: '/app/products', label: 'Products', icon: Box },
  { path: '/app/review', label: 'Review Queue', icon: CheckSquare },
  { path: '/app/evidence', label: 'Evidence', icon: ShieldCheck },
  { path: '/app/analytics', label: 'Analytics', icon: FileText },
  { path: '/app/schemas', label: 'Schemas', icon: Layers },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 flex font-sans selection:bg-blue-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111111] border-r border-neutral-800/50 flex flex-col fixed inset-y-0 z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold tracking-widest text-white">FORGE<span className="text-blue-500 font-light">IQ</span></h1>
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-4 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'}`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User / Org footer context */}
        <div className="p-4 border-t border-neutral-800/50">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer transition">
            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center font-medium text-neutral-300">
              U
            </div>
            <div>
              <p className="font-medium text-neutral-200 leading-none">Admin</p>
              <p className="text-xs mt-1">Enterprise Org</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Optional Top Header could go here */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
