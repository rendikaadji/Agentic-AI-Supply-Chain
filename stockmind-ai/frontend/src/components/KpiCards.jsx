import React from 'react';
import { 
  AlertOctagon, 
  Clock, 
  CheckCheck, 
  TrendingDown, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function KpiCards() {
  const cards = [
    {
      title: 'Kejadian Stok Kosong',
      target: 'Turun 85%',
      current: '8 - 14 / kuartal',
      label: 'Target Penurunan',
      change: '-85.0%',
      icon: AlertOctagon,
      accentColor: '#FF3366', // Sunset Coral
      progress: 85,
      note: 'Mitigasi stok semu via Computer Vision',
    },
    {
      title: 'Kecepatan Siklus P2P',
      target: '< 3 Jam',
      current: '4 - 7 hari kerja',
      label: 'Kecepatan Siklus',
      change: '97.2% Lebih Cepat',
      icon: Clock,
      accentColor: '#CCFF00', // Electric Lime
      progress: 96,
      note: 'Otomatisasi RFQ & SAP Ariba PoD',
    },
    {
      title: 'Akurasi Stok (Fisik vs SAP)',
      target: '99.5%',
      current: '80% - 85% (Fisik vs SAP)',
      label: 'Presisi Inventaris',
      change: '+16.5% Akurasi',
      icon: CheckCheck,
      accentColor: '#00F0FF', // Vivid Cyan
      progress: 99.5,
      note: 'YOLOv8 Edge + DynamoDB real-time',
    },
    {
      title: 'Efisiensi Logistik Masuk',
      target: 'Hemat 24.1%',
      current: 'Demurrage 19%',
      label: 'Efisiensi Angkutan',
      change: 'Hemat Rp 142.8M',
      icon: TrendingDown,
      accentColor: '#8A2BE2', // Cyber Purple
      progress: 78,
      note: 'Rute multimoda dinamis mitigasi kongesti',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-[#14141E] border border-[#242436] hover:border-[#34344E] rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Subtle top glow line */}
            <div 
              className="absolute top-0 inset-x-8 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: card.accentColor }}
            />

            {/* Top Card Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${card.accentColor}18`,
                    border: `1px solid ${card.accentColor}40`,
                    color: card.accentColor 
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="w-7 h-7 rounded-full bg-[#181824] border border-[#242436] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-[#CCFF00] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                {card.title}
              </span>

              {/* Target Metric Value */}
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display mt-1">
                {card.target}
              </div>

              {/* Kondisi Awal */}
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mt-2">
                <span>Kondisi Awal:</span>
                <span className="font-mono text-zinc-300 font-bold bg-[#181824] px-2.5 py-0.5 border border-[#262638] rounded-full text-[11px]">
                  {card.current}
                </span>
              </div>
            </div>

            {/* Progress Bar & Note */}
            <div className="space-y-2.5 mt-5 pt-3 border-t border-[#1F1F2E]">
              <div className="w-full bg-[#181824] border border-[#242436] rounded-full h-2.5 overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${card.progress}%`,
                    backgroundColor: card.accentColor,
                    boxShadow: `0 0 10px ${card.accentColor}60`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[150px] text-[11px] text-zinc-500 font-medium">
                  {card.note}
                </span>
                <span 
                  className="inline-flex items-center gap-1 font-black font-mono text-[11px] px-2.5 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: `${card.accentColor}20`,
                    color: card.accentColor,
                    border: `1px solid ${card.accentColor}40`
                  }}
                >
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
