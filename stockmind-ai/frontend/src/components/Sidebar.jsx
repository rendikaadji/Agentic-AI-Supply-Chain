import React from 'react';
import { 
  LayoutDashboard, 
  Eye, 
  TrendingUp, 
  RefreshCcw, 
  ShoppingCart, 
  Truck, 
  Settings, 
  Cpu, 
  Database, 
  Server, 
  CheckCircle2,
  Layers,
  Radio
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vision', label: 'Vision Agent', icon: Eye, active: true, tag: 'Phase 1' },
    { id: 'demand', label: 'Demand Sensing', icon: TrendingUp },
    { id: 'reconciliation', label: 'Stock Reconciliation', icon: RefreshCcw },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const systemStatuses = [
    { name: 'SAP S/4HANA', status: 'Connected', ping: '24ms', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'AWS Lambda', status: 'Online', ping: 'us-east-1', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'DynamoDB', status: 'Active', ping: 'Ready', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19]/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0B0F19] rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-white">StockMind<span className="text-cyan-400">.AI</span></h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">Autonomous Supply Chain</p>
          </div>
        </div>

        {/* Hackathon Badge */}
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            Sokrates × AWS × SAP
          </span>
          <span className="text-[10px] font-semibold text-emerald-400">Agentic</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Multi-Agent Pillars
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
              
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>

              {item.tag && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isSelected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Integration Connections Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
          <span>Enterprise Links</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ALL LIVE
          </span>
        </div>

        <div className="space-y-1.5">
          {systemStatuses.map((sys, idx) => {
            const SysIcon = sys.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SysIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300 font-medium text-[11px]">{sys.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">{sys.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
