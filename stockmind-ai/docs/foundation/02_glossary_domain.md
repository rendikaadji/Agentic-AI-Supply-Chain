# StockMind AI — Glossary Domain & Technical Dictionary

**Document ID:** `DOC-FD-02`  
**Document Name:** Glossary Domain & Technical Dictionary  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/02_glossary_domain.md`  

---

## 1. Pendahuluan

Dokumen ini mendefinisikan secara resmi istilah teknis industri rantai pasok (*supply chain*), sistem ERP enterprise (*SAP S/4HANA*), arsitektur kecerdasan buatan (*agentic & computer vision*), serta peran aktor yang berinteraksi di dalam ekosistem **StockMind AI**. Seluruh anggota tim pengembang dan pemangku kepentingan wajib mengacu pada terminologi standar ini untuk mencegah perbedaan interpretasi.

---

## 2. Glosarium Istilah Domain & Akronim Sistem

| No | Istilah / Akronim | Kategori | Definisi & Penjelasan Teknis | Konteks Penggunaan di StockMind AI |
|:---:|---|---|---|---|
| 1 | **Phantom Inventory** | Supply Chain / Gudang | Kondisi disparitas di mana saldo pembukuan ERP mencatat stok tersedia, padahal fisik di rak gudang sebenarnya kosong/rusak/hilang akibat salah penempatan atau pencurian. | Masalah fundamental yang dideteksi saat rekonsiliasi antara hasil inferensi YOLOv8 (Fisik) vs SAP S/4HANA MM (Buku). |
| 2 | **Safety Stock (SS)** | Inventory Control | Cadangan persediaan minimum penyangga untuk meredam fluktuasi lonjakan permintaan pasar dan variansi keterlambatan pengiriman vendor. | Dihitung secara adaptif menggunakan formula standar APICS: $SS = Z \times \sigma_d \times \sqrt{L}$. |
| 3 | **Adaptive Reorder Point (ROP)** | Inventory Control | Ambang batas saldo persediaan yang memicu pengadaan kembali, dihitung dinamis mengikuti perubahan musiman pasar: $ROP = (d \times L) + SS$. | Jika stok fisik terdeteksi berada di bawah nilai ROP, sistem otomatis mengaktifkan status `CRITICAL_DEFICIT` dan memicu RFQ darurat. |
| 4 | **Demurrage Cost** | Logistik & Transportasi | Biaya denda penalti finansial yang timbul akibat armada truk tertahan melebihi batas waktu tunggu di area dok bongkar muat gudang. | Diminimalisir hingga 19% melalui kombinasi rerouting dinamis (Pilar 5) dan verifikasi instan surat jalan via chatbot supir (Pilar 6). |
| 5 | **Bullwhip Effect** | Supply Chain Dynamics | Fenomena distorsi informasi di mana fluktuasi permintaan kecil di tingkat konsumen akhir membesar secara eksponensial ke hulu rantai pasok. | Dimitigasi oleh Pilar 1 (*Demand Sensing*) dengan membaca sinyal deret waktu penjualan langsung dan faktor musiman. |
| 6 | **Closed-Loop MAS** | Arsitektur AI | *Multi-Agent System* siklus tertutup di mana output eksekusi pilar akhir (Goods Receipt) memulihkan input pilar awal secara kontinu tanpa jeda manual klerikal. | Kerangka orkestrasi 6 pilar dari deteksi visual sampai pembukuan saldo SAP pulih ke 96 unit. |
| 7 | **SAP S/4HANA MM** | Enterprise ERP | Modul *Materials Management* di SAP yang mengelola master data material, saldo buku inventaris, dan pergerakan barang (*goods movements*). | Sistem pembukuan master yang disinkronisasikan oleh Agen Rekonsiliasi dan Inbound Execution. |
| 8 | **SAP Ariba** | Procurement Platform | Platform pengadaan digital enterprise berbasis cloud untuk interaksi B2B dengan jaringan vendor rekanan penyedia bahan baku. | Sistem tujuan pengiriman penawaran dan penerbitan Purchase Order otomatis oleh Pilar 4. |
| 9 | **BAPI (Business API)** | Antarmuka SAP | Fungsi antarmuka standar berstandar enterprise yang disediakan SAP untuk mengintegrasikan sistem luar dengan database transaksi SAP. | Menggunakan mock yang kompatibel: `BAPI_PO_CREATE1` (buat PO) dan `BAPI_GOODSMVT_CREATE` (Goods Receipt). |
| 10 | **Goods Receipt (GR 101)** | Logistik / SAP | Transaksi pengakuan fisik barang yang masuk ke area gudang penyimpanan (*Movement Type 101* di SAP). | Diterbitkan otomatis oleh Pilar 6 setelah verifikasi surat jalan berhasil, menambah saldo SAP dari 46 ke 96 unit. |
| 11 | **RFQ (Request for Quotation)** | Procurement | Undangan penawaran harga resmi dari pembeli ke beberapa vendor rekanan untuk kuantitas dan spesifikasi barang tertentu. | Diterbitkan secara otonom oleh Pilar 4 ke minimal 3 vendor rekanan terdaftar saat terjadi kondisi *stockout*. |
| 12 | **e-PoD** | Logistik | *Electronic Proof of Delivery* — bukti tanda terima penyerahan barang secara digital (berupa kode alfanumerik / barcode unik). | Kunci verifikasi pencocokan muatan fisik di Dok-02 antara armada vendor dan catatan PO sistem. |
| 13 | **Delivery Order / Surat Jalan** | Logistik / Lapangan | Dokumen fisik kertas resmi bertanda tangan basah yang dibawa oleh supir truk sebagai bukti legal pengiriman barang dari vendor. | Diambil fotonya oleh supir truk menggunakan smartphone dan dikirim ke chatbot untuk diekstraksi datanya secara otomatis. |
| 14 | **Spatial CV (YOLOv8n)** | Computer Vision | Model Deep Learning konvolusional cepat untuk mendeteksi lokasi dan jumlah objek kotak kardus (`cardboard_box`) dalam frame gambar. | Model Deep Learning #1 (`best.pt`, 5.96 MB, latensi 35 ms) yang dijalankan pada kamera pengawas rak gudang. |
| 15 | **Document Vision OCR** | Computer Vision / NLP | Model Deep Learning pengenal teks visual untuk mengekstrak entitas teks terstruktur, stempel, dan nomor PO dari foto dokumen surat jalan. | Model Deep Learning #2 di gerbang masuk dokumen Pilar 6. |
| 16 | **Dual Synchronization Layer** | Arsitektur Integrasi | Mekanisme pencatatan data ganda yang serentak mengalirkan data ke Google Sheets API (monitoring tim operasional) dan SAP S/4HANA (audit enterprise). | Menjamin transparansi instan bagi operator gudang di lapangan tanpa mengabaikan tata kelola korporat ERP. |
| 17 | **Guardrails SOP** | Tata Kelola AI | Aturan batasan ketat korporat yang membatasi wewenang agen AI (misal: diskon minimal 8%, rating vendor $\ge 4.0$, termin kredit Net-30/60). | Mencegah *hallucination* atau transaksi pembelian non-kontrak (*maverick spending*) oleh LLM. |

---

## 3. Peran & Aktor Sistem

| Aktor | Tipe | Peran Utama | Interaksi dengan StockMind AI |
|---|---|---|---|
| **Warehouse Supervisor** | Pengguna Manusia | Mengawasi kondisi fisik rak gudang dan memastikan kesesuaian stok opname harian. | Memantau dashboard *Vision Agent* dan *Stock Reconciliation* secara visual real-time. |
| **Procurement Manager** | Pengguna Manusia | Bertanggung jawab atas anggaran belanja bahan baku korporat dan relasi vendor. | Memberikan otorisasi *one-click approval* untuk PO bernilai tinggi di atas batas wewenang otonom. |
| **Supply Chain Director** | Pengguna Manusia | Menjaga kelancaran pasokan produksi, SLA pengiriman, dan efisiensi modal kerja. | Memantau ringkasan KPI agregat, efisiensi biaya logistik, dan laporan mitigasi risiko di dashboard. |
| **Supir Truk Armada** | Aktor Lapangan | Mengemudikan truk pengantar barang dari vendor rekanan ke dok penerimaan gudang. | Mengirimkan foto kertas surat jalan via aplikasi pesan instan (**WhatsApp/Telegram Bot**) tanpa perlu login ke sistem. |
| **Multi-Agent Orchestrator** | Sistem AI | Koordinator ReAct utama yang mengeksekusi urutan *Thought, Action, dan Observation* lintas 6 pilar. | Menjalankan pipeline otonom via REST API (`POST /api/orchestrator/run-cycle`). |
