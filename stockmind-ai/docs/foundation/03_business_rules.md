# StockMind AI — Business Rules Specification

**Document ID:** `DOC-FD-03`  
**Document Name:** Business Rules Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/03_business_rules.md`  

---

## 1. Pendahuluan

Dokumen ini memuat seluruh aturan bisnis operasional, tata kelola enterprise (*enterprise guardrails*), serta logika pengambilan keputusan otonom yang wajib dipatuhi oleh sistem **StockMind AI**. Setiap aturan ditulis menggunakan format ketat: **Kondisi $\rightarrow$ Aturan $\rightarrow$ Konsekuensi** guna memastikan perilaku sistem konsisten, dapat diaudit, dan terlindungi dari risiko kesalahan eksekusi.

---

## 2. Aturan Bisnis Inti (Core Business Rules)

### BR-01: Deteksi Disparitas Fisik vs Pembukuan (Phantom Inventory Trigger)
* **Kondisi:** Hasil hitungan fisik kamera rak gudang (`physical_count`) berbeda dengan saldo pembukuan di SAP S/4HANA MM (`sap_recorded_stock`), yaitu $\Delta = \text{Fisik} - \text{SAP} \neq 0$.
* **Aturan:** Sistem wajib mencatat delta disparitas ke log audit DynamoDB/S3 dan menggunakan angka fisik riil kamera sebagai acuan utama keputusan operasional selanjutnya.
* **Konsekuensi:** Mencegah ERP melakukan perencanaan pasokan berbasis angka pembukuan fiktif (*phantom stock*).

### BR-02: Pemicu Ambang Batas Pengadaan Darurat (Adaptive ROP Threshold)
* **Kondisi:** Stok fisik terkonfirmasi berada di bawah nilai Adaptive Reorder Point ($\text{Stok Fisik} < \text{ROP}$).
* **Aturan:** Sistem wajib secara otomatis mengubah status inventaris SKU menjadi `CRITICAL_DEFICIT` dan menerbitkan event pengadaan darurat (*Emergency RFQ*) tanpa menunggu jadwal audit kuartalan manual.
* **Konsekuensi:** Mencegah terjadinya kekosongan bahan baku total (*stockout*) yang dapat menghentikan lini produksi pabrik.

### BR-03: Integritas Perhitungan Persediaan Deterministik APICS (Anti-Halusinasi)
* **Kondisi:** Sistem menghitung *Safety Stock* (SS) dan *Adaptive Reorder Point* (ROP) untuk bahan baku.
* **Aturan:** Sistem WAJIB menggunakan formula deterministik baku APICS:
  $$\text{SS} = \lceil Z \times \sigma_d \times \sqrt{L} \rceil \quad (\text{dengan } Z = 1.65 \text{ untuk service level 95\%})$$
  $$\text{ROP} = \lceil (d \times L) + \text{SS} \rceil$$
  Sistem DILARANG KERAS menggunakan angka tebakan bebas dari LLM untuk perhitungan matematis neraca inventaris.
* **Konsekuensi:** Nilai persediaan selalu akurat, dapat diaudit secara finansial, dan bebas risiko halusinasi AI.

### BR-04: Kualifikasi & Seleksi Vendor Rekanan
* **Kondisi:** Sistem memilih kandidat vendor untuk pengadaan bahan baku darurat.
* **Aturan:** Vendor yang dievaluasi wajib memenuhi 3 kriteria minimum:
  1. Terdaftar resmi di sistem rekanan SAP Ariba.
  2. Memiliki *historical performance rating* $\ge 0.85$ (skala 0.0 - 1.0) atau $\ge 4.0$ (skala 1 - 5).
  3. Memiliki komitmen *lead time* pengiriman $\le 5$ hari kerja.
* **Konsekuensi:** Vendor dengan performa buruk atau tidak terdaftar otomatis didiskualifikasi dari proses negosiasi.

### BR-05: Guardrail Batas Negosiasi Harga & Termin Pembayaran
* **Kondisi:** Agen AI (Cognitive LLM) menjalankan diplomasi tawar-menawar harga dengan vendor rekanan.
* **Aturan:** Negosiasi wajib mematuhi *guardrail corporate policy*:
  1. Target diskon minimal yang harus dicapai adalah $\ge 8.0\%$ dari harga penawaran awal vendor.
  2. Harga akhir per unit tidak boleh melebihi plafon anggaran (*target budget ceiling*).
  3. Termin kredit pembayaran wajib Net-30 atau Net-60 hari.
* **Konsekuensi:** Pembelian non-kontrak (*maverick spending*) tereliminasi, penghematan kas perusahaan terjamin secara konsisten.

### BR-06: Batas Wewenang Belanja & Otorisasi Human-in-the-Loop (HitL)
* **Kondisi:** Nilai total Purchase Order yang dihitung melebihi batas wewenang otonom (*threshold* belanja mandiri, misal $> \text{Rp } 10.000.000$).
* **Aturan:** Sistem wajib menghentikan alur sementara (*PAUSE workflow*), menghasilkan ringkasan *Draft PO*, dan meminta otorisasi digital satu klik (*One-Click Digital Approval*) dari Manajer Procurement/Finance.
* **Konsekuensi:** PO resmi tidak akan diterbitkan ke SAP sebelum ada persetujuan manusia yang sah; jika nilai $\le \text{Rp } 10.000.000$ dan berstatus darurat, PO diterbitkan secara otonom.

### BR-07: Mitigasi Kemacetan & Pengalihan Rute Armada Vendor
* **Kondisi:** Telemetri Amazon Location Service mendeteksi estimasi keterlambatan armada $> 30\text{ menit}$ akibat kemacetan lalu lintas jalan raya / jalan tol.
* **Aturan:** Sistem wajib menghitung rute alternatif (arteri/bypass) dan mengirimkan instruksi pengalihan rute ke armada ekspedisi vendor.
* **Konsekuensi:** Menjaga estimasi waktu kedatangan (ETA) tepat waktu dan menghindarkan perusahaan dari denda penalti keterlambatan dok (*demurrage*).

### BR-08: Validasi Ketat Surat Jalan Fisik (Waybill Matching) di Dok Penerimaan
* **Kondisi:** Supir truk mengirimkan foto surat jalan kertas melalui bot chat saat tiba di gerbang dok gudang.
* **Aturan:** Data hasil ekstraksi Deep Learning OCR wajib diverifikasi silang (*cross-match*):
  1. Nomor PO pada surat jalan harus berstatus `RELEASED / AWAITING_DELIVERY` di SAP.
  2. Kuantitas barang yang dikirim ($\text{Qty}$) harus bernilai $\le$ sisa kuantitas PO yang belum diterima.
  3. Stempel vendor dan cap basah pengesahan terdeteksi.
* **Konsekuensi:** Jika data cocok, supir langsung diarahkan ke nomor dok bongkar muat; jika tidak cocok, pengiriman ditolak sementara (*quarantined*) dan tim gudang diberi notifikasi peringatan.

### BR-09: Idempotensi Transaksi Penerimaan Barang (Anti-Double Counting SAP)
* **Kondisi:** Eksekusi transaksi posting Goods Receipt (`BAPI_GOODSMVT_CREATE` Movement Type 101).
* **Aturan:** Setiap kode barcode e-PoD / nomor surat jalan unik hanya boleh dieksekusi tepat 1 kali (*strict idempotency*).
* **Konsekuensi:** Mencegah mutasi saldo ganda pada sistem pembukuan SAP MM akibat pengiriman ulang foto atau duplikasi request jaringan.

### BR-10: Atomisitas Dual Synchronization Layer
* **Kondisi:** Mutasi saldo inventaris berhasil divalidasi di dok penerimaan.
* **Aturan:** Sistem wajib serentak memperbarui baris data di **Google Sheets API** (untuk monitoring operasional cepat tim lantai gudang) dan menerbitkan **SAP Material Document** resmi (untuk audit kepatuhan korporat).
* **Konsekuensi:** Menghilangkan celah miskomunikasi antara staf lapangan gudang dan auditor ERP korporat.
