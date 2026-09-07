# StockMind AI — Architecture Decision Records (ADR)

**Document ID:** `DOC-FD-07`  
**Document Name:** Architecture Decision Records (ADR)  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/07_adr.md`  

---

## 1. Pendahuluan

Dokumen ini mencatat keputusan-keputusan arsitektural paling signifikan, berisiko tinggi, dan berdampak fundamental terhadap desain teknis sistem **StockMind AI**. Setiap catatan merangkum konteks masalah, keputusan yang diambil, alternatif yang ditolak, serta konsekuensi teknisnya.

---

## 2. Daftar Rekam Keputusan Arsitektur

### ADR-01: Penerapan Balanced AI Architecture vs Full Blackbox LLM

* **Status:** `ACCEPTED`
* **Context:**  
  Rantai pasok manufaktur melibatkan spektrum domain yang sangat lebar: ekstraksi visual rak fisik gudang, analisis data historis deret waktu penjualan, kepatuhan finansial neraca audit ERP, dan diplomasi negosiasi B2B. Pendekatan naif (*anti-pattern*) yang memaksakan model LLM tunggal untuk mengerjakan seluruh siklus dari awal hingga akhir (*end-to-end blackbox*) menimbulkan 3 risiko fatal:
  1. *Halusinasi Angka:* Model probabilistik LLM tidak dapat dipercaya untuk perhitungan persediaan matematis yang mengikat neraca audit korporat.
  2. *Latensi Tinggi:* Inferensi vision LLM memakan waktu 2 hingga 5 detik per frame gambar, tidak memenuhi target SLA gudang.
  3. *Biaya Token:* Pengiriman gambar CCTV resolusi tinggi secara terus menerus memboroskan biaya operasional API.
* **Decision:**  
  Membagi beban kerja ke dalam komposisi sistem seimbang (*Balanced AI Architecture*):
  * **2 Model Deep Learning:** YOLOv8n (Spatial CV deteksi box di rak) + Document Vision OCR (ekstraksi teks surat jalan supir).
  * **1 Model Machine Learning:** Time-series statistical forecasting (LightGBM/Prophet/XGBoost) untuk peramalan permintaan 14 hari.
  * **1 Cognitive LLM:** Qwen 2.5:7b (Ollama lokal) / Claude 3.5 Sonnet (AWS Bedrock) khusus untuk diplomasi negosiasi harga dan orkestrasi tools.
  * **2 Mesin Deterministik:** Formula baku APICS untuk perhitungan persediaan ($SS$ & $ROP$) dan optimasi graf rute armada logistik.
* **Alternatives Considered:**  
  * *End-to-End Multimodal Vision-LLM (GPT-4V / Gemini Flash tunggal):* Ditolak karena biaya tinggi, latensi tidak konsisten, dan risiko halusinasi angka persediaan.
* **Consequences:**  
  * $(+)$ Angka persediaan 100% akurat, deterministik, dan dapat diaudit secara finansial.
  * $(+)$ Latensi deteksi visual sangat cepat (rata-rata 34.8 ms pada CPU).
  * $(+)$ Biaya operasional $0$ rupiah saat dijalankan di lingkungan lokal.
  * $(-)$ Tim pengembang harus memelihara multi-stack dependensi (PyTorch/Ultralytics untuk CV, FastAPI untuk backend, dan LLM runtime).

---

### ADR-02: YOLOv8n CPU Warm Start (<50ms) & Lambda Adapter vs Cloud Rekognition Berbayar

* **Status:** `ACCEPTED`
* **Context:**  
  Sistem membutuhkan verifikasi stok fisik secara visual dari kamera gudang. Tim memerlukan solusi yang dapat diuji mandiri oleh seluruh anggota tim tanpa dependensi kartu kredit atau kuota awal cloud berbayar, namun memiliki jalur integrasi mulus (*seamless deployment path*) ke ekosistem AWS serverless.
* **Decision:**  
  Melatih model *custom* YOLOv8 nano (`best.pt`, 5.96 MB), menerapkan teknik *lazy-loading singleton model caching* untuk warm-start latensi CPU (~35 ms), dan membungkusnya dalam modul adapter `computer_vision/inference/lambda_handler.py`.
* **Alternatives Considered:**  
  * *Amazon Rekognition Custom Labels:* Ditolak untuk fase prototipe awal karena membutuhkan biaya training per jam komputasi cloud dan keterikatan vendor (*vendor lock-in*) yang menyulitkan pengujian lokal offline.
* **Consequences:**  
  * $(+)$ Model sangat portabel (5.96 MB), jauh di bawah batas kuota deployment langsung AWS Lambda zip (50 MB).
  * $(+)$ Lulus uji 5/5 unit test latensi dan kontrak JSON interface dengan target SLA terpenuhi (<500 ms).
  * $(-)$ Diperlukan dataset anotasi internal jika ingin memperluas deteksi ke jenis kemasan non-kardus di masa depan.

---

### ADR-03: Inovasi Chatbot Supir & Dual Synchronization Layer (Google Sheets & SAP BAPI 101)

* **Status:** `ACCEPTED`
* **Context:**  
  Pada kenyataan operasional lapangan di Indonesia, supir truk logistik tidak pernah login ke portal web manajemen gudang perusahaan. Alat komunikasi utama mereka adalah WhatsApp atau Telegram di smartphone. Selain itu, lembaran surat jalan masih berupa kertas fisik resmi bertanda tangan. Di dok gudang, petugas membutuhkan waktu 30-45 menit untuk verifikasi dokumen fisik dan menginput ke komputer SAP, memicu denda penalti antrean dok (*demurrage cost*). Di sisi lain, staf lantai gudang membutuhkan visibilitas instan tanpa harus membuka terminal SAP yang kaku.
* **Decision:**  
  1. Menghadirkan antarmuka percakapan bot (WhatsApp/Telegram Bot API) sebagai gerbang masukan supir truk mengunggah foto surat jalan.
  2. Menerapkan Deep Learning Model #2 Document Vision OCR untuk auto-ekstraksi nomor PO, nomor surat jalan, dan kuantitas barang.
  3. Mengalirkan hasil verifikasi secara serentak (*Dual Sync Layer*):
     * Log baris real-time ke **Google Sheets API** untuk monitoring instan tim operasional gudang.
     * Transaksi resmi **SAP Goods Receipt 101** (`BAPI_GOODSMVT_CREATE`) untuk integritas data korporat.
* **Alternatives Considered:**  
  * *Mewajibkan Supir Membuka Web Dashboard Gudang:* Ditolak karena supir truk menolak antarmuka rumit dan menghambat adopsi lapangan.
  * *Hanya Mengandalkan SAP MM Tanpa Google Sheets:* Ditolak karena staf gudang tidak selalu memiliki lisensi SAP atau akses terminal saat berada di area bongkar muat fisik.
* **Consequences:**  
  * $(+)$ Menghilangkan waktu tunggu antrean verifikasi dok dari 45 menit menjadi di bawah 2 menit per truk.
  * $(+)$ Nol perubahan kontrak (*zero breaking changes*) pada signature fungsi `tool_06_inbound_goods_receipt`.
  * $(+)$ Tim lapangan mendapat visibilitas real-time di Google Sheets yang sangat ramah pengguna.
  * $(-)$ Memerlukan konektivitas internet seluler di smartphone supir truk untuk mengunggah foto lembaran kertas.
