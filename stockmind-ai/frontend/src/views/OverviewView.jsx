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
  Clock, 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  Database, 
  Server, 
  Zap,
  Radio,
  Sparkles
} from 'lucide-react';

export default function OverviewView({ onNavigateToVision, onTriggerCycle }) {
  const globalStats = [
    { title: 'Total SKU Dipantau', value: '1.420', sub: 'Unit inventaris aktif', change: '+12 baru', icon: Layers, accentColor: '#00F0FF' },
    { title: 'Stok Semu Terselesaikan', value: '14 Unit', sub: 'Terekonsiliasi di SAP MM', change: '100% tuntas', icon: CheckCircle2, accentColor: '#CCFF00' },
    { title: 'Kecepatan P2P Otonom', value: '2.4 Jam', sub: 'Target < 3 Jam (Awal: 5 hari)', change: '97.2% lebih cepat', icon: Zap, accentColor: '#8A2BE2' },
    { title: 'Efisiensi Biaya Logistik', value: 'Rp 142.8M', sub: 'Hemat 24.1% demurrage', change: '+24.1% hemat', icon: TrendingUp, accentColor: '#FFD600' },
  ];

  const agentPillars = [
    { id: 1, name: 'Deteksi Permintaan', role: 'Prediksi Time-Series & Sinyal Pasar', tech: 'Amazon Bedrock + SageMaker', status: 'Aktif', latency: '42ms', uptime: '99.98%', icon: TrendingUp, color: '#FFD600' },
    { id: 2, name: 'Visi Inventaris', role: 'Verifikasi Stok Fisik Real-Time', tech: 'YOLOv8 + Rekognition', status: 'Aktif (Fase 1)', latency: '34ms', uptime: '100%', icon: Eye, color: '#00F0FF' },
    { id: 3, name: 'Rekonsiliasi Stok', role: 'Kalkulasi Dinamis SS & Titik ROP', tech: 'Bedrock Agents + SAP MM', status: 'Tersinkron', latency: '28ms', uptime: '99.95%', icon: RefreshCcw, color: '#8A2BE2' },
    { id: 4, name: 'Disrupsi & Negosiasi', role: 'Otomatisasi RFQ & SLA Rekanan', tech: 'Bedrock KB RAG + SAP Ariba', status: 'Siap', latency: '85ms', uptime: '99.90%', icon: ShoppingCart, color: '#FF3366' },
    { id: 5, name: 'Rute Logistik', role: 'Optimasi Rute & Mitigasi Kemacetan', tech: 'Amazon Location Service', status: 'Memantau', latency: '52ms', uptime: '99.92%', icon: Truck, color: '#CCFF00' },
    { id: 6, name: 'Eksekusi Penerimaan', role: 'e-PoD & Goods Receipt (GR) SAP', tech: 'AWS IoT Core + SAP S/4HANA', status: 'Terhubung', latency: '19ms', uptime: '99.99%', icon: PackageCheck, color: '#00F0FF' },
  ];

  const recentActions = [
    { time: '14:33:10 WIB', agent: 'Visi Inventaris', event: 'Pemindaian CAM-01: 46 kotak terdeteksi di Lorong A. Data tersinkron ke DynamoDB.', status: 'SUKSES', color: '#CCFF00' },
    { time: '14:28:45 WIB', agent: 'Rekonsiliasi Stok', event: 'Selisih stok semu terdeteksi: Fisik 46 vs SAP 60. Titik pesan ulang (ROP) otomatis terpicu.', status: 'PERINGATAN', color: '#FF3366' },
    { time: '14:20:12 WIB', agent: 'Disrupsi & Negosiasi', event: 'RFQ PO #45009821 disetujui bersama PT Mitra Kemasan Prima (50 unit @ Rp 18.500.000).', status: 'SUKSES', color: '#CCFF00' },
    { time: '13:58:30 WIB', agent: 'Rute Logistik', event: 'Truk B-9122-TX dialihkan ke Jalur Lingkar Luar guna menghindari kemacetan 45 menit di Cikunir.', status: 'TEROPTIMASI', color: '#FFD600' },
    { time: '13:15:04 WIB', agent: 'Eksekusi Penerimaan', event: 'Dokumen SAP GR #50012498 berhasil diterbitkan secara instan setelah pencocokan barcode e-PoD.', status: 'SUKSES', color: '#CCFF00' },
    { time: '12:45:00 WIB', agent: 'Deteksi Permintaan', event: 'Menganalisis tren penjualan mingguan: Proyeksi peningkatan permintaan kardus +24%.', status: 'INFORMASI', color: '#00F0FF' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome Hero Banner (Gaya Hero Portofolio Dikshant) */}
      <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8A2BE2]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="text-[#FFD600] font-black text-sm select-none">👑</span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#181826] text-[#CCFF00] border border-[#2D2D42] font-mono">
                ORKESTRASI MULTI-AGEN OTONOM
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-medium">Sokrates × AWS × SAP Hackathon 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-display uppercase leading-tight">
              HALO, KAMI <span className="text-[#CCFF00]">STOCKMIND AI</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-2 leading-relaxed">
              Platform otonom 6 pilar rantai pasok cerdas yang menghubungkan kondisi fisik gudang secara real-time dengan SAP S/4HANA ERP melalui fondasi Amazon Bedrock dan Rekognition.
            </p>

            {/* Floating Speech-Bubble / Sticker Motif dari Referensi */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIKLUS TERTUTUP: GUDANG FISIK ➔ ERP REKONSILIASI OTOMATIS!</span>
            </div>
          </div>

          {/* Action Button Pills */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onTriggerCycle}
              className="px-6 py-3 rounded-full bg-[#CCFF00] hover:bg-[#D9FF33] text-black font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:scale-102 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Jalankan Siklus Agen</span>
            </button>

            <button
              onClick={onNavigateToVision}
              className="px-5 py-3 rounded-full bg-[#181826] hover:bg-[#222233] text-white hover:text-[#CCFF00] border border-[#2D2D42] hover:border-[#CCFF00] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Eye className="w-4 h-4" />
              <span>Agen Visi Komputer ↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {globalStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#14141E] border border-[#242436] hover:border-zinc-500 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">{stat.title}</span>
                  <div className="text-3xl font-black font-mono text-white mt-1 tracking-tight font-display">
                    {stat.value}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium block mt-1">{stat.sub}</span>
                </div>
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${stat.accentColor}18`, border: `1px solid ${stat.accentColor}40`, color: stat.accentColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F1F2E] flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium text-[11px]">Kinerja</span>
                <span 
                  className="font-mono font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1"
                  style={{ backgroundColor: `${stat.accentColor}20`, color: stat.accentColor, border: `1px solid ${stat.accentColor}40` }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6 Multi-Agent Status Board (Gaya Grid Card di referensi) */}
      <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#20202F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase font-display">
                STATUS SISTEM MULTI-AGEN OTONOM (MAS)
              </h3>
              <p className="text-xs text-zinc-400 font-mono">6 Pilar Ketahanan Rantai Pasok Tertutup</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
            SEMUA AGEN TERSINKRONISASI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentPillars.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-[#101018] border border-[#222232] hover:border-zinc-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `${agent.color}18`, border: `1px solid ${agent.color}40`, color: agent.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-zinc-400">Pilar {agent.id}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                          {agent.name}
                        </h4>
                      </div>
                    </div>

                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${agent.color}20`, color: agent.color, border: `1px solid ${agent.color}40` }}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium mb-3 min-h-[32px] leading-relaxed">
                    {agent.role}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#1C1C2A] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Latensi: <strong className="text-white font-bold">{agent.latency}</strong></span>
                  <span>Ketersediaan: <strong className="text-white font-bold">{agent.uptime}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closed-Loop Workflow Flowchart & Live Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Closed Loop Visual */}
        <div className="lg:col-span-6 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#20202F]">
              <div className="w-9 h-9 rounded-2xl bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 text-[#A855F7] flex items-center justify-center">
                <RefreshCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase font-display">Arsitektur Siklus Tertutup</h3>
                <p className="text-[11px] text-zinc-400 font-mono">Alur Umpan Balik Berkelanjutan</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-medium leading-relaxed mb-4">
              StockMind AI menghubungkan data persepsi visual dari rak fisik gudang langsung dengan modul <strong>SAP S/4HANA Materials Management (MM)</strong> dan <strong>SAP Ariba</strong>.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-[#101018] border border-[#222232] flex items-center justify-between">
                <span className="text-white font-bold">1. Deteksi Permintaan</span>
                <span className="text-zinc-400 text-[11px]">Historis SAP + Bedrock</span>
              </div>
              <div className="flex justify-center text-[#CCFF00] font-black text-xs">↓</div>
              <div className="p-3 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-between">
                <span className="text-[#CCFF00] font-bold">2. Visi Inventaris (Fase 1)</span>
                <span className="text-black font-black text-[10px] bg-[#CCFF00] px-2 py-0.5 rounded-full">YOLOv8 Edge (46 Kotak)</span>
              </div>
              <div className="flex justify-center text-[#CCFF00] font-black text-xs">↓</div>
              <div className="p-3 rounded-2xl bg-[#101018] border border-[#222232] flex items-center justify-between">
                <span className="text-white font-bold">3. Rekonsiliasi Stok</span>
                <span className="text-zinc-400 text-[11px]">Kalkulasi Dinamis SS &amp; ROP</span>
              </div>
              <div className="flex justify-center text-[#CCFF00] font-black text-xs">↓</div>
              <div className="p-3 rounded-2xl bg-[#101018] border border-[#222232] flex items-center justify-between">
                <span className="text-white font-bold">4. Disrupsi &amp; Negosiasi</span>
                <span className="text-zinc-400 text-[11px]">RFQ Otomatis SAP Ariba</span>
              </div>
              <div className="flex justify-center text-[#CCFF00] font-black text-xs">↓</div>
              <div className="p-3 rounded-2xl bg-[#101018] border border-[#222232] flex items-center justify-between">
                <span className="text-white font-bold">5 &amp; 6. Logistik &amp; Penerimaan Inbound</span>
                <span className="text-zinc-400 text-[11px]">e-PoD &amp; Goods Receipt Instan (GR)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#20202F] text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Siklus menutup otomatis: GR memperbarui saldo SAP</span>
            <span className="bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/40 px-2.5 py-0.5 rounded-full font-bold font-mono">
              AKTIF
            </span>
          </div>
        </div>

        {/* Live Autonomous Event Stream */}
        <div className="lg:col-span-6 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#20202F]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] flex items-center justify-center">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase font-display">Aliran Peristiwa Otonom</h3>
                <p className="text-[11px] text-zinc-400 font-mono">Audit Log Multi-Agen Real-Time</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-[#181826] border border-[#2D2D42] text-zinc-300 px-3 py-0.5 rounded-full">
              6 PERISTIWA
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1">
            {recentActions.map((act, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl bg-[#101018] border border-[#222232] hover:border-zinc-500 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-zinc-500 font-bold">{act.time}</span>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                    style={{ backgroundColor: `${act.color}20`, color: act.color, border: `1px solid ${act.color}40` }}
                  >
                    {act.status}
                  </span>
                </div>
                <div className="font-bold text-white uppercase tracking-wide">{act.agent}</div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed">{act.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
