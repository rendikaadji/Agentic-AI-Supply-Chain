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
        message: 'RFC Destination S4H_RFC_CONN Active. BAPI_GOODSMVT_CREATE ready.'
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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Settings className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">StockMind AI Enterprise Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Konfigurasi koneksi SAP S/4HANA ERP, model AWS Bedrock, batas toleransi inferensi Computer Vision, dan tata kelola HITL.
            </p>
          </div>
        </div>

        {isSaved && (
          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Konfigurasi Berhasil Disimpan
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: SAP S/4HANA ERP Connection */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">SAP S/4HANA ERP Gateway &amp; Ariba</h3>
            </div>
            <button
              type="button"
              onClick={handleTestSap}
              disabled={isTestingSap}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isTestingSap ? 'animate-spin' : ''}`} />
              <span>{isTestingSap ? 'Testing RFC...' : 'Test Connection'}</span>
            </button>
          </div>

          {sapTestResult && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
              <span>[PASS] {sapTestResult.message}</span>
              <span className="font-bold">Latency: {sapTestResult.ping}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">RFC Destination Host</label>
              <input
                type="text"
                value={sapHost}
                onChange={(e) => setSapHost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Client ID</label>
              <input
                type="text"
                value={sapClient}
                onChange={(e) => setSapClient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">System ID (SID)</label>
              <input
                type="text"
                value={sapSysId}
                onChange={(e) => setSapSysId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AWS Bedrock & Cloud Config */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Amazon Bedrock &amp; Cloud Architecture</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Foundation Model (Bedrock)</label>
              <select
                value={bedrockModel}
                onChange={(e) => setBedrockModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="anthropic.claude-3-5-sonnet-20241022-v2:0">Claude 3.5 Sonnet (Rekomendasi - Superior Reasoning)</option>
                <option value="anthropic.claude-3-haiku-20240307-v1:0">Claude 3 Haiku (Ultra Fast)</option>
                <option value="meta.llama3-70b-instruct-v1:0">Meta Llama 3 70B</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">AWS Region Deployment</label>
              <input
                type="text"
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Vision Agent & YOLOv8 Inference Parameters */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Computer Vision (YOLOv8) Edge Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">
                Confidence Threshold (Default: 0.25)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="font-bold text-cyan-400 w-10 text-right">{confThreshold}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                NMS IoU Threshold (Default: 0.60)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.30"
                  max="0.90"
                  step="0.05"
                  value={iouThreshold}
                  onChange={(e) => setIouThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <span className="font-bold text-purple-400 w-10 text-right">{iouThreshold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Human-in-the-Loop (HITL) Governance Toggles */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Tata Kelola Otonom &amp; Human-in-the-Loop (HITL)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">Ambang Batas Penerbitan PO Otonom</div>
                <div className="text-[11px] text-slate-400">PO di bawah batas ini diterbitkan langsung oleh Bedrock Agent tanpa approval manual</div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">Rp 50.000.000</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">Posting Otomatis SAP Goods Receipt (GR 101)</div>
                <div className="text-[11px] text-slate-400">Pemicu eksekusi BAPI setelah barcode e-PoD dan muatan terverifikasi 100% cocok</div>
              </div>
              <input
                type="checkbox"
                checked={autoGrEnabled}
                onChange={(e) => setAutoGrEnabled(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Konfigurasi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
