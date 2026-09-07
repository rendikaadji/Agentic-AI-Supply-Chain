# StockMind AI — Enterprise Data Contracts & Interface Specifications

**Document Version:** 1.0.0  
**Status:** ACTIVE / CANONICAL SPECIFICATION  
**Scope:** Closed-Loop Multi-Agent System (Edge Vision, Serverless Lambda, DynamoDB Event Store, Multi-Agent Orchestration, SAP S/4HANA ERP, and Frontend Dashboard)

---

## Table of Contents
1. [Prinsip & Konvensi Kontrak](#1-prinsip--konvensi-kontrak)
2. [Peta Arsitektur Alur Kontrak Data](#2-peta-arsitektur-alur-kontrak-data)
3. [Contract 1: Edge Camera / Storage → Vision Inventory Agent (Lambda)](#contract-1-edge-camera--storage--vision-inventory-agent-lambda)
4. [Contract 2: Vision Inventory Agent → Amazon DynamoDB (`inventory_scans`)](#contract-2-vision-inventory-agent--amazon-dynamodb-inventory_scans)
5. [Contract 3: DynamoDB Streams / EventBridge → Stock Reconciliation Agent](#contract-3-dynamodb-streams--eventbridge--stock-reconciliation-agent)
6. [Contract 4: Stock Reconciliation → Disruption & Negotiation Agent (Bedrock)](#contract-4-stock-reconciliation--disruption--negotiation-agent-bedrock)
7. [Contract 5: Negotiation Agent → SAP S/4HANA Purchase Order (BAPI / Ariba)](#contract-5-negotiation-agent--sap-s4hana-purchase-order-bapi--ariba)
8. [Contract 6: Logistics Fleet Telemetry & Inbound Goods Receipt (GR 101)](#contract-6-logistics-fleet-telemetry--inbound-goods-receipt-gr-101)
9. [Contract 7: Backend API Gateway → Frontend Dashboard State](#contract-7-backend-api-gateway--frontend-dashboard-state)
10. [Error Handling & Exception Response Standard](#10-error-handling--exception-response-standard)
11. [Type Definitions (Pydantic Python & TypeScript Interface)](#11-type-definitions-pydantic-python--typescript-interface)

---

## 1. Prinsip & Konvensi Kontrak

Untuk mencegah regresi antar subsistem dan memudahkan QA serta Backend/ML engineers:
1. **Strict Key Naming:** Seluruh JSON field menggunakan format `snake_case` (contoh: `confidence_avg`, `reorder_point`).
2. **Koordinat Bounding Box:** Seluruh koordinat deteksi objek (`x`, `y`, `w`, `h`) **wajib ternormalisasi** dalam rentang float `0.0` sampai `1.0` terhadap dimensi gambar asli.
3. **Format Waktu:** Menggunakan standar **ISO 8601 UTC** (`YYYY-MM-DDTHH:mm:ss.sssZ`) atau Unix Epoch float seconds.
4. **Desimal Presisi:** Nilai mata uang (IDR/USD) dan persentase probabilitas dibulatkan maksimal 4 digit desimal.
5. **Idempotensi:** Setiap pemanggilan API atau posting mutasi stok harus menyertakan `idempotency_key` / `request_id` unik berbasis UUIDv4.

---

## 2. Peta Arsitektur Alur Kontrak Data

```text
[Edge Camera / S3] 
        │ (Contract 1: Multipart / Base64 Image Payload)
        ▼
[AWS Lambda: Vision Agent (YOLOv8n)]
        │ (Contract 2: Normalized Bounding Boxes & Count)
        ▼
[Amazon DynamoDB (inventory_scans)]
        │ (Contract 3: DynamoDB Streams Disparity Trigger)
        ▼
[Stock Reconciliation Agent (SAP MM Discrepancy & Adaptive ROP)]
        │ (Contract 4: Emergency Procurement RFQ Trigger)
        ▼
[Disruption & Negotiation Agent (Bedrock KB + RAG)]
        │ (Contract 5: Validated PO Creation BAPI_PO_CREATE1)
        ▼
[SAP S/4HANA ERP & SAP Ariba]
        │ (Contract 6: Inbound Tracking & Goods Receipt GR 101)
        ▼
[Logistics Fleet & IoT Dock Scanner]
        │ (Contract 7: Aggregate Real-time Dashboard State)
        ▼
[React 18 Frontend Dashboard Presentation Layer]
```

---

## Contract 1: Edge Camera / Storage → Vision Inventory Agent (Lambda)

### Deskripsi
Payload masukan dari kamera gudang (Edge IPC atau S3 trigger) ke AWS Lambda entrypoint (`computer_vision/inference/lambda_handler.py`).

### Format Input: REST / API Gateway Event
```json
{
  "camera_id": "CAM-01",
  "zone_id": "ZONE-A",
  "aisle_rack": "Aisle-04-Rack-B",
  "expected_sku": "BOX-CB-001",
  "timestamp": "2026-09-07T03:30:00.000Z",
  "image_base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYMBQUEBQUEBggGBQUH...",
  "conf_threshold": 0.25
}
```

---

## Contract 2: Vision Inventory Agent → Amazon DynamoDB (`inventory_scans`)

### Deskripsi
Output inferensi terstandarisasi dari `computer_vision/scripts/inference.py` yang disimpan ke DynamoDB dan dikembalikan via API Gateway status `200 OK`.

### Format Output Payload
```json
{
  "status": "SUCCESS",
  "scan_id": "scn_550e8400-e29b-41d4-a716-446655440000",
  "camera_id": "CAM-01",
  "zone_id": "ZONE-A",
  "sku_id": "BOX-CB-001",
  "timestamp": 1773024000.12,
  "datetime_iso": "2026-09-07T03:30:00.120Z",
  "count": 46,
  "confidence_avg": 0.9250,
  "latency_ms": 34.8,
  "model_version": "yolov8n-phase1",
  "boxes": [
    {
      "box_id": "box_01",
      "label": "cardboard_box",
      "conf": 0.9812,
      "x": 0.3117,
      "y": 0.3211,
      "w": 0.3670,
      "h": 0.1273
    },
    {
      "box_id": "box_02",
      "label": "cardboard_box",
      "conf": 0.8924,
      "x": 0.5574,
      "y": 0.2405,
      "w": 0.3261,
      "h": 0.1423
    }
  ]
}
```

---

## Contract 3: DynamoDB Streams / EventBridge → Stock Reconciliation Agent

### Deskripsi
Payload komparasi antara stok fisik visual (hasil deteksi) dan saldo pembukuan di **SAP S/4HANA Materials Management (MM)**.

### Skema Payload
```json
{
  "event_id": "evt_rec_9821a001",
  "timestamp": "2026-09-07T03:30:02.000Z",
  "sku_id": "BOX-CB-001",
  "sku_name": "Standard Cardboard Box 40x40x40",
  "plant_id": "PLANT-1000",
  "storage_location": "WH01",
  "physical_count": 46,
  "sap_recorded_stock": 60,
  "discrepancy_delta": -14,
  "discrepancy_percentage": -23.33,
  "discrepancy_status": "CRITICAL_DEFICIT",
  "calculated_metrics": {
    "average_daily_demand": 8.5,
    "lead_time_days": 4,
    "dynamic_safety_stock": 18,
    "reorder_point": 52
  },
  "is_reorder_triggered": true,
  "reason": "Physical count (46) is below adaptive ROP (52) due to phantom inventory disparity (-14 units)."
}
```

---

## Contract 4: Stock Reconciliation → Disruption & Negotiation Agent (Bedrock)

### Deskripsi
Pemicu pengadaan otomatis (*Emergency RFQ*) yang dikirimkan ke agen negosiasi AI saat stok menyentuh titik kritis.

### Skema Payload
```json
{
  "rfq_id": "RFQ-2026-09-0014",
  "triggered_by": "StockReconciliationAgent",
  "priority": "HIGH",
  "material": {
    "sku_id": "BOX-CB-001",
    "name": "Heavy-Duty Corrugated Box",
    "quantity_needed": 50,
    "unit_of_measure": "EA",
    "max_budget_unit_idr": 15000
  },
  "vendor_candidates": [
    {
      "vendor_id": "VEND-001",
      "name": "PT Mitra Logistik Prima",
      "baseline_unit_price": 14200,
      "standard_lead_time_days": 3,
      "historical_sla_score": 0.96
    },
    {
      "vendor_id": "VEND-002",
      "name": "CV Sumber Rezeki Box",
      "baseline_unit_price": 14500,
      "standard_lead_time_days": 2,
      "historical_sla_score": 0.91
    }
  ],
  "llm_negotiation_guardrails": {
    "max_acceptable_price_idr": 14000,
    "max_lead_time_days": 3,
    "target_discount_pct": 8.0,
    "require_human_approval_threshold_idr": 50000000
  }
}
```

---

## Contract 5: Negotiation Agent → SAP S/4HANA Purchase Order (BAPI / Ariba)

### Deskripsi
Payload penerbitan pesanan pembelian resmi (*Purchase Order*) setelah agen negosiasi Bedrock menyepakati harga terbaik.

### Skema Payload
```json
{
  "po_request_id": "POR-45009821-REQ",
  "sap_plant": "PLANT-1000",
  "sap_purchasing_org": "PO-100",
  "selected_vendor": {
    "vendor_id": "VEND-001",
    "vendor_name": "PT Mitra Logistik Prima",
    "final_negotiated_price_idr": 13064,
    "discount_obtained_pct": 8.0
  },
  "items": [
    {
      "item_no": "00010",
      "sku_id": "BOX-CB-001",
      "quantity": 50,
      "net_price_idr": 13064,
      "tax_code": "V1",
      "promised_delivery_date": "2026-09-09T18:00:00Z"
    }
  ],
  "total_value_idr": 653200,
  "autonomous_approval_status": "AUTO_APPROVED",
  "sap_bapi_target": "BAPI_PO_CREATE1",
  "sap_response": {
    "po_number": "45009821",
    "status": "CREATED_SUCCESS",
    "doc_date": "2026-09-07"
  }
}
```

---

## Contract 6: Logistics Fleet Telemetry & Inbound Goods Receipt (GR 101)

### Deskripsi
Data telemetri rute armada vendor via Amazon Location Service serta scanning e-PoD barcode di dock gudang untuk eksekusi Goods Receipt (GR 101).

### Skema Payload Telemetri & Inbound
```json
{
  "shipment_id": "SHP-2026-8801",
  "po_number": "45009821",
  "carrier_name": "Mitra Express Fleet #04",
  "vehicle_plate": "B 9821 TKO",
  "gps_telemetry": {
    "current_lat": -6.2146,
    "current_lng": 106.8451,
    "speed_kmh": 42.5,
    "route_status": "REROUTED_DYNAMIC_AVOID_JAM",
    "estimated_arrival": "2026-09-07T14:15:00Z"
  },
  "inbound_dock_execution": {
    "dock_id": "DOCK-02",
    "epod_barcode": "EPOD-45009821-BOXCB",
    "scanned_at": "2026-09-07T14:18:22Z",
    "received_quantity": 50,
    "quality_inspection": "PASSED",
    "sap_gr_movement_type": "101",
    "sap_material_document": "MATDOC-50019283",
    "final_sap_stock_balance": 96
  }
}
```

---

## Contract 7: Backend API Gateway → Frontend Dashboard State

### Deskripsi
Struktur payload REST API yang disediakan Backend untuk mengisi state 7 view di Frontend Dashboard (`frontend/src/views/`).

### Endpoint: `GET /api/v1/dashboard/state`
```json
{
  "system_status": "OPTIMAL_AUTONOMOUS",
  "last_updated": "2026-09-07T03:30:15Z",
  "kpis": {
    "map_50": 99.50,
    "inference_latency_ms": 34.8,
    "model_size_mb": 5.96,
    "accuracy_rate": 100.0,
    "active_cameras": 3,
    "autonomous_pos_created": 14,
    "cost_savings_pct": 14.2
  },
  "cameras": [
    {
      "id": "CAM-01",
      "zone": "ZONE-A (Aisle A, Rack-04)",
      "sku": "BOX-CB-001",
      "detected_boxes": 46,
      "confidence_avg": 0.925,
      "status": "ONLINE"
    }
  ],
  "discrepancies": [
    {
      "sku": "BOX-CB-001",
      "physical": 46,
      "sap": 60,
      "delta": -14,
      "urgency": "HIGH",
      "rop": 52
    }
  ]
}
```

---

## 10. Error Handling & Exception Response Standard

```json
{
  "type": "https://stockmind.ai/errors/INVALID_IMAGE_FORMAT",
  "title": "Invalid Image Payload",
  "status": 400,
  "detail": "Citra yang dikirimkan korup atau tidak dapat di-decode oleh PIL (format bukan JPEG/PNG).",
  "instance": "/api/v1/vision/inference/scan_88291",
  "error_code": "CV_ERR_001",
  "timestamp": "2026-09-07T03:30:00Z"
}
```

---

## 11. Type Definitions (Pydantic Python)

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BoundingBox(BaseModel):
    box_id: Optional[str] = None
    label: str = "cardboard_box"
    conf: float = Field(ge=0.0, le=1.0)
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)
    w: float = Field(ge=0.0, le=1.0)
    h: float = Field(ge=0.0, le=1.0)

class VisionDetectionOutput(BaseModel):
    status: str = "SUCCESS"
    scan_id: str
    camera_id: str
    sku_id: str
    timestamp: float
    datetime_iso: datetime
    count: int = Field(ge=0)
    confidence_avg: float = Field(ge=0.0, le=1.0)
    latency_ms: float
    model_version: str = "yolov8n-phase1"
    boxes: List[BoundingBox]
```
