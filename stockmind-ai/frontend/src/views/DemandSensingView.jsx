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
    { week: 'Minggu 37 (+1 Mgg)', historical: 510, forecast: 565, upper: 600, lower: 530, status: 'Meningkat' },
    { week: 'Minggu 38 (+2 Mgg)', historical: 490, forecast: 620, upper: 670, lower: 580, status: 'Risiko Puncak' },
    { week: 'Minggu 39 (+3 Mgg)', historical: 520, forecast: 590, upper: 640, lower: 550, status: 'Tinggi' },
  ];

  const marketSignals = [
    { title: 'Indeks Pulp & Kertas Karton', val: '+4.8%', impact: 'Sedang', desc: 'Kenaikan harga bahan baku kertas industri global', icon: Globe, badgeClass: 'bg-[#FFD600]/15 text-[#FFD600] border-[#FFD600]/30' },
    { title: 'Waktu Sandar Pelabuhan Priok', val: '3.8 Hari', impact: 'Risiko Tinggi', desc: 'Kemacetan inbound dock kontainer +1.2 hari dari baseline', icon: CloudRain, badgeClass: 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40' },
    { title: 'Festival Promo E-Commerce', val: '+35% PO Vol', impact: 'Permintaan Tinggi', desc: 'Lonjakan pesanan distributor retail menyambut festival belanja Q4', icon: Zap, badgeClass: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30' },
  ];

  const handleRunProjection = () => {
    setIsProjecting(true);
    setTimeout(() => {
      setForecastSpike(Number((22 + Math.random() * 6).toFixed(1)));
      setIsProjecting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00F0FF] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-wide">
                Pilar 1: Agen Deteksi Permintaan
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#FFD600] text-black font-mono shadow-[0_0_10px_rgba(255,214,0,0.3)]">
                AMAZON BEDROCK + SAGEMAKER
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Peramalan probabilistik multi-minggu dengan integrasi data historis SAP S/4HANA &amp; sinyal pasar eksternal.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="bg-[#101018] border border-[#242436] rounded-full px-4 py-2 text-xs font-mono font-bold text-zinc-200 cursor-pointer focus:outline-none focus:border-[#CCFF00]"
          >
            <option value="2w">Cakupan: 2 Minggu</option>
            <option value="4w">Cakupan: 4 Minggu (Rekomendasi)</option>
            <option value="8w">Cakupan: 8 Minggu</option>
          </select>

          <button
            onClick={handleRunProjection}
            disabled={isProjecting}
            className="px-5 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-black font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isProjecting ? 'animate-spin' : ''}`} />
            <span>{isProjecting ? 'MENGANALISIS...' : 'JALANKAN PROYEKSI'}</span>
          </button>
        </div>
      </div>

      {/* Main Forecast Metrics & Graphic Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forecast Bars and Schedule */}
        <div className="lg:col-span-8 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#242436]">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-wide">
                  Proyeksi Permintaan SKU: BOX-CB-001 (Kardus Kemasan)
                </h3>
                <span className="text-xs text-[#CCFF00]">✦</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/15 px-2.5 py-0.5 rounded-full border border-[#CCFF00]/30">
                  TINGKAT KEYAKINAN: 94.8%
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Model: Bedrock DeepAR+
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-400 block uppercase text-[11px] font-bold">Proyeksi Kenaikan</span>
              <span className="text-2xl font-black font-mono text-[#FFD600] flex items-center justify-end gap-1 mt-0.5">
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                +{forecastSpike}%
              </span>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="space-y-4">
            {forecastData.map((d, idx) => {
              const maxVal = 700;
              const histWidth = (d.historical / maxVal) * 100;
              const foreWidth = (d.forecast / maxVal) * 100;

              return (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#222232] hover:border-[#3D3D5A] transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-black text-white uppercase tracking-wide">{d.week}</span>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                      <span className="text-zinc-400">Historis: <strong className="text-zinc-200">{d.historical} unit</strong></span>
                      <span className="text-zinc-300">Proyeksi AI: <strong className="text-[#00F0FF] bg-[#00F0FF]/15 px-2 py-0.5 border border-[#00F0FF]/30 rounded-full">{d.forecast} unit</strong></span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        d.status === 'Risiko Puncak' ? 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/40' :
                        d.status === 'Meningkat' ? 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/40' :
                        'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Graphic */}
                  <div className="space-y-2 pt-1">
                    <div className="w-full bg-[#20202F] rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-zinc-500 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${histWidth}%` }} 
                        title={`Historis: ${d.historical}`}
                      />
                    </div>
                    <div className="w-full bg-[#20202F] rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#00F0FF] to-[#CCFF00] h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                        style={{ width: `${foreWidth}%` }} 
                        title={`Proyeksi AI: ${d.forecast}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                    <span>Rentang 90% CI: {d.lower} – {d.upper} unit</span>
                    <span className="text-[#CCFF00] font-bold bg-[#CCFF00]/15 px-2 py-0.5 rounded-full border border-[#CCFF00]/30">
                      Δ +{d.forecast - d.historical} unit lonjakan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forecast Insights Footer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C182A] to-[#2B1B3D] border border-[#8A2BE2]/40 text-xs text-zinc-300 flex items-start gap-4 shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <div className="w-9 h-9 rounded-xl bg-[#8A2BE2] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(138,43,226,0.4)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white uppercase font-black text-xs font-display tracking-wide">
                Rekomendasi Tindakan Cerdas (Claude 3.5 Sonnet):
              </strong>
              <p className="mt-1 text-zinc-300 font-medium leading-relaxed text-xs">
                Lonjakan permintaan Minggu 38 (+26.5%) diprediksi menghabiskan buffer Safety Stock dalam 48 jam jika pesanan tidak diterbitkan segera. StockMind AI merekomendasikan penerbitan RFQ ke vendor kardus paling lambat tanggal <strong className="text-[#CCFF00]">08 September 2026</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Market Signals & Model Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          {/* External Market Signals */}
          <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#242436]">
              <div className="w-10 h-10 rounded-2xl bg-[#00F0FF] text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <Globe className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
                  Sinyal Pasar &amp; Disrupsi Eksternal
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">3 Sinyal Aktif Terpantau</span>
              </div>
            </div>

            <div className="space-y-3">
              {marketSignals.map((sig, i) => {
                const SigIcon = sig.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-[#101018] border border-[#222232] hover:border-[#3D3D5A] transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SigIcon className="w-4 h-4 text-[#00F0FF]" />
                        <span className="text-xs font-bold text-white">{sig.title}</span>
                      </div>
                      <span className="font-mono text-xs font-black text-[#CCFF00] bg-[#CCFF00]/15 px-2 py-0.5 rounded-full border border-[#CCFF00]/30">
                        {sig.val}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium">{sig.desc}</p>
                    <div className="flex justify-end pt-1">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${sig.badgeClass}`}>
                        {sig.impact}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Parameters & SAP BTP Connector Info */}
          <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 shadow-xl font-mono text-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#242436]">
              <div className="w-8 h-8 rounded-xl bg-[#8A2BE2] text-white flex items-center justify-center shadow-[0_0_10px_rgba(138,43,226,0.3)]">
                <Cpu className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-black font-display uppercase text-xs text-white">Status Pipeline SageMaker</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Kontainer Inferensi:</span>
              <span className="text-zinc-200 font-bold bg-[#101018] px-2 py-0.5 rounded-full border border-[#242436]">deepar-v2.1</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Loss Pelatihan (RMSE):</span>
              <span className="text-[#CCFF00] font-bold bg-[#CCFF00]/15 px-2 py-0.5 rounded-full border border-[#CCFF00]/30">0.0381 (Optimal)</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Sumber Tabel SAP:</span>
              <span className="text-[#00F0FF] font-bold bg-[#00F0FF]/15 px-2 py-0.5 rounded-full border border-[#00F0FF]/30">VBAP (Item Penjualan)</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Jadwal Latih Ulang:</span>
              <span className="text-zinc-300 font-bold">07 Sep 2026, 00:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
