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
  Cpu,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';

export default function MultiAgentModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const agents = [
    {
      id: 1,
      name: 'Demand Sensing Agent',
      tech: 'Amazon Bedrock + SageMaker',
      icon: TrendingUp,
      color: 'cyan',
      description: 'Menganalisis time-series penjualan SAP, sinyal pasar, memproyeksikan kebutuhan 14 hari ke depan.',
      payload: 'Target SKU: BOX-CB-001 | Proyeksi Kebutuhan: +60 Units | Seasonality factor: 1.24x',
      status: 'Demand spike terdeteksi (+28% lead time risk)',
    },
    {
      id: 2,
      name: 'Vision Inventory Agent',
      tech: 'YOLOv8 + Amazon Rekognition',
      icon: Eye,
      color: 'emerald',
      description: 'Memproses frame kamera gudang (CAM-01), menghitung stok nyata di rak secara otonom.',
      payload: 'Status 200 OK | Count: 46 Boxes | Conf: 0.925 | Latency: 34.8ms | Target Rak: Aisle A',
      status: 'Stok fisik riil terkonfirmasi 46 unit',
    },
    {
      id: 3,
      name: 'Stock Reconciliation Agent',
      tech: 'Bedrock Agents + SAP MM',
      icon: RefreshCcw,
      color: 'blue',
      description: 'Menghitung Safety Stock dinamis dan ROP adaptif, mendeteksi phantom inventory discrepancy.',
      payload: 'SAP Saldo: 60 | Fisik: 46 | Defisit: -14 Units | Dynamic SS: 18 units | ROP Triggered!',
      status: 'Defisit terdeteksi! ROP terpicu otomatis',
    },
    {
      id: 4,
      name: 'Disruption & Negotiation Agent',
      tech: 'Bedrock KB (RAG) + SAP Ariba',
      icon: ShoppingCart,
      color: 'purple',
      description: 'Rujuk SOP via RAG, negosiasi kuota dan harga secara otomatis dengan 3 vendor rekanan.',
      payload: 'Vendor: PT Mitra Kemasan Prima | PO #45009821 | Qty: 50 Units | SLA Pengiriman: 48 Jam',
      status: 'PO disetujui & diterbitkan via SAP Ariba',
    },
    {
      id: 5,
      name: 'Logistics Route Agent',
      tech: 'Amazon Location Service',
      icon: Truck,
      color: 'amber',
      description: 'Optimasi rute multimoda vendor-gudang dan menghindari kemacetan logistik jalan tol.',
      payload: 'Route: Cikarang -> Marunda Central WH | Distance: 38.4km | ETA: 2 Jam 15 Menit',
      status: 'Rute optimal terkunci, mitigasi demurrage',
    },
    {
      id: 6,
      name: 'Inbound Execution Agent',
      tech: 'AWS IoT Core + SAP BAPI',
      icon: PackageCheck,
      color: 'emerald',
      description: 'Memverifikasi geofence armada, validasi e-PoD barcode, eksekusi Goods Receipt (GR) instan.',
      payload: 'SAP BAPI_GOODSMVT_CREATE: GR Doc #50012498 posted | Saldo SAP bertambah +50 Units',
      status: 'Closed Loop Selesai! Stok SAP & Fisik sinkron',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0B0F19] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400">
              <Zap className="w-5 h-5 text-cyan-300 fill-cyan-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Autonomous Multi-Agent Cycle Orchestration
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  6-Pillar Closed Loop
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Orchestration: Amazon Bedrock × Rekognition × SAP S/4HANA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSimulating && currentStep === 0 && (
              <button
                onClick={startSimulation}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                Start Live Simulation
              </button>
            )}

            {!isSimulating && currentStep > 0 && (
              <button
                onClick={startSimulation}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Re-Run Cycle
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - 6 Agent Sequence */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isPast = currentStep > agent.id;
              const isCurrent = currentStep === agent.id;
              const isFuture = currentStep < agent.id;

              return (
                <div
                  key={agent.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/60 scale-[1.01]'
                      : isPast
                      ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">Pillar #{agent.id}</span>
                          <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400/90">{agent.tech}</span>
                      </div>
                    </div>

                    <div>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/20 animate-pulse border border-cyan-500/40">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ORCHESTRATING
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          COMPLETED
                        </span>
                      )}
                      {isFuture && (
                        <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Telemetry Payload Bar */}
                  <div className="p-2 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-[10px] text-slate-300 flex flex-col gap-1">
                    <span className="text-slate-400">Payload: <span className="text-slate-200">{agent.payload}</span></span>
                    <span className="text-emerald-400 font-semibold">Status: {agent.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Enterprise Closed Loop: Data Fisik Gudang &lt;=&gt; SAP S/4HANA ERP</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-cyan-400">
              {currentStep === 0 && 'Ready to launch'}
              {currentStep > 0 && currentStep <= 6 && `Executing Stage ${currentStep} of 6...`}
              {currentStep > 6 && 'Cycle 100% Complete & Synchronized!'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
