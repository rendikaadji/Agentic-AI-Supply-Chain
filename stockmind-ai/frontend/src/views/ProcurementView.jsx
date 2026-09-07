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
  const [poStatus, setPoStatus] = useState('Diterbitkan');
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
      reason: 'Harga terendah setelah negosiasi AI (-4.2%) dan SLA kedatangan tercepat sesuai matriks.',
    },
    {
      id: 2,
      name: 'CV Sumber Karton Abadi',
      location: 'Tangerang Industrial Estate',
      price: 'Rp 385.000',
      leadTime: '72 Jam (3 Hari)',
      quality: '94.0%',
      selected: false,
      reason: 'Lead time melebihi toleransi Safety Stock kritis Marunda DC.',
    },
    {
      id: 3,
      name: 'PT Packindo Sejahtera Perkasa',
      location: 'Karawang Timur',
      price: 'Rp 392.000',
      leadTime: '96 Jam (4 Hari)',
      quality: '92.1%',
      selected: false,
      reason: 'Tidak menyetujui klausul penalti demurrage logistik & syarat SLA.',
    },
  ];

  const negotiationChat = [
    { sender: 'StockMind Agent (Bedrock)', time: '14:15:02', text: 'Mengirimkan RFQ Otomatis #RFQ-2026-09-88: Kebutuhan 50 Bundle Cardboard Box (SKU: BOX-CB-001). Target harga: Rp 365.000/bundle, ETA: 48 Jam.' },
    { sender: 'PT Mitra Kemasan (Vendor API)', time: '14:16:30', text: 'Penawaran awal kami Rp 386.000/bundle untuk pengiriman 48 jam karena adanya lonjakan biaya pulp packaging global.' },
    { sender: 'StockMind Agent (Bedrock KB RAG)', time: '14:17:15', text: 'Merujuk Kontrak Payung Korporat (SOP-PROC-2025-V2): Volume pembelian Q3 berhak atas tier diskon 4%. Kami menawarkan Rp 370.000/bundle dengan komitmen pembayaran 14 hari.' },
    { sender: 'PT Mitra Kemasan (Vendor API)', time: '14:18:40', text: 'Tawaran diterima. Harga final disepakati Rp 370.000/bundle. Total Rp 18.500.000. Dokumen PO siap ditandatangani secara digital.' },
    { sender: 'StockMind Agent (Ariba Integration)', time: '14:19:10', text: 'Penerbitan Purchase Order #45009821 berhasil dieksekusi di SAP Ariba Network. Dokumen diteruskan ke Logistics Route Agent.' },
  ];

  return (
    <div className="space-y-6">
      {/* Subsystem Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14141E] border border-[#242436] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF3366] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,51,102,0.3)] shrink-0">
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wide">
                Pilar 4: Agen Disrupsi &amp; Negosiasi Otonom
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#8A2BE2] text-white font-mono text-[10px] font-black uppercase shadow-[0_0_10px_rgba(138,43,226,0.3)]">
                Bedrock KB + SAP Ariba
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Otonomi pengadaan darurat: RAG pencarian SOP, negosiasi harga terotomasi, dan penerbitan PO instan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#101018] border border-[#242436] text-xs font-mono text-zinc-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFD600]" />
            <span>Kecepatan P2P: <strong className="text-[#CCFF00]">2 Jam 4 Mnt</strong> (Target &lt; 3 Jam)</span>
          </div>
        </div>
      </div>

      {/* 3-Tier Supplier Bidding Comparison */}
      <div className="bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#242436]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black font-display text-white uppercase tracking-wide">
                Evaluasi Multi-Vendor &amp; Penawaran Otonom (RFQ)
              </h3>
              <span className="text-[#CCFF00] text-xs">✦</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Bedrock Agent menguji 3 rekanan terdaftar secara paralel via REST API &amp; Knowledge Base
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-bold uppercase">
            RFQ #2026-09-88
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vendors.map((v) => (
            <div
              key={v.id}
              className={`p-5 rounded-2xl transition-all relative ${
                v.selected 
                  ? 'bg-gradient-to-br from-[#1C182A] to-[#251838] border-2 border-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.15)] -translate-y-1' 
                  : 'bg-[#101018] border border-[#222232] opacity-85 hover:opacity-100 hover:border-[#3D3D5A]'
              }`}
            >
              {v.selected && (
                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-[#CCFF00] text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.4)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Pemenang Tender
                </span>
              )}

              <div className="flex items-center gap-2 mb-1">
                <Building2 className={`w-4 h-4 ${v.selected ? 'text-[#CCFF00]' : 'text-zinc-400'}`} />
                <h4 className="text-sm font-black font-display text-white truncate">{v.name}</h4>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mb-3">{v.location}</div>

              <div className="space-y-2 py-3 border-y border-[#242436] text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Harga Penawaran:</span>
                  <strong className={`font-black text-sm ${v.selected ? 'text-[#CCFF00]' : 'text-zinc-200'}`}>
                    {v.price}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Waktu Tunggu:</span>
                  <strong className="text-zinc-200 font-bold">{v.leadTime}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Skor Kualitas:</span>
                  <strong className="text-[#00F0FF] font-bold bg-[#00F0FF]/15 px-2 py-0.5 rounded-full border border-[#00F0FF]/30 text-[11px]">
                    {v.quality}
                  </strong>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-medium">
                {v.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Autonomous Negotiation Transcript & Purchase Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Negotiation Chat Console */}
        <div className="lg:col-span-7 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242436]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF] text-black flex items-center justify-center font-black shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-display text-white uppercase tracking-wide">
                    Transkrip Negosiasi Otonom
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">Berbantuan Bedrock KB RAG</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#101018] text-[#00F0FF] border border-[#00F0FF]/30">
                Ariba API WebSocket
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
              {negotiationChat.map((msg, idx) => {
                const isAgent = msg.sender.includes('StockMind');
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl text-xs space-y-1.5 transition-all ${
                      isAgent
                        ? 'bg-[#151D2A] border border-[#00F0FF]/30 ml-4'
                        : 'bg-[#101018] border border-[#242436] mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/5 pb-1">
                      <span className={`font-black uppercase tracking-wider ${isAgent ? 'text-[#00F0FF]' : 'text-zinc-300'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-zinc-500 font-bold">{msg.time}</span>
                    </div>
                    <p className="text-zinc-200 font-medium leading-relaxed text-xs">{msg.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#242436] flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" /> Hemat Rp 800.000 (-4.2%) vs tarif awal
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold">Durasi: 4m 08s</span>
          </div>
        </div>

        {/* PO Document Summary & HITL Governance */}
        <div className="lg:col-span-5 bg-[#14141E] border border-[#242436] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF3366] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,51,102,0.3)]">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black font-display text-white uppercase tracking-wide">
                  Pesanan Pembelian (PO) SAP
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-[#CCFF00] text-black font-black uppercase shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                {poStatus.toUpperCase()}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#101018] border border-[#242436] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Nomor PO:</span>
                <span className="font-black text-white bg-zinc-800 px-2.5 py-0.5 rounded-full">#45009821</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Pemasok / Rekanan:</span>
                <span className="text-zinc-200 font-bold">PT Mitra Kemasan Prima</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Material / SKU:</span>
                <span className="text-[#FFD600] font-bold">BOX-CB-001 (50 Bundles)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Nilai PO:</span>
                <span className="text-[#CCFF00] font-black text-sm">Rp 18.500.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Target Kedatangan:</span>
                <span className="text-zinc-300">08 Sep 2026, 14:00 WIB</span>
              </div>
            </div>

            {/* Human-in-the-Loop Governance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C182A] to-[#251838] border border-[#8A2BE2]/40 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-white uppercase flex items-center gap-1.5 font-display">
                  <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                  Tata Kelola HITL Korporat
                </span>
                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/15 border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-full font-bold">
                  Batas Otonom: &lt; Rp 50M
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Nilai PO berada di bawah batas otorisasi manajerial Rp 50.000.000. Eksekusi otonom diizinkan tanpa intervensi manual sesuai SOP Korporat.
              </p>
              
              <button
                onClick={() => setHitlApproved(!hitlApproved)}
                className={`w-full py-3 px-4 rounded-full font-black uppercase text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  hitlApproved
                    ? 'bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                    : 'bg-[#101018] hover:bg-[#181826] text-white border border-[#242436] hover:border-zinc-500'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{hitlApproved ? 'Tervalidasi: Kepala Pengadaan Menyetujui' : 'Tambahkan Tanda Tangan Manajer (Opsional)'}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#242436] text-[11px] font-mono text-zinc-500 flex justify-between font-bold">
            <span>Status SAP MM: EINKAUF_OK</span>
            <span className="text-zinc-400">Berikutnya: Agen Rute Logistik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
