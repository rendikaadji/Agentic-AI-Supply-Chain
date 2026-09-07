import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Eye, 
  RefreshCcw, 
  ShoppingCart, 
  Truck, 
  PackageCheck,
  Sparkles
} from 'lucide-react';

export default function MultiAgentModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const agents = [
    {
      id: 1,
      name: 'Agen Deteksi Permintaan',
      tech: 'Amazon Bedrock + SageMaker',
      icon: TrendingUp,
      accentColor: '#FFD600',
      description: 'Menganalisis time-series penjualan SAP, sinyal pasar, memproyeksikan kebutuhan 14 hari ke depan.',
      payload: 'Target SKU: BOX-CB-001 | Proyeksi Kebutuhan: +60 Unit | Faktor Musiman: 1.24x',
      status: 'Lonjakan permintaan terdeteksi (+28% risiko lead time)',
    },
    {
      id: 2,
      name: 'Agen Visi Inventaris',
      tech: 'YOLOv8 + Amazon Rekognition',
      icon: Eye,
      accentColor: '#00F0FF',
      description: 'Memproses frame kamera gudang (CAM-01), menghitung stok nyata di rak secara otonom.',
      payload: 'Status 200 OK | Jumlah: 46 Kotak | Keyakinan: 0.925 | Latensi: 34.8ms | Target Rak: Lorong A',
      status: 'Stok fisik riil terkonfirmasi 46 unit',
    },
    {
      id: 3,
      name: 'Agen Rekonsiliasi Stok',
      tech: 'Bedrock Agents + SAP MM',
      icon: RefreshCcw,
      accentColor: '#8A2BE2',
      description: 'Menghitung Safety Stock dinamis dan ROP adaptif, mendeteksi diskrepansi stok semu.',
      payload: 'Saldo SAP: 60 | Fisik: 46 | Defisit: -14 Unit | SS Dinamis: 18 unit | ROP Terpicu!',
      status: 'Defisit terdeteksi! ROP terpicu otomatis',
    },
    {
      id: 4,
      name: 'Agen Disrupsi & Negosiasi',
      tech: 'Bedrock KB (RAG) + SAP Ariba',
      icon: ShoppingCart,
      accentColor: '#FF3366',
      description: 'Rujuk SOP via RAG, negosiasi kuota dan harga secara otomatis dengan 3 vendor rekanan.',
      payload: 'Pemasok: PT Mitra Kemasan Prima | PO #45009821 | Jumlah: 50 Unit | SLA Pengiriman: 48 Jam',
      status: 'PO disetujui & diterbitkan via SAP Ariba',
    },
    {
      id: 5,
      name: 'Agen Rute Logistik',
      tech: 'Amazon Location Service',
      icon: Truck,
      accentColor: '#CCFF00',
      description: 'Optimasi rute multimoda vendor-gudang dan menghindari kemacetan logistik jalan tol.',
      payload: 'Rute: Cikarang -> Marunda Central WH | Jarak: 38.4km | ETA: 2 Jam 15 Menit',
      status: 'Rute optimal terkunci, mitigasi demurrage',
    },
    {
      id: 6,
      name: 'Agen Eksekusi Penerimaan',
      tech: 'AWS IoT Core + SAP BAPI',
      icon: PackageCheck,
      accentColor: '#00F0FF',
      description: 'Memverifikasi geofence armada, validasi e-PoD barcode, eksekusi Goods Receipt (GR) instan.',
      payload: 'SAP BAPI_GOODSMVT_CREATE: Dokumen GR #50012498 dicatat | Saldo SAP bertambah +50 Unit',
      status: 'Siklus Tertutup Selesai! Stok SAP & Fisik sinkron',
    },
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!isSimulating) return;

    if (currentStep <= agents.length) {
      const timer = setTimeout(() => {
        if (currentStep < agents.length) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsSimulating(false);
        }
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isSimulating, agents.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#14141E] border border-[#28283C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#20202F] bg-[#101018] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CCFF00]/15 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.25)] shrink-0">
              <Zap className="w-5 h-5 fill-[#CCFF00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase font-display flex items-center gap-1.5">
                  <span>ORKESTRASI SIKLUS MULTI-AGEN</span>
                  <span className="text-[#FFD600] text-sm">✦</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#8A2BE2]/25 text-[#A855F7] border border-[#8A2BE2]/50 font-mono">
                  6 PILAR OTONOM
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5 hidden xs:block">
                Ujung-ke-Ujung: Amazon Bedrock × YOLOv8 × SAP S/4HANA ERP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {!isSimulating && currentStep === 0 && (
              <button
                onClick={startSimulation}
                className="px-4 py-2 rounded-full bg-[#CCFF00] hover:bg-[#D9FF33] text-black font-black text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-102 cursor-pointer uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                Mulai Simulasi
              </button>
            )}

            {!isSimulating && currentStep > 0 && (
              <button
                onClick={startSimulation}
                className="px-4 py-2 rounded-full bg-[#181826] hover:bg-[#222233] text-white hover:text-[#CCFF00] border border-[#2D2D42] hover:border-[#CCFF00] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer uppercase"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Ulangi Siklus
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#181824] hover:bg-[#FF3366] text-zinc-400 hover:text-white border border-[#2D2D42] flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - 6 Agent Sequence */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-[#0D0D14]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isPast = currentStep > agent.id;
              const isCurrent = currentStep === agent.id;
              const isFuture = currentStep < agent.id;

              return (
                <div
                  key={agent.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#181828] border-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.2)] scale-[1.01]'
                      : isPast
                      ? 'bg-[#14141E] border-[#CCFF00]/40 text-white'
                      : 'bg-[#12121A] border-[#20202E] text-zinc-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        {/* Step Circle Badge */}
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: isCurrent ? '#CCFF00' : isPast ? '#CCFF0020' : '#181824',
                            color: isCurrent ? '#000000' : isPast ? '#CCFF00' : '#71717A',
                            border: `1px solid ${isCurrent ? '#CCFF00' : isPast ? '#CCFF0060' : '#2D2D42'}`
                          }}
                        >
                          {agent.id}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                            {agent.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {agent.tech}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black text-black px-2.5 py-0.5 rounded-full bg-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.5)] animate-pulse">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            AKTIF
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#CCFF00] px-2.5 py-0.5 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/30">
                            <CheckCircle2 className="w-3 h-3" />
                            LULUS
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-[10px] font-mono font-medium text-zinc-500 px-2.5 py-0.5 rounded-full bg-[#181824] border border-[#242436]">
                            ANTREAN
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 font-medium mb-3.5 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  {/* Telemetry Payload Bar */}
                  <div className="p-3 rounded-2xl bg-[#0E0E14] border border-[#242436] font-mono text-[10px] text-zinc-300 flex flex-col gap-1">
                    <span className="text-zinc-400 truncate">
                      Muatan Data: <span className="text-white font-bold">{agent.payload}</span>
                    </span>
                    <span className="text-white font-medium flex items-center gap-1.5 pt-0.5 border-t border-zinc-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></span>
                      Status: {agent.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#20202F] bg-[#101018] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
            <span>Siklus Tertutup Perusahaan: Fisik Gudang &lt;=&gt; SAP S/4HANA ERP</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold bg-[#181826] border border-[#2D2D42] px-3 py-1 rounded-full text-[#CCFF00]">
              {currentStep === 0 && 'SIAP DIJALANKAN'}
              {currentStep > 0 && currentStep <= 6 && `TAHAP ${currentStep} DARI 6 BERJALAN...`}
              {currentStep > 6 && 'SIKLUS 100% SELESAI & TERSINKRONISASI!'}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#181826] hover:bg-[#242438] text-white hover:text-[#CCFF00] border border-[#2D2D42] font-bold transition-all cursor-pointer uppercase text-xs"
            >
              TUTUP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
