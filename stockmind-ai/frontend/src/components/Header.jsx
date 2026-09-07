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
    <header className="h-20 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & System Status */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg lg:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              StockMind AI Control Panel
            </h2>

            {/* Clean Status Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Closed Loop (6/6 Agents Ready)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>Autonomous Supply Chain Orchestration System</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/90 font-mono">YOLOv8 + Qwen 2.5 + SAP S/4HANA</span>
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Active Local AI Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="text-slate-400">Engine:</span>
          <span className="text-cyan-300 font-semibold">Ollama (qwen2.5:7b)</span>
        </div>

        {/* Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeStr || '12:00:00 WIB'}</span>
        </div>

        {/* Single Primary Action Button */}
        <button
          id="btn-trigger-cycle"
          onClick={onTriggerCycle}
          disabled={isCycleRunning}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs lg:text-sm flex items-center gap-2 transition-all duration-200 ${
            isCycleRunning
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 active:scale-[0.98]'
          }`}
        >
          <Zap className={`w-4 h-4 fill-slate-950 ${isCycleRunning ? 'animate-spin' : ''}`} />
          <span>{isCycleRunning ? 'Executing Cycle...' : 'Run Autonomous Cycle'}</span>
        </button>
      </div>
    </header>
  );
}
