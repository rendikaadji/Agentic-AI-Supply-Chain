import React, { useState } from 'react';
import { 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Calculator, 
  Database, 
  Server, 
  ArrowRight, 
  Sparkles,
  Zap,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function StockReconciliationView() {
  // Adaptive SS / ROP calculator state
  const [d, setD] = useState(15); // daily consumption
  const [L, setL] = useState(4);  // lead time in days
  const [sigmaD, setSigmaD] = useState(3.2); // demand std dev
  const [sigmaL, setSigmaL] = useState(1.4); // lead time std dev
  const [zFactor, setZFactor] = useState(1.65); // 95% service level

  const [reconciled, setReconciled] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);

  // Dynamic Safety Stock formula: SS = Z * sqrt( L * (sigmaD)^2 + d^2 * (sigmaL)^2 )
  const varianceTerm = (L * Math.pow(sigmaD, 2)) + (Math.pow(d, 2) * Math.pow(sigmaL, 2));
  const calculatedSS = Math.round(zFactor * Math.sqrt(varianceTerm));
  // ROP = (d * L) + SS
  const calculatedROP = Math.round((d * L) + calculatedSS);

  const inventoryDiscrepancies = [
    {
      sku: 'BOX-CB-001',
      name: 'Kardus Karton Box (640x640mm)',
      category: 'Kemasan Utama',
      physical: 46,
      sap: 60,
      diff: -14,
      status: reconciled ? 'Tersinkronisasi' : 'Diskrepansi Stok Semu',
      severity: 'critical',
      location: 'Rak A-04 (CAM-01)',
      action: 'Picu Agen Pengadaan'
    },
    {
      sku: 'PAL-WD-002',
      name: 'Euro Pallet Standar (1200x800mm)',
      category: 'Unit Penyimpanan',
      physical: 120,
      sap: 120,
      diff: 0,
      status: 'Tersinkronisasi',
      severity: 'ok',
      location: 'Bay B-01 (CAM-02)',
      action: 'Terverifikasi Akurat'
    },
    {
      sku: 'STR-PL-003',
      name: 'Stretch Wrap Gulung Industri (500mm)',
      category: 'Barang Habis Pakai',
      physical: 85,
      sap: 88,
      diff: -3,
      status: reconciled ? 'Tersinkronisasi' : 'Variansi Kecil',
      severity: 'warning',
      location: 'Bay C-03',
      action: 'Penyesuaian Stok SAP MM'
    },
    {
      sku: 'TAPE-OPP-004',
      name: 'Lakban OPP 48mm x 100m',
      category: 'Barang Habis Pakai',
      physical: 210,
      sap: 210,
      diff: 0,
      status: 'Tersinkronisasi',
      severity: 'ok',
      location: 'Bin D-12',
      action: 'Terverifikasi Akurat'
    },
  ];

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setReconciled(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD600] text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,214,0,0.3)] shrink-0">
            <RefreshCcw className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-wide">
                Pilar 3: Agen Rekonsiliasi Stok
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#CCFF00] text-black font-mono shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                BEDROCK AGENTS + SAP MM + DYNAMODB
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Menutup celah stok semu (phantom inventory): rekonsiliasi stok visual fisik YOLOv8 dengan saldo pembukuan SAP S/4HANA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReconcile}
            disabled={isReconciling || reconciled}
            className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider ${
              reconciled
                ? 'bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                : 'bg-[#CCFF00] hover:bg-[#d8ff33] text-black shadow-[0_0_15px_rgba(204,255,0,0.25)] hover:scale-105 active:scale-95'
            }`}
          >
            {isReconciling ? (
              <>
                <RefreshCcw className="w-4 h-4 stroke-[3] animate-spin" />
                <span>Mencatat ke SAP S/4HANA...</span>
              </>
            ) : reconciled ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Stok Terekonsiliasi &amp; Sinkron</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black stroke-[2]" />
                <span>Jalankan Rekonsiliasi Otomatis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Discrepancy Table Panel */}
      <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#222232]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white uppercase font-display tracking-wide">
                Matriks Variansi Fisik vs SAP S/4HANA
              </h3>
              <span className="text-[#00F0FF] text-xs">✦</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Audit rekonsiliasi langsung antara deteksi Edge YOLOv8 &amp; tabel SAP MM
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-mono font-black">
            <span className="bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/40 px-3 py-1 rounded-full">
              1 Diskrepansi Ditemukan
            </span>
            <span className="bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40 px-3 py-1 rounded-full">
              3 SKU Sinkron
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#242436]">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#0E0E14] text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-black border-b border-[#242436]">
              <tr>
                <th className="py-3.5 px-4 border-r border-[#242436]/50">SKU / Material</th>
                <th className="py-3.5 px-4 border-r border-[#242436]/50">Lokasi Fisik</th>
                <th className="py-3.5 px-4 text-center border-r border-[#242436]/50">Fisik (YOLOv8)</th>
                <th className="py-3.5 px-4 text-center border-r border-[#242436]/50">SAP S/4HANA</th>
                <th className="py-3.5 px-4 text-center border-r border-[#242436]/50">Variansi</th>
                <th className="py-3.5 px-4 border-r border-[#242436]/50">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan Otonom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20202F] font-sans font-medium">
              {inventoryDiscrepancies.map((item, idx) => {
                const isCritical = item.diff < -5 && !reconciled;
                return (
                  <tr key={idx} className="hover:bg-[#181826] transition-colors bg-[#12121B]">
                    <td className="py-3.5 px-4 border-r border-[#20202F]">
                      <div className="font-black text-white font-mono text-sm">{item.sku}</div>
                      <div className="text-[11px] text-zinc-400">{item.name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 text-xs border-r border-[#20202F]">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-black text-white text-sm border-r border-[#20202F]">
                      {reconciled && item.sku === 'BOX-CB-001' ? 46 : item.physical}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-zinc-300 border-r border-[#20202F]">
                      {reconciled && item.sku === 'BOX-CB-001' ? 46 : item.sap}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-black border-r border-[#20202F]">
                      {reconciled && item.sku === 'BOX-CB-001' ? (
                        <span className="text-[#CCFF00] bg-[#CCFF00]/15 px-2.5 py-0.5 rounded-full border border-[#CCFF00]/30 font-bold">0</span>
                      ) : item.diff < 0 ? (
                        <span className="text-white bg-[#FF3366] px-2.5 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(255,51,102,0.4)]">{item.diff} unit</span>
                      ) : (
                        <span className="text-[#CCFF00] bg-[#CCFF00]/15 px-2.5 py-0.5 rounded-full border border-[#CCFF00]/30 font-bold">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 border-r border-[#20202F]">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black inline-flex items-center gap-1 border ${
                        (item.status === 'Tersinkronisasi' || reconciled)
                          ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40'
                          : isCritical
                          ? 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40 animate-pulse'
                          : 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/40'
                      }`}>
                        {(item.status === 'Tersinkronisasi' || reconciled) && <Check className="w-3 h-3 stroke-[3]" />}
                        {reconciled ? 'TERSINKRONISASI' : item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] font-bold text-[#00F0FF] bg-[#00F0FF]/15 border border-[#00F0FF]/30 px-3 py-1 rounded-full inline-block">
                        {reconciled && item.sku === 'BOX-CB-001' ? 'DOK #5000182 DICATAT' : item.action.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Safety Stock & ROP Dynamic Math Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formula Explainer & Controls */}
        <div className="lg:col-span-7 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#242436]">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF] text-black flex items-center justify-center font-black shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-wide">
                Mesin Kalkulasi Inventaris Adaptif
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Formula Standar Stochastic Safety Stock</p>
            </div>
          </div>

          {/* Formulas rendered in monospace box */}
          <div className="p-4 rounded-2xl bg-[#101018] border border-[#242436] font-mono text-xs text-zinc-300 space-y-1.5 shadow-inner">
            <div className="text-[#CCFF00] font-bold">SS  = Z × √( L × (σd)² + d² × (σL)² )</div>
            <div className="text-[#00F0FF] font-bold">ROP = (d × L) + SS</div>
            <div className="text-[10px] text-zinc-500 pt-2 border-t border-[#242436]">
              *Z = 1.65 (Tingkat Layanan 95%), d = rata-rata konsumsi harian, L = waktu tunggu / lead time (hari)
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#222232]">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-zinc-300 font-bold uppercase text-[11px]">Rata-rata Konsumsi Harian (d):</span>
                <span className="font-mono font-black text-[#FFD600] bg-[#FFD600]/15 px-2.5 py-0.5 rounded-full border border-[#FFD600]/30">{d} unit/hari</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={d} 
                onChange={(e) => setD(Number(e.target.value))}
                className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#FFD600]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#222232]">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-zinc-300 font-bold uppercase text-[11px]">Waktu Tunggu Rekanan Rerata (L):</span>
                <span className="font-mono font-black text-[#00F0FF] bg-[#00F0FF]/15 px-2.5 py-0.5 rounded-full border border-[#00F0FF]/30">{L} hari</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={L} 
                onChange={(e) => setL(Number(e.target.value))}
                className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#222232]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-300 font-bold uppercase text-[10px]">Variansi Permintaan (σd):</span>
                  <span className="font-mono font-black text-white bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{sigmaD}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.2"
                  value={sigmaD} 
                  onChange={(e) => setSigmaD(Number(e.target.value))}
                  className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#101018] border border-[#222232]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-300 font-bold uppercase text-[10px]">Variansi Waktu Tunggu (σL):</span>
                  <span className="font-mono font-black text-white bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{sigmaL}</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.1"
                  value={sigmaL} 
                  onChange={(e) => setSigmaL(Number(e.target.value))}
                  className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="lg:col-span-5 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
              <span className="text-xs font-black text-white uppercase tracking-wider font-display">
                Hasil Kalkulasi Adaptif
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-[#101018] text-[#CCFF00] border border-[#CCFF00]/40">
                SL: 95% (Z=1.65)
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#101018] border border-[#242436] shadow-lg">
                <div className="text-xs font-black uppercase text-zinc-400">Stok Pengaman Dinamis (Safety Stock - SS):</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
                  {calculatedSS} <span className="text-sm font-bold text-[#00F0FF]">unit buffer</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium mt-1">Melindungi dari variabilitas lead time &amp; fluktuasi pesanan</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C182A] to-[#2B1B3D] border border-[#8A2BE2]/50 shadow-[0_0_25px_rgba(138,43,226,0.2)]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase text-[#CCFF00]">Titik Pesan Ulang Adaptif (ROP):</div>
                  <span className="text-xs text-[#CCFF00]">⚡</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#CCFF00] mt-1">
                  {calculatedROP} <span className="text-sm font-black text-white">unit batas</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium mt-2 leading-relaxed">
                  Stok saat ini: <strong className="text-white bg-[#FF3366] px-1.5 py-0.5 rounded-full text-xs">46 unit</strong> &lt; ROP ({calculatedROP}). 
                  <span className="block mt-1 text-[#FF3366] font-black">Memicu RFQ Pengadaan Darurat!</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#242436] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Sinkronisasi Otomatis:</span>
            <span className="bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 px-3 py-1 rounded-full font-bold">
              MRP SAP MM AKTIF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
