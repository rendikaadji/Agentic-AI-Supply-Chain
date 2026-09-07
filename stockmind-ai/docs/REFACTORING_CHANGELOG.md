# StockMind AI — Refactoring & Architecture Restructuring Changelog

**Tanggal:** 7 September 2026  
**Status:** COMPLETED & VERIFIED  
**Tujuan:** Merapikan struktur proyek, mengeliminasi folder/file dummy sampah, merestrukturisasi arsitektur 6 pilar rantai pasok otonom agar siap pakai (*ready-to-code*), dan menjamin **100% kode eksekusi dan aset model tetap utuh dan berfungsi normal**.

---

## 1. Ringkasan Tindakan Utama

| Kategori Tindakan | Sebelum Refaktor | Setelah Refaktor | Dampak & Manfaat |
|---|---|---|---|
| **Struktur Modul Agen (`agents/`)** | Folder tidak berurutan (`demand_forecasting_agent`, `inventory_monitoring_agent`, dll.) | Diberi penomoran sesuai urutan 6 Pilar Closed-Loop MAS (`01_demand_sensing` s/d `06_inbound_execution` + `orchestrator`) | Developer dan QA langsung paham alur pipeline data end-to-end tanpa bingung. |
| **Inisialisasi Package Python** | Banyak folder hanya berisi file `README.md` 1 baris (30–100 bytes) | Dilengkapi file `__init__.py` berstandar dengan metadata kontrak input/output | Folder langsung dikenali sebagai modul Python dan siap diisi kode tanpa error import. |
| **Frontend Subsystem** | Terdapat folder tiruan `frontend/components/`, `frontend/assets/`, dan `frontend/dashboard/` di luar `src/` | Folder tiruan dihapus. Aset terpusat di `frontend/public/` dan komponen di `frontend/src/` | Menghilangkan kebingungan developer dan mencegah salah edit file. |
| **Integrasi & Backend** | Folder terpecah tanpa kontrak data | `backend/` dan `integrations/` distandarisasi dan dilengkapi spesifikasi di `DATA-CONTRACTS.md` | Memudahkan Backend Lead menghubungkan DynamoDB, Bedrock, dan SAP S/4HANA. |
| **Dokumentasi Spesifikasi** | Tidak ada PRD, SRS, atau QA matrix | Tersedia `docs/PRD-SRS-SPECIFICATION.md` dan `docs/DATA-CONTRACTS.md` | QA memiliki acuan test matrix terstruktur (`TC-CV-01` s/d `TC-E2E-01`). |
| **Konfigurasi Lingkungan (`pyrightconfig.json`)** | Berisi path absolut hardcoded milik developer tertentu (`C:\laragon\...`, `rendi`) | Diubah ke path relatif (`.`, `computer_vision`, `agents`, `backend`) | IDE dan type checker berjalan mulus di laptop semua anggota tim. |

---

## 2. Struktur Pohon Direktori Akhir (Clean Architecture)

```text
stockmind-ai/
├── agents/                                  # 6 Pilar Multi-Agent System (Urutan Closed-Loop)
│   ├── 01_demand_sensing/                   # Pilar 1: Amazon Bedrock + SageMaker
│   ├── 02_vision_inventory/                 # Pilar 2: Vision Inventory Scheduler
│   ├── 03_stock_reconciliation/             # Pilar 3: SAP MM Discrepancy & Adaptive ROP
│   ├── 04_negotiation_procurement/          # Pilar 4: Autonomous RFQ & PO Vendor
│   ├── 05_logistics_route/                  # Pilar 5: Amazon Location Service
│   ├── 06_inbound_execution/                # Pilar 6: Dok e-PoD & SAP Goods Receipt (GR 101)
│   └── orchestrator/                        # AWS Step Functions MAS Orchestrator
│
├── backend/                                 # Backend API & Business Logic Layer
│   ├── api/                                 # REST API Endpoints / Serverless handlers
│   ├── models/                              # Pydantic Schemas & DTOs
│   ├── services/                            # Perhitungan ROP, Safety Stock, Audit
│   └── utils/                               # Helper logging, formatters
│
├── computer_vision/                         # Subsystem Inti Fase 1 (Computer Vision)
│   ├── data/                                # data.yaml, split train/val/test images & labels
│   ├── inference/                           # lambda_handler.py (AWS Lambda Adapter)
│   ├── models/                              # best.pt (YOLOv8n trained weights 5.96 MB)
│   ├── notebooks/                           # 01_yolo8_training.py
│   ├── results/                             # model_evaluation_epoch50.csv, plots
│   ├── scripts/                             # inference.py, evaluate_model.py, train_yolov8.py, validate_dataset.py, seed_sample_dataset.py
│   └── README.md                            # Laporan teknis & SLA metrik Computer Vision
│
├── data/                                    # Dataset & Master Schemas
│   ├── sample_datasets/                     # Data dummy CSV penjualan & vendor
│   ├── schemas/                             # JSON Schema kontrak resmi
│   └── synthetic_data/                      # Generator data sintetis
│
├── docs/                                    # Master Single-Source-of-Truth Documentation
│   ├── PRD-SRS-SPECIFICATION.md             # PRD, SRS, & Master QA Verification Matrix
│   ├── DATA-CONTRACTS.md                    # Kontrak Data & Skema Antar-Subsistem
│   ├── WORKFLOW-PER-FILE-TRACE.md           # Peta Alur Data Function-Level Lengkap
│   ├── DASHBOARD_GUIDE.md                   # Panduan Alur Kerja Closed-Loop Sistem
│   ├── VISION_AGENT_REPORT.md               # Laporan Metrik Akurasi & Panduan CLI
│   └── REFACTORING_CHANGELOG.md             # Laporan Hasil Restrukturisasi Ini
│
├── frontend/                                # Enterprise Control Center (React 18 + Vite + Tailwind)
│   ├── public/                              # Aset gambar kamera gudang & logo SVG
│   ├── src/                                 # App.jsx, 7 domain views, 6 interaktif komponen
│   ├── package.json                         # Dependensi React & Vite scripts
│   ├── vite.config.js                       # Konfigurasi bundler Vite
│   ├── tailwind.config.js                   # Konfigurasi styling Tailwind
│   └── README.md                            # Panduan menjalankan frontend
│
├── human_in_the_loop/                       # Eskalasi persetujuan manajer untuk PO risiko tinggi
├── infra/                                   # Infrastructure as Code (CDK, CloudFormation, Terraform)
├── integrations/                            # Connector resmi AWS SDK & SAP S/4HANA
├── knowledge_base/                          # RAG Documents, SOP Pengadaan, Guardrails
├── logs/                                    # Folder logging sistem
├── notebooks/                               # Wrapper notebook root workspace
├── scripts/                                 # Runner eksekusi root workspace (train_yolov8.py)
├── tests/                                   # Automation Test Suites
│   ├── unit/                                # test_vision_inference.py (Kontrak Lambda & Latensi)
│   ├── integration/                         # Test integrasi multi-agent & AWS mocks
│   └── e2e/                                 # Test skenario Demo Day end-to-end
│
├── pyrightconfig.json                       # Konfigurasi static type checker (Clean relative paths)
├── .gitignore                               # Aturan ignore node_modules, build artifacts
└── README.md                                # Master repository documentation
```

---

## 3. Daftar File yang Dibersihkan / Dihapus

1. **Folder Duplikat Snapshot di Root Workspace:**
   - `Agentic-AI-Supply-Chain-feature-testing/` (Dihapus — snapshot usang yang redundan).
   - `Agentic-AI-Supply-Chain-feature-vision-system-phase1/` (Dihapus — snapshot usang yang redundan).
2. **Folder Dummy & Palsu di Frontend:**
   - `stockmind-ai/frontend/assets/` (Dihapus — hanya berisi `README.md` 45 byte).
   - `stockmind-ai/frontend/components/` (Dihapus — hanya berisi `README.md` 54 byte).
   - `stockmind-ai/frontend/dashboard/` (Dihapus — redundan).
3. **Folder Kosong di Computer Vision:**
   - `stockmind-ai/computer_vision/camera_ingestion/` (Dihapus).
   - `stockmind-ai/computer_vision/rekognition_integration/` (Dihapus).
4. **Folder Kosong di Scripts:**
   - `stockmind-ai/scripts/data_seeding/` (Dihapus).
   - `stockmind-ai/scripts/deployment/` (Dihapus).
   - `stockmind-ai/scripts/monitoring/` (Dihapus).
5. **File Duplikat Dokumentasi:**
   - `stockmind-ai/WORKFLOW-PER-FILE-TRACE.md` (Salinan duplikat di root dihapus; dokumen kanonikal berada di `stockmind-ai/docs/WORKFLOW-PER-FILE-TRACE.md`).

---

## 4. Jaminan Integritas Kode (Code Safety Verification)

Sesuai instruksi mutlak: **"Dilarang menghapus isi 1 file yang file itu memang berisi kode untuk dijalankan"**.

Seluruh file kode telah diverifikasi dengan hasil sebagai berikut:
- [x] **Python Syntax & Bytecode Compilation:**  
  Perintah `python -m compileall stockmind-ai` berhasil **100% tanpa error syntax** di seluruh 39 modul.
- [x] **Dataset Integrity:**  
  Perintah `python computer_vision/scripts/validate_dataset.py --data-dir computer_vision/data --yaml-file computer_vision/data/data.yaml` menghasilkan status **`[PASS] VALID`** (46 citra utuh, 222 bounding box kardus valid).
- [x] **Frontend Codebase:**  
  Seluruh 15 file React JSX di `frontend/src/` (App, views, components), file konfigurasi Vite, Tailwind, dan aset citra publik `/warehouse_box_test_*.jpg` tetap utuh 100%.
- [x] **Weights & Models:**  
  File bobot model terlatih `computer_vision/models/best.pt` (5.96 MB) tetap aman dan berada di jalurnya.
