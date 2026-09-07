# StockMind AI — Tools & Library Specification

**Document ID:** `DOC-FD-09`  
**Document Name:** Tools & Library Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/09_tools_dan_library.md`  

---

## 1. Daftar Stack Teknologi & Library Inti

| Kategori | Teknologi / Library | Versi Rekomendasi | Alasan Pemilihan & Fungsi di Sistem |
|---|---|---|---|
| **Bahasa Utama (Backend)** | Python | $\ge 3.11$ (Test OK di 3.11 & 3.14) | Ekosistem terlengkap untuk Computer Vision, data science, integrasi AWS SDK, dan automasi. |
| **Web API Framework** | FastAPI | $\ge 0.115.0$ | Framework ASGI modern dengan performa tinggi, native async, auto docs OpenAPI/Swagger, dan validasi data Pydantic. |
| **ASGI Server Engine** | Uvicorn | $\ge 0.30.0$ | Server web asinkron berkecepatan tinggi berbasis `uvloop` untuk melayani request dashboard. |
| **Spatial Computer Vision** | Ultralytics YOLOv8n | $\ge 8.2.0$ | Model deteksi objek kotak kardus tercepat (<50 ms di CPU), bobot nano sangat ringan (5.96 MB). |
| **Deep Learning Framework** | PyTorch (`torch`, `torchvision`) | $\ge 2.2.0$ | Engine backend tensor dan konvolusi untuk model YOLOv8n dan Document Vision OCR. |
| **Image Processing & Preprocessing** | OpenCV (`opencv-python-headless`) + Pillow | $\ge 4.9.0$ / $\ge 10.0.0$ | Auto-crop batas lembaran dokumen surat jalan dan penyesuaian kontras adaptif anti-bayangan. |
| **Data Contract Validation** | Pydantic v2 | $\ge 2.8.0$ | Validasi ketat tipe data skema DTO antar-pilar tanpa penalti performa komputasi. |
| **Cognitive AI (Lokal)** | Ollama (`qwen2.5:7b` / `llama3`) | $\ge 0.3.0$ | Penalaran negosiasi vendor 100% offline, biaya Rp 0, dan privasi data terjamin di port `11434`. |
| **Cognitive AI (Cloud)** | Google Generative AI (`google-generativeai`) | $\ge 0.8.0$ | Dukungan model Gemini 1.5 Flash via Google AI Studio API key gratis tanpa kartu kredit. |
| **Cloud Enterprise SDK** | AWS SDK (`boto3`) | $\ge 1.34.0$ | Konektor resmi ke AWS Bedrock (Claude 3.5 Sonnet), S3 KMS Encrypted storage, dan Location Service. |
| **Spreadsheet Sync Layer** | `gspread` + Google Auth | $\ge 6.1.0$ | Dual Synchronization: Mengalirkan data surat jalan real-time ke Google Sheets API. |
| **Konfigurasi Lingkungan** | `python-dotenv` | $\ge 1.0.0$ | Membaca variabel environment runtime dari file `.env` secara otomatis. |
| **Frontend Framework** | React 18 + Vite 5 | 18.3 / 5.4 | Waktu build instan (<300 ms HMR), ekosistem modular component-driven untuk dashboard operasional. |
| **Styling & Icons** | Tailwind CSS + Lucide React | 3.4 / 0.4 | Sistem desain token warna dark cyber-enterprise (`#080B11`, aksen cyan/emerald). |
| **Testing Automation** | Python `unittest` / `pytest` | Standard | Pengujian otomatis validitas dataset YOLO, latensi inferensi Lambda, dan kontrak integrasi. |
