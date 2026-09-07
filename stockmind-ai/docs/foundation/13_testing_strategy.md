# StockMind AI — Testing Strategy & Quality Assurance Matrix

**Document ID:** `DOC-FD-13`  
**Document Name:** Testing Strategy & Quality Assurance Matrix  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/13_testing_strategy.md`  

---

## 1. Piramida & Strategi Pengujian (Testing Pyramid)

StockMind AI menerapkan strategi pengujian berlapis guna menjamin keandalan sistem dari level unit terkecil hingga simulasi alur end-to-end Demo Day:

```text
               ▲
              / \
             /   \      Level 4: End-to-End Demo Simulation (UI & FastAPI)
            / E2E \
           /───────\    Level 3: Multi-Agent Integration Tests (Closed-Loop)
          / Integr. \
         /───────────\  Level 2: Model Benchmark & Dataset Integrity
        /  CV & Math  \
       /───────────────\Level 1: Unit Tests & Lambda Contract (Latency <50ms)
      /─────────────────\
```

### Rincian Lapisan Pengujian:
1. **Level 1: Unit Testing (Lambda Contract & Latency):**
   * Memvalidasi class `BoxDetector` dan fungsi `lambda_handler`.
   * Menjamin format payload output terstandarisasi (`boxes`, `count`, `confidence_avg`, `latency_ms`).
   * Menjamin penanganan *edge cases* (gambar gelap/kosong mengembalikan `count=0` tanpa crash).
   * Menjamin SLA latensi warm start $\le 50.0\text{ ms}$ di CPU lokal.
2. **Level 2: Dataset Integrity & Model Evaluation:**
   * Script `validate_dataset.py` memastikan 0 citra korup dan seluruh koordinat label berada dalam batas normalisasi `[0.0 - 1.0]`.
   * Script `evaluate_model.py` memastikan bobot `best.pt` mencapai target $\text{mAP@50} \ge 85.0\%$ pada data pengujian.
3. **Level 3: Multi-Agent Integration Testing:**
   * Memastikan interkoneksi 6 tools di `agents/orchestrator/tools.py` saling mengalirkan data secara atomik sesuai spesifikasi kontrak data JSON.
4. **Level 4: End-to-End System Simulation:**
   * Memicu tombol CTA `Run Autonomous Cycle` dari browser dan memvalidasi sinkronisasi stepper modal 100% serta stream log terminal.

---

## 2. Master QA Verification Matrix (Demo Day Readiness)

| ID Uji | Skenario Pengujian | Komponen yang Diuji | Nilai Input | Ekspektasi Hasil (*Expected Output*) | Kriteria Lulus | Status |
|:---:|---|---|---|---|---|:---:|
| **QA-01** | **Deteksi Phantom Inventory** | Vision Agent & Reconciliation | Citra rak: 46 box; Saldo SAP MM: 60 box | Delta $-14$ terdeteksi, formula menghitung ROP $52$. Karena $46 < 52$, status `CRITICAL_DEFICIT` terpicu. | Sinyal emergency RFQ aktif | ✅ PASS |
| **QA-02** | **SLA Latensi Inferensi CV** | `BoxDetector` / `lambda_handler` | Citra JPEG 640×640 | Eksekusi selesai di bawah batas target Lambda SLA (<500 ms). Rata-rata terukur: 34.8 ms. | Latensi $\le 50.0\text{ ms}$ warm-start | ✅ PASS |
| **QA-03** | **Negosiasi Harga Otonom** | LLM Negotiation Agent | Penawaran awal vendor: Rp 14.200 | Kesepakatan diskon $8.0\%$ (harga final Rp 13.064/unit), terbit draft PO SAP `#45009821`. | Diskon $\ge 8.0\%$, nomor PO terbit | ✅ PASS |
| **QA-04** | **Rerouting Dinamis Armada** | Logistics Route Agent | Insiden macet Tol Cikampek KM 28 | Rute dialihkan via Jalur Arteri Kalimalang Bypass, menghemat keterlambatan 40 menit, ETA 14:15 WIB aman. | Demurrage cost terhindar | ✅ PASS |
| **QA-05** | **Validasi Surat Jalan Dok** | DL OCR & Chatbot Supir | Foto lembaran kertas Delivery Order supir | Teks terekstraksi (No. SJ, No. PO, Qty), row tercatat di Google Sheets, GR 101 SAP MM terbit. | Dokumen Material terbit | ✅ PASS |
| **QA-06** | **Pemulihan Saldo Tertutup** | Closed-Loop Orchestration | Goods Receipt terkonfirmasi di Dok-02 | Saldo SAP MM pulih menjadi 96 unit $(60 - 14) + 50$, siklus tertutup komplit 100%. | Saldo buku pulih sempurna | ✅ PASS |

---

## 3. Kriteria Definition of Done (DoD)

Sebuah modul atau pilar dianggap tuntas (*Done*) apabila memenuhi 4 kriteria baku:
1. **Fungsionalitas Teruji:** Lulus seluruh pengujian unit dan integrasi otomatis tanpa error.
2. **Kontrak Data Valid:** Payload yang dihasilkan mematuhi skema JSON di `05_kontrak_data.md`.
3. **Resiliensi Aktif:** Memiliki penanganan *graceful fallback* deterministik saat dependensi eksternal offline.
4. **Dokumentasi Terbarui:** Kode terdokumentasi dan terdaftar pada `06_dokumentasi_api.md`.
