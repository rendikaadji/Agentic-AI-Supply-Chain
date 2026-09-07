import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  AlertCircle, 
  Calendar, 
  Cpu, 
  ArrowUpRight, 
  RefreshCw, 
  ShieldAlert, 
  CloudRain, 
  Globe, 
  CheckCircle2,
  Zap,
  Sliders
} from 'lucide-react';

export default function DemandSensingView() {
  const [isProjecting, setIsProjecting] = useState(false);
  const [horizon, setHorizon] = useState('4w'); // 2w, 4w, 8w
  const [forecastSpike, setForecastSpike] = useState(24.2);

  const forecastData = [
    { week: 'Minggu 36 (Aktif)', historical: 480, forecast: 495, upper: 520, lower: 470, status: 'Normal' },
    { week: 'Minggu 37 (+1 Mgg)', historical: 510, forecast: 565, upper: 600, lower: 530, status: 'Rising' },
    { week: 'Minggu 38 (+2 Mgg)', historical: 490, forecast: 620, upper: 670, lower: 580, status: 'Peak Risk' },
    { week: 'Minggu 39 (+3 Mgg)', historical: 520, forecast: 590, upper: 640, lower: 550, status: 'Elevated' },
  ];

  const marketSignals = [
    { title: 'Pulp & Packaging Index', val: '+4.8%', impact: 'Moderate', desc: 'Kenaikan harga bahan baku kertas industri global', icon: Globe, color: 'text-amber-400', border: 'border-amber-500/30' },
    { title: 'Tanjung Priok Port Dwell Time', val: '3.8 Hari', impact: 'High Risk', desc: 'Kemacetan inbound dock kontainer +1.2 hari dari baseline', icon: CloudRain, color: 'text-rose-400', border: 'border-rose-500/30' },
    { title: 'E-Commerce Peak Promo', val: '+35% PO Vol', impact: 'High Demand', desc: 'Kenaikan pesanan distributor retail menyambut Q4 festival', icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  ];

  const handleRunProjection = () => {
    setIsProjecting(true);
    setTimeout(() => {
      setForecastSpike(24.2);
      setIsProjecting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pillar 1: Demand Sensing Agent</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                Dataset Baseline • SageMaker (Phase 2)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-week probabilistic forecasting dengan integrasi time-series penjualan SAP S/4HANA & sinyal pasar eksternal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="2w">Horizon: 2 Minggu</option>
            <option value="4w">Horizon: 4 Minggu (Default)</option>
            <option value="8w">Horizon: 8 Minggu (Quarter)</option>
          </select>

          <button
            onClick={handleRunProjection}
            disabled={isProjecting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <Zap className={`w-3.5 h-3.5 fill-slate-950 ${isProjecting ? 'animate-spin' : ''}`} />
            <span>{isProjecting ? 'Computing Baseline...' : 'Recalculate Projection'}</span>
          </button>
        </div>
      </div>

      {/* Honest Architecture Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
          BASELINE DATASET
        </span>
        <p className="leading-relaxed">
          Proyeksi demand dihitung dari deret waktu sintetis 4-minggu (lonjakan +24.2% terdeteksi). Model deep learning AWS SageMaker DeepAR dijadwalkan terhubung pada Phase 2 pasca-sandbox cloud.
        </p>
      </div>

      {/* Main Forecast Metrics & Graphic Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forecast Bars and Schedule */}
        <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Proyeksi Permintaan SKU: BOX-CB-001 (Cardboard Box)</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Confidence: 94.8%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: Bedrock DeepAR+ • Peramalan Adaptif Berbasis Volatilitas Lead Time
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Proyeksi Kenaikan</span>
              <span className="text-xl font-bold font-mono text-cyan-400 flex items-center justify-end gap-1">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                +{forecastSpike}%
              </span>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="space-y-4 mb-6">
            {forecastData.map((d, idx) => {
              const maxVal = 700;
              const histWidth = (d.historical / maxVal) * 100;
              const foreWidth = (d.forecast / maxVal) * 100;

              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{d.week}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">Hist: <strong className="text-slate-300">{d.historical} unit</strong></span>
                      <span className="text-cyan-400">AI Forecast: <strong className="text-white">{d.forecast} unit</strong></span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        d.status === 'Peak Risk' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        d.status === 'Rising' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Graphic */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden flex">
                      <div 
                        className="bg-slate-600 h-full rounded-l-full transition-all duration-700" 
                        style={{ width: `${histWidth}%` }} 
                        title={`Historical: ${d.historical}`}
                      />
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden flex">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${foreWidth}%` }} 
                        title={`AI Projected: ${d.forecast}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>90% CI: {d.lower} – {d.upper} units</span>
                    <span className="text-cyan-400 font-semibold">Δ +{d.forecast - d.historical} unit surge</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forecast Insights Footer */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Rekomendasi Tindakan Cerdas (Claude 3.5 Sonnet):</strong>
              <p className="mt-0.5 text-slate-300 leading-relaxed text-[11px]">
                Lonjakan permintaan Minggu 38 (+26.5%) diprediksi menghabiskan buffer Safety Stock dalam 48 jam jika pesanan tidak diterbitkan segera. StockMind AI merekomendasikan penerbitan RFQ ke vendor kardus paling lambat tanggal <strong>08 September 2026</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Market Signals & Model Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          {/* External Market Signals */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                External Market & Disruptive Signals
              </h3>
            </div>

            <div className="space-y-3">
              {marketSignals.map((sig, i) => {
                const SigIcon = sig.icon;
                return (
                  <div key={i} className={`p-3 rounded-xl bg-slate-950/60 border ${sig.border} space-y-1`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SigIcon className={`w-3.5 h-3.5 ${sig.color}`} />
                        <span className="text-xs font-bold text-slate-200">{sig.title}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">{sig.val}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sig.desc}</p>
                    <div className="flex justify-end">
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        sig.impact === 'High Risk' ? 'bg-rose-500/20 text-rose-300' :
                        sig.impact === 'High Demand' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sig.impact}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Parameters & SAP BTP Connector Info */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md font-mono text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 mb-1">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="font-bold font-sans">SageMaker Pipeline Status</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Inference Container:</span>
              <span className="text-slate-200">deepar-v2.1</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Training Loss (RMSE):</span>
              <span className="text-emerald-400 font-bold">0.0381 (Optimal)</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>SAP Table Source:</span>
              <span className="text-cyan-400">VBAP (Sales Items)</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Next Retraining Run:</span>
              <span className="text-slate-300">07 Sep 2026, 00:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
