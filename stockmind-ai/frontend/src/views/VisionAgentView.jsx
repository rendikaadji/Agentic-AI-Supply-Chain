import React from 'react';
import KpiCards from '../components/KpiCards';
import WarehouseCameraFeed from '../components/WarehouseCameraFeed';
import ExecutionConsole from '../components/ExecutionConsole';
import { CheckCircle2, Cpu, Database, Server } from 'lucide-react';

export default function VisionAgentView() {
  return (
    <div className="space-y-6">
      {/* Subsystem Banner Notice */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Active Subsystem: Pillar 2 (Vision Inventory Agent)</span>
            <span className="text-slate-400 ml-2 font-mono">
              Target: YOLOv8n Cardboard Box Detection &amp; Physical Stock Auto-Reconciliation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" /> Edge CV Worker #01
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Database className="w-3.5 h-3.5" /> DynamoDB Sync: 0ms lag
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <Server className="w-3.5 h-3.5" /> SAP S/4HANA MM Ready
          </span>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <KpiCards />

      {/* Row 2: Vision Feed + Execution Console */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7">
          <WarehouseCameraFeed />
        </div>
        <div className="xl:col-span-5">
          <ExecutionConsole />
        </div>
      </div>
    </div>
  );
}
