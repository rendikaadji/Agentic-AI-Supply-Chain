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
    { name: 'Pabrik Vendor (Cikarang Barat)', time: '12:30 WIB', status: 'done', desc: 'Muatan 50 bundle kardus selesai dimuat ke armada' },
    { name: 'Simpang Susun Cikunir (Kemacetan 45m)', time: '13:15 WIB', status: 'diverted', desc: 'Amazon Location mendeteksi delay; pengalihan rute dinamis diaktifkan' },
    { name: 'Jalur Lingkar Luar Timur (KM 28)', time: '14:05 WIB', status: 'current', desc: 'Armada bergerak 54 km/jam menuju Marunda DC' },
    { name: 'Marunda Central DC (Dock 02)', time: 'ETA 14:47 WIB', status: 'pending', desc: 'Tujuan akhir - Geofence kedatangan siap menyambut' },
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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-emerald-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pillars 5 &amp; 6: Logistics &amp; Inbound Execution</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                Amazon Location Service + AWS IoT Core + SAP BAPI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimasi rute multimoda mitigasi demurrage, verifikasi e-PoD barcode, dan posting instan Goods Receipt (GR) di SAP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            GPS Armada: Terhubung (AWS IoT Core)
          </span>
        </div>
      </div>

      {/* Real-Time Fleet Waypoint & Congestion Mitigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Tracking Panel */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Pelacakan Rute Dinamis Armada Inbound</h3>
                <p className="text-xs text-slate-400 font-mono">Carrier: PT Trans Karunia • Truk Plat: B-9122-TX</p>
              </div>
              <span className="text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
                Speed: 54 km/jam
              </span>
            </div>

            {/* Congestion Mitigation Alert Badge */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs mb-5 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold">Mitigasi Kemacetan Otonom (Amazon Location Service):</strong>
                <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                  Terdeteksi insiden kemacetan 45 menit di Ruas Tol Jakarta-Cikampek KM 14. Logistics Agent secara otomatis mengalihkan rute melalui <strong>Jalur Lingkar Luar Timur</strong>, menghemat 32 menit waktu tempuh dan mengeliminasi risiko demurrage sebesar Rp 1.200.000.
                </p>
              </div>
            </div>

            {/* Step Waypoints */}
            <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2 mb-4">
              {waypoints.map((wp, i) => (
                <div key={i} className="relative group">
                  <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    wp.status === 'done' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' :
                    wp.status === 'diverted' ? 'bg-amber-400' :
                    wp.status === 'current' ? 'bg-cyan-400 animate-ping' :
                    'bg-slate-700'
                  }`} />

                  <div className="flex items-baseline justify-between text-xs">
                    <span className={`font-bold ${wp.status === 'current' ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {wp.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{wp.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{wp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Jarak Sisa: <strong>14.2 km</strong></span>
            <span className="text-cyan-400">ETA Dock 02: 42 Menit</span>
          </div>
        </div>

        {/* e-PoD Verification & SAP Goods Receipt Execution */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">e-PoD &amp; Instant Goods Receipt (GR)</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                grPosted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {grPosted ? 'GR COMPLETE' : 'AWAITING GR'}
              </span>
            </div>

            {/* Document Match Summary */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Target PO:</span>
                <span className="text-white font-bold">#45009821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">e-PoD Barcode:</span>
                <span className="text-cyan-400">QR-POD-88219-OK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Material / SKU:</span>
                <span className="text-slate-200">BOX-CB-001 (50 Bundles)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kesesuaian Muatan:</span>
                <span className="text-emerald-400 font-bold">100% Match (0 Defect)</span>
              </div>
            </div>

            {/* Post GR Action & SAP S/4HANA Result */}
            {grPosted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SAP Goods Receipt Dokumen #50012498 Diterbitkan!</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Modul <code>BAPI_GOODSMVT_CREATE</code> berhasil dieksekusi di SAP S/4HANA Cloud (Movement Type 101). Saldo stok gudang otomatis bertambah <strong>+50 bundle</strong>, menutup siklus rantai pasok secara otonom!
                </p>
                <div className="pt-2 border-t border-emerald-500/20 flex justify-between font-mono text-[10px] text-emerald-300">
                  <span>Saldo Baru SAP: 96 unit</span>
                  <span>Discrepancy: 0 (Resolved)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setelah e-PoD barcode dipindai di Gate 04, sistem memicu API SAP S/4HANA untuk mencatat penerimaan barang secara instan tanpa input manual staf gudang.
                </p>

                <button
                  onClick={handlePostGoodsReceipt}
                  disabled={isPostingGr}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isPostingGr ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Posting BAPI_GOODSMVT_CREATE...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Eksekusi Instant Goods Receipt (SAP S/4HANA)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>SAP Interface: BAPI_GOODSMVT_CREATE</span>
            <span>Movement Type: 101</span>
          </div>
        </div>
      </div>
    </div>
  );
}
