# StockMind AI — Root Directory Structure Specification

**Document ID:** `DOC-FD-08`  
**Document Name:** Root Directory Structure Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/08_root_direktori.md`  

---

## 1. Tata Kelola & Struktur Direktori (Clean Architecture)

Sistem StockMind AI menggunakan struktur direktori modular yang memisahkan subsistem agen otonom (*agents*), inferensi visi komputer (*computer vision*), server REST API (*backend*), antarmuka pengguna (*frontend*), serta repositori dokumentasi formal (*docs*):

```text
stockmind-ai/
├── .env                                # Konfigurasi runtime AI (local / gemini / ollama)
├── .env.example                        # Template konfigurasi environment variables
├── .gitignore                          # Aturan filter ignore file build, cache, & node_modules
├── pyrightconfig.json                  # Konfigurasi static type checking (clean relative path)
├── requirements.txt                    # Dependensi Python backend, CV, & AI agents
├── README.md                           # Master repo documentation & quickstart
│
├── agents/                             # MULTI-AGENT CLOSED-LOOP SUBSYSTEM (6 PILAR)
│   ├── 01_demand_sensing/              # Pilar 1: ML Time-Series Demand Forecasting
│   ├── 02_vision_inventory/            # Pilar 2: Spatial CV Scheduler & Edge Ingestion
│   ├── 03_stock_reconciliation/        # Pilar 3: APICS Inventory Math Engine (SS & ROP)
│   ├── 04_negotiation_procurement/     # Pilar 4: Autonomous RFQ & Vendor PO Negotiation
│   ├── 05_logistics_route/             # Pilar 5: Fleet Route Tracking & Dynamic Rerouting
│   ├── 06_inbound_execution/           # Pilar 6: Inbound Dok, DL OCR, & Dual Sync
│   └── orchestrator/                   # INTI ORKESTRASI MULTI-AGENT
│       ├── __init__.py                 # Package metadata
│       ├── tools.py                    # Registry 6 callable tools deterministik
│       └── multimodal_agent.py         # Flexible Autonomous Orchestrator (ReAct Engine)
│
├── backend/                            # RESTful API SUBSYSTEM (FASTAPI)
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── app.py                      # Server FastAPI & endpoints (/run-cycle, /state)
│   ├── models/                         # Pydantic schemas & Data Transfer Objects (DTO)
│   ├── services/                       # Business logic services
│   └── utils/                          # Helper utilities & loggers
│
├── computer_vision/                    # COMPUTER VISION SUBSYSTEM (FASE 1 INTI)
│   ├── data/                           # Dataset train/val/test & data.yaml
│   ├── inference/                      # lambda_handler.py (AWS Lambda Adapter)
│   ├── models/                         # best.pt (Bobot YOLOv8n terlatih 5.96 MB)
│   ├── notebooks/                      # 01_yolo8_training.py (Colab / Jupyter notebook)
│   ├── results/                        # Matriks evaluasi mAP, confusion matrix, & PR curve
│   ├── scripts/                        # inference.py, evaluate_model.py, validate_dataset.py
│   └── README.md                       # Laporan spesifikasi teknis Computer Vision
│
├── docs/                               # REPOSITORI DOKUMENTASI MASTER
│   ├── foundation/                     # 13 Dokumen Fondasi (01_srs.md s/d 13_testing_strategy.md)
│   ├── PRD-SRS-SPECIFICATION.md        # Spesifikasi PRD, SRS, & Master QA Matrix
│   ├── DATA-CONTRACTS.md               # 7 Spesifikasi Kontrak Data JSON Antar-Modul
│   ├── ARCHITECTURE_DIAGRAM.md         # Diagram arsitektur visual & infografis
│   ├── WORKFLOW-PER-FILE-TRACE.md      # Peta penelusuran fungsi per file
│   └── SYSTEM_IMPLEMENTATION_REPORT.md # Laporan implementasi teknis sistem
│
├── frontend/                           # DASHBOARD ANTARMUKA (REACT 18 + VITE)
│   ├── public/                         # Aset statis & logo
│   ├── src/
│   │   ├── components/                 # ExecutionConsole.jsx, MultiAgentModal.jsx, Header, dll.
│   │   ├── views/                      # 7 modular views (Overview, Vision, Demand, dll.)
│   │   ├── App.jsx                     # Root component & tab navigation
│   │   ├── main.jsx                    # Entrypoint React DOM
│   │   └── index.css                   # Custom theme cyber-enterprise Tailwind
│   ├── package.json                    # Dependensi npm & build scripts
│   ├── vite.config.js                  # Konfigurasi bundler Vite
│   └── tailwind.config.js              # Token warna dark enterprise Tailwind
│
├── data/                               # DATASET SINTETIS & SAMPLE CSV PENJUALAN
├── integrations/                       # CONNECTOR RESMI (AWS BOTO3, SAP BAPI, GOOGLE SHEETS)
├── human_in_the_loop/                  # WORKFLOW OTORISASI DIGITAL PERSETUJUAN MANAJER
├── infra/                              # IaC (AWS CDK, TERRAFORM, CLOUDFORMATION)
├── logs/                               # RUNTIME LOGS LOKAL
└── tests/                              # SUITE PENGUJIAN OTOMATIS
    ├── unit/                           # test_vision_inference.py (Kontrak Lambda & Latensi)
    ├── integration/                    # Pengujian integrasi antar-agen
    └── e2e/                            # Pengujian skenario end-to-end Demo Day
```
