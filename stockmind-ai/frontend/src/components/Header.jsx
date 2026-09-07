import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Activity,
  Menu,
  Sparkles
} from 'lucide-react';

export default function Header({ onTriggerCycle, isCycleRunning, onOpenMobileMenu }) {
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
    <header className="bg-[#0E0E16]/95 backdrop-blur-md border-b border-[#242436] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Judul & Status Sistem */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden w-10 h-10 rounded-full bg-[#181824] hover:bg-[#222233] border border-[#2D2D42] hover:border-[#CCFF00] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-display uppercase truncate">
              <span>PANEL KONTROL STOCKMIND</span>
              <span className="text-[#CCFF00]">AI</span>
              <span className="text-[#FFD600] text-sm sm:text-base select-none">✦</span>
            </h2>

            {/* Lencana Status: Fase 1 Visi Komputer */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181824] border border-[#2D2D42] text-[#CCFF00] text-[11px] font-mono font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
              </span>
              <span>FASE 1: AGEN VISI AKTIF</span>
            </div>
          </div>
          <p className="hidden md:flex text-xs text-zinc-400 font-medium mt-0.5 items-center gap-2">
            <span>Sistem Orkestrasi Rantai Pasok Otonom 6 Pilar</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-mono text-[11px] bg-[#14141E] px-2 py-0.5 rounded-full border border-[#242436]">
              Amazon Bedrock × Rekognition × SAP S/4HANA
            </span>
          </p>
        </div>
      </div>

      {/* Area Tombol Aksi */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Jam & Status Kesiapan Agen (Hidden on small screens) */}
        <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#14141E] border border-[#242436] text-xs font-mono font-medium text-zinc-300">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeStr || '14:30:00 WIB'}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span className="text-[#CCFF00] font-bold text-[11px]">
              6/6 AGEN SIAP
            </span>
          </div>
        </div>

        {/* Tombol Pemicu Siklus Lengkap 6 Pilar (Gaya Pill Hijau Lime seperti 'Watch Showreel' di referensi) */}
        <button
          id="btn-trigger-cycle"
          onClick={onTriggerCycle}
          disabled={isCycleRunning}
          className={`relative px-4 sm:px-6 py-2.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 sm:gap-2.5 transition-all duration-200 cursor-pointer ${
            isCycleRunning
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
              : 'bg-[#CCFF00] hover:bg-[#D9FF33] text-black shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-black text-[#CCFF00] flex items-center justify-center shrink-0">
            <Play className={`w-3 h-3 fill-[#CCFF00] ml-0.5 ${isCycleRunning ? 'animate-spin' : ''}`} />
          </div>
          <span className="tracking-wide">
            {isCycleRunning ? 'Mengorkestrasi...' : 'Jalankan Siklus'}
            <span className="hidden sm:inline"> Agen</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-black/15 text-black rounded-full font-mono font-black">
            6 PILAR
          </span>
        </button>
      </div>
    </header>
  );
}
