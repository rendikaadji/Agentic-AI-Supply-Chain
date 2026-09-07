# StockMind AI — Execution & Runbook Specification

**Document ID:** `DOC-FD-12`  
**Document Name:** Execution & Runbook Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/12_cara_jalanin.md`  

---

## 1. Menjalankan Sistem Secara Lokal (Development Mode)

Untuk mendemonstrasikan sistem secara utuh dari dashboard interaktif hingga inferensi AI, jalankan dua proses terminal berikut secara berdampingan:

### Terminal 1: Backend API Server (FastAPI Port 8000)
Pastikan berada di root `stockmind-ai` dengan virtual environment aktif:
```powershell
cd e:\Agentic-Ai\stockmind-ai-struktur-folder\stockmind-ai
.\.venv\Scripts\Activate.ps1
python backend/api/app.py
```
* **Status:** Server akan mendengarkan di `http://127.0.0.1:8000`.
* **Swagger API Docs:** Akses `http://127.0.0.1:8000/docs` di browser.

### Terminal 2: Frontend Dashboard (Vite React Port 5173)
Buka terminal baru di folder `frontend`:
```powershell
cd e:\Agentic-Ai\stockmind-ai-struktur-folder\stockmind-ai\frontend
npm run dev
```
* **Status:** Dashboard aktif dan dapat dibuka melalui `http://localhost:5173/`.

### Terminal 3 (Opsional): Model LLM Lokal Ollama
Jika menggunakan `AI_PROVIDER=ollama` di file `.env`:
```powershell
ollama run qwen2.5:7b
```

---

## 2. Katalog Perintah Pengujian & Verifikasi (CLI Runbook)

### 2.1 Validasi Integritas Dataset YOLOv8 (Tahap 1)
Memastikan seluruh citra utuh, file label anotasi sinkron, dan koordinat ternormalisasi `[0.0 - 1.0]`:
```powershell
.\.venv\Scripts\python computer_vision/scripts/validate_dataset.py
```
* **Kriteria Lulus:** Status `[PASS] VALID`, 0 citra korup, 0 missing annotation.

### 2.2 Pengujian Unit & SLA Latensi AWS Lambda (Tahap 2)
Memvalidasi kontrak JSON output, normalisasi bounding box, dan SLA latensi warm-start (<500 ms):
```powershell
.\.venv\Scripts\python -m unittest tests/unit/test_vision_inference.py -v
```
* **Kriteria Lulus:** 5/5 unit tests berstatus `ok`, rata-rata latensi CPU $\approx 30 - 35\text{ ms}$.

### 2.3 Benchmark Akurasi Model YOLOv8 (Tahap 3)
Menguji performa bobot model `computer_vision/models/best.pt` pada test split independen:
```powershell
.\.venv\Scripts\python computer_vision/scripts/evaluate_model.py --model computer_vision/models/best.pt --split test
```
* **Kriteria Lulus:** Capaian akurasi $\text{mAP@50} \ge 85.0\%$ (baseline: **99.50%**).

### 2.4 Uji Inferensi Langsung Citra Rak Gudang (Tahap 4)
* **Deteksi Citra Tunggal via CLI:**
  ```powershell
  .\.venv\Scripts\python computer_vision/scripts/inference.py --image computer_vision/data/test_images/warehouse_box_test_0001.jpg
  ```
* **Simulasi Payload Event AWS Lambda (API Gateway / EventBridge):**
  ```powershell
  .\.venv\Scripts\python -c "import base64, json; from computer_vision.inference.lambda_handler import lambda_handler; img_b64 = base64.b64encode(open('computer_vision/data/test_images/warehouse_box_test_0001.jpg', 'rb').read()).decode('utf-8'); resp = lambda_handler({'body': json.dumps({'image_base64': img_b64})}, None); print('HTTP Status:', resp['statusCode']); print('Response Body:', resp['body'])"
  ```

---

## 3. Perintah One-Liner PowerShell (Full Automated Suite)

Untuk menjalankan seluruh 4 tahapan pengujian sekaligus dalam satu baris perintah:
```powershell
.\.venv\Scripts\python computer_vision/scripts/validate_dataset.py; `
.\.venv\Scripts\python -m unittest tests/unit/test_vision_inference.py -v; `
.\.venv\Scripts\python computer_vision/scripts/evaluate_model.py --model computer_vision/models/best.pt --split test; `
.\.venv\Scripts\python computer_vision/scripts/inference.py --image computer_vision/data/test_images/warehouse_box_test_0001.jpg
```
