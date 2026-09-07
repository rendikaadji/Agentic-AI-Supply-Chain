# StockMind AI — Conventions & Coding Standards

**Document ID:** `DOC-FD-10`  
**Document Name:** Conventions & Coding Standards  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/10_konvensi_dan_standar.md`  

---

## 1. Konvensi Penamaan (Naming Conventions)

| Elemen | Konvensi | Contoh | Keterangan |
|---|---|---|---|
| **File & Modul Python** | `snake_case` | `multimodal_agent.py`, `lambda_handler.py` | Nama ringkas, deskriptif, dan tanpa spasi. |
| **Kelas (Python & React)** | `PascalCase` | `SupplyChainOrchestrator`, `BoxDetector`, `ExecutionConsole.jsx` | Berlaku untuk kelas OOP dan React Functional Components. |
| **Fungsi & Method (Python)**| `snake_case` | `tool_01_demand_sensing()`, `run_autonomous_cycle()` | Format standar PEP 8. |
| **Fungsi & Hook (JavaScript)**| `camelCase` | `handleTriggerCycle()`, `useState()`, `fetchDashboardState()` | Format standar JavaScript ES6+. |
| **Variabel (Python & JS)** | `snake_case` (Py) / `camelCase` (JS) | `physical_count`, `activeTab` | Hindari singkatan yang ambigu. |
| **Konstanta & Environment** | `UPPER_SNAKE_CASE` | `DEFAULT_PROVIDER`, `GEMINI_API_KEY`, `OLLAMA_URL` | Nilai global yang tidak bermutasi saat runtime. |

---

## 2. Pola Penanganan Error & Resiliensi (Graceful Fallback)

1. **Prinsip Zero-Crash:**
   Seluruh fungsi tools di `agents/orchestrator/tools.py` wajib memiliki mekanisme cadangan deterministik (*graceful fallback*). Jika library pihak ketiga (misal: PyTorch atau koneksi internet LLM) gagal dimuat atau timeout, fungsi WAJIB mengembalikan mock deterministik yang sah agar alur siklus 6 pilar tidak terhenti total.
2. **Penanganan Error REST API:**
   Setiap route di FastAPI wajib dibungkus dalam blok `try...except` dan melempar `HTTPException(status_code=500, detail="Pesan error spesifik")` untuk mempermudah debugging antarmuka frontend.
3. **Pencatatan Log Terstruktur:**
   Log penalaran agen diklasifikasikan ke dalam 4 tipe:
   * `cmd`: Perintah sistem/terminal.
   * `info`: Informasi alur tahapan atau penalaran model LLM.
   * `success`: Keberhasilan eksekusi pilar atau transaksi.
   * `accent`: Peringatan kondisi darurat (*disparity/deficit alert*).

---

## 3. Standar Git & Conventional Commits

Setiap commit pada repositori wajib mematuhi konvensi pesan commit standar industri:

* `feat(<scope>):` Penambahan fungsionalitas baru (contoh: `feat(inbound): implement ocr waybill extraction`).
* `fix(<scope>):` Perbaikan kesalahan logika atau bug (contoh: `fix(api): ensure relative path import in app.py`).
* `docs(<scope>):` Penambahan atau pembaruan berkas dokumentasi (contoh: `docs(foundation): finalize phase 3 specifications`).
* `chore(<scope>):` Pembersihan direktori, update `.gitignore`, atau linting (contoh: `chore: clean pyrightconfig paths`).
* `test(<scope>):` Penambahan atau pembaruan script automated testing (contoh: `test(cv): add lambda warm latency SLA test`).

---

## 4. Standar Tipe & Kualitas Kode (Type Checking)

* **Python Static Analysis:** Repositori mematuhi konfigurasi **Pyright** ([pyrightconfig.json](file:///e:/Agentic-Ai/stockmind-ai-struktur-folder/stockmind-ai/pyrightconfig.json)) dengan parameter `extraPaths` relatif (`stockmind-ai` dan `stockmind-ai/computer_vision`), melarang penulisan path lokal hardcoded developer.
* **Type Annotations:** Menggunakan pengetikan tipe resmi Python (`from typing import Dict, Any, List, Optional, Union`).
