import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  DollarSign, 
  Building2, 
  Send,
  Zap,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function ProcurementView() {
  const [poStatus, setPoStatus] = useState('Issued');
  const [hitlApproved, setHitlApproved] = useState(false);

  const vendors = [
    {
      id: 1,
      name: 'PT Mitra Kemasan Prima',
      location: 'Cikarang Barat, Bekasi',
      price: 'Rp 370.000',
      leadTime: '48 Jam (2 Hari)',
      quality: '98.5%',
      selected: true,
      reason: 'Harga terendah setelah negosiasi AI (-4.2%) dan SLA kedatangan tercepat.',
      border: 'border-emerald-500/50 bg-emerald-500/5'
    },
    {
      id: 2,
      name: 'CV Sumber Karton Abadi',
      location: 'Tangerang Industrial Estate',
      price: 'Rp 385.000',
      leadTime: '72 Jam (3 Hari)',
      quality: '94.0%',
      selected: false,
      reason: 'Lead time melebihi toleransi Safety Stock kritis.',
      border: 'border-slate-800 bg-slate-950/40 opacity-70'
    },
    {
      id: 3,
      name: 'PT Packindo Sejahtera Perkasa',
      location: 'Karawang Timur',
      price: 'Rp 392.000',
      leadTime: '96 Jam (4 Hari)',
      quality: '92.1%',
      selected: false,
      reason: 'Tidak menyetujui klausul penalti demurrage logistik.',
      border: 'border-slate-800 bg-slate-950/40 opacity-70'
    },
  ];

  const negotiationChat = [
    { sender: 'StockMind Agent (Bedrock)', time: '14:15:02', text: 'Mengirimkan RFQ Otomatis #RFQ-2026-09-88: Kebutuhan 50 Bundle Cardboard Box (SKU: BOX-CB-001). Target harga: Rp 365.000/bundle, ETA: 48 Jam.' },
    { sender: 'PT Mitra Kemasan (Vendor API)', time: '14:16:30', text: 'Penawaran awal kami Rp 386.000/bundle untuk pengiriman 48 jam karena adanya lonjakan biaya pulp packaging.' },
    { sender: 'StockMind Agent (Bedrock KB RAG)', time: '14:17:15', text: 'Merujuk Kontrak Payung Korporat (SOP-PROC-2025-V2): Volume pembelian Q3 berhak atas tier diskon 4%. Kami menawarkan Rp 370.000/bundle dengan komitmen pembayaran 14 hari.' },
    { sender: 'PT Mitra Kemasan (Vendor API)', time: '14:18:40', text: 'Tawaran diterima. Harga final disepakati Rp 370.000/bundle. Total Rp 18.500.000. Dokumen PO siap ditandatangani secara digital.' },
    { sender: 'StockMind Agent (Ariba Integration)', time: '14:19:10', text: 'Penerbitan Purchase Order #45009821 berhasil dieksekusi di SAP Ariba Network. Dokumen diteruskan ke Logistics Route Agent.' },
  ];

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pillar 4: Disruption &amp; Negotiation Agent</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
                Amazon Bedrock Knowledge Bases + SAP Ariba
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Otonomi pengadaan darurat: RAG pencarian SOP, negosiasi harga terotomasi, dan penerbitan PO instan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>P2P Velocity: <strong className="text-emerald-400">2 Jam 4 Mnt</strong> (&lt; 3 Jam Target)</span>
          </div>
        </div>
      </div>

      {/* 3-Tier Supplier Bidding Comparison */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-white">Evaluasi Multi-Vendor &amp; Penawaran Otonom (RFQ)</h3>
            <p className="text-xs text-slate-400 font-mono">Bedrock Agent menguji 3 rekanan terdaftar secara paralel</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">RFQ #2026-09-88</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <div
              key={v.id}
              className={`p-5 rounded-xl border transition-all relative ${v.border}`}
            >
              {v.selected && (
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Pemenang Tender
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <h4 className="text-xs font-bold text-white truncate">{v.name}</h4>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mb-3">{v.location}</div>

              <div className="space-y-2 py-2 border-y border-slate-800/80 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Harga Penawaran:</span>
                  <strong className={v.selected ? 'text-emerald-400' : 'text-slate-200'}>{v.price}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Time:</span>
                  <strong className="text-slate-200">{v.leadTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Skor Kualitas Vendor:</span>
                  <strong className="text-cyan-400">{v.quality}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                {v.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Autonomous Negotiation Transcript & Purchase Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Negotiation Chat Console */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Transkrip Negosiasi Otonom (RAG Assisted)</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Ariba API WebSocket
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[320px] pr-2">
              {negotiationChat.map((msg, idx) => {
                const isAgent = msg.sender.includes('StockMind');
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isAgent
                        ? 'bg-slate-950/80 border-cyan-500/30 ml-4'
                        : 'bg-slate-900 border-slate-700/60 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={isAgent ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                        {msg.sender}
                      </span>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{msg.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Negosiasi Selesai: Hemat Rp 800.000 vs harga awal
            </span>
            <span className="font-mono text-slate-500">Duration: 4m 08s</span>
          </div>
        </div>

        {/* PO Document Summary & HITL Governance */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Purchase Order (PO) SAP</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                {poStatus.toUpperCase()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 font-mono text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">PO Number:</span>
                <span className="font-bold text-white">#45009821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vendor:</span>
                <span className="text-slate-200">PT Mitra Kemasan Prima</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Material / SKU:</span>
                <span className="text-cyan-400 font-bold">BOX-CB-001 (50 Bundles)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Nilai PO:</span>
                <span className="text-emerald-400 font-bold text-sm">Rp 18.500.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Kedatangan:</span>
                <span className="text-slate-200">08 Sep 2026, 14:00 WIB</span>
              </div>
            </div>

            {/* Human-in-the-Loop Governance Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Tata Kelola Human-in-the-Loop (HITL)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Ambang Batas: &lt; Rp 50M
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nilai PO berada di bawah batas kewenangan manajerial Rp 50.000.000. Eksekusi otonom diizinkan tanpa intervensi manual sesuai SOP Korporat.
              </p>
              
              <button
                onClick={() => setHitlApproved(!hitlApproved)}
                className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 ${
                  hitlApproved
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{hitlApproved ? 'Tervalidasi oleh Procurement Head' : 'Tambahkan Tanda Tangan Manajer (Opsional)'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>SAP MM Order Status: EINKAUF_OK</span>
            <span>Handover: Logistics Route Agent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
