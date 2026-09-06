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
      name: 'Cardboard Box (640x640mm)',
      category: 'Primary Packaging',
      physical: 46,
      sap: 60,
      diff: -14,
      status: reconciled ? 'Synchronized' : 'Phantom Discrepancy',
      severity: 'critical',
      location: 'Rack A-04 (CAM-01)',
      action: 'Trigger Procurement Agent'
    },
    {
      sku: 'PAL-WD-002',
      name: 'Standard Euro Pallet (1200x800mm)',
      category: 'Storage Unit',
      physical: 120,
      sap: 120,
      diff: 0,
      status: 'Synchronized',
      severity: 'ok',
      location: 'Bay B-01 (CAM-02)',
      action: 'Verified Accurate'
    },
    {
      sku: 'STR-PL-003',
      name: 'Stretch Wrap Industrial Roll (500mm)',
      category: 'Consumable',
      physical: 85,
      sap: 88,
      diff: -3,
      status: reconciled ? 'Synchronized' : 'Minor Variance',
      severity: 'warning',
      location: 'Bay C-03',
      action: 'SAP MM Inventory Adj'
    },
    {
      sku: 'TAPE-OPP-004',
      name: 'Packaging Tape 48mm x 100m',
      category: 'Consumable',
      physical: 210,
      sap: 210,
      diff: 0,
      status: 'Synchronized',
      severity: 'ok',
      location: 'Bin D-12',
      action: 'Verified Accurate'
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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pillar 3: Stock Reconciliation Agent</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold">
                Amazon Bedrock Agents + SAP MM + DynamoDB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Menutup celah Phantom Inventory: rekonsiliasi stok visual fisik YOLOv8 dengan saldo pembukuan SAP S/4HANA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReconcile}
            disabled={isReconciling || reconciled}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              reconciled
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 shadow-blue-500/20'
            }`}
          >
            {isReconciling ? (
              <>
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Posting to SAP S/4HANA...</span>
              </>
            ) : reconciled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Inventory Reconciled &amp; Synced</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Trigger Auto-Reconciliation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Discrepancy Table Panel */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Fisik vs SAP S/4HANA Variance Matrix</h3>
            <p className="text-xs text-slate-400 font-mono">Live reconciliation audit between YOLOv8 Edge detections &amp; SAP MM tables</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-rose-400 font-bold">1 Discrepancy Found</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">3 SKUs Synced</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU / Nama Material</th>
                <th className="py-3 px-4">Lokasi Fisik</th>
                <th className="py-3 px-4 text-center">Fisik (YOLOv8)</th>
                <th className="py-3 px-4 text-center">SAP S/4HANA</th>
                <th className="py-3 px-4 text-center">Variansi</th>
                <th className="py-3 px-4">Status Rekonsiliasi</th>
                <th className="py-3 px-4 text-right">Tindakan Otonom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {inventoryDiscrepancies.map((item, idx) => {
                const isCritical = item.diff < -5 && !reconciled;
                const isWarning = item.diff < 0 && !reconciled;
                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono">{item.sku}</div>
                      <div className="text-[11px] text-slate-400">{item.name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {reconciled && item.sku === 'BOX-CB-001' ? 46 : item.physical}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {reconciled && item.sku === 'BOX-CB-001' ? 46 : item.sap}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {reconciled && item.sku === 'BOX-CB-001' ? (
                        <span className="text-emerald-400">0</span>
                      ) : item.diff < 0 ? (
                        <span className="text-rose-400">{item.diff} unit</span>
                      ) : (
                        <span className="text-emerald-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                        (item.status === 'Synchronized' || reconciled)
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isCritical
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {(item.status === 'Synchronized' || reconciled) && <Check className="w-2.5 h-2.5" />}
                        {reconciled ? 'Synchronized' : item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                        {reconciled && item.sku === 'BOX-CB-001' ? 'Doc #5000182 Posted' : item.action}
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
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              Adaptive Inventory Math Engine (Formula Kontrak)
            </h3>
          </div>

          {/* Formulas rendered in monospace box */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-purple-300 space-y-1 mb-5">
            <div>SS  = Z × √( L × (σd)² + d² × (σL)² )</div>
            <div>ROP = (d × L) + SS</div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              *Z = 1.65 (95% Service Level), d = rata-rata konsumsi harian, L = lead time (hari)
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Rata-rata Konsumsi Harian (d):</span>
                <span className="font-mono font-bold text-cyan-400">{d} units/hari</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={d} 
                onChange={(e) => setD(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Lead Time Vendor Rerata (L):</span>
                <span className="font-mono font-bold text-cyan-400">{L} hari</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={L} 
                onChange={(e) => setL(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Variansi Demand (σd):</span>
                  <span className="font-mono text-purple-300">{sigmaD}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.2"
                  value={sigmaD} 
                  onChange={(e) => setSigmaD(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Variansi Lead Time (σL):</span>
                  <span className="font-mono text-purple-300">{sigmaL}</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.1"
                  value={sigmaL} 
                  onChange={(e) => setSigmaL(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Hasil Kalkulasi Adaptif Realtime
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SL: 95% (Z=1.65)
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">Dynamic Safety Stock (SS):</div>
                <div className="text-3xl font-black font-mono text-white mt-1">
                  {calculatedSS} <span className="text-sm font-normal text-purple-300">unit buffer</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Melindungi dari variabilitas lead time & fluktuasi order</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/40 bg-cyan-950/10">
                <div className="text-xs text-cyan-300">Reorder Point Adaptif (ROP):</div>
                <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
                  {calculatedROP} <span className="text-sm font-normal text-cyan-200">unit threshold</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Stok saat ini: <strong className="text-rose-400">46 unit</strong> &lt; ROP ({calculatedROP}). 
                  <span className="text-amber-300 ml-1 font-semibold">Memicu RFQ Pengadaan Darurat!</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Sinkronisasi Otomatis:</span>
            <span className="text-emerald-400 font-semibold">SAP MM MRP Live Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
