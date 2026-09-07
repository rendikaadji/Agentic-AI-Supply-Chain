import React from 'react';
import { 
  AlertOctagon, 
  Clock, 
  CheckCheck, 
  BadgePercent, 
  ArrowDownRight, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  TrendingDown
} from 'lucide-react';

export default function KpiCards() {
  const cards = [
    {
      title: 'Stockout Events',
      target: 'Turun 85%',
      current: '8 - 14 / kuartal',
      label: 'Target Penurunan',
      change: '-85.0%',
      changeType: 'positive',
      icon: AlertOctagon,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20 hover:border-rose-500/40',
      gradient: 'from-rose-500/5 to-transparent',
      progress: 85,
      note: 'Mitigasi phantom inventory via vision scanning',
    },
    {
      title: 'Procure-to-Pay Time',
      target: '< 3 Jam',
      current: '4 - 7 hari kerja',
      label: 'Kecepatan Siklus',
      change: '97.2% Cepat',
      changeType: 'positive',
      icon: Clock,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
      gradient: 'from-cyan-500/5 to-transparent',
      progress: 96,
      note: 'Otomatisasi RFQ & SAP Ariba PoD matching',
    },
    {
      title: 'Stock Accuracy',
      target: '99.5%',
      current: '80% - 85% (Fisik vs SAP)',
      label: 'Presisi Inventaris',
      change: '+16.5% Akurasi',
      changeType: 'positive',
      icon: CheckCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
      gradient: 'from-emerald-500/5 to-transparent',
      progress: 99.5,
      note: 'YOLOv8 Edge inferensi + DynamoDB log realtime',
    },
    {
      title: 'Logistics Inbound Cost',
      target: 'Hemat 22 - 25%',
      current: 'Overhead demurrage 19%',
      label: 'Efisiensi Angkutan',
      change: 'Hemat 24.1%',
      changeType: 'positive',
      icon: TrendingDown,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20 hover:border-purple-500/40',
      gradient: 'from-purple-500/5 to-transparent',
      progress: 78,
      note: 'Dynamic multimodal route mitigasi kongesti dock',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${card.gradient} bg-slate-900/60 border ${card.borderColor} p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/50 group`}
          >
            {/* Ambient subtle glow top-right */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/[0.03] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-black tracking-tight text-white font-mono">
                    {card.target}
                  </h3>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor} border border-white/5`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Baseline comparison */}
            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Baseline Saat Ini:</span>
                <span className="font-medium text-slate-300 font-mono">{card.current}</span>
              </div>

              {/* Progress bar indication */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    idx === 0 ? 'bg-rose-500' :
                    idx === 1 ? 'bg-cyan-400' :
                    idx === 2 ? 'bg-emerald-400' : 'bg-purple-400'
                  }`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span className="truncate max-w-[190px] text-slate-400">{card.note}</span>
                <span className="inline-flex items-center gap-0.5 font-bold font-mono text-emerald-400">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
