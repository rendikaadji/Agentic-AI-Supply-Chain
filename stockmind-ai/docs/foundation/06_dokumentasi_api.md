# StockMind AI — RESTful API Documentation

**Document ID:** `DOC-FD-06`  
**Document Name:** RESTful API Documentation  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/06_dokumentasi_api.md`  

---

## 1. Spesifikasi Teknis Server API

* **Framework:** FastAPI (Python 3.11/3.14 ASGI)
* **Server Engine:** Uvicorn ASGI Server
* **Base URL:** `http://127.0.0.1:8000`
* **Dokumentasi Interaktif:**
  * Swagger UI: `http://127.0.0.1:8000/docs`
  * ReDoc: `http://127.0.0.1:8000/redoc`
* **Format Request/Response:** `application/json`
* **CORS Middleware:** Mengizinkan request dari dashboard Vite React (`http://localhost:5173` dan wildcard `*`).

---

## 2. Katalog Endpoint API

### 2.1 `GET /` — Healthcheck & Runtime State
* **Method:** `GET`
* **Path:** `/`
* **Fungsi:** Memeriksa status keaktifan backend API, versi sistem, dan engine AI aktif.
* **Headers:** Tidak memerlukan autentikasi.
* **Contoh Response (200 OK):**
```json
{
  "service": "StockMind AI API",
  "status": "ONLINE",
  "version": "1.0.0",
  "ai_provider": "local",
  "pillars": 6
}
```

---

### 2.2 `POST /api/orchestrator/run-cycle` — Pemicu Siklus Otonom 6 Pilar
* **Method:** `POST`
* **Path:** `/api/orchestrator/run-cycle`
* **Fungsi:** Menjalankan eksekusi siklus otonom 6 pilar rantai pasok secara berurutan (*closed-loop*), mengalirkan log *Thought, Action, Observation* ke frontend.
* **Request Payload:**
```json
{
  "sku_id": "BOX-CB-001",
  "camera_id": "CAM-01",
  "provider": "local"
}
```
* **Contoh Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "cycle_id": "CYC-9A82B1C4",
  "provider": "local",
  "duration_ms": 284.5,
  "timestamp_iso": "2026-09-07T13:35:00Z",
  "steps": [
    {
      "step": 1,
      "pillar": "Demand Sensing Agent",
      "tech": "Amazon Bedrock + SageMaker",
      "status": "COMPLETED",
      "payload": "SKU: BOX-CB-001 | Proyeksi: +60 unit | Tren: +24.0%",
      "summary": "Lonjakan permintaan +24.0% terdeteksi untuk SKU BOX-CB-001."
    },
    {
      "step": 2,
      "pillar": "Vision Inventory Agent",
      "tech": "YOLOv8n Edge + AWS Lambda",
      "status": "COMPLETED",
      "payload": "Kamera: CAM-01 | Fisik di Rak: 46 Kotak | Conf: 92.5%",
      "summary": "Kamera CAM-01 mendeteksi fisik 46 unit kotak kardus di rak."
    },
    {
      "step": 3,
      "pillar": "Stock Reconciliation Agent",
      "tech": "SAP MM Connector + Dynamic ROP Engine",
      "status": "COMPLETED",
      "payload": "Fisik: 46 | SAP: 60 | Delta: -14 | ROP: 52",
      "summary": "Disparitas terdeteksi: Fisik 46 vs SAP 60. ROP 52 terpicu otomatis!"
    },
    {
      "step": 4,
      "pillar": "Disruption & Negotiation Agent",
      "tech": "Bedrock KB (RAG) + SAP Ariba",
      "status": "COMPLETED",
      "payload": "Vendor: PT Mitra Logistik Prima | Harga: Rp 13,064 (-8%) | PO-45009821",
      "summary": "Negosiasi otonom sukses. PO PO-45009821 resmi diterbitkan."
    },
    {
      "step": 5,
      "pillar": "Logistics Route Agent",
      "tech": "Amazon Location Service + Telematics",
      "status": "COMPLETED",
      "payload": "Armada: Mitra Express #04 | Dialihkan Arteri Kalimalang | ETA: 14:15 WIB",
      "summary": "Kemacetan terdeteksi. Armada dialihkan via Jalur Arteri. ETA aman."
    },
    {
      "step": 6,
      "pillar": "Inbound Execution Agent",
      "tech": "AWS IoT Core + SAP BAPI 101",
      "status": "COMPLETED",
      "payload": "Dok: DOCK-02 | MATDOC-5009821 (GR 101) | Saldo SAP Akhir: 96 Unit",
      "summary": "Barang masuk 50 unit diverifikasi di Dok-02. Saldo stok MM pulih ke 96 unit!"
    }
  ],
  "final_summary": {
    "initial_stock_sap": 60,
    "physical_detected": 46,
    "discrepancy": -14,
    "po_number": "PO-45009821",
    "final_restored_stock": 96,
    "closed_loop_complete": true
  }
}
```

---

### 2.3 `GET /api/dashboard/state` — Aggregated Real-Time Dashboard State
* **Method:** `GET`
* **Path:** `/api/dashboard/state`
* **Fungsi:** Mengambil status ringkasan metrik performa (KPI) dan kondisi stok inventaris untuk visualisasi antarmuka pengguna.
* **Contoh Response (200 OK):**
```json
{
  "status": "ONLINE",
  "system_mode": "AUTONOMOUS_CLOSED_LOOP",
  "kpis": {
    "map_50": 99.50,
    "inference_latency_ms": 34.8,
    "model_size_mb": 5.96,
    "accuracy_rate": 100.0,
    "active_cameras": 3,
    "autonomous_pos_created": 14,
    "cost_savings_pct": 14.2
  },
  "inventory": {
    "sku_id": "BOX-CB-001",
    "name": "Standard Cardboard Box 40x40x40",
    "physical_visual_stock": 46,
    "sap_recorded_stock": 60,
    "discrepancy_delta": -14,
    "adaptive_rop": 52,
    "safety_stock": 18
  }
}
```

---

### 2.4 `POST /api/inbound/webhook/waybill` — Driver Waybill Chatbot Webhook
* **Method:** `POST`
* **Path:** `/api/inbound/webhook/waybill`
* **Fungsi:** Menerima unggahan foto surat jalan fisik dari bot percakapan (WhatsApp/Telegram), menjalankan pipeline Deep Learning Document OCR, dan mengembalikan konfirmasi alokasi dok.
* **Request Payload (Multipart / Base64):**
```json
{
  "driver_phone": "+6281234567890",
  "image_base64": "/9j/4AAQSkZJRgABAQEASABIAAD..."
}
```
* **Contoh Response (200 OK):**
```json
{
  "status": "VERIFIED",
  "waybill_no": "SJ-MLP-2026-0088",
  "po_number": "PO-45009821",
  "assigned_dock": "DOCK-02",
  "message_reply": "Surat Jalan SJ-MLP-2026-0088 terverifikasi sistem! Silakan langsung bongkar muatan di Dok 02."
}
```
