import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Activity,
  Bell
} from 'lucide-react';

export default function Header({ onTriggerCycle, isCycleRunning }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Status */}
      <div className="flex items-center gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              StockMind AI Control Panel
            </h2>

            {/* Badge Status: Phase 1: Vision Agent Complete */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Phase 1: Vision Agent Complete</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>End-to-End Autonomous Supply Chain Orchestration System</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/80 font-mono">Bedrock + Rekognition + SAP S/4HANA</span>
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4">
        {/* Clock & System Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeStr || '14:30:00 WIB'}</span>
          <span className="w-1 h-3 bg-slate-700"></span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Activity className="w-3 h-3 animate-pulse" />
            6/6 Agents Ready
          </span>
        </div>

        {/* Tombol Trigger Multi-Agent Cycle */}
        <button
          id="btn-trigger-cycle"
          onClick={onTriggerCycle}
          disabled={isCycleRunning}
          className={`relative group overflow-hidden px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 ${
            isCycleRunning
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
          
          <Zap className={`w-4 h-4 text-slate-950 fill-slate-950 ${isCycleRunning ? 'animate-spin' : ''}`} />
          <span>{isCycleRunning ? 'Orchestrating Cycle...' : 'Trigger Multi-Agent Cycle'}</span>
          
          <span className="px-1.5 py-0.5 text-[10px] bg-slate-950/20 rounded font-mono font-bold">
            MAS
          </span>
        </button>
      </div>
    </header>
  );
}
