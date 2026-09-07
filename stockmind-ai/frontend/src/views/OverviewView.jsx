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
  Radio
} from 'lucide-react';
import WarehouseCameraFeed from '../components/WarehouseCameraFeed';

export default function OverviewView({ onNavigateToVision, onTriggerCycle }) {
  const [activeStage, setActiveStage] = useState(null);

  const kpis = [
    { 
      title: 'Physical Stock (Camera)', 
      value: '46 Boxes', 
      sub: 'YOLOv8 Edge Inference (CAM-01)', 
      tag: '100% Accuracy', 
      icon: Eye, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/20' 
    },
    { 
      title: 'SAP Stock Discrepancy', 
      value: '-14 Boxes', 
      sub: 'SAP Saldo: 60 | Defisit Fisik', 
      tag: 'Phantom Stock Resolved', 
      icon: AlertTriangle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20' 
    },
    { 
      title: 'Adaptive ROP Threshold', 
      value: '52 Units', 
      sub: 'Safety Stock Dinamis: 18 Units', 
      tag: 'Auto-Procure Triggered', 
      icon: RefreshCcw, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20' 
    },
    { 
      title: 'Closed-Loop P2P Cycle', 
      value: '9.5 Detik', 
      sub: 'PO #45009821 ➔ GR 101 Posted', 
      tag: 'Restored to 96 Units', 
      icon: Zap, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20' 
    },
  ];

  const pipelineStages = [
    { id: 1, name: 'Demand Sensing', tech: 'Bedrock + SageMaker', status: 'COMPLETED', metric: '+24% Spike', icon: TrendingUp },
    { id: 2, name: 'Vision Inventory', tech: 'YOLOv8 Edge', status: 'COMPLETED', metric: '46 Boxes', icon: Eye },
    { id: 3, name: 'Reconciliation', tech: 'SAP MM BAPI', status: 'COMPLETED', metric: '-14 Gap', icon: RefreshCcw },
    { id: 4, name: 'AI Negotiation', tech: 'Ollama Qwen 2.5', status: 'COMPLETED', metric: 'Disc 8.0%', icon: ShoppingCart },
    { id: 5, name: 'Logistics Route', tech: 'Location Svc', status: 'COMPLETED', metric: '38.4 km', icon: Truck },
    { id: 6, name: 'Inbound GR 101', tech: 'SAP S/4HANA', status: 'COMPLETED', metric: '96 Stored', icon: PackageCheck },
  ];

  const recentLogs = [
    { 
      time: '14:33:10', 
      pillar: 'Pillar 06: Inbound Execution', 
      action: 'SAP BAPI_GOODSMVT_CREATE posted GR #50012498. Saldo stok dipulihkan ke 96 unit.', 
      status: 'VERIFIED', 
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
    },
    { 
      time: '14:33:08', 
      pillar: 'Pillar 05: Logistics Route Agent', 
      action: 'Rute Cikarang ➔ Marunda dioptimalkan (38.4 km, ETA 2 jam 15 m). Demurrage termitigasi.', 
      status: 'OPTIMAL', 
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
    },
    { 
      time: '14:33:04', 
      pillar: 'Pillar 04: Disruption & Negotiation (Qwen 2.5)', 
      action: 'Kesepakatan diskon 8.0% tercapai dengan PT Mitra Logistik Prima (Rp 13.064/unit). PO #45009821 diterbitkan.', 
      status: 'APPROVED', 
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30' 
    },
    { 
      time: '14:32:59', 
      pillar: 'Pillar 03: Stock Reconciliation', 
      action: 'Phantom inventory terdeteksi (-14 box). Stok fisik (46) < ROP (52). Memicu procurement otonom.', 
      status: 'TRIGGERED', 
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
    },
    { 
      time: '14:32:58', 
      pillar: 'Pillar 02: Vision Inventory (YOLOv8)', 
      action: 'CAM-01 mendeteksi 46 kardus fisik (confidence 0.925, latency 34.8ms). Data tersinkronisasi ke DynamoDB.', 
      status: 'DETECTED', 
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' 
    },
    { 
      time: '14:32:55', 
      pillar: 'Pillar 01: Demand Sensing', 
      action: 'Analisis time-series mendeteksi proyeksi kenaikan permintaan kardus box sebesar +24% minggu depan.', 
      status: 'SENSING', 
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Bersih & Ringkas (Tanpa Tombol Duplikat) */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 p-5 lg:p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                AUTONOMOUS CLOSED LOOP
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Sokrates × AWS × SAP Partner</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
              StockMind AI Enterprise Control Tower
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Sinkronisasi real-time antara persepsi fisik gudang (Edge YOLOv8) dan SAP S/4HANA ERP melalui orkestrasi model AI lokal (Qwen 2.5).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SAP ERP: Connected</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Feeds: 3 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Empat Kartu KPI Utama (Clean & Non-distracting) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 lg:p-5 rounded-2xl bg-slate-900/60 border ${kpi.border} backdrop-blur-md transition-all hover:border-slate-700`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">{kpi.title}</span>
                  <div className="text-2xl font-black font-mono text-white mt-1 tracking-tight">
                    {kpi.value}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">{kpi.sub}</span>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} border border-white/5`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Audit Status</span>
                <span className="font-mono text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {kpi.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Linear 6-Pillar Closed-Loop Pipeline (Horizontal Stepper yang Rapi) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">6-Pillar Closed-Loop Autonomous Pipeline</h3>
              <p className="text-[10px] text-slate-400 font-mono">Alur Otomasi Terintegrasi: Persepsi Fisik ➔ Rekonsiliasi ➔ Procurement ➔ Goods Receipt</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-semibold">
            All 6 Stages Verified
          </span>
        </div>

        {/* Horizontal Pipeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div 
                key={stage.id} 
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">#{stage.id}</span>
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 leading-tight">{stage.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{stage.tech}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{stage.metric}</span>
                  <span className="text-slate-400 font-semibold">{stage.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Side-by-Side Dual Operational Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Panel Kiri: Live Camera Feed (YOLOv8 Edge Verification) */}
        <div className="xl:col-span-7">
          <WarehouseCameraFeed />
        </div>

        {/* Panel Kanan: Real-Time Multi-Agent Audit Log */}
        <div className="xl:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Autonomous Agent Audit Stream</h3>
                <p className="text-[10px] text-slate-400 font-mono">Real-time Multi-Agent Decision Ledger</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              6 Events Logged
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {recentLogs.map((log, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {log.time} WIB
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${log.badge}`}>
                    {log.status}
                  </span>
                </div>
                <div className="font-bold text-slate-200 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {log.pillar}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {log.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
