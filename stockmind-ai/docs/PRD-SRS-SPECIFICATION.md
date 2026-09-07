# StockMind AI — Product Requirements Document (PRD) & Software Requirements Specification (SRS)

**Project:** StockMind AI (Autonomous Multi-Agent Supply Chain Orchestration System)  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Hackathon 2026)  
**Document Version:** 1.0.0  
**Status:** OFFICIAL BASELINE / QA MASTER SPECIFICATION  
**Target Roles:** Product Owner, QA Engineers, Backend/AWS Lead, ML/Vision Lead, DevOps Lead

---

## Table of Contents
1. [BAGIAN 1: Product Requirements Document (PRD)](#bagian-1-product-requirements-document-prd)
   - [1.1 Background & Problem Statement](#11-background--problem-statement)
   - [1.2 Target Personas & Use Cases](#12-target-personas--use-cases)
   - [1.3 Functional Requirements (FR) 6 Pilar](#13-functional-requirements-fr-6-pilar)
   - [1.4 Non-Functional Requirements (NFR) & SLA](#14-non-functional-requirements-nfr--sla)
   - [1.5 Business Value & Success Metrics (KPIs)](#15-business-value--success-metrics-kpis)
2. [BAGIAN 2: Software Requirements Specification (SRS)](#bagian-2-software-requirements-specification-srs)
   - [2.1 Arsitektur Sistem & Komponen Antarmuka](#21-arsitektur-sistem--komponen-antarmuka)
   - [2.2 Data Flow & State Machine Transitions](#22-data-flow--state-machine-transitions)
   - [2.3 External Interfaces (AWS & SAP S/4HANA)](#23-external-interfaces-aws--sap-s4hana)
   - [2.4 Security, Guardrails, & Human-in-the-Loop Policies](#24-security-guardrails--human-in-the-loop-policies)
3. [BAGIAN 3: QA Test Plan & Verification Matrix](#bagian-3-qa-test-plan--verification-matrix)
   - [3.1 QA Testing Strategy](#31-qa-testing-strategy)
   - [3.2 Master QA Verification Matrix](#32-master-qa-verification-matrix)
   - [3.3 Definition of Done (DoD) per Milestone](#33-definition-of-done-dod-per-milestone)

---

# BAGIAN 1: Product Requirements Document (PRD)

### 1.1 Background & Problem Statement

Operasi manufaktur dan logistik modern menghadapi 4 kerapuhan struktural:
1. **Phantom Inventory (Disparitas Fisik vs ERP):** Catatan stok di SAP S/4HANA MM mencatat stok mencukupi, padahal di rak gudang fisik kosong karena hilang, rusak, atau salah letak (deviasi rata-rata industri 15%–22%).
2. **Keterlambatan Deteksi Stockout:** Reorder Point (ROP) statis tidak sanggup merespons volatilitas pesanan musiman dan keterlambatan vendor.
3. **Inersia Pengadaan Klerikal:** Proses Request for Quotation (RFQ), negosiasi diskon harga, dan penerbitan PO memakan waktu rata-rata 4–8 hari kerja.
4. **Blind-Spot Logistik Masuk:** Ketidakpastian rute armada vendor menyebabkan penumpukan di dok penerimaan dan biaya penalti (*demurrage*) membengkak hingga 14%–19%.

**Solusi StockMind AI:** Sistem otonom berbasis Multi-Agent System (MAS) yang menutup siklus (*closed-loop*) dari deteksi visual rak gudang menggunakan YOLOv8, rekonsiliasi otomatis dengan SAP MM, negosiasi pengadaan otonom via Bedrock LLM, optimasi rute armada, hingga posting penerimaan barang (Goods Receipt 101) di SAP.

---

### 1.2 Target Personas & Use Cases

| Persona | Peran | Masalah Utama | Nilai yang Diberikan StockMind AI |
|---|---|---|---|
| **Budi Santoso** (Warehouse Supervisor) | Memastikan stok fisik di rak selalu sinkron dengan pembukuan gudang. | Stock opname manual memakan waktu berjam-jam dan sering salah hitung. | Kamera CCTV melakukan *hourly visual counting* otomatis dengan akurasi 99.50%. |
| **Dewi Lestari** (Procurement Manager) | Melakukan pengadaan bahan baku, negosiasi vendor, dan menerbitkan PO. | Kelelahan membandingkan puluhan email penawaran RFQ saat stok mendesak. | Bedrock Agent melakukan negosiasi harga dan menerbitkan draft PO otonom di SAP Ariba. |
| **Rian Hidayat** (Supply Chain Director) | Menjaga SLA pengiriman dan efisiensi modal kerja. | Tidak ada visibilitas armada vendor sehingga produksi sering terhenti. | Dashboard visual real-time memetakan armada dan memitigasi kemacetan rute. |

---

### 1.3 Functional Requirements (FR) 6 Pilar

#### Pilar 1: Demand Sensing Agent (FR-01)
- **FR-01.1:** Sistem wajib memproyeksikan kebutuhan bahan baku 14 hari ke depan berdasarkan historical sales dan data musiman.
- **FR-01.2:** Sistem harus mendeteksi sinyal anomali lonjakan pesanan (> 20% deviasi dari moving average) dan memicu evaluasi stok.

#### Pilar 2: Vision Inventory Agent (FR-02)
- **FR-02.1:** Sistem wajib mendeteksi kotak kardus (`cardboard_box`) dari frame citra rak gudang (resolusi 640×640).
- **FR-02.2:** Output deteksi wajib menyertakan koordinat bounding box ternormalisasi `[0.0 - 1.0]`, jumlah box (`count`), dan rata-rata confidence score.
- **FR-02.3:** Harus menyediakan adapter AWS Lambda (`lambda_handler`) untuk eksekusi serverless berbasis event.

#### Pilar 3: Stock Reconciliation Agent (FR-03)
- **FR-03.1:** Sistem wajib membandingkan hasil hitungan fisik kamera dengan saldo pembukuan di SAP S/4HANA MM.
- **FR-03.2:** Menghitung formula Dynamic Safety Stock (SS) dan Adaptive Reorder Point (ROP):
  $$\text{ROP} = (\text{Daily Demand} \times \text{Lead Time}) + \text{Dynamic Safety Stock}$$
- **FR-03.3:** Jika stok fisik < ROP, sistem otomatis menerbitkan sinyal pengadaan darurat (*Emergency RFQ*).

#### Pilar 4: Disruption & Negotiation Agent (FR-04)
- **FR-04.1:** Sistem wajib menyusun dan mengirimkan paket RFQ digital ke minimal 3 vendor rekanan terdaftar.
- **FR-04.2:** Menggunakan Amazon Bedrock (Claude 3.5 Sonnet) untuk mengevaluasi proposal harga dan melakukan tawar-menawar harga otonom sesuai batas guardrail anggaran perusahaan.
- **FR-04.3:** Menerbitkan Purchase Order otomatis di SAP Ariba / SAP S/4HANA (BAPI_PO_CREATE1).

#### Pilar 5: Logistics Route Agent (FR-05)
- **FR-05.1:** Melacak telemetri armada pengiriman vendor secara real-time via Amazon Location Service.
- **FR-05.2:** Mengalihkan rute secara dinamis saat mendeteksi insiden kemacetan jalan tol guna menjamin estimasi kedatangan (ETA).

#### Pilar 6: Inbound Execution Agent (FR-06)
- **FR-06.1:** Menerima hasil pemindaian barcode e-PoD di dok penerimaan gudang.
- **FR-06.2:** Menjalankan posting otomatis transaksi SAP Goods Receipt (Movement Type 101) dan memperbarui saldo buku SAP MM secara instan.

---

### 1.4 Non-Functional Requirements (NFR) & SLA

| ID NFR | Kategori | Spesifikasi / Target SLA | Metode Verifikasi |
|---|---|---|---|
| **NFR-01** | **Inference Latency** | $\le 50.0\text{ ms}$ (CPU warm start) / $\le 500\text{ ms}$ (end-to-end Lambda) | `tests/unit/test_vision_inference.py` |
| **NFR-02** | **Model File Size** | $< 50.0\text{ MB}$ (Batas deployment AWS Lambda direct zip) | `computer_vision/scripts/train_yolov8.py` |
| **NFR-03** | **Akurasi Model** | $\text{mAP@50} \ge 85.0\%$ (Capaian saat ini: **99.50%**) | `computer_vision/scripts/evaluate_model.py` |
| **NFR-04** | **Frontend Responsiveness** | First Contentful Paint (FCP) $< 1.2\text{ s}$ di jaringan 4G | Google Lighthouse / DevTools |
| **NFR-05** | **Idempotensi & Keamanan** | Tidak ada mutasi ganda pada SAP PO; tidak ada kredensial hardcoded | Code review & Trivy / GitGuardian scan |
| **NFR-06** | **Ketersediaan Layanan** | Uptime Multi-Agent System $\ge 99.9\%$ (Serverless Architecture) | CloudWatch SLA Monitoring |

---

# BAGIAN 2: Software Requirements Specification (SRS)

### 2.1 Arsitektur Sistem & Komponen Antarmuka

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STOCKMIND AI SRS MAP                             │
├──────────────────────┬───────────────────────────────┬──────────────────────┤
│ SUBSYSTEM            │ KOMPONEN KODE                 │ INTERFACE EXTERNAL   │
├──────────────────────┼───────────────────────────────┼──────────────────────┤
│ 1. Vision Engine     │ computer_vision/scripts/      │ AWS Lambda / S3      │
│ 2. Data Store        │ data/schemas/, DynamoDB       │ Amazon DynamoDB      │
│ 3. Multi-Agent Logic │ agents/, integrations/        │ Amazon Bedrock       │
│ 4. ERP Connector     │ integrations/sap_s4hana/      │ SAP NetWeaver RFC    │
│ 5. Presentation      │ frontend/src/                 │ REST / WebSockets    │
│ 6. Verification      │ tests/unit/, tests/e2e/       │ Unittest / Pytest    │
└──────────────────────┴───────────────────────────────┴──────────────────────┘
```

### 2.2 External Interfaces (AWS & SAP S/4HANA)

1. **Amazon Bedrock:** Model ID `anthropic.claude-3-5-sonnet-20241022-v2:0` untuk reasoning multi-agent dan ekstraksi klausul kontrak RFQ.
2. **Amazon DynamoDB:** Tabel `stockmind-inventory-events` (On-Demand billing, TTL enabled 90 hari, Stream view: NEW_IMAGE).
3. **SAP S/4HANA On-Premise / Cloud:**
   - OData Service `API_MATERIAL_STOCK_SRV` untuk pembacaan saldo MM.
   - BAPI `BAPI_PO_CREATE1` untuk pembuatan Purchase Order.
   - BAPI `BAPI_GOODSMVT_CREATE` untuk posting penerimaan material (GR 101).

---

# BAGIAN 3: QA Test Plan & Verification Matrix

### 3.2 Master QA Verification Matrix

| Test Case ID | Modul / Pilar | Deskripsi Skenario Pengujian | Langkah Pengujian | Kriteria Keberhasilan (Expected Result) | Status | Penanggung Jawab |
|---|---|---|---|---|:---:|---|
| **TC-CV-01** | Computer Vision | Validasi kepatuhan skema JSON output inferensi | Jalankan `python -m unittest tests/unit/test_vision_inference.py -k test_01` | Response memuat key `boxes`, `count`, `confidence_avg`. `count == len(boxes)`. | `[PASS]` | ML / QA Lead |
| **TC-CV-02** | Computer Vision | Normalisasi koordinat bounding box | Jalankan `test_02_bounding_box_normalization` | Seluruh nilai `x`, `y`, `w`, `h` berada di rentang $0.0 \le val \le 1.0$. | `[PASS]` | ML / QA Lead |
| **TC-CV-03** | Computer Vision | Deteksi skenario citra kosong (Edge Case) | Kirimkan citra hitam pekat 640x640 ke `BoxDetector.detect()` | Mengembalikan `count: 0`, `boxes: []`, `confidence_avg: 0.0` (tanpa false positive). | `[PASS]` | ML / QA Lead |
| **TC-CV-04** | Computer Vision | Benchmark latensi inferensi CPU warm-start | Eksekusi 5 kali iterasi berturut-turut pada citra gudang | Rata-rata durasi inferensi $< 500\text{ ms}$ (Capaian: ~34.8 ms). | `[PASS]` | ML / QA Lead |
| **TC-CV-05** | Computer Vision | Pemanggilan AWS Lambda Handler Event | Simulasikan event dict memuat citra base64 ke `lambda_handler(event, None)` | HTTP status 200 OK, payload body memuat status `SUCCESS` dan key `count`. | `[PASS]` | Backend / QA Lead |
| **TC-CV-06** | Computer Vision | Validasi batas ukuran bobot model untuk Lambda | Periksa ukuran file `computer_vision/models/best.pt` | Ukuran file $< 50.0\text{ MB}$ (Aktual: 5.96 MB). | `[PASS]` | DevOps Lead |
| **TC-DAT-01**| Dataset | Integritas format label YOLO dan citra | Jalankan `python computer_vision/scripts/validate_dataset.py --data-dir computer_vision/data --yaml-file computer_vision/data/data.yaml` | 100% citra terpasangkan dengan label, tidak ada koordinat bounding box di luar batas [0, 1]. | `[PASS]` | ML Lead |
| **TC-REC-01**| Reconciliation | Deteksi disparitas phantom inventory | Input fisik = 46, input SAP = 60 | Menghasilkan delta = -14 unit, status `CRITICAL_DEFICIT`, dan pemicu ROP aktif. | `[READY]` | Backend Lead |
| **TC-NEG-01**| Procurement | Penolakan penawaran vendor melebihi batas guardrail | Simulasikan vendor mengajukan harga Rp 16.000 (batas maks: Rp 14.000) | Bedrock Agent mengirimkan pesan penawaran balik (*counter-offer*) atau mengeliminasi vendor. | `[READY]` | Backend Lead |
| **TC-UI-01**  | Frontend UI | Rendering interaktif feed kamera gudang | Buka tab Vision Agent, ganti kamera ke CAM-02 | Citra `/warehouse_box_test_0002.jpg` tampil dengan bounding box akurat, tanpa error F12. | `[PASS]` | Frontend / QA |
| **TC-UI-02**  | Frontend UI | Filter confidence slider pada kamera feed | Geser slider threshold dari 0.25 ke 0.90 | Bounding box dengan konfidensi < 0.90 otomatis tersembunyi dari canvas. | `[PASS]` | Frontend / QA |
| **TC-UI-03**  | Frontend UI | Eksekusi simulasi Closed-Loop MAS Modal | Klik tombol "Run Autonomous Cycle" pada header | Modal terbuka dan animasi siklus 6 agen berputar secara berurutan hingga selesai. | `[PASS]` | Frontend / QA |
| **TC-E2E-01** | End-to-End | Siklus penuh: Deteksi fisik $\to$ Goods Receipt SAP | Pemicu scan CAM-01 $\to$ Terbitkan PO $\to$ Posting GR | Saldo buku SAP bertambah dari 60 menjadi 96 unit secara konsisten. | `[READY]` | Full Team |

---

### 3.3 Definition of Done (DoD) per Milestone

#### Phase 1: Foundation & Vision System (Status: COMPLETED)
- [x] Dataset rak gudang tervalidasi tanpa label korup (`validate_dataset.py`).
- [x] Model YOLOv8n dilatih dan diekspor ke `best.pt` dengan ukuran < 50 MB.
- [x] Akurasi model mAP@50 mencapai target $\ge 85\%$ (Capaian: 99.50%).
- [x] Unit test kontrak inferensi dan latensi lulus 100% (`test_vision_inference.py`).
- [x] Frontend dashboard menyediakan visualisasi interaktif untuk seluruh 7 view rantai pasok.

#### Phase 2: Database & Backend Integration (Status: READY TO CODE)
- [ ] Tabel DynamoDB `stockmind-inventory-events` ter-deploy via template CDK / Terraform.
- [ ] Lambda adapter `lambda_handler.py` terhubung ke event upload S3 dan menulis ke DynamoDB.
- [ ] Endpoint REST API FastAPI / API Gateway siap dikonsumsi oleh Frontend Dashboard menggantikan mock data.
