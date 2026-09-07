# StockMind AI — Interactive Dashboard & Multi-Agent Control Panel

> **End-to-End Autonomous Supply Chain Orchestration System**  
> Jalur Kompetisi: **Intelligent Supply Chain**  
> Penyelenggara: **Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026**

---

## Daftar Isi
1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Arsitektur 6 Pilar Multi-Agent System (MAS)](#2-arsitektur-6-pilar-multi-agent-system-mas)
3. [Prasyarat & Persiapan Lingkungan](#3-prasyarat--persiapan-lingkungan)
4. [Cara Menjalankan Dashboard (Running Guide)](#4-cara-menjalankan-dashboard-running-guide)
5. [Panduan Halaman & Fitur Interaktif](#5-panduan-halaman--fitur-interaktif)
6. [Skenario Demo Day (Pitch / Demo Walkthrough)](#6-skenario-demo-day-pitch--demo-walkthrough)
7. [Struktur Kode & Komponen](#7-struktur-kode--komponen)
8. [Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Ringkasan Proyek

**StockMind AI** adalah sistem orkestrasi rantai pasok otonom berbasis Multi-Agent System (MAS) yang menutup celah antara **kondisi fisik nyata di lantai gudang** dan **pembukuan di ERP enterprise (SAP S/4HANA)**.

Platform ini memadukan **Computer Vision (YOLOv8 Edge / AWS Rekognition)**, **Generative AI & Reasoning (Amazon Bedrock - Claude 3.5 Sonnet)**, dan **SAP S/4HANA Materials Management (MM) & SAP Ariba** dalam siklus tertutup (*closed-loop*).

### Masalah Utama yang Diselesaikan:
1. **Phantom Inventory**: Catatan saldo di SAP menunjukkan barang ada, namun fisiknya kosong di rak (atau sebaliknya).
2. **Reaktivitas Disrupsi**: Reorder Point (ROP) statis yang gagal merespons kenaikan permintaan musiman.
3. **Inersia Pengadaan (Procure-to-Pay)**: Proses RFQ dan persetujuan pembelian manual yang memakan 4–7 hari kerja.
4. **Keterputusan Logistik Inbound**: Ketiadaan visibilitas perjalanan armada vendor yang memicu demurrage hingga 19%.

---

## 2. Arsitektur 6 Pilar Multi-Agent System (MAS)

StockMind AI beroperasi melalui siklus tertutup 6 pilar otonom:

```
                  ┌─────────────────────────────────────────┐
                  │ 1. Demand Sensing Agent                 │
                  │    (Amazon Bedrock + SageMaker)         │
                  └────────────────────┬────────────────────┘
                                       │ Menganalisis lonjakan pesanan
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 2. Vision Inventory Agent (Phase 1)     │
                  │    (YOLOv8 Edge + Amazon Rekognition)   │
                  └────────────────────┬────────────────────┘
                                       │ Verifikasi stok fisik di rak
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 3. Stock Reconciliation Agent           │
                  │    (Bedrock Agents + SAP MM + DynamoDB) │
                  └────────────────────┬────────────────────┘
                                       │ Hitung Dynamic SS & ROP (Defisit terdeteksi)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 4. Disruption & Negotiation Agent       │
                  │    (Bedrock KB RAG + SAP Ariba)         │
                  └────────────────────┬────────────────────┘
                                       │ Negosiasi harga & terbitkan PO otonom
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 5. Logistics Route Agent                │
                  │    (Amazon Location Service)            │
                  └────────────────────┬────────────────────┘
                                       │ Rute dinamis mitigasi kemacetan jalan tol
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 6. Inbound Execution Agent              │
                  │    (AWS IoT Core + SAP BAPI Goods Rcpt) │
                  └────────────────────┬────────────────────┘
                                       │ e-PoD barcode match -> BAPI GR 101 Posted
                                       │ Saldo SAP ter-update!
                                       ▼
                  (Kembali ke Pilar 1: Siklus Menutup Otonom)
```

---

## 3. Prasyarat & Persiapan Lingkungan

Pastikan di mesin lokal atau server demo telah terpasang:
- **Node.js**: Versi `18.x`, `20.x`, atau `22.x` (Direkomendasikan `v20+`).
- **npm**: Versi `9.x` atau `10+`.
- **Python** (opsional untuk menjalankan skrip AI backend secara langsung): Versi `3.10+` dengan virtual environment (`.venv`).

---

## 4. Cara Menjalankan Dashboard (Running Guide)

### Langkah 1: Masuk ke Folder Frontend
Buka terminal dan arahkan ke direktori `frontend`:
```bash
cd c:\laragon\www\Agentic-AI-Supply-Chain\stockmind-ai\frontend
```

### Langkah 2: Instal Dependensi (Jika baru pertama kali)
```bash
npm install
```
*Dependensi utama yang terpasang:*
- `react` & `react-dom` (v18.3)
- `tailwindcss` (v3.4) & `@vitejs/plugin-react`
- `lucide-react` (Koleksi icon enterprise)
- `clsx` & `tailwind-merge`

### Langkah 3: Jalankan Development Server
```bash
npm run dev
```
Output terminal akan menampilkan:
```text
  VITE v5.4.21  ready in 213 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```

### Langkah 4: Buka di Browser
Buka browser favorit Anda (Google Chrome / Edge) dan akses:  
👉 **`http://127.0.0.1:5173/`**

### Langkah Tambahan: Uji Build Production
Untuk memastikan tidak ada galat sebelum hari presentasi:
```bash
npm run build
```
Hasil build akan tersimpan di folder `frontend/dist/` dan selesai dalam waktu kurang dari 2 detik.

---

## 5. Panduan Halaman & Fitur Interaktif

Dashboard dirancang modular dengan navigasi di **Sidebar kiri**. Berikut adalah penjelasan setiap halaman:

### 1. Halaman "Vision Agent" (Pilar Utama Fase 1)
- **Live Warehouse Camera Feed**:
  - Menampilkan citra riil dari kamera gudang dengan aspect ratio **1:1 (`aspect-square`)** yang persis dengan resolusi input model YOLO ($640 \times 640$).
  - **Bounding Box YOLOv8 Real**: Membungkus setiap kardus (`cardboard_box`) secara akurat dengan persentase confidence tinggi ($0.80 - 1.00$).
  - **Kontrol HUD Interaktif**:
    - Tombol `Box`: Sembunyikan / tampilkan bounding box.
    - Tombol `Target`: Sembunyikan / tampilkan label confidence.
    - Tombol `Radio`: Hidupkan / matikan efek laser scanline.
    - Dropdown Kamera: Ganti antara `CAM-01: Aisle A`, `CAM-02: Aisle B`, dan `CAM-03: Inbound Dock 02`.
- **4 Metrik Real-Time**:
  - *Detected Objects*: 46 Boxes (total dataset uji).
  - *Average Confidence*: 92.5% (melebihi standar >= 0.25).
  - *Inference Latency*: 34.8 ms (memenuhi SLA < 50ms).
  - *Model mAP@50*: 99.5% (melebihi target 85%).
- **Phase 1 Validation Pipeline (Console Kanan)**:
  - Tersedia 4 tombol eksekusi berurutan:
    1. `1. Validate Dataset (validate_dataset.py)`: Menguji integritas 46 citra dan 222 anotasi box (Status: PASS).
    2. `2. Run Unit Tests (test_vision_inference.py)`: Menjalankan test suite kontrak output schema Lambda.
    3. `3. Evaluate Model (evaluate_model.py)`: Menampilkan metrik mAP@50 (99.5%), Precision (96.2%), Recall (98.1%).
    4. `4. Live Lambda Inference (inference.py)`: Memicu simulasi AWS Lambda handler dan memunculkan log:
       ```text
       Running inference on warehouse_box_test_0001.jpg... Status: 200 OK | Count: 46 | Confidence: 0.92 | Latency: 35ms. Data saved to DynamoDB.
       ```
  - Dilengkapi tombol **Copy** dan **Clear** terminal.

### 2. Halaman "Overview"
- **KPI Global Operasional**: Menampilkan dampak bisnis (Total SKU 1,420, Phantom stock 14 unit teratasi, Kecepatan P2P 2.4 Jam, Penghematan biaya logistik Rp 142.8M).
- **Status 6 Agen MAS**: Latensi dan uptime live dari masing-masing pilar.
- **Diagram Alur Closed-Loop**: Memvisualisasikan integrasi dari lantai gudang ke SAP ERP.
- **Live Autonomous Event Stream**: Log aktivitas otonom yang berjalan secara berkesinambungan.

### 3. Halaman "Demand Sensing" (Pilar 1)
- **Probabilistic Forecast Chart**: Proyeksi kebutuhan 4 minggu ke depan untuk SKU `BOX-CB-001` dengan confidence interval 90%.
- **Sinyal Disrupsi Eksternal**: Analisis harga pulp packaging (+4.8%), dwelling time Pelabuhan Tanjung Priok (3.8 hari), dan kenaikan promo e-commerce (+35%).
- **AI Narrative Reasoning (Claude 3.5 Sonnet)**: Rekomendasi memajukan pemesanan untuk menghindari potensi stockout di Minggu 38.
- Tombol *"Run Demand Projection"* untuk simulasi kalkulasi.

### 4. Halaman "Stock Reconciliation" (Pilar 3)
- **Variance Matrix**: Menemukan selisih *Phantom Inventory* pada SKU `BOX-CB-001` (Saldo SAP: 60, Saldo Fisik: 46, Defisit: -14 unit).
- **Interactive Adaptive Math Engine**:
  - Mengimplementasikan rumus adaptif rantai pasok:
    $$SS = Z \times \sqrt{L \times (\sigma_d)^2 + d^2 \times (\sigma_L)^2}$$
    $$ROP = (d \times L) + SS$$
  - Slider interaktif untuk konsumsi harian ($d$), lead time vendor ($L$), variansi demand ($\sigma_d$), dan lead time ($\sigma_L$) yang langsung mengkalkulasi ulang nilai Safety Stock dan Reorder Point secara real-time.
- Tombol *"Trigger Auto-Reconciliation"* untuk memicu penyesuaian otomatis di SAP MM.

### 5. Halaman "Procurement" (Pilar 4)
- **Evaluasi 3 Rekanan Pemasok (RFQ)**: Komparasi paralel antara *PT Mitra Kemasan Prima*, *CV Sumber Karton Abadi*, dan *PT Packindo Sejahtera*.
- **Transkrip Negosiasi Otonom**: Dialog tawar-menawar otomatis antara Bedrock AI Agent dan API vendor merujuk SOP korporat untuk mengamankan diskon 4.2%.
- **Purchase Order SAP Ariba**: Dokumen PO #45009821 senilai Rp 18.500.000 dengan tata kelola *Human-in-the-Loop (HITL)* (ambang batas otonom < Rp 50M).

### 6. Halaman "Logistics" (Pilar 5 & 6)
- **Pelacakan Armada Inbound**: GPS Truk B-9122-TX dari Pabrik Vendor Cikarang menuju Gudang Utama Marunda Central DC.
- **Autonomous Congestion Mitigation**: Deteksi kemacetan 45 menit di Simpang Cikunir dan pengalihan rute otomatis via Jalur Lingkar Luar Timur (hemat 32 menit & eliminasi demurrage).
- **e-PoD & Instant Goods Receipt (GR)**:
  - Pencocokan barcode QR-POD-88219 (100% cocok).
  - Tombol eksekusi `BAPI_GOODSMVT_CREATE` (Movement Type 101) di SAP S/4HANA yang otomatis menambah saldo gudang dari 46 menjadi 96 unit.

### 7. Halaman "Settings"
- Konfigurasi parameter koneksi SAP S/4HANA (Host RFC, Client ID, SID) lengkap dengan tombol uji koneksi (*live ping*).
- Konfigurasi model AWS Bedrock (Claude 3.5 Sonnet / Haiku / Llama 3) dan region cloud.
- Batas toleransi Computer Vision (Confidence Threshold $0.25$, IoU $0.60$).
- Pengaturan ambang batas kewenangan otonom *Human-in-the-Loop*.

### 8. Modal "Trigger Multi-Agent Cycle"
- Tombol di sudut kanan atas header yang dapat ditekan kapan saja.
- Menjalankan simulasi orkestrasi 6 agen secara berurutan dengan animasi langkah, payload telemetri, dan progres penyelesaian.

---

## 6. Skenario Demo Day (Pitch / Demo Walkthrough)

Gunakan alur 5 menit berikut saat presentasi di hadapan dewan juri:

| Menit | Halaman / Aksi | Poin yang Disampaikan |
|---|---|---|
| **00:00 - 01:00** | **Overview** | Buka halaman Overview. Jelaskan masalah *Phantom Inventory* dan disparitas data fisik vs ERP SAP. Tunjukkan status 6 agen yang terhubung ke SAP S/4HANA, AWS Lambda, dan DynamoDB. |
| **01:00 - 02:30** | **Vision Agent** | Masuk ke menu Vision Agent. Tunjukkan kamera gudang dengan bounding box YOLOv8 presisi. Jelaskan metrik: 46 boxes, latency 34ms (<50ms SLA), mAP 99.5%. Klik 4 tombol di konsol kanan secara berurutan untuk menunjukkan validasi pipeline otomatis. |
| **02:30 - 03:30** | **Stock Reconciliation** | Pindah ke menu Stock Reconciliation. Tunjukkan tabel disparitas: fisik 46 vs SAP 60 (defisit 14 unit). Geser slider rumus adaptif ($SS$ & $ROP$) untuk membuktikan kalkulasi matematis berbasis variansi lead time. |
| **03:30 - 04:15** | **Procurement & Logistics** | Buka menu Procurement: perlihatkan transkrip negosiasi otonom RAG Bedrock dan PO SAP Ariba. Pindah ke menu Logistics: tunjukkan pengalihan rute GPS menghindari kemacetan dan klik *"Eksekusi Instant Goods Receipt"* untuk menambah saldo SAP. |
| **04:15 - 05:00** | **Header Button** | Klik tombol **"Trigger Multi-Agent Cycle"** di kanan atas. Klik *"Start Live Simulation"*. Biarkan juri melihat animasi 6 agen berorkestrasi secara tertutup (*closed-loop*). Tutup dengan pernyataan nilai bisnis. |

---

## 7. Struktur Kode & Komponen

```text
frontend/
├── index.html                   # HTML template & Google Fonts (Inter + JetBrains Mono)
├── package.json                 # Konfigurasi dependensi React + Tailwind + Lucide
├── vite.config.js               # Konfigurasi bundler Vite (Port 5173, Host: true)
├── tailwind.config.js           # Konfigurasi palet dark cyberpunk enterprise
├── postcss.config.js            # PostCSS plugin Tailwind & Autoprefixer
├── public/                      # Asset statis
│   ├── logo.svg                 # Logo SVG StockMind AI
│   ├── warehouse_box_test_0001.jpg # Citra uji kamera CAM-01
│   ├── warehouse_box_test_0002.jpg # Citra uji kamera CAM-02
│   └── warehouse_box_test_0003.jpg # Citra uji kamera CAM-03
└── src/
    ├── main.jsx                 # Entry point React
    ├── index.css                # Style global, scanline keyframes, custom scrollbar
    ├── App.jsx                  # Main shell & router navigasi SPA
    ├── components/
    │   ├── Sidebar.jsx          # Menu navigasi & status koneksi enterprise
    │   ├── Header.jsx           # Judul, live time, status badge, tombol Trigger Cycle
    │   ├── KpiCards.jsx         # 4 KPI dampak operasional bisnis
    │   ├── WarehouseCameraFeed.jsx # Viewport kamera 1:1, HUD YOLO, 4 metrik vision
    │   ├── ExecutionConsole.jsx # 4 Tombol pipeline & Terminal command prompt
    │   └── MultiAgentModal.jsx  # Modal simulasi orkestrasi 6 agen closed-loop
    └── views/
        ├── OverviewView.jsx     # Halaman ringkasan eksekutif & MAS board
        ├── VisionAgentView.jsx  # Halaman Phase 1 Vision Agent
        ├── DemandSensingView.jsx # Halaman peramalan permintaan AI & sinyal pasar
        ├── StockReconciliationView.jsx # Halaman variansi stok & kalkulator ROP
        ├── ProcurementView.jsx  # Halaman evaluasi RFQ, transkrip negosiasi & PO
        ├── LogisticsView.jsx    # Halaman pelacakan armada & instant GR
        └── SettingsView.jsx     # Halaman konfigurasi SAP, AWS Bedrock & HITL
```

---

## 8. Troubleshooting & FAQ

### 1. Port 5173 sudah digunakan
Jika port 5173 terpakai oleh proses lain, Anda dapat menjalankan:
```bash
npm run dev -- --port 3000
```

### 2. Gambar kamera gudang tidak tampil
Pastikan folder `frontend/public/` berisi file `warehouse_box_test_0001.jpg`, `0002.jpg`, dan `0003.jpg`. Jika belum ada, jalankan perintah copy dari root:
```powershell
Copy-Item -Force "computer_vision/data/test_images/*.jpg" "frontend/public/"
```

### 3. Merestart background dev server
Jika proses terhenti di IDE atau background:
```bash
cd frontend
npm run dev
```

---
*Dibuat untuk Tim Pengembang StockMind AI — Intelligent Supply Chain Track 2026.*
