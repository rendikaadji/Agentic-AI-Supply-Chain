import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Eye, 
  RefreshCcw, 
  ShoppingCart, 
  Truck, 
  PackageCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Database, 
  Server, 
  Zap,
  ShieldCheck,
  Radio,
  Sparkles
} from 'lucide-react';

export default function OverviewView({ onNavigateToVision, onTriggerCycle }) {
  const [filter, setFilter] = useState('all');

  const globalStats = [
    { title: 'Total SKU Monitored', value: '1,420', sub: 'Active inventory units', change: '+12 new', icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { title: 'Phantom Stock Resolved', value: '14 Units', sub: 'Auto-reconciled in SAP MM', change: '100% fixed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Autonomous P2P Velocity', value: '2.4 Jam', sub: 'Target < 3 Jam (Baseline: 5 hari)', change: '97.2% faster', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { title: 'Cost Optimization (Inbound)', value: 'Rp 142.8M', sub: 'Hemat 24.1% demurrage', change: '+24.1% saved', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  const agentPillars = [
    { id: 1, name: 'Demand Sensing', role: 'Time-Series & Market Forecasting', tech: 'Amazon Bedrock + SageMaker', status: 'Online', latency: '42ms', uptime: '99.98%', icon: TrendingUp, color: 'text-cyan-400', badge: 'bg-cyan-500/15 border-cyan-500/30' },
    { id: 2, name: 'Vision Inventory', role: 'Real-Time Edge Stock Verification', tech: 'YOLOv8 + Rekognition', status: 'Active (Phase 1)', latency: '34ms', uptime: '100%', icon: Eye, color: 'text-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/30' },
    { id: 3, name: 'Stock Reconciliation', role: 'Adaptive Safety Stock & ROP Math', tech: 'Bedrock Agents + SAP MM', status: 'Synchronized', latency: '28ms', uptime: '99.95%', icon: RefreshCcw, color: 'text-blue-400', badge: 'bg-blue-500/15 border-blue-500/30' },
    { id: 4, name: 'Disruption & Negotiation', role: 'Autonomous RFQ & Vendor SLA', tech: 'Bedrock KB RAG + SAP Ariba', status: 'Ready', latency: '85ms', uptime: '99.90%', icon: ShoppingCart, color: 'text-purple-400', badge: 'bg-purple-500/15 border-purple-500/30' },
    { id: 5, name: 'Logistics Route', role: 'Dynamic Multimodal Route Mitigation', tech: 'Amazon Location Service', status: 'Monitoring', latency: '52ms', uptime: '99.92%', icon: Truck, color: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/30' },
    { id: 6, name: 'Inbound Execution', role: 'e-PoD & BAPI Goods Receipt (GR)', tech: 'AWS IoT Core + SAP S/4HANA', status: 'Connected', latency: '19ms', uptime: '99.99%', icon: PackageCheck, color: 'text-teal-400', badge: 'bg-teal-500/15 border-teal-500/30' },
  ];

  const recentActions = [
    { time: '14:33:10 WIB', agent: 'Vision Inventory', event: 'Scanned CAM-01: 46 Boxes detected on Aisle A. Synced to DynamoDB.', status: 'SUCCESS', type: 'vision' },
    { time: '14:28:45 WIB', agent: 'Stock Reconciliation', event: 'Phantom Discrepancy detected: Physical 46 vs SAP 60. Dynamic ROP triggered.', status: 'ALERT', type: 'recon' },
    { time: '14:20:12 WIB', agent: 'Disruption & Negotiation', event: 'Auto RFQ PO #45009821 approved with PT Mitra Kemasan Prima (50 units @ Rp 18.5M).', status: 'SUCCESS', type: 'procure' },
    { time: '13:58:30 WIB', agent: 'Logistics Route', event: 'Truck B-9122-TX rerouted to Lingkar Luar to bypass 45-min congestion at Cikunir.', status: 'OPTIMIZED', type: 'logistics' },
    { time: '13:15:04 WIB', agent: 'Inbound Execution', event: 'SAP BAPI_GOODSMVT_CREATE GR #50012498 posted instantly after e-PoD barcode match.', status: 'SUCCESS', type: 'inbound' },
    { time: '12:45:00 WIB', agent: 'Demand Sensing', event: 'Analyzed weekly sales series: Projected demand increase +24% for Cardboard Box.', status: 'INFO', type: 'demand' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                AUTONOMOUS MULTI-AGENT ORCHESTRATION
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Sokrates × AWS × SAP Partner</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              StockMind AI Enterprise Overview
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Platform otonom 6 pilar rantai pasok cerdas yang menghubungkan kondisi fisik gudang secara real-time dengan SAP S/4HANA ERP melalui fondasi Amazon Bedrock dan Rekognition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToVision}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              View Vision Agent Live
            </button>
            <button
              onClick={onTriggerCycle}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              Trigger Full Cycle
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {globalStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-slate-900/60 border ${stat.border} backdrop-blur-md relative overflow-hidden transition-all hover:-translate-y-1 group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">{stat.title}</span>
                  <div className="text-2xl font-black font-mono text-white mt-1 tracking-tight">
                    {stat.value}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">{stat.sub}</span>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border border-white/5`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Performance</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6 Multi-Agent Status Board */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Autonomous Multi-Agent System (MAS) Status
              </h3>
              <p className="text-xs text-slate-400 font-mono">6 Pillars of Closed-Loop Supply Chain Resilience</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ALL AGENTS SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentPillars.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${agent.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">Pillar {agent.id}</span>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {agent.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400/90 truncate block max-w-[150px]">
                        {agent.tech}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${agent.badge} ${agent.color}`}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                  {agent.role}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Latency: <strong className="text-slate-200">{agent.latency}</strong></span>
                  <span>Uptime: <strong className="text-emerald-400">{agent.uptime}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closed-Loop Workflow Flowchart & Live Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Closed Loop Visual */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <RefreshCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Closed-Loop Operational Architecture</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Continuous Feedback Cycle</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              StockMind AI menghubungkan data persepsi visual dari rak fisik gudang langsung dengan modul <strong>SAP S/4HANA Materials Management (MM)</strong> dan <strong>SAP Ariba</strong>.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-cyan-400 font-bold">1. Demand Sensing</span>
                <span className="text-slate-400 text-[11px]">SAP Historical + Bedrock</span>
              </div>
              <div className="flex justify-center text-slate-600">↓</div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between bg-emerald-500/5">
                <span className="text-emerald-400 font-bold">2. Vision Inventory (Phase 1)</span>
                <span className="text-emerald-300 text-[11px]">YOLOv8 Edge Realtime (46 Boxes)</span>
              </div>
              <div className="flex justify-center text-slate-600">↓</div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-blue-400 font-bold">3. Stock Reconciliation</span>
                <span className="text-slate-400 text-[11px]">Dynamic SS &amp; ROP Formula</span>
              </div>
              <div className="flex justify-center text-slate-600">↓</div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-purple-400 font-bold">4. Disruption &amp; Negotiation</span>
                <span className="text-slate-400 text-[11px]">SAP Ariba Autonomous RFQ</span>
              </div>
              <div className="flex justify-center text-slate-600">↓</div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-teal-400 font-bold">5 &amp; 6. Logistics &amp; Inbound GR</span>
                <span className="text-slate-400 text-[11px]">e-PoD &amp; Instant Goods Receipt</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Siklus menutup otomatis: GR memperbarui saldo SAP</span>
            <span className="text-emerald-400 font-semibold font-mono">Loop: Active</span>
          </div>
        </div>

        {/* Live Autonomous Event Stream */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live Autonomous Event Stream</h3>
                <p className="text-[11px] text-slate-400 font-mono">Real-time Multi-Agent Audit Log</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Streaming: 6 Events</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {recentActions.map((act, i) => (
              <div 
                key={i} 
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    act.status === 'SUCCESS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    act.status === 'ALERT' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                    act.status === 'OPTIMIZED' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {act.status}
                  </span>
                </div>
                <div className="font-bold text-slate-200">{act.agent}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{act.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
