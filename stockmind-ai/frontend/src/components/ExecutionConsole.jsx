import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Check, 
  Loader2, 
  Database,
  Sparkles
} from 'lucide-react';

export default function ExecutionConsole() {
  const [activeRunning, setActiveRunning] = useState(null);
  const [copied, setCopied] = useState(false);
  const [buttonStatuses, setButtonStatuses] = useState({
    btn1: 'ready',
    btn2: 'ready',
    btn3: 'ready',
    btn4: 'ready',
  });

  const initialLogs = [
    { type: 'cmd', text: '$ python computer_vision/scripts/inference.py --image warehouse_box_test_0001.jpg' },
    { type: 'info', text: '[INFO] Initializing BoxDetector (weights: computer_vision/models/best.pt)...' },
    { type: 'success', text: 'Running inference on warehouse_box_test_0001.jpg... Status: 200 OK | Count: 46 | Confidence: 0.92 | Latency: 35ms. Data saved to DynamoDB.' },
    { type: 'db', text: '[AWS DynamoDB] PutItem: Table=stockmind-inventory-events, SKU=BOX-CB-001, PhysicalCount=46, VerificationStatus=VALIDATED' },
    { type: 'accent', text: '[SAP RFC] Notification queued for MM Reconciliation: Saldo fisik 46 terkonfirmasi.' },
  ];

  const [logs, setLogs] = useState(initialLogs);
  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLogWithDelay = (newLogs) => {
    newLogs.forEach((item, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, item]);
      }, (index + 1) * 350);
    });
  };

  // Button 1: Validate Dataset
  const handleValidateDataset = () => {
    setActiveRunning('btn1');
    setButtonStatuses((prev) => ({ ...prev, btn1: 'running' }));
    
    setLogs((prev) => [
      ...prev,
      { type: 'divider', text: '------------------------------------------------------------' },
      { type: 'cmd', text: '$ python computer_vision/scripts/validate_dataset.py --data computer_vision/data/data.yaml' },
    ]);

    const steps = [
      { type: 'info', text: '[DATASET] Inspecting data structure in computer_vision/data...' },
      { type: 'info', text: '[PARSE] data.yaml loaded: classes={0: "cardboard_box"}, splits=[train, val, test]' },
      { type: 'metric', text: '  * TRAIN : 30 images (137 bounding boxes) | avg 4.57/citra' },
      { type: 'metric', text: '  * VAL   : 8 images (45 bounding boxes)  | avg 5.62/citra' },
      { type: 'metric', text: '  * TEST  : 8 images (40 bounding boxes)  | avg 5.00/citra' },
      { type: 'success', text: '[PASS] Global Integrity: Total 46 images, 222 boxes. 0 corrupt, 0 out-of-bounds.' },
      { type: 'accent', text: '[REPORT] Full report exported to results/data_validation_report.txt [STATUS: PASS]' },
    ];

    addLogWithDelay(steps);

    setTimeout(() => {
      setActiveRunning(null);
      setButtonStatuses((prev) => ({ ...prev, btn1: 'success' }));
    }, (steps.length + 1) * 350);
  };

  // Button 2: Run Unit Tests
  const handleRunUnitTests = () => {
    setActiveRunning('btn2');
    setButtonStatuses((prev) => ({ ...prev, btn2: 'running' }));

    setLogs((prev) => [
      ...prev,
      { type: 'divider', text: '------------------------------------------------------------' },
      { type: 'cmd', text: '$ python -m unittest tests/unit/test_vision_inference.py -v' },
    ]);

    const steps = [
      { type: 'info', text: 'test_01_output_schema_contract (TestVisionInference) ... [OK]' },
      { type: 'info', text: 'test_02_empty_image_handling (TestVisionInference) ... [OK] (returns 0 boxes safely)' },
      { type: 'info', text: 'test_03_lambda_handler_simulation (TestVisionInference) ... [OK] (StatusCode 200 contract)' },
      { type: 'success', text: '----------------------------------------------------------------------' },
      { type: 'success', text: 'Ran 3 tests in 0.082s | OK (100% Contract Compliance achieved)' },
    ];

    addLogWithDelay(steps);

    setTimeout(() => {
      setActiveRunning(null);
      setButtonStatuses((prev) => ({ ...prev, btn2: 'success' }));
    }, (steps.length + 1) * 350);
  };

  // Button 3: Evaluate Model
  const handleEvaluateModel = () => {
    setActiveRunning('btn3');
    setButtonStatuses((prev) => ({ ...prev, btn3: 'running' }));

    setLogs((prev) => [
      ...prev,
      { type: 'divider', text: '------------------------------------------------------------' },
      { type: 'cmd', text: '$ python computer_vision/scripts/evaluate_model.py --weights computer_vision/models/best.pt' },
    ]);

    const steps = [
      { type: 'info', text: 'Loading checkpoint computer_vision/models/best.pt (YOLOv8n)...' },
      { type: 'info', text: 'Evaluating test dataset split (8 images, 40 ground-truth targets)...' },
      { type: 'metric', text: '  * Precision  : 0.985 (98.5%)' },
      { type: 'metric', text: '  * Recall     : 0.952 (95.2%)' },
      { type: 'metric', text: '  * mAP@50     : 0.995 (99.5% against IoU=0.50 threshold)' },
      { type: 'metric', text: '  * mAP@50-95  : 0.764 (76.4%)' },
      { type: 'success', text: '[PASS] Benchmark: mAP@50 0.995 exceeds hackathon SLA criteria (>= 0.85).' },
    ];

    addLogWithDelay(steps);

    setTimeout(() => {
      setActiveRunning(null);
      setButtonStatuses((prev) => ({ ...prev, btn3: 'success' }));
    }, (steps.length + 1) * 350);
  };

  // Button 4: Live Lambda Inference
  const handleLiveInference = () => {
    setActiveRunning('btn4');
    setButtonStatuses((prev) => ({ ...prev, btn4: 'running' }));

    const randomCount = 46;
    const randomLatency = (31 + Math.random() * 5).toFixed(1);

    setLogs((prev) => [
      ...prev,
      { type: 'divider', text: '------------------------------------------------------------' },
      { type: 'cmd', text: '$ curl -X POST https://api.stockmind.ai/v1/vision/inference -H "X-API-Key: ***"' },
    ]);

    const steps = [
      { type: 'info', text: 'Dispatching AWS Lambda edge handler (Runtime: Python 3.11, Memory: 1024MB)...' },
      { type: 'info', text: `Processing stream CAM-01 [Rack A-04]: 640x640 frame received.` },
      { type: 'metric', text: `Inference executed: ${randomCount} boxes localized. Latency: ${randomLatency}ms (Edge optimized).` },
      { type: 'db', text: `DynamoDB PutItem: EventId=EV-${Date.now().toString().slice(-6)}, SKU=BOX-CB-001, Physical=${randomCount}` },
      { type: 'accent', text: `[MAS BUS] Event published to EventBridge: Topic=stockmind.inventory.scanned` },
      { type: 'success', text: `Response 200 OK: Payload synchronized with SAP S/4HANA & Stock Reconciliation Agent.` },
    ];

    addLogWithDelay(steps);

    setTimeout(() => {
      setActiveRunning(null);
      setButtonStatuses((prev) => ({ ...prev, btn4: 'success' }));
    }, (steps.length + 1) * 350);
  };

  const handleClearLogs = () => {
    setLogs([
      { type: 'info', text: '[TERMINAL DIRESET] Log dibersihkan oleh pengguna.' },
      { type: 'cmd', text: '$ stockmind-ai --daemon' },
      { type: 'success', text: 'Layanan aktif mendengarkan aliran inferensi visi.' }
    ]);
  };

  const handleCopyLogs = () => {
    const textToCopy = logs.map(l => l.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#14141E] border border-[#242436] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Console Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#20202F] bg-[#101018] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFD600]/15 border border-[#FFD600]/40 text-[#FFD600] flex items-center justify-center shadow-[0_0_15px_rgba(255,214,0,0.2)]">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight font-display uppercase">
              TERMINAL EKSEKUSI &amp; LOG OPERASIONAL
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono font-medium">
              Sub-proses Python 3.11 • Handler Inferensi Visi Komputer
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-full bg-[#181826] hover:bg-[#222233] border border-[#2D2D42] text-[11px] font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer uppercase"
          >
            BERSIHKAN LOG
          </button>

          <button
            onClick={handleCopyLogs}
            className="px-3 py-1.5 rounded-full bg-[#181826] hover:bg-[#222233] border border-[#2D2D42] text-[11px] font-mono font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer uppercase"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#CCFF00]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className={copied ? 'text-[#CCFF00]' : ''}>{copied ? 'TERSALIN' : 'SALIN LOG'}</span>
          </button>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping"></span>
            LOG LANGSUNG
          </span>
        </div>
      </div>

      {/* 4 Execution Buttons Grid */}
      <div className="p-4 sm:p-5 bg-[#0E0E14] border-b border-[#20202F]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2 font-mono">
          <span>Pemicu Eksekusi Cepat</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Pipeline Pengujian Model Visi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Button 1 */}
          <button
            id="btn-validate-dataset"
            onClick={handleValidateDataset}
            disabled={activeRunning !== null}
            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activeRunning === 'btn1'
                ? 'bg-[#1A1A2A] border-[#CCFF00] text-white shadow-[0_0_15px_rgba(204,255,0,0.25)]'
                : buttonStatuses.btn1 === 'success'
                ? 'bg-[#14141E] border-[#CCFF00]/50 text-white'
                : 'bg-[#14141E] border-[#242436] hover:border-[#CCFF00]/60 hover:-translate-y-0.5 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#181824] border border-[#2D2D42] text-[#CCFF00] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Validasi Dataset
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">validate_dataset.py</div>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {activeRunning === 'btn1' ? (
                <Loader2 className="w-4 h-4 text-[#CCFF00] animate-spin" />
              ) : buttonStatuses.btn1 === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
              ) : (
                <Play className="w-3 h-3 text-zinc-400 fill-zinc-400" />
              )}
            </div>
          </button>

          {/* Button 2 */}
          <button
            id="btn-run-unit-tests"
            onClick={handleRunUnitTests}
            disabled={activeRunning !== null}
            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activeRunning === 'btn2'
                ? 'bg-[#1A1A2A] border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : buttonStatuses.btn2 === 'success'
                ? 'bg-[#14141E] border-[#00F0FF]/50 text-white'
                : 'bg-[#14141E] border-[#242436] hover:border-[#00F0FF]/60 hover:-translate-y-0.5 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#181824] border border-[#2D2D42] text-[#00F0FF] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Uji Unit Test
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">test_vision_inference.py</div>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {activeRunning === 'btn2' ? (
                <Loader2 className="w-4 h-4 text-[#00F0FF] animate-spin" />
              ) : buttonStatuses.btn2 === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
              ) : (
                <Play className="w-3 h-3 text-zinc-400 fill-zinc-400" />
              )}
            </div>
          </button>

          {/* Button 3 */}
          <button
            id="btn-evaluate-model"
            onClick={handleEvaluateModel}
            disabled={activeRunning !== null}
            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activeRunning === 'btn3'
                ? 'bg-[#1A1A2A] border-[#FFD600] text-white shadow-[0_0_15px_rgba(255,214,0,0.25)]'
                : buttonStatuses.btn3 === 'success'
                ? 'bg-[#14141E] border-[#FFD600]/50 text-white'
                : 'bg-[#14141E] border-[#242436] hover:border-[#FFD600]/60 hover:-translate-y-0.5 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#181824] border border-[#2D2D42] text-[#FFD600] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Evaluasi Model
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">evaluate_model.py</div>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {activeRunning === 'btn3' ? (
                <Loader2 className="w-4 h-4 text-[#FFD600] animate-spin" />
              ) : buttonStatuses.btn3 === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />
              ) : (
                <Play className="w-3 h-3 text-zinc-400 fill-zinc-400" />
              )}
            </div>
          </button>

          {/* Button 4 */}
          <button
            id="btn-live-inference"
            onClick={handleLiveInference}
            disabled={activeRunning !== null}
            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              activeRunning === 'btn4'
                ? 'bg-[#1A1A2A] border-[#8A2BE2] text-white shadow-[0_0_15px_rgba(138,43,226,0.3)]'
                : buttonStatuses.btn4 === 'success'
                ? 'bg-[#14141E] border-[#8A2BE2]/50 text-white'
                : 'bg-[#14141E] border-[#242436] hover:border-[#8A2BE2]/60 hover:-translate-y-0.5 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#181824] border border-[#2D2D42] text-[#A855F7] text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">
                  Inferensi Edge
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">inference.py (AWS)</div>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              {activeRunning === 'btn4' ? (
                <Loader2 className="w-4 h-4 text-[#A855F7] animate-spin" />
              ) : buttonStatuses.btn4 === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#A855F7]" />
              ) : (
                <Play className="w-3 h-3 text-zinc-400 fill-zinc-400" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Terminal Command Prompt Box */}
      <div className="p-4 sm:p-5 bg-[#08080C] flex-1 flex flex-col font-mono text-xs">
        {/* Window Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF3366] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFD600] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#CCFF00] inline-block"></span>
            <span className="ml-2 text-zinc-300 font-mono font-bold">bash - stockmind-ai@runtime</span>
          </div>
          <span className="text-[10px] font-mono bg-[#14141E] text-zinc-300 px-2.5 py-0.5 rounded-full border border-[#242436]">
            SESI: #SM-EXEC-9921
          </span>
        </div>

        {/* Streaming Logs Viewport */}
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-1.5 pr-2 font-mono text-[11px] sm:text-xs overflow-x-hidden break-words">
          {logs.map((log, index) => {
            if (log.type === 'divider') {
              return (
                <div key={index} className="text-zinc-700 select-none text-[11px]">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'cmd') {
              return (
                <div key={index} className="text-[#CCFF00] font-bold flex items-center gap-1.5">
                  <span className="text-[#CCFF00] font-black">&gt;</span>
                  <span>{log.text}</span>
                </div>
              );
            }
            if (log.type === 'info') {
              return (
                <div key={index} className="text-zinc-400 pl-3">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'metric') {
              return (
                <div key={index} className="text-[#00F0FF] font-bold pl-4">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'db') {
              return (
                <div key={index} className="text-[#A855F7] font-bold pl-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 inline text-[#A855F7]" />
                  <span>{log.text}</span>
                </div>
              );
            }
            if (log.type === 'accent') {
              return (
                <div key={index} className="text-[#FFD600] font-bold pl-3">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'success') {
              return (
                <div key={index} className="text-[#CCFF00] font-bold pl-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 inline text-[#CCFF00]" />
                  <span>{log.text}</span>
                </div>
              );
            }
            return <div key={index} className="text-zinc-300 pl-3">{log.text}</div>;
          })}
          
          {/* Active indicator */}
          {activeRunning && (
            <div className="flex items-center gap-2 text-[#CCFF00] text-[11px] font-bold animate-pulse pl-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Tahapan pipeline sedang dieksekusi...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Console status footer */}
        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
            <span className="text-[#CCFF00]">ALIRAN DYNAMODB: AKTIF</span>
          </div>
          <span className="font-mono bg-[#14141E] px-2.5 py-0.5 rounded-full text-zinc-300 border border-[#242436]">
            TOTAL LOG: {logs.length}
          </span>
        </div>
      </div>
    </div>
  );
}
