# StockMind AI

**End-to-End Autonomous Supply Chain Orchestration System**

[![Status](https://img.shields.io/badge/Phase%201-Vision%20Agent%20Complete-brightgreen)]()
[![Status](https://img.shields.io/badge/Model-Proof--of--Concept-yellow)]()

Jalur Kompetisi: **Intelligent Supply Chain**
Penyelenggara: **Sokrates x AWS x SAP Partner — Agentic AI Hackathon 2026**

---

## Daftar Isi

1. [Ringkasan](#ringkasan)
2. [Pernyataan Masalah](#1-pernyataan-masalah-problem-statement)
3. [Solusi Agentic AI yang Diusulkan](#2-solusi-agentic-ai-yang-diusulkan-proposed-solution)
4. [Dampak yang Diharapkan](#3-dampak-yang-diharapkan-expected-impact--business-value)
5. [Arsitektur & Struktur Folder](#arsitektur--struktur-folder)
6. [Logika Inti](#logika-inti)
7. [Tim & Pembagian Peran](#tim--pembagian-peran)
8. [Roadmap Implementasi](#roadmap-implementasi)
9. [Status Implementasi Saat Ini](#status-implementasi-saat-ini)
10. [Sumber](#sumber)

---

## Ringkasan

StockMind AI adalah **Multi-Agent System (MAS)** yang menutup celah antara
kondisi fisik gudang dan sistem perencanaan enterprise (ERP), dengan
menggabungkan **Amazon Bedrock**, **Amazon Rekognition**, dan **SAP S/4HANA**
dalam siklus tertutup enam pilar rantai pasok — dari peramalan permintaan,
verifikasi stok fisik via computer vision, rekonsiliasi inventaris,
negosiasi pengadaan otonom, optimasi rute logistik, hingga eksekusi
penerimaan barang (Goods Receipt) di SAP.

> "StockMind AI mentransformasi data visual gudang dan sinyal pasar menjadi
> keputusan operasional rantai pasok yang otonom, presisi, dan terintegrasi
> penuh dalam ekosistem AWS dan SAP. Kami tidak sekadar membangun agen
> pencatat barang, melainkan menghadirkan Rekan Kerja Digital Rantai Pasok
> yang proaktif melindungi kelangsungan bisnis dari hulu hingga ke hilir
> dengan tata kelola enterprise berstandar global."

---

## 1. Pernyataan Masalah (Problem Statement)

### Latar Belakang & Disrupsi Rantai Pasok Modern

Industri manufaktur dan distribusi skala besar menghadapi volatilitas rantai
pasok yang ekstrem. Keterlambatan bahan baku dan fluktuasi permintaan dapat
menimbulkan kerugian material yang signifikan. Pengelolaan inventaris
konvensional masih bergantung pada data silo, sehingga catatan ketersediaan
material di ERP dapat berjalan asinkron dengan kondisi stok nyata di rak
gudang.

### Empat Titik Kerapuhan Struktural

1. **Disparitas Data Fisik vs ERP (Phantom Inventory)** — Saldo inventaris
   di sistem dapat terlihat cukup, sementara stok fisik sebenarnya kosong
   akibat kerusakan atau salah peletakan. Stock opname manual membutuhkan
   biaya dan waktu tinggi sehingga krisis stok terlambat terdeteksi.
2. **Reaktivitas Disrupsi & Ketiadaan Peramalan Cerdas** — Reorder Point
   (ROP) statis tidak cukup menghadapi perubahan musiman dan variansi lead
   time vendor. Kondisi ini dapat memicu *bullwhip effect* dan stockout
   mendadak.
3. **Inersia Siklus Pengadaan Manual (Procure-to-Pay Friction)** —
   Pengadaan darurat membutuhkan koordinasi klerikal lintas divisi, mulai
   dari RFQ, penawaran harga, hingga validasi SOP, yang memakan rata-rata
   4–8 hari kerja per pesanan.
4. **Keterputusan Visibilitas Logistik Masuk (Inbound Blind-Spot)** —
   Setelah PO diterbitkan, perusahaan kehilangan visibilitas perjalanan
   armada vendor. Tidak adanya optimasi rute dinamis dapat menyebabkan
   keterlambatan kedatangan dan antrean di dok bongkar-muat.

### Data Kerugian Industri & Tolok Ukur Baseline

| Dimensi Kerapuhan | Indikator Baseline | Dampak Operasional |
|---|---|---|
| Akurasi Saldo Gudang | Deviasi fisik vs ERP 15%–22% | Penyebab utama kegagalan pemenuhan pesanan pelanggan |
| Efisiensi Staf Procurement | 65% waktu kerja untuk administrasi RFQ | Durasi pengadaan lambat dan inersia operasional tinggi |
| Kepatuhan SOP Korporat | Pembelian non-kontrak (*maverick spending*) 18% | Pemborosan kas karena diskon volume tidak teroptimalkan |
| Logistik & Transportasi | Ketidakpastian ETA memicu *demurrage* | Biaya logistik membengkak hingga 14%–19% per kuartal |

---

## 2. Solusi Agentic AI yang Diusulkan (Proposed Solution)

### Arsitektur End-to-End

StockMind AI menggunakan Multi-Agent System (MAS) untuk menutup celah antara
kondisi fisik gudang dan sistem perencanaan enterprise. Platform
menggabungkan **Amazon Bedrock**, **Amazon Rekognition**, serta
**SAP S/4HANA** dalam siklus tertutup enam pilar rantai pasok.

| Pilar Siklus | Agen | Fungsi Otonom & Alur Kerja | Tech Stack AWS & SAP |
|---|---|---|---|
| 1. Prediksi Permintaan Cerdas | **Demand Sensing Agent** | Menganalisis deret waktu penjualan SAP, seasonality, dan data pasar untuk memproyeksikan kebutuhan bahan baku multi-minggu | Amazon Bedrock, Amazon SageMaker, SAP BTP Data Hub |
| 2. Visibilitas Real-Time | **Vision Inventory Agent** | Memproses frame kamera gudang (1 frame/jam) dengan Computer Vision untuk mendeteksi jumlah unit fisik, SKU, dan status rak | Amazon Rekognition Custom Labels, AWS Lambda, OpenCV Edge |
| 3. Manajemen Inventaris Prediktif | **Stock Reconciliation Agent** | Merekonsiliasi stok fisik dengan saldo SAP MM serta menghitung Safety Stock dinamis dan ROP adaptif berdasarkan variansi lead time | Agents for Amazon Bedrock, Amazon DynamoDB, SAP S/4HANA MM |
| 4. Manajemen Gangguan Cepat | **Disruption & Negotiation Agent** | Mendeteksi potensi kelangkaan, merujuk SOP melalui RAG, lalu mengeksekusi negosiasi harga, kuota, dan SLA vendor melalui API/surel | Amazon Bedrock Knowledge Bases, EventBridge, SAP Ariba API |
| 5. Optimasi Rute Logistik | **Logistics Route Agent** | Mengevaluasi performa carrier 3PL, memetakan rute multimoda vendor–gudang, dan memitigasi kemacetan secara dinamis | Amazon Location Service, AWS Lambda, SAP Logistics Network |
| 6. Eksekusi & Pengiriman Fisik | **Inbound Execution Agent** | Melacak GPS armada inbound, memverifikasi dokumen e-PoD saat kedatangan, dan memicu pencatatan Goods Receipt (GR) instan di SAP | AWS IoT Core, Amazon S3, SAP S/4HANA Cloud (BAPI Goods Receipt) |

Alur bersifat siklikal: setelah **Inbound Execution Agent** mencatat Goods
Receipt, sistem kembali ke **Demand Sensing Agent** untuk siklus prediksi
berikutnya — menutup *closed loop* end-to-end supply chain orchestration.

### Logika Kontrol, Tata Kelola, dan Human-in-the-Loop

**Perhitungan inventaris adaptif:**

```
SS  = Z × √( L × (σd)² + d² × (σL)² )
ROP = (d × L) + SS
```

- `Z`  = faktor service level (1,65 untuk tingkat layanan 95%)
- `d`  = rerata konsumsi harian
- `σd` = standar deviasi konsumsi
- `L`  = rerata lead time vendor
- `σL` = standar deviasi pengiriman vendor

Jika stok fisik mencapai ROP, event dikirim melalui **Amazon EventBridge**
ke agen negosiasi.

**Strict Enterprise Guardrails:** Disruption & Negotiation Agent
menggunakan Knowledge Base RAG terverifikasi yang memuat batas wewenang
belanja, diskon minimal 10%, rating vendor ≥ 4,0, serta termin kredit
Net-30/60. Hasil negosiasi dirangkum menjadi **Draft PO** dan alur
dihentikan untuk meminta **otorisasi digital satu klik** dari manajer
Procurement/Finance sebelum PO diterbitkan ke SAP S/4HANA. Log agen,
rekaman gambar audit kamera, dan persetujuan manusia diarsipkan di
Amazon S3 dengan enkripsi AWS KMS.

---

## 3. Dampak yang Diharapkan (Expected Impact & Business Value)

Implementasi ditujukan untuk mengurangi stockout, mempercepat pengadaan,
meningkatkan kesesuaian stok fisik dengan ERP, dan menekan biaya logistik
masuk melalui visibilitas serta orkestrasi yang lebih adaptif.

| Metrik Kinerja | Kondisi Eksisting (Manual) | Target StockMind AI |
|---|---|---|
| Kasus Kehabisan Stok (Stockout) | 8–14 kejadian per kuartal | Turun 85% melalui deteksi dini near real-time dan ROP dinamis |
| Siklus Pengadaan (P2P Time) | 4–7 hari kerja klerikal | Di bawah 3 jam dari deteksi hingga draft kesepakatan PO |
| Akurasi Saldo Rak Fisik vs ERP | 80%–85% karena phantom inventory | Mencapai 99,5% melalui Computer Vision Rekognition periodik |
| Efisiensi Biaya Logistik Masuk | Rute statis dan keterlambatan armada vendor | Penghematan 22%–25% melalui Amazon Location Service |

---

## Arsitektur & Struktur Folder

```
stockmind-ai/
├── agents/                    # Multi-agent system (4 agent inti + orchestrator)
│   ├── inventory_monitoring_agent/    # Deteksi Phantom Inventory (fisik vs ERP)
│   ├── demand_forecasting_agent/      # Peramalan permintaan, hitung SS & ROP
│   ├── negotiation_procurement_agent/ # Negosiasi & Draft PO berpagar SOP
│   ├── logistics_tracking_agent/      # Pelacakan & optimasi rute armada
│   └── orchestrator/                  # Koordinator siklus tertutup MAS
│
├── computer_vision/            # Verifikasi stok fisik dari kamera gudang (Vision Inventory Agent)
│   ├── models/                        # Bobot model YOLOv8 (best.pt)
│   ├── inference/                     # lambda_handler.py — adapter AWS Lambda
│   ├── camera_ingestion/
│   └── rekognition_integration/
│
├── knowledge_base/             # RAG Knowledge Base & guardrail enterprise
│   ├── rag_documents/
│   ├── vector_store/
│   └── guardrails_policies/    # Batas belanja, diskon min 10%, rating vendor ≥4.0, Net-30/60
│
├── integrations/                # Konektor ke layanan AWS & SAP
│   ├── aws_bedrock/
│   ├── aws_eventbridge/         # Trigger event saat stok fisik capai ROP
│   ├── aws_step_functions/      # Orkestrasi Human-in-the-Loop
│   ├── aws_s3/                  # Arsip log & rekaman audit
│   ├── aws_kms/                 # Enkripsi arsip
│   ├── amazon_location_service/
│   └── sap_s4hana/              # Sinkronisasi PO & Goods Receipt
│
├── human_in_the_loop/          # Otorisasi digital satu klik manajer
│   ├── approval_workflows/
│   └── notifications/
│
├── data/
│   ├── synthetic_data/          # Skema data sintetis (Tahap 1)
│   ├── schemas/
│   ├── sample_datasets/
│   ├── train_images/ val_images/ test_images/   # Dataset YOLOv8 (Vision Agent)
│   └── data.yaml
│
├── models/weights/              # best.pt, last.pt (Vision Inventory Agent)
├── notebooks/                   # 01_yolo8_training.ipynb (Google Colab, GPU-ready)
├── scripts/                     # validate_dataset.py, train_yolov8.py, evaluate_model.py, inference.py
├── results/                     # Laporan validasi, evaluasi, plot, README serah terima
│
├── backend/                     # API & business logic (kalkulasi SS/ROP, dll)
│   ├── api/
│   ├── services/
│   ├── models/
│   └── utils/
│
├── frontend/                    # Dashboard monitoring
│   ├── dashboard/
│   ├── components/
│   └── assets/
│
├── infra/                       # Infrastructure as Code
│   ├── cdk/
│   ├── terraform/
│   └── cloudformation/
│
├── tests/
│   ├── unit/                    # test_vision_inference.py, dll
│   ├── integration/
│   └── e2e/                     # Skenario Demo Day end-to-end
│
├── docs/
│   ├── architecture/
│   ├── proposal/                # StockMind_AI_Ringkasan_3_Halaman.docx
│   └── api_docs/
│
├── scripts/deployment/ data_seeding/ monitoring/
├── logs/
└── config/
```

---

## Tim & Pembagian Peran

Tim eksekusi Phase 1 (Foundation) terdiri dari 3 orang dengan alokasi
~15 jam/minggu per orang (total 90 person-hours untuk 2 minggu):

| Peran | Tanggung Jawab Utama | Skill Inti |
|---|---|---|
| **Vision/ML Lead** | Dataset collection & validation, training YOLOv8, evaluasi model, export `best.pt`, script inference | Python (PyTorch/ultralytics), Colab, Computer Vision, LabelImg/Roboflow |
| **Backend/AWS Lead** | AWS setup (S3, DynamoDB, IAM, Lambda), integrasi database, CI/CD, persiapan integrasi SAP | AWS (Lambda, S3, DynamoDB, IAM), Python (boto3), Database design (NoSQL), API |
| **DevOps/Support Lead** | Repo & branching, automation script, testing, dokumentasi, monitoring, tracking budget AWS | Git/GitHub, Bash, pytest, Markdown/Mermaid, AWS dasar |

> Rendi (Adji Putra) berperan sebagai **Vision/ML Lead**, bertanggung jawab
> penuh atas **Vision Inventory Agent** (Agen #2 dalam siklus MAS).

---

## Roadmap Implementasi

### Roadmap Kompetisi (Agustus–Oktober 2026)

| Tahap | Periode | Fokus |
|---|---|---|
| 1 | 24 Agt – 10 Sep 2026 | Finalisasi proposal teknis & skema data sintetis SAP S/4HANA |
| 2 | Workshop & Enablement | Konfigurasi Bedrock Agents, RAG Knowledge Bases, tuning model CV |
| 3 | Integrasi & Orkestrasi | AWS Step Functions (HitL), Amazon Location Service, simulasi telemetri IoT |
| 4 | Demo Day — 31 Okt 2026 | Simulasi end-to-end: deteksi stok kritis → negosiasi AI → approval manajer → pelacakan rute → posting Goods Receipt |

### Detail Phase 1: Foundation & Vision System (Minggu 1–2)

```
WEEK 1 (Mon-Fri):   Setup + YOLOv8 Training
  Mon-Tue:  Infrastruktur & persiapan dataset
  Wed-Fri:  Training model & evaluasi

WEEK 2 (Mon-Fri):   Lambda Integration & Testing
  Mon-Wed:  Fungsi Lambda + setup DynamoDB
  Thu-Fri:  Pengujian end-to-end + dashboard CloudWatch
```

**Target keberhasilan Phase 1:**
- ✅ Model YOLOv8 deteksi cardboard box (≥85% akurasi)
- ✅ Pipeline inferensi AWS Lambda (<500ms)
- ✅ Database inventaris DynamoDB
- ✅ Sistem end-to-end: kamera → Lambda → database

---

## Status Implementasi Saat Ini

**Vision Inventory Agent — Phase 1: ✅ Selesai (Proof-of-Concept)**

| Tahap | Deliverable | Status |
|---|---|---|
| 1. Setup & Validasi Dataset | Struktur folder, `data.yaml`, `validate_dataset.py` | ✅ PASS — 0 file korup, 0 anotasi invalid |
| 2. Training Pipeline | `01_yolo8_training.ipynb` (Colab) + `train_yolov8.py` (lokal) | ✅ `best.pt` 5.95 MB, inferensi CPU ~51ms |
| 3. Evaluasi Model | `evaluate_model.py`, `model_evaluation_epoch50.csv`, plot & confusion matrix | ✅ mAP50 99,5% *(baseline dataset sintetis)* |
| 4. Script Inference | `inference.py`, `lambda_handler.py` — kontrak JSON siap Backend Lead | ✅ Warm latency 33–47ms, 5/5 unit test PASSED |
| 5. Dokumentasi Serah Terima | `results/README_vision.md` | ✅ Status model ditandai jelas sebagai PoC |

> ⚠️ **Catatan penting:** Model saat ini dilatih di atas dataset sintetis
> (46 citra gudang buatan), bukan data warehouse nyata. Angka mAP50 99,5%
> adalah *baseline validasi pipeline*, bukan performa final. Retraining
> wajib dilakukan begitu dataset cardboard box asli (≥500 citra, via
> Roboflow atau anotasi manual) tersedia — struktur notebook & script
> sudah siap dipakai ulang tanpa perubahan kode.

**Langkah berikutnya:**
1. Serah terima `best.pt` + `inference.py`/`lambda_handler.py` ke Backend/AWS
   Lead untuk integrasi Lambda + DynamoDB.
2. Mendapatkan dataset cardboard box warehouse asli untuk retraining.
3. Lanjut ke Phase 2: SAP integration & orkestrasi multi-agent penuh.

---

## Sumber

Struktur dan konten dokumen ini disusun berdasarkan:
- `StockMind_AI_Ringkasan_3_Halaman.docx` — Problem Statement, Proposed
  Solution, Expected Impact (salinan referensi di `docs/proposal/`).
- Dokumentasi eksekusi Phase 1: *Weeks 1-2 Foundation & Vision System —
  3-Person Team Execution Guide*.
- Laporan hasil eksekusi Tahap 1–5 Vision Inventory Agent (walkthrough
  internal tim).
