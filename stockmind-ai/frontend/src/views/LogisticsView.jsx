import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  CheckCircle2, 
  PackageCheck, 
  QrCode, 
  Clock, 
  ArrowRight, 
  Radio, 
  Server, 
  FileCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function LogisticsView() {
  const [grPosted, setGrPosted] = useState(false);
  const [isPostingGr, setIsPostingGr] = useState(false);
  const [rerouted, setRerouted] = useState(true);

  const waypoints = [
    { step: '01', name: 'Pabrik Rekanan (Cikarang Barat)', time: '12:30 WIB', status: 'done', desc: 'Muatan 50 bundle kardus selesai dimuat ke armada box truk' },
    { step: '02', name: 'Simpang Susun Cikunir (Macet 45m)', time: '13:15 WIB', status: 'diverted', desc: 'Amazon Location mendeteksi delay parah; kalkulasi rute dinamis otomatis aktif' },
    { step: '03', name: 'Jalur Lingkar Luar Timur (KM 28)', time: '14:05 WIB', status: 'current', desc: 'Armada bergerak 54 km/jam menuju Gerbang Marunda DC Dock 02' },
    { step: '04', name: 'Marunda Central DC (Dock 02)', time: 'ETA 14:47 WIB', status: 'pending', desc: 'Tujuan akhir - Geofence kedatangan siap menyambut e-PoD barcode scan' },
  ];

  const handlePostGoodsReceipt = () => {
    setIsPostingGr(true);
    setTimeout(() => {
      setIsPostingGr(false);
      setGrPosted(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00F0FF] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0">
            <Truck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wide">
                Pilar 5 &amp; 6: Logistik &amp; Penerimaan Inbound
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-mono text-[10px] font-black uppercase">
                Amazon Location + IoT Core + SAP BAPI
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Optimasi rute multimoda mitigasi demurrage, verifikasi e-PoD barcode, dan pencatatan instan Goods Receipt (GR) di SAP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-full bg-[#101018] border border-[#CCFF00]/40 text-xs font-mono text-[#CCFF00] font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-ping"></span>
            GPS Armada: AKTIF (AWS IoT Core)
          </span>
        </div>
      </div>

      {/* Real-Time Fleet Waypoint & Congestion Mitigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Tracking Panel */}
        <div className="lg:col-span-7 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-[#242436]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black font-display text-white uppercase tracking-wide">
                    Pelacakan Rute Dinamis Armada Inbound
                  </h3>
                  <span className="text-[#00F0FF] text-xs">✦</span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Ekspedisi: PT Trans Karunia • Armada: B-9122-TX (Tronton Box)</p>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#FFD600] text-xs font-mono font-bold uppercase">
                Kecepatan: 54 km/jam
              </span>
            </div>

            {/* Congestion Mitigation Alert Badge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1F1A15] to-[#2B1F18] border border-[#FFD600]/40 text-xs mb-5 flex items-start gap-3.5 shadow-[0_0_20px_rgba(255,214,0,0.1)]">
              <div className="w-8 h-8 rounded-xl bg-[#FFD600] text-black flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,214,0,0.4)]">
                <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <strong className="text-white font-black font-display uppercase tracking-wide text-xs">
                  Mitigasi Kemacetan Otonom (Amazon Location Service)
                </strong>
                <p className="text-zinc-300 mt-1 leading-relaxed text-xs font-medium">
                  Terdeteksi kemacetan 45 menit di Ruas Tol Jakarta-Cikampek KM 14. Logistics Agent secara otomatis mengalihkan rute melalui <strong className="text-[#CCFF00]">Jalur Lingkar Luar Timur</strong>, menghemat 32 menit waktu tempuh dan mengeliminasi estimasi demurrage <strong className="text-[#00F0FF]">Rp 1.200.000</strong>.
                </p>
              </div>
            </div>

            {/* Step Waypoints (Numbered Steps pattern from reference) */}
            <div className="space-y-3 mb-4">
              {waypoints.map((wp, i) => {
                let badgeClass = 'bg-zinc-800 text-zinc-300';
                let cardClass = 'bg-[#101018] border-[#222232]';
                let highlightClass = 'text-zinc-200';

                if (wp.status === 'done') {
                  badgeClass = 'bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]';
                  cardClass = 'bg-[#101018] border-[#242436]';
                } else if (wp.status === 'diverted') {
                  badgeClass = 'bg-[#FFD600] text-black shadow-[0_0_10px_rgba(255,214,0,0.3)]';
                  cardClass = 'bg-[#181512] border-[#FFD600]/30';
                } else if (wp.status === 'current') {
                  badgeClass = 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]';
                  cardClass = 'bg-[#141C28] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.15)]';
                  highlightClass = 'text-[#00F0FF] font-black';
                }

                return (
                  <div 
                    key={i} 
                    className={`p-4 rounded-2xl border flex items-start gap-4 transition-all ${cardClass}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${badgeClass}`}>
                      {wp.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-black font-display text-xs uppercase tracking-tight truncate ${highlightClass}`}>
                          {wp.name}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded-full shrink-0">
                          {wp.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{wp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#242436] text-xs text-zinc-400 flex items-center justify-between font-mono font-bold">
            <span>Jarak Sisa: <strong className="text-[#FFD600] bg-[#FFD600]/15 px-2 py-0.5 rounded-full border border-[#FFD600]/30">14.2 km</strong></span>
            <span className="text-[#00F0FF] bg-[#00F0FF]/15 px-2.5 py-0.5 rounded-full border border-[#00F0FF]/30">ETA Dock 02: 42 Menit</span>
          </div>
        </div>

        {/* e-PoD Verification & SAP Goods Receipt Execution */}
        <div className="lg:col-span-5 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                  <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-black font-display text-white uppercase tracking-wide">
                  e-PoD &amp; Penerimaan Barang Instan (GR)
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase ${
                grPosted 
                  ? 'bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]' 
                  : 'bg-[#FFD600] text-black shadow-[0_0_10px_rgba(255,214,0,0.3)]'
              }`}>
                {grPosted ? 'GR SELESAI' : 'MENUNGGU GR'}
              </span>
            </div>

            {/* Document Match Summary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#242436] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Target PO SAP:</span>
                <span className="font-black text-white bg-zinc-800 px-2.5 py-0.5 rounded-full">#45009821</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Barcode e-PoD:</span>
                <span className="text-[#00F0FF] font-bold bg-[#00F0FF]/15 px-2.5 py-0.5 rounded-full border border-[#00F0FF]/30">QR-POD-88219-OK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Material / SKU:</span>
                <span className="text-zinc-200 font-bold">BOX-CB-001 (50 Bundles)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Kesesuaian Muatan:</span>
                <span className="text-[#CCFF00] font-bold bg-[#CCFF00]/15 px-2.5 py-0.5 rounded-full border border-[#CCFF00]/30">100% Cocok (0 Cacat)</span>
              </div>
            </div>

            {/* Post GR Action & SAP S/4HANA Result */}
            {grPosted ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#14261C] to-[#183624] border border-[#CCFF00]/50 space-y-2.5 text-xs shadow-[0_0_25px_rgba(204,255,0,0.2)]">
                <div className="flex items-center gap-2 text-[#CCFF00] font-black font-display uppercase tracking-tight text-sm">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>SAP GR Dokumen #50012498 Diterbitkan!</span>
                </div>
                <p className="text-zinc-200 text-xs leading-relaxed font-medium">
                  Modul <code className="bg-zinc-900 px-2 py-0.5 rounded border border-[#CCFF00]/30 font-mono text-[#CCFF00]">BAPI_GOODSMVT_CREATE</code> berhasil dieksekusi di SAP S/4HANA Cloud (Tipe Pergerakan 101). Saldo stok gudang otomatis bertambah <strong className="text-white">+50 bundle</strong>, menutup siklus rantai pasok secara otonom!
                </p>
                <div className="pt-2 border-t border-[#CCFF00]/30 flex justify-between font-mono text-[11px] font-bold text-zinc-300">
                  <span>Saldo Baru SAP: <strong className="text-[#CCFF00]">96 unit</strong></span>
                  <span>Diskrepansi: <strong className="text-[#00F0FF]">0 (Terselesaikan)</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Setelah barcode e-PoD dipindai di Gate 04, sistem memicu API SAP S/4HANA untuk mencatat penerimaan barang secara instan tanpa input manual staf gudang.
                </p>

                <button
                  onClick={handlePostGoodsReceipt}
                  disabled={isPostingGr}
                  className="w-full py-3.5 px-5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-black font-black uppercase text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPostingGr ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>Mencatat BAPI_GOODSMVT_CREATE...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Eksekusi Penerimaan Barang Instan (SAP S/4HANA)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#242436] text-[11px] font-mono text-zinc-500 flex justify-between font-bold">
            <span>Antarmuka SAP: BAPI_GOODSMVT_CREATE</span>
            <span className="text-zinc-400">Tipe Pergerakan: 101</span>
          </div>
        </div>
      </div>
    </div>
  );
}
