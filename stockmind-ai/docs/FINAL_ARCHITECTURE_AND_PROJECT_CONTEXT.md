# StockMind AI — Final Architecture Specification & Project Context

**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Competition Track:** Intelligent Supply Chain (Sokrates x AWS x SAP Partner — Agentic AI Hackathon 2026)  
**Document Version:** 1.0.0 (Canonical Production Architecture)  
**Status:** APPROVED FOR SUBMISSION & DEMO DAY BASELINE  
**Reference Documents:** [PRD-SRS-SPECIFICATION.md](PRD-SRS-SPECIFICATION.md), [DATA-CONTRACTS.md](DATA-CONTRACTS.md), [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md), [SYSTEM_IMPLEMENTATION_REPORT.md](SYSTEM_IMPLEMENTATION_REPORT.md)

---

## Table of Contents

1. [Konteks Bisnis & Problem Statement Industri](#1-konteks-bisnis--problem-statement-industri)
2. [Solusi StockMind AI: Closed-Loop Multi-Agent System (MAS)](#2-solusi-stockmind-ai-closed-loop-multi-agent-system-mas)
3. [Arsitektur AI Seimbang: Justifikasi Pemilihan Model](#3-arsitektur-ai-seimbang-justifikasi-pemilihan-model)
4. [Inovasi Human-Centric Pilar 6: Chatbot Supir, Deep Learning OCR, & Google Sheets](#4-inovasi-human-centric-pilar-6-chatbot-supir-deep-learning-ocr--google-sheets)
5. [Diagram Arsitektur 3-Tier Enterprise](#5-diagram-arsitektur-3-tier-enterprise)
6. [Alur End-to-End Function Call Pipeline](#6-alur-end-to-end-function-call-pipeline)
7. [Tech Stack & Lingkungan Eksekusi](#7-tech-stack--lingkungan-eksekusi)

---

## 1. Konteks Bisnis & Problem Statement Industri

Operasi rantai pasok manufaktur dan distribusi modern menghadapi 4 titik kerapuhan kritis yang selama ini diselesaikan secara manual, lambat, dan terfragmentasi:

1. **Phantom Inventory (Disparitas Fisik vs ERP):**
   Catatan pembukuan di ERP (SAP S/4HANA Materials Management) sering kali mencatat stok mencukupi, padahal di rak fisik gudang barang telah habis karena salah letak, rusak, atau pencurian. Deviasi rata-rata industri mencapai 15% sampai 22%, menyebabkan operasional pabrik terhenti mendadak (*line shutdown*).

2. **Keterlambatan Deteksi Stockout (Static Reorder Point):**
   Sistem ERP tradisional menggunakan nilai Reorder Point (ROP) statis yang dihitung per kuartal. Sistem tidak mampu merespons lonjakan permintaan pasar musiman secara instan sebelum barang benar-benar habis di gudang.

3. **Inersia Pengadaan Klerikal (Procurement Latency):**
   Saat stok kritis terdeteksi, proses manual penerbitan Request for Quotation (RFQ), negosiasi diskon harga antar vendor rekanan, hingga pembuatan Purchase Order (PO) resmi memakan waktu rata-rata 4 sampai 8 hari kerja.

4. **Blind-Spot Logistik & Antrean Dok Penerimaan (Inbound Bottleneck):**
   Armada pengiriman vendor kerap terjebak kemacetan tanpa rute dinamis. Ketika tiba di gudang, supir truk membawa lembaran fisik surat jalan kertas manual. Petugas gudang membutuhkan waktu 30 hingga 45 menit per truk untuk mencocokkan dokumen fisik dan menginput transaksi Goods Receipt (GR 101) ke komputer SAP, memicu denda penalti antrean dok (*demurrage cost*) membengkak hingga 14% sampai 19%.

---

## 2. Solusi StockMind AI: Closed-Loop Multi-Agent System (MAS)

StockMind AI adalah sistem orkestrasi rantai pasok otonom tertutup (*closed-loop*) 6 pilar yang menghubungkan dunia fisik gudang dengan platform enterprise AWS dan SAP S/4HANA:

```text
[Pilar 1: Demand Sensing] -> Mendeteksi lonjakan pesanan 14 hari ke depan (+24%)
          |
[Pilar 2: Vision Inventory] -> Kamera CCTV Edge YOLOv8 menghitung fisik di rak (46 unit)
          |
[Pilar 3: Stock Reconciliation] -> Hitung selisih ERP (Delta -14) & Adaptive ROP (52 unit)
          |
[Pilar 4: Autonomous Negotiation] -> LLM menawar harga vendor (Diskon 8%) & terbitkan PO SAP
          |
[Pilar 5: Logistics Route] -> Reroute armada dinamis menghindari macet (Hemat 40 menit)
          |
[Pilar 6: Inbound Execution] -> Supir foto surat jalan via Chatbot -> DL OCR -> Google Sheets & SAP GR 101
```

Siklus ini sepenuhnya otomatis: dari pemantauan visual fisik, mitigasi kekurangan stok, pengadaan cerdas, hingga barang kembali masuk dok dan saldo pembukuan pulih tanpa intervensi klerikal manual.

---

## 3. Arsitektur AI Seimbang: Justifikasi Pemilihan Model

Dalam perancangan sistem enterprise skala industri, memaksakan Machine Learning pada semua pilar adalah *anti-pattern* yang keliru (*overengineering*). Rantai pasok membutuhkan sinergi antara **Prediksi Statistik, Deep Learning Persepsi Visual, Matematika Deterministik ERP, Algoritma Optimasi Graf, dan Cognitive GenAI Reasoning**.

Berikut pembagian tanggung jawab teknologi per pilar:

| No | Pilar Fungsional | Kebutuhan Industri Riil | Teknologi yang Tepat | Alasan & Justifikasi Ilmiah |
|---|---|---|---|---|
| **01** | **Demand Sensing** | Prediksi angka permintaan masa depan berdasarkan deret waktu historis. | **1x Machine Learning (Time-Series):** LightGBM / XGBoost / Prophet | Sifat data terstruktur time-series dengan pola musiman. ML tabular jauh lebih efisien, cepat, dan akurat dibanding Deep Learning berat untuk forecasting 14 hari. |
| **02** | **Vision Inventory** | Deteksi dan hitung kotak kardus fisik dari citra CCTV rak gudang. | **1x Deep Learning (Spatial CV):** YOLOv8n Object Detection (`best.pt`) | Domain Computer Vision memerlukan ekstraksi fitur spasial konvolusional berkecepatan tinggi (<50 ms CPU) untuk inferensi edge AWS Lambda. |
| **03** | **Stock Reconciliation** | Menghitung selisih stok fisik vs ERP, Dynamic Safety Stock, dan Adaptive ROP. | **Matematika Deterministik ERP:** Formula APICS / SAP MM | ROP adalah rumus baku persediaan industri: $ROP = (d \times L) + SS$. Mengganti rumus pasti dengan blackbox ML berisiko halusinasi angka yang membahayakan neraca audit perusahaan. |
| **04** | **Disruption & Negotiation** | Membaca penawaran RFQ, menawar diskon, mengevaluasi SLA, dan membuat PO. | **Cognitive Agent (LLM):** Qwen 2.5 (Ollama lokal) / Claude 3.5 (Bedrock) | Domain Natural Language Understanding & Strategic Dialogue. Memerlukan kemampuan reasoning diplomatis dan eksekusi function calling BAPI SAP. |
| **05** | **Logistics Route** | Mencari rute truk tercepat menghindari kemacetan dan mitigasi demurrage. | **Riset Operasional & Location API:** Amazon Location Service / Graph Solver | Perutean kendaraan adalah permasalahan optimasi graf (Dijkstra / Vehicle Routing Problem), bukan regresi statistik. |
| **06** | **Inbound Execution** | Membaca kertas surat jalan supir, mencatat log, dan mutasi saldo SAP. | **1x Deep Learning (Document Vision OCR):** PaddleOCR / TrOCR / Vision-LLM | Membaca teks cetak, stempel cap basah, dan tabel surat jalan dari foto HP supir membutuhkan model Deep Learning OCR bertingkat. |

**Kesimpulan Komposisi Model AI:**
Sistem StockMind AI menggunakan **2 Model Deep Learning (YOLOv8 + Document OCR)**, **1 Model Machine Learning (Time-Series Forecasting)**, **1 Cognitive LLM Orchestrator (Qwen/Claude)**, dan **2 Mesin Deterministik (APICS ERP Math + Route Optimization)**.

---

## 4. Inovasi Human-Centric Pilar 6: Chatbot Supir, Deep Learning OCR, & Google Sheets

### 4.1 Realitas Operasional Supir Truk
Supir truk logistik di Indonesia tidak mengakses dashboard web manajemen gudang. Alat kerja utama mereka di lapangan adalah aplikasi pesan instan (**WhatsApp / Telegram**) di ponsel pintar. Surat jalan yang dibawa adalah lembaran kertas fisik Delivery Order (DO) bertanda tangan.

### 4.2 Arsitektur Pipeline Smart Perception Feeder

```text
[Supir Ambil Foto Surat Jalan Kertas di HP]
                     │
                     ▼
[Aplikasi Chatbot: Telegram / WhatsApp Bot API]
                     │
                     ▼
[OpenCV Image Preprocessing]
 - Auto-crop boundary lembaran dokumen
 - Adaptive thresholding & contrast enhancement (anti-bayangan gelap foto dok)
                     │
                     ▼
[Deep Learning Model #2: Document Vision OCR]
 - Ekstraksi teks multi-kolom, stempel cap basah, dan nomor PO
 - Transformasi data visual menjadi JSON terstruktur:
   {
     "waybill_no": "SJ-MLP-2026-0088",
     "po_number": "45009821",
     "vendor_name": "PT Mitra Logistik Prima",
     "vehicle_plate": "B 9821 TKO",
     "sku_id": "BOX-CB-001",
     "received_quantity": 50,
     "condition": "PASSED"
   }
                     │
                     ▼
[Eksekusi Function Call Tetap Kompatibel]
 p6_res = tool_06_inbound_goods_receipt(
     epod_barcode="EPOD-45009821-BOXCB",
     received_quantity=50
 )
                     │
                     ▼
[Dual Synchronization Layer]
 ├── 1. Google Sheets API (Monitoring Instan Tim Operasional Gudang)
 └── 2. SAP S/4HANA BAPI_GOODSMVT_CREATE (Movement Type 101 Goods Receipt)
                     │
                     ▼
[Bot Mengirim Pesan Balasan Otomatis ke Supir]
 "Surat Jalan SJ-0088 terverifikasi sistem! Silakan langsung bongkar muatan di DOK 02."
```

### 4.3 Kompatibilitas Function Call (Zero Breaking Changes)
Function call `tool_06_inbound_goods_receipt` di [`agents/orchestrator/tools.py`](../agents/orchestrator/tools.py) tetap menerima parameter yang sama (`epod_barcode`, `received_quantity`). Model Deep Learning OCR bertindak sebagai *feeder* cerdas di gerbang masukan, sehingga sistem mendukung pemindaian barcode langsung di dok gudang maupun pengiriman foto via chatbot supir secara fleksibel.

---

## 5. Diagram Arsitektur 3-Tier Enterprise

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STOCKMIND AI ENTERPRISE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 1: PERCEPTION & INGESTION (EDGE & DOCUMENT COMPUTER VISION)           │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │ Deep Learning Model #1          │   │ Deep Learning Model #2          │  │
│  │ YOLOv8n Box Detector (Spatial)  │   │ Document Vision OCR (Waybill)   │  │
│  │ - 640x640 CCTV Feed Frame       │   │ - Foto Surat Jalan Kertas Supir │  │
│  │ - mAP@50: 99.50% | Latency: 35ms│   │ - Telegram / WhatsApp Bot API   │  │
│  └────────────────┬────────────────┘   └────────────────┬────────────────┘  │
│                   │                                     │                   │
├───────────────────┼─────────────────────────────────────┼───────────────────┤
│                   ▼                                     ▼                   │
│  TIER 2: DETERMINISTIC BUSINESS MATH, OPTIMIZATION, & DATA STORES           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ APICS Standard Inventory Math Engine                                  │  │
│  │ - Dynamic Safety Stock (SS) & Adaptive Reorder Point (ROP = d*L + SS) │  │
│  │ Fleet Route Optimizer (Graph Dispatcher & Telematics)                 │  │
│  │ Operational Data Store: Amazon DynamoDB & Google Sheets Live Sync     │  │
│  │ Enterprise ERP Connector: SAP S/4HANA (OData & BAPI_PO_CREATE1)       │  │
│  └────────────────┬──────────────────────────────────────────────────────┘  │
│                   │                                                         │
├───────────────────┼─────────────────────────────────────────────────────────┤
│                   ▼                                                         │
│  TIER 3: COGNITIVE AGENTIC ORCHESTRATOR & PRESENTATION                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Multi-Agent Autonomous Orchestrator (ReAct / Tool-Use Protocol)       │  │
│  │ - Local Provider: Ollama Qwen 2.5 (Offline, 0 Biaya, Privacy Terjaga) │  │
│  │ - Cloud Provider: Amazon Bedrock Claude 3.5 Sonnet                    │  │
│  │ - Serverless API Layer: FastAPI (Uvicorn Async Event Bus)             │  │
│  │ Presentation Dashboard: React 18 + Vite (Tailwind Dark Enterprise)    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Alur End-to-End Function Call Pipeline

1. **Trigger Permintaan (Pilar 1):**  
   Orkestrator memanggil `tool_01_demand_sensing(sku_id="BOX-CB-001")`. Model time-series mendeteksi anomali kenaikan pesanan 14 hari (+24%), memproyeksikan kebutuhan 60 unit.

2. **Verifikasi Fisik Rak (Pilar 2):**  
   Orkestrator memanggil `tool_02_vision_inventory(camera_id="CAM-01")`. Model YOLOv8n memproses citra kamera CCTV rak gudang. Hasil deteksi terkonfirmasi: 46 kotak kardus fisik (confidence rata-rata 92.5%).

3. **Rekonsiliasi & Evaluasi Kritis (Pilar 3):**  
   Orkestrator memanggil `tool_03_stock_reconciliation(physical_count=46, sap_stock=60)`. Ditemukan disparitas phantom inventory (Delta: -14 unit). Rumus persediaan menghitung Adaptive ROP = 52. Karena stok fisik (46) < ROP (52), status ditetapkan `CRITICAL_DEFICIT` dan memicu pengadaan darurat.

4. **Negosiasi & Penerbitan PO (Pilar 4):**  
   Orkestrator memanggil `tool_04_negotiate_and_issue_po(sku_id="BOX-CB-001", quantity=50)`. Agen LLM (Qwen 2.5 lokal) menjalankan diplomasi tawar-menawar harga dengan vendor rekanan terbaik (PT Mitra Logistik Prima), menyepakati diskon 8.0% (Rp 13.064/unit), dan menerbitkan PO SAP resmi `#45009821`.

5. **Pelacakan Rute Armada (Pilar 5):**  
   Orkestrator memanggil `tool_05_optimize_fleet_route(shipment_id="SHP-2026-8801")`. Sistem telemetri mendeteksi kemacetan parah di Tol Cikampek dan mengalihkan armada via Jalur Arteri Kalimalang Bypass, menghemat keterlambatan 40 menit dan menjaga ETA tiba pukul 14:15 WIB.

6. **Penerimaan Barang Cerdas di Dok (Pilar 6):**  
   Supir truk tiba di dok penerimaan dan mengirim foto surat jalan via chatbot. Deep Learning Model #2 mengekstrak data surat jalan. Orkestrator memanggil `tool_06_inbound_goods_receipt(epod_barcode="EPOD-45009821-BOXCB", received_quantity=50)`. Sistem memverifikasi e-PoD, mencatat transaksi ke Google Sheets, dan membukukan SAP Material Document (GR 101), memulihkan saldo buku inventaris menjadi 96 unit secara instan.

---

## 7. Tech Stack & Lingkungan Eksekusi

* **Computer Vision & OCR:** PyTorch 2.x, Ultralytics YOLOv8n (`best.pt`, 5.96 MB), OpenCV, Pillow.
* **Agentic Reasoning & LLM:** Qwen 2.5:7b (via Ollama local host `11434`), Amazon Bedrock (Claude 3.5 Sonnet Boto3 adapter), Google Generative AI (Gemini 1.5 Flash).
* **Backend & API Layer:** Python 3.11/3.14, FastAPI, Uvicorn ASGI Server, Pydantic v2 data contracts.
* **Spreadsheet & ERP Connectors:** Google Sheets API (`gspread`), SAP S/4HANA OData & BAPI Connectors.
* **Frontend Presentation:** React 18, Vite 5, Tailwind CSS, Lucide Icons.
* **Kualitas & Pengujian:** Python `unittest` suite (`tests/unit/test_vision_inference.py`), dataset validation pipeline (`validate_dataset.py`).
