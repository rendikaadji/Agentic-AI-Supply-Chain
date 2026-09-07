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
  Layers,
  Radio,
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const menuItems = [
    { id: 'overview', label: 'Ringkasan Eksekutif', icon: LayoutDashboard, color: '#CCFF00' },
    { id: 'vision', label: 'Agen Visi Komputer', icon: Eye, active: true, tag: 'Fase 1', color: '#00F0FF' },
    { id: 'demand', label: 'Deteksi Permintaan', icon: TrendingUp, color: '#FFD600' },
    { id: 'reconciliation', label: 'Rekonsiliasi Stok', icon: RefreshCcw, color: '#8A2BE2' },
    { id: 'procurement', label: 'Pengadaan Otonom', icon: ShoppingCart, color: '#FF3366' },
    { id: 'logistics', label: 'Logistik & Armada', icon: Truck, color: '#CCFF00' },
    { id: 'settings', label: 'Pengaturan Sistem', icon: Settings, color: '#A855F7' },
  ];

  const systemSkills = [
    { name: 'SAP S/4HANA', short: 'SAP', status: 'Terhubung', color: '#00F0FF', ping: '24ms' },
    { name: 'AWS Bedrock', short: 'AI', status: 'Aktif', color: '#A855F7', ping: 'Sonnet' },
    { name: 'DynamoDB', short: 'DB', status: 'Siap', color: '#CCFF00', ping: '0ms' },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#101018]">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#20202F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#8A2BE2] via-[#5B21B6] to-[#CCFF00] p-0.5 shadow-[0_0_20px_rgba(138,43,226,0.35)]">
                <div className="w-full h-full bg-[#101018] rounded-[14px] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#CCFF00]" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#CCFF00] border-2 border-[#101018] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white font-display">
                  StockMind<span className="text-[#CCFF00]">.AI</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 rounded-full">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                Rantai Pasok Otonom
              </p>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-full bg-[#181826] hover:bg-[#222233] border border-[#2D2D42] text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hackathon Badge */}
        <div className="mt-3.5 px-3 py-1.5 rounded-full bg-[#181826] border border-[#242436] text-[11px] flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1.5 font-medium text-[11px]">
            <Radio className="w-3 h-3 text-[#CCFF00] animate-pulse" />
            Sokrates × AWS × SAP
          </span>
          <span className="text-[9px] font-black bg-[#CCFF00] text-black px-2 py-0.5 rounded-full uppercase">
            OTONOM
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
          Pilar Multi-Agen
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? 'bg-[#181826] text-white font-black border border-[#CCFF00]/40 shadow-[0_0_20px_rgba(204,255,0,0.15)] translate-x-1'
                  : 'text-zinc-400 hover:text-white hover:bg-[#151522] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: isSelected ? `${item.color}25` : '#181824',
                    color: item.color,
                    border: `1px solid ${isSelected ? item.color : '#242436'}`
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.tag && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isSelected 
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00]' 
                    : 'bg-[#181824] text-zinc-300 border-[#2D2D42]'
                }`}>
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Integration Connections Footer (Gaya Software Skills di referensi) */}
      <div className="p-4 border-t border-[#20202F] bg-[#0E0E14] space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase font-mono px-1">
          <span>Koneksi Enterprise</span>
          <span className="flex items-center gap-1 text-[10px] text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded-full border border-[#CCFF00]/30 font-bold">
            AKTIF
          </span>
        </div>

        {/* 3 Skill-like Icons */}
        <div className="grid grid-cols-3 gap-2">
          {systemSkills.map((sys, idx) => (
            <div 
              key={idx}
              className="p-2 rounded-2xl bg-[#14141E] border border-[#242436] hover:border-zinc-500 transition-all flex flex-col items-center justify-center text-center group"
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs mb-1 font-mono transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${sys.color}20`, color: sys.color, border: `1px solid ${sys.color}50` }}
              >
                {sys.short}
              </div>
              <span className="text-[10px] font-bold text-white truncate max-w-full">
                {sys.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                {sys.ping}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[#20202F] flex-col shrink-0 z-10 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200 border-r border-[#20202F]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
