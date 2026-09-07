import React, { useState } from 'react';
import { 
  Camera, 
  Eye, 
  RefreshCw, 
  Box, 
  Target, 
  Radio,
  Cpu,
  CheckCircle2,
  Zap,
  Sparkles
} from 'lucide-react';

export default function WarehouseCameraFeed() {
  const [showBoxes, setShowBoxes] = useState(true);
  const [showConf, setShowConf] = useState(true);
  const [scanActive, setScanActive] = useState(true);
  const [selectedCam, setSelectedCam] = useState('CAM-01');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latency, setLatency] = useState(34.8);

  // Exact real-world YOLOv8n (best.pt) inference bounding boxes
  const cameraData = {
    'CAM-01': {
      image: '/warehouse_box_test_0001.jpg',
      zone: 'ZONA-A (Lorong A, Rak-04)',
      sku: 'BOX-CB-001',
      batch: '#WH-2026-09-01',
      boxes: [
        { id: 'BOX-001', label: 'kardus_box', conf: 0.98, top: 25.74, left: 12.82, width: 36.70, height: 12.73, color: 'lime' },
        { id: 'BOX-002', label: 'kardus_box', conf: 1.00, top: 24.05, left: 55.74, width: 32.61, height: 14.23, color: 'lime' },
        { id: 'BOX-003', label: 'kardus_box', conf: 0.97, top: 47.72, left: 13.62, width: 33.47, height: 18.63, color: 'lime' },
        { id: 'BOX-004', label: 'kardus_box', conf: 0.80, top: 50.27, left: 50.96, width: 27.66, height: 16.04, color: 'cyan' },
      ]
    },
    'CAM-02': {
      image: '/warehouse_box_test_0002.jpg',
      zone: 'ZONA-B (Lorong B, Area Palet)',
      sku: 'BOX-CB-001',
      batch: '#WH-2026-09-02',
      boxes: [
        { id: 'BOX-001', label: 'kardus_box', conf: 0.97, top: 25.38, left: 10.66, width: 24.86, height: 12.81, color: 'lime' },
        { id: 'BOX-002', label: 'kardus_box', conf: 1.00, top: 23.58, left: 42.66, width: 19.12, height: 14.56, color: 'lime' },
        { id: 'BOX-003', label: 'kardus_box', conf: 1.00, top: 24.29, left: 68.04, width: 20.75, height: 13.85, color: 'lime' },
        { id: 'BOX-004', label: 'kardus_box', conf: 0.88, top: 53.29, left: 15.04, width: 31.62, height: 13.01, color: 'cyan' },
        { id: 'BOX-005', label: 'kardus_box', conf: 0.93, top: 50.14, left: 54.24, width: 33.87, height: 16.31, color: 'lime' },
      ]
    },
    'CAM-03': {
      image: '/warehouse_box_test_0003.jpg',
      zone: 'ZONA-C (Dok Penerimaan 02)',
      sku: 'BOX-CB-001',
      batch: '#WH-2026-09-03',
      boxes: [
        { id: 'BOX-001', label: 'kardus_box', conf: 1.00, top: 23.38, left: 17.57, width: 19.22, height: 14.70, color: 'lime' },
        { id: 'BOX-002', label: 'kardus_box', conf: 1.00, top: 24.63, left: 36.88, width: 18.98, height: 13.60, color: 'lime' },
        { id: 'BOX-003', label: 'kardus_box', conf: 0.99, top: 18.79, left: 64.16, width: 19.15, height: 19.36, color: 'lime' },
        { id: 'BOX-004', label: 'kardus_box', conf: 0.98, top: 52.69, left: 12.60, width: 23.98, height: 13.54, color: 'lime' },
        { id: 'BOX-005', label: 'kardus_box', conf: 0.99, top: 51.42, left: 37.27, width: 20.67, height: 14.78, color: 'lime' },
        { id: 'BOX-006', label: 'kardus_box', conf: 0.99, top: 48.82, left: 67.53, width: 18.81, height: 17.39, color: 'lime' },
      ]
    }
  };

  const activeCam = cameraData[selectedCam] || cameraData['CAM-01'];
  const currentBoxes = activeCam.boxes;

  const avgConf = (
    currentBoxes.reduce((acc, b) => acc + b.conf, 0) / currentBoxes.length * 100
  ).toFixed(1);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatency(Number((31 + Math.random() * 6).toFixed(1)));
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-[#14141E] border border-[#242436] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Feed Header */}
      <div className="p-4 sm:p-5 border-b border-[#20202F] bg-[#101018] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CCFF00]/15 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <Camera className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight font-display uppercase">
                CCTV GUDANG &amp; AGEN VISI KOMPUTER
              </h3>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF3366]/20 border border-[#FF3366]/50 text-[#FF3366] text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(255,51,102,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-ping"></span>
                RTSP LIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono font-medium">
              Aliran Citra: 640×640 @ 29.97fps • Model: YOLOv8n-Box (best.pt)
            </p>
          </div>
        </div>

        {/* Camera Selector & Toggle Tools */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Cam Selector */}
          <select 
            value={selectedCam}
            onChange={(e) => setSelectedCam(e.target.value)}
            className="flex-1 sm:flex-initial bg-[#181826] border border-[#2D2D42] text-white rounded-full px-3 py-1.5 text-xs font-mono font-bold cursor-pointer focus:border-[#CCFF00] focus:outline-none"
          >
            <option value="CAM-01">CAM-01: Lorong A (Rak-04)</option>
            <option value="CAM-02">CAM-02: Lorong B (Area Palet)</option>
            <option value="CAM-03">CAM-03: Dok Penerimaan 02</option>
          </select>

          {/* Quick HUD toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              title={showBoxes ? "Sembunyikan Kotak Deteksi" : "Tampilkan Kotak Deteksi"}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                showBoxes 
                  ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.4)]' 
                  : 'bg-[#181824] text-zinc-400 border-[#2D2D42] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowConf(!showConf)}
              title={showConf ? "Sembunyikan Label Akurasi" : "Tampilkan Label Akurasi"}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                showConf 
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.4)]' 
                  : 'bg-[#181824] text-zinc-400 border-[#2D2D42] hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setScanActive(!scanActive)}
              title="Nyalakan/Matikan Garis Pemindai Laser"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                scanActive 
                  ? 'bg-[#FFD600] text-black border-[#FFD600] shadow-[0_0_12px_rgba(255,214,0,0.4)]' 
                  : 'bg-[#181824] text-zinc-400 border-[#2D2D42] hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRefresh}
              title="Jalankan Ulang Inferensi"
              disabled={isRefreshing}
              className="w-8 h-8 rounded-full bg-[#181824] hover:bg-[#222233] border border-[#2D2D42] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#CCFF00]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Viewport (Gaya Showreel Card dari referensi) */}
      <div className="p-3 sm:p-5 bg-[#0D0D14] flex items-center justify-center">
        <div className="relative w-full max-w-[560px] aspect-square bg-[#08080C] border border-[#242436] rounded-3xl overflow-hidden group select-none shadow-2xl">
          {/* Underlying Exact 640x640 YOLO Test Image */}
          <img
            src={activeCam.image}
            alt="Aliran Kamera Gudang mendeteksi tumpukan kardus"
            className="w-full h-full object-contain block opacity-90 group-hover:opacity-100 transition-opacity"
          />

          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Laser Scanner Line (Neon Lime) */}
          {scanActive && (
            <div className="absolute inset-x-0 h-1 bg-[#CCFF00] shadow-[0_0_16px_#CCFF00] animate-laser pointer-events-none opacity-90" />
          )}

          {/* Top HUD Camera Overlays */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#CCFF00]/40 text-[11px] font-mono font-bold text-[#CCFF00] flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping"></span>
              YOLOv8 EDGE
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-white">
              {selectedCam}
            </div>
          </div>

          <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#CCFF00] text-black text-[11px] font-mono font-black pointer-events-none shadow-[0_0_15px_rgba(204,255,0,0.35)]">
            AKURASI &gt;= 0.25 (LULUS)
          </div>

          {/* Center Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-16 h-16 border border-white/60 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full"></div>
            </div>
            <div className="absolute w-32 h-[1px] bg-white/40"></div>
            <div className="absolute h-32 w-[1px] bg-white/40"></div>
          </div>

          {/* Exact YOLOv8 Bounding Boxes Overlay */}
          {showBoxes && (
            <div className="absolute inset-0 pointer-events-none">
              {currentBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute transition-all duration-300"
                  style={{
                    top: `${box.top}%`,
                    left: `${box.left}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                >
                  <div className="w-full h-full border-2 border-[#CCFF00] bg-[#CCFF00]/15 relative rounded-sm shadow-[0_0_12px_rgba(204,255,0,0.25)]">
                    {/* Corner Precision Brackets */}
                    <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white"></span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white"></span>
                    <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white"></span>
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white"></span>

                    {/* Confidence Label Tag */}
                    {showConf && (
                      <div className="absolute -top-6 left-0 px-2 py-0.5 rounded-full bg-black/90 border border-[#CCFF00] text-[10px] font-mono font-bold text-[#CCFF00] whitespace-nowrap shadow-md flex items-center gap-1">
                        <span>{box.label}</span>
                        <span className="bg-[#CCFF00] text-black px-1.5 rounded-full text-[9px] font-black">
                          {box.conf.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Box ID Tag */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-mono font-black text-black bg-[#CCFF00] px-1.5 py-0.2 rounded-md shadow-md">
                        #{box.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Telemetry HUD Bar (Pill Transparan) */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full shadow-lg gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="text-black font-black bg-[#CCFF00] px-2 py-0.5 rounded-full text-[10px] shrink-0">
                {activeCam.sku}
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="font-medium hidden sm:inline truncate">{activeCam.batch}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-zinc-400 hidden md:inline truncate">{activeCam.zone}</span>
              <span className="bg-[#8A2BE2]/30 text-[#A855F7] border border-[#8A2BE2]/50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                {currentBoxes.length} KOTAK
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Vision Metrics Directly Below Camera Feed */}
      <div className="p-4 sm:p-5 bg-[#101018] border-t border-[#20202F] grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-2xl bg-[#14141E] border border-[#242436] hover:border-zinc-600 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span className="uppercase text-[11px] font-bold">Total Terdeteksi</span>
            <div className="w-6 h-6 rounded-lg bg-[#CCFF00]/15 text-[#CCFF00] flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">46</span>
            <span className="text-xs font-bold text-zinc-400">Kotak</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">
            Kamera {selectedCam}: <strong className="text-zinc-300">{currentBoxes.length} terlihat</strong>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-2xl bg-[#14141E] border border-[#242436] hover:border-zinc-600 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span className="uppercase text-[11px] font-bold">Akurasi Rerata</span>
            <div className="w-6 h-6 rounded-lg bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{avgConf}%</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#00F0FF]/20 text-[#00F0FF] rounded-full font-mono font-bold">TINGGI</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">Batas &gt;= 0.25 (Lulus)</p>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-2xl bg-[#14141E] border border-[#242436] hover:border-zinc-600 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span className="uppercase text-[11px] font-bold">Latensi Inferensi</span>
            <div className="w-6 h-6 rounded-lg bg-[#FFD600]/15 text-[#FFD600] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{latency}</span>
            <span className="text-xs font-mono text-zinc-400">ms</span>
            <span className="text-[10px] font-mono bg-[#CCFF00]/15 text-[#CCFF00] px-1.5 rounded-full ml-auto font-bold">&lt; 50ms</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">Edge YOLOv8n Worker</p>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-2xl bg-[#14141E] border border-[#242436] hover:border-zinc-600 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span className="uppercase text-[11px] font-bold">Presisi (mAP@50)</span>
            <div className="w-6 h-6 rounded-lg bg-[#8A2BE2]/20 text-[#A855F7] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">99.5%</span>
            <span className="text-[10px] font-mono text-zinc-400">IoU=0.50</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">Target &gt;= 85% TERPENUHI</p>
        </div>
      </div>
    </div>
  );
}
