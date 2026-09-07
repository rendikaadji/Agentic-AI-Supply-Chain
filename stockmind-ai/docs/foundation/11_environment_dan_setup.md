# StockMind AI — Environment & Setup Specification

**Document ID:** `DOC-FD-11`  
**Document Name:** Environment & Setup Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/11_environment_dan_setup.md`  

---

## 1. Konfigurasi Environment Variables (`.env`)

Sistem menggunakan konfigurasi berbasis file `.env` di root direktori `stockmind-ai/`:

```bash
# ==============================================================================
# StockMind AI — Runtime Configuration
# ==============================================================================

# AI Provider Pilihan: "local" (default offline ReAct), "gemini", atau "ollama"
AI_PROVIDER=local

# Google Gemini API Key (Opsional jika AI_PROVIDER=gemini)
GEMINI_API_KEY=

# Local Ollama Settings (Opsional jika AI_PROVIDER=ollama)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# Backend Server Host & Port
API_HOST=127.0.0.1
API_PORT=8000

# Path Bobot Model YOLOv8 (Default: computer_vision/models/best.pt)
MODEL_PATH=

# Google Sheets Dual Sync Integration (Credentials path & Sheet title)
GOOGLE_SHEETS_CREDENTIALS_JSON=credentials.json
GOOGLE_SHEETS_SPREADSHEET_NAME=StockMind_Inbound_Log

# SAP S/4HANA Integration Mode ("mock" untuk testing offline / "live" untuk sandbox)
SAP_INTEGRATION_MODE=mock
```

---

## 2. Prasyarat Sistem & Dependensi Perangkat Lunak

1. **Sistem Operasi:** Windows 10/11, macOS, atau Linux (Ubuntu 22.04 LTS).
2. **Python Runtime:** Python $\ge 3.11$ (disarankan $3.11$ s/d $3.14$).
3. **Node.js Runtime:** Node.js $\ge 18.x$ LTS dan `npm` $\ge 9.x$.
4. **Ollama Daemon (Opsional):** Diperlukan jika ingin menjalankan model open-weights lokal (`qwen2.5:7b` atau `llama3`) tanpa biaya API berbayar.

---

## 3. Panduan Setup Lingkungan Baru (Step-by-Step)

### 3.1 Setup Lingkungan Virtual Python (Backend & AI)
Buka terminal PowerShell pada direktori proyek:
```powershell
cd e:\Agentic-Ai\stockmind-ai-struktur-folder\stockmind-ai

# 1. Buat virtual environment
python -m venv .venv

# 2. Aktifkan virtual environment
.\.venv\Scripts\Activate.ps1

# 3. Upgrade package installer
pip install --upgrade pip

# 4. Pasang seluruh dependensi resmi
pip install -r requirements.txt
```

### 3.2 Setup Dependensi Frontend Dashboard (Vite + React)
```powershell
# Masuk ke folder frontend
cd frontend

# Pasang dependensi npm
npm install

# Kembali ke root direktori
cd ..
```

### 3.3 Konfigurasi File Environment
```powershell
# Duplikasi template .env.example menjadi .env
copy .env.example .env
```
*(Buka file `.env` dan sesuaikan provider AI yang ingin digunakan: `local`, `gemini`, atau `ollama`)*.
