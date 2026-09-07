import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Cpu, 
  Eye, 
  ShieldCheck, 
  Save, 
  Check, 
  RefreshCw, 
  Database, 
  Bell,
  Lock,
  Key
} from 'lucide-react';

export default function SettingsView() {
  const [isSaved, setIsSaved] = useState(false);
  const [isTestingSap, setIsTestingSap] = useState(false);
  const [sapTestResult, setSapTestResult] = useState(null);

  // Config State
  const [sapHost, setSapHost] = useState('s4h-prod-gateway.corp.internal');
  const [sapClient, setSapClient] = useState('100');
  const [sapSysId, setSapSysId] = useState('S4H');
  const [bedrockModel, setBedrockModel] = useState('anthropic.claude-3-5-sonnet-20241022-v2:0');
  const [awsRegion, setAwsRegion] = useState('us-east-1');
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [iouThreshold, setIouThreshold] = useState(0.60);
  const [autoPoLimit, setAutoPoLimit] = useState(50000000);
  const [autoGrEnabled, setAutoGrEnabled] = useState(true);

  const handleTestSap = () => {
    setIsTestingSap(true);
    setSapTestResult(null);
    setTimeout(() => {
      setIsTestingSap(false);
      setSapTestResult({
        status: 'OK',
        ping: '24ms',
        message: 'Tujuan RFC S4H_RFC_CONN Aktif. BAPI_GOODSMVT_CREATE siap.'
      });
    }, 1000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Subsystem Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD600] text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,214,0,0.3)] shrink-0">
            <Settings className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wide">
                Pengaturan Sistem StockMind AI
              </h2>
              <span className="text-xs text-[#CCFF00]">✦</span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Konfigurasi koneksi SAP S/4HANA ERP, model AWS Bedrock, batas toleransi inferensi Computer Vision, dan tata kelola HITL.
            </p>
          </div>
        </div>

        {isSaved && (
          <span className="px-4 py-2 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-mono font-bold uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <Check className="w-4 h-4 stroke-[3]" /> Konfigurasi Berhasil Disimpan
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: SAP S/4HANA ERP Connection */}
        <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242436] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00F0FF] text-black flex items-center justify-center font-black shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <Server className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black font-display text-white uppercase tracking-wide">
                  Gateway ERP SAP S/4HANA &amp; Ariba
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">Koneksi Remote Function Call (RFC) NetWeaver</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestSap}
              disabled={isTestingSap}
              className="px-4 py-2 rounded-full bg-[#101018] hover:bg-[#181826] text-xs font-mono font-bold uppercase text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSap ? 'animate-spin' : ''}`} />
              <span>{isTestingSap ? 'Menguji RFC...' : 'Uji Koneksi RFC'}</span>
            </button>
          </div>

          {sapTestResult && (
            <div className="p-4 rounded-2xl bg-[#14261C] border border-[#CCFF00]/40 text-xs font-mono text-[#CCFF00] font-bold flex flex-wrap items-center justify-between gap-2 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <span>[LULUS] {sapTestResult.message}</span>
              <span className="bg-[#101018] text-white px-3 py-1 border border-[#242436] rounded-full">Ping: {sapTestResult.ping}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-2">Host Tujuan RFC</label>
              <input
                type="text"
                value={sapHost}
                onChange={(e) => setSapHost(e.target.value)}
                className="w-full bg-[#101018] border border-[#242436] rounded-xl px-4 py-2.5 text-zinc-200 font-bold focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-2">ID Klien SAP</label>
              <input
                type="text"
                value={sapClient}
                onChange={(e) => setSapClient(e.target.value)}
                className="w-full bg-[#101018] border border-[#242436] rounded-xl px-4 py-2.5 text-zinc-200 font-bold focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-2">ID Sistem (SID)</label>
              <input
                type="text"
                value={sapSysId}
                onChange={(e) => setSapSysId(e.target.value)}
                className="w-full bg-[#101018] border border-[#242436] rounded-xl px-4 py-2.5 text-zinc-200 font-bold focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AWS Bedrock & Cloud Config */}
        <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-[#242436] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#8A2BE2] text-white flex items-center justify-center font-black shadow-[0_0_10px_rgba(138,43,226,0.3)]">
              <Cpu className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-display text-white uppercase tracking-wide">
                Arsitektur Cloud &amp; Amazon Bedrock
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Model Penalaran Multi-Agen &amp; Knowledge Base</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-2">Model Fondasi (Bedrock)</label>
              <select
                value={bedrockModel}
                onChange={(e) => setBedrockModel(e.target.value)}
                className="w-full bg-[#101018] border border-[#242436] rounded-xl px-4 py-2.5 text-zinc-200 font-bold focus:outline-none focus:border-[#CCFF00] transition-colors cursor-pointer"
              >
                <option value="anthropic.claude-3-5-sonnet-20241022-v2:0">Claude 3.5 Sonnet (Penalaran Superior - Rekomendasi)</option>
                <option value="anthropic.claude-3-haiku-20240307-v1:0">Claude 3 Haiku (Sangat Cepat)</option>
                <option value="meta.llama3-70b-instruct-v1:0">Meta Llama 3 70B</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-2">Wilayah Deployment AWS</label>
              <input
                type="text"
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                className="w-full bg-[#101018] border border-[#242436] rounded-xl px-4 py-2.5 text-zinc-200 font-bold focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Vision Agent & YOLOv8 Inference Parameters */}
        <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-[#242436] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FF3366] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,51,102,0.3)]">
              <Eye className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-display text-white uppercase tracking-wide">
                Parameter Edge Computer Vision (YOLOv8)
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Toleransi Deteksi Objek &amp; NMS Supresi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
            <div className="p-4 sm:p-5 bg-[#101018] border border-[#222232] rounded-2xl">
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-3">
                Ambang Batas Kepercayaan (Bawaan: 0.25)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
                />
                <span className="font-mono font-black text-[#CCFF00] bg-[#CCFF00]/15 px-3 py-1 border border-[#CCFF00]/30 rounded-full text-xs shrink-0">
                  {confThreshold}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#101018] border border-[#222232] rounded-2xl">
              <label className="block text-zinc-300 font-bold uppercase text-[11px] mb-3">
                Ambang Batas NMS IoU (Bawaan: 0.60)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.30"
                  max="0.90"
                  step="0.05"
                  value={iouThreshold}
                  onChange={(e) => setIouThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-[#20202F] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                />
                <span className="font-mono font-black text-[#00F0FF] bg-[#00F0FF]/15 px-3 py-1 border border-[#00F0FF]/30 rounded-full text-xs shrink-0">
                  {iouThreshold}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Human-in-the-Loop (HITL) Governance Toggles */}
        <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-[#242436] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black shadow-[0_0_10px_rgba(204,255,0,0.3)]">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-display text-white uppercase tracking-wide">
                Tata Kelola Otonom &amp; Human-in-the-Loop (HITL)
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Batas Kewenangan Finansial &amp; Persetujuan Eksekusi</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#222232]">
              <div className="max-w-[80%]">
                <div className="font-bold text-white uppercase text-xs">Ambang Batas Penerbitan PO Otonom</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">PO di bawah batas ini diterbitkan langsung oleh Agen Bedrock tanpa persetujuan manual</div>
              </div>
              <span className="font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/15 px-3 py-1 border border-[#CCFF00]/30 rounded-full text-xs shrink-0">
                Rp 50.000.000
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#222232]">
              <div className="max-w-[80%]">
                <div className="font-bold text-white uppercase text-xs">Pencatatan Otomatis SAP Goods Receipt (GR 101)</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Pemicu eksekusi BAPI setelah barcode e-PoD dan muatan terverifikasi 100% cocok</div>
              </div>
              <input
                type="checkbox"
                checked={autoGrEnabled}
                onChange={(e) => setAutoGrEnabled(e.target.checked)}
                className="w-5 h-5 rounded-md border border-[#242436] bg-[#101018] accent-[#CCFF00] cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-black font-black font-display uppercase tracking-wider text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Simpan Perubahan Konfigurasi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
