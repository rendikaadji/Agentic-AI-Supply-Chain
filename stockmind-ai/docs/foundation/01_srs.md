# StockMind AI — Software Requirements Specification (SRS)

**Document ID:** `DOC-FD-01`  
**Document Name:** Software Requirements Specification (SRS)  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/01_srs.md`  

---

## 1. Pendahuluan & Latar Belakang Masalah

StockMind AI adalah sistem orkestrasi rantai pasok otonom tertutup (*closed-loop*) 6 pilar yang dirancang untuk mengatasi 4 titik kerapuhan kritis industri manufaktur dan distribusi:

1. **Phantom Inventory (Disparitas Fisik vs SAP ERP):** Saldo buku di ERP SAP S/4HANA Materials Management (MM) sering kali mencatat stok mencukupi, padahal di rak fisik gudang barang telah habis karena salah letak, rusak, atau pencurian (deviasi rata-rata industri mencapai 15%–22%), memicu *line shutdown* pabrik mendadak.
2. **Keterlambatan Deteksi Stockout (Static Reorder Point):** Sistem ERP tradisional mengandalkan Reorder Point (ROP) statis yang dihitung per kuartal sehingga gagal mengantisipasi lonjakan musiman pasar sebelum stok fisik di gudang benar-benar habis.
3. **Inersia Pengadaan Klerikal (Procurement Latency):** Proses penerbitan Request for Quotation (RFQ), negosiasi diskon harga ke vendor rekanan, hingga pembuatan Purchase Order (PO) manual memakan waktu rata-rata 4–8 hari kerja.
4. **Blind-Spot Logistik & Antrean Dok Penerimaan (Inbound Bottleneck):** Armada vendor kerap terjebak kemacetan tanpa rute dinamis. Ketika tiba di gudang, supir membawa surat jalan kertas manual. Petugas gudang membutuhkan 30–45 menit per truk untuk mencocokkan dokumen fisik dan menginput transaksi Goods Receipt (GR 101) ke komputer SAP, memicu denda penalti antrean dok (*demurrage cost*) membengkak hingga 14%–19%.

---

## 2. Input & Output Sistem

### 2.1 Input Utama
* **Data Penjualan Historis:** Time-series transaksi penjualan SAP S/4HANA (harian/mingguan).
* **Frame Citra CCTV Gudang:** Snapshot kamera resolusi 640×640 (format RGB/JPEG) dari rak penyimpanan.
* **Saldo Buku Inventaris:** Catatan stok master material SAP S/4HANA MM.
* **Proposal Penawaran Vendor:** Dokumen RFQ & penawaran harga vendor rekanan terdaftar.
* **Telemetri Rute Armada:** Koordinat GPS dan sinyal kondisi lalu lintas jalan raya.
* **Foto Surat Jalan (Delivery Order):** Citra lembaran fisik kertas surat jalan bertanda tangan yang dikirimkan supir truk melalui antarmuka chatbot (WhatsApp/Telegram).

### 2.2 Output Utama
* **Hasil Proyeksi Kebutuhan:** Angka proyeksi kebutuhan 14 hari ke depan beserta peringatan lonjakan (*spike alert*).
* **Hasil Hitungan Fisik Rak:** Koordinat bounding box ternormalisasi `[0.0 - 1.0]`, jumlah unit box terdeteksi, dan rata-rata confidence score.
* **Hasil Rekonsiliasi Stok:** Nilai disparitas delta inventaris, Dynamic Safety Stock, dan Adaptive Reorder Point (ROP).
* **Purchase Order SAP:** Dokumen PO resmi hasil negosiasi otonom (`BAPI_PO_CREATE1`).
* **Instruksi Pengalihan Rute:** Rekomendasi rute alternatif bebas hambatan untuk menjaga ETA armada.
* **Verifikasi Surat Jalan & Goods Receipt:** Ekstraksi JSON terstruktur dari foto surat jalan, sinkronisasi baris transaksi ke Google Sheets, dan nomor SAP Material Document (`GR 101 Movement Type`).

---

## 3. Functional Requirements (FR) 6 Pilar

### 3.1 Pilar 1: Demand Sensing Agent (FR-01)
* **FR-01.1:** Sistem wajib memproyeksikan estimasi kebutuhan bahan baku 14 hari ke depan menggunakan model Machine Learning Time-Series (LightGBM/Prophet/XGBoost).
* **FR-01.2:** Sistem harus mendeteksi anomali lonjakan permintaan (>20% deviasi dari tren rata-rata bergerak) dan otomatis meneruskan sinyal pemicu ke pilar persediaan.

### 3.2 Pilar 2: Vision Inventory Agent (FR-02)
* **FR-02.1:** Sistem wajib memproses citra frame kamera rak gudang menggunakan model Deep Learning Spatial CV YOLOv8n (`best.pt`).
* **FR-02.2:** Output deteksi wajib mengidentifikasi objek `cardboard_box` dengan melampirkan array bounding box, total unit fisik (`count`), dan *average confidence*.
* **FR-02.3:** Menyediakan adapter serverless AWS Lambda (`lambda_handler`) dengan dukungan *warm start model caching*.

### 3.3 Pilar 3: Stock Reconciliation Agent (FR-03)
* **FR-03.1:** Sistem wajib membandingkan hasil hitungan fisik kamera dengan saldo pembukuan SAP S/4HANA MM untuk menghitung disparitas ($Delta = \text{Fisik} - \text{SAP}$).
* **FR-03.2:** Sistem wajib menerapkan formula persediaan deterministik APICS standar:
  $$\text{SS} = Z \times \sigma_d \times \sqrt{L}$$
  $$\text{ROP} = (d \times L) + \text{SS}$$
* **FR-03.3:** Jika $\text{Stok Fisik} < \text{ROP}$, sistem wajib secara otonom memicu status `CRITICAL_DEFICIT` dan menerbitkan event pengadaan darurat.

### 3.4 Pilar 4: Disruption & Negotiation Agent (FR-04)
* **FR-04.1:** Sistem wajib mengevaluasi penawaran harga dari minimal 3 vendor rekanan terdaftar berdasarkan harga, lead time, dan rating vendor.
* **FR-04.2:** Menggunakan Cognitive LLM (Qwen 2.5 / Claude 3.5 Sonnet) untuk melakukan diplomasi negosiasi harga otonom sesuai batasan guardrail SOP korporat.
* **FR-04.3:** Menerbitkan dokumen Purchase Order otomatis melalui antarmuka SAP Ariba / SAP S/4HANA (`BAPI_PO_CREATE1`).

### 3.5 Pilar 5: Logistics Route Agent (FR-05)
* **FR-05.1:** Sistem wajib memonitor telemetri GPS dan status lalu lintas armada vendor pengirim via Amazon Location Service.
* **FR-05.2:** Jika terdeteksi insiden kemacetan jalan tol, sistem harus melakukan rerouting dinamis untuk menghemat waktu keterlambatan dan mencegah biaya denda antrean dok (*demurrage*).

### 3.6 Pilar 6: Inbound Execution Agent (FR-06)
* **FR-06.1 (Chatbot Supir):** Menyediakan antarmuka komunikasi bot (WhatsApp/Telegram Bot API) untuk menerima kiriman foto lembaran kertas surat jalan dari supir truk.
* **FR-06.2 (Preprocessing & OCR):** Melakukan auto-crop dan contrast adjustment via OpenCV, lalu mengekstrak teks surat jalan (Nomor Surat Jalan, Nomor PO, Nama Vendor, SKU, Kuantitas) menggunakan Deep Learning Document Vision OCR.
* **FR-06.3 (Dual Synchronization Layer):**
  * Mencatat log penerimaan secara real-time ke **Google Sheets API** untuk monitoring instan tim operasional gudang.
  * Memvalidasi kode e-PoD dan mengeksekusi mutasi saldo inventaris di SAP S/4HANA melalui transaksi **Goods Receipt Movement Type 101** (`BAPI_GOODSMVT_CREATE`).
* **FR-06.4 (Notifikasi Supir):** Mengirimkan balasan otomatis ke aplikasi pesan supir truk yang mengonfirmasi validitas dokumen dan mengarahkan nomor dok bongkar muatan.

---

## 4. Non-Functional Requirements (NFR) & SLA

| ID NFR | Kategori | Spesifikasi & Target SLA | Cara Pengujian |
|---|---|---|---|
| **NFR-01** | Latensi Spatial CV | $\le 50.0\text{ ms}$ (CPU warm start) / $\le 500\text{ ms}$ (Lambda) | `test_vision_inference.py` |
| **NFR-02** | Ukuran Model CV | $< 50.0\text{ MB}$ (Aktual model YOLOv8n: **5.96 MB**) | Inspeksi file `best.pt` |
| **NFR-03** | Akurasi Deteksi Box | $\text{mAP@50} \ge 85.0\%$ (Aktual: **99.50%** baseline) | `evaluate_model.py` |
| **NFR-04** | Latensi Pipeline OCR | $\le 2.0\text{ detik}$ dari foto diterima hingga JSON terekstraksi | Benchmark pipeline OCR |
| **NFR-05** | Kontrak Kompatibilitas | Zero breaking changes pada signature `tool_06_inbound_goods_receipt` | Unit test tool registry |
| **NFR-06** | Latensi Dual Sync | Google Sheets $\le 1.0\text{ s}$, SAP BAPI $\le 2.0\text{ s}$ | Integration test |
| **NFR-07** | Keamanan Data | Kredensial disimpan via `.env`/AWS Secrets Manager, audit log terenkripsi KMS | SAIF security checklist |
| **NFR-08** | Skalabilitas & SLA | Arsitektur stateless, decoupling asynchronous event bus, Uptime $\ge 99.9\%$ | Load testing backend |

---

## 5. Out of Scope (Eksplisit di Luar Batasan MVP Saat Ini)

1. **Live Hardware CCTV RTSP Streaming:** Di luar MVP; input visi gudang menggunakan capture frame snapshot JPEG terdistribusi.
2. **Koneksi Live ke Core SAP Production Enterprise:** Di luar MVP; menggunakan SAP Sandbox / Mock BAPI Service yang kompatibel 1:1 secara skema data.
3. **Pengenalan Tulisan Tangan Bebas Tanpa Format:** OCR difokuskan pada format lembaran Delivery Order cetak terstruktur dengan stempel dan tanda tangan.
4. **Multi-Warehouse Cross-Border:** MVP difokuskan pada 1 site pilot gudang manufaktur/distribusi.

---

## 6. Asumsi Implementasi Teknis

* **Asumsi 1:** Engine OCR lokal didukung oleh kombinasi OpenCV preprocessing + lightweight OCR model (PaddleOCR/TrOCR atau Vision-LLM fallback), sehingga dapat berjalan pada laptop pengembang tanpa dependensi hardware GPU server.
* **Asumsi 2:** Chatbot supir pada tahap demo menggunakan endpoint webhook Telegram Bot API (bebas biaya dan mudah disimulasikan) dengan opsi ekspansi ke WhatsApp Business Cloud API.
