import React from 'react';
import KpiCards from '../components/KpiCards';
import WarehouseCameraFeed from '../components/WarehouseCameraFeed';
import ExecutionConsole from '../components/ExecutionConsole';
import { CheckCircle2, Cpu, Database, Server } from 'lucide-react';

export default function VisionAgentView() {
  return (
    <div className="space-y-6">
      {/* Subsystem Banner Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#CCFF00] text-black font-black flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.3)] shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white uppercase tracking-wider text-sm font-display">
                Subsistem Aktif: Pilar 2 (Agen Visi Inventaris)
              </span>
              <span className="text-xs text-[#CCFF00] hidden sm:inline">✦</span>
            </div>
            <span className="text-zinc-400 font-mono text-xs block sm:inline">
              Target: Deteksi Kotak Kardus YOLOv8n &amp; Auto-Rekonsiliasi Stok Fisik
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 bg-[#101018] text-[#00F0FF] border border-[#00F0FF]/30 px-3 py-1.5 rounded-full font-bold">
            <Cpu className="w-3.5 h-3.5 stroke-[2.5]" /> Pekerja CV Edge #01
          </span>
          <span className="flex items-center gap-1.5 bg-[#101018] text-[#CCFF00] border border-[#CCFF00]/30 px-3 py-1.5 rounded-full font-bold">
            <Database className="w-3.5 h-3.5 stroke-[2.5]" /> Sinkron DynamoDB: 0ms
          </span>
          <span className="flex items-center gap-1.5 bg-[#101018] text-[#FFD600] border border-[#FFD600]/30 px-3 py-1.5 rounded-full font-bold">
            <Server className="w-3.5 h-3.5 stroke-[2.5]" /> SAP S/4HANA MM
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

