# StockMind AI — Data Contracts & Schema Specification

**Document ID:** `DOC-FD-05`  
**Document Name:** Data Contracts & Schema Specification  
**Project Name:** StockMind AI — End-to-End Autonomous Multi-Agent Supply Chain Orchestration System  
**Track:** Intelligent Supply Chain (Sokrates × AWS × SAP Partner — Agentic AI Hackathon 2026)  
**Version:** 1.0.0 (Canonical Production Baseline)  
**Status:** APPROVED  
**Directory:** `stockmind-ai/docs/foundation/05_kontrak_data.md`  

---

## 1. Pendahuluan

Dokumen ini menetapkan kontrak data formal (skema JSON terstruktur) yang mengikat seluruh pertukaran data antar-pilar fungsional di dalam sistem **StockMind AI**. Setiap modul dan antarmuka tool wajib mematuhi skema data ini secara ketat (*strict typing & validation*) guna menjamin interoperabilitas dan mencegah kegagalan runtime.

---

## 2. Spesifikasi Skema Data Kontrak Antar-Pilar

### 2.1 Kontrak Output Vision Inventory (Pilar 2 $\rightarrow$ Orchestrator)
Dihasilkan oleh model Deep Learning YOLOv8n (`computer_vision/scripts/inference.py`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VisionInventoryDetectionPayload",
  "type": "object",
  "properties": {
    "camera_id": { "type": "string", "example": "CAM-01" },
    "zone": { "type": "string", "example": "ZONE-A (Rack-04)" },
    "sku_id": { "type": "string", "example": "BOX-CB-001" },
    "physical_count": { "type": "integer", "minimum": 0, "example": 46 },
    "confidence_avg": { "type": "number", "minimum": 0.0, "maximum": 1.0, "example": 0.925 },
    "boxes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "box_id": { "type": "string", "example": "box_01" },
          "label": { "type": "string", "example": "cardboard_box" },
          "conf": { "type": "number", "example": 0.98 },
          "x": { "type": "number", "description": "Normalized center X [0.0 - 1.0]", "example": 0.3117 },
          "y": { "type": "number", "description": "Normalized center Y [0.0 - 1.0]", "example": 0.3211 },
          "w": { "type": "number", "description": "Normalized width [0.0 - 1.0]", "example": 0.367 },
          "h": { "type": "number", "description": "Normalized height [0.0 - 1.0]", "example": 0.127 }
        },
        "required": ["box_id", "label", "conf", "x", "y", "w", "h"]
      }
    },
    "latency_ms": { "type": "number", "example": 34.8 },
    "status": { "type": "string", "enum": ["VALIDATED_ON_RACK", "EMPTY_RACK", "CAMERA_OCCLUDED"] },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["camera_id", "sku_id", "physical_count", "confidence_avg", "boxes", "latency_ms", "status"]
}
```

### 2.2 Kontrak Evaluasi Rekonsiliasi & ROP (Pilar 3 $\rightarrow$ Procurement)
Dihasilkan oleh mesin matematis APICS (`agents/orchestrator/tools.py::tool_03_stock_reconciliation`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "StockReconciliationPayload",
  "type": "object",
  "properties": {
    "sku_id": { "type": "string", "example": "BOX-CB-001" },
    "sap_recorded_stock": { "type": "integer", "example": 60 },
    "physical_count": { "type": "integer", "example": 46 },
    "discrepancy_delta": { "type": "integer", "description": "physical_count - sap_recorded_stock", "example": -14 },
    "phantom_inventory_detected": { "type": "boolean", "example": true },
    "daily_demand": { "type": "number", "example": 8.5 },
    "lead_time_days": { "type": "integer", "example": 4 },
    "dynamic_safety_stock": { "type": "integer", "example": 18 },
    "adaptive_reorder_point": { "type": "integer", "example": 52 },
    "is_reorder_triggered": { "type": "boolean", "example": true },
    "urgency": { "type": "string", "enum": ["NORMAL", "HIGH", "CRITICAL"], "example": "HIGH" }
  },
  "required": ["sku_id", "sap_recorded_stock", "physical_count", "discrepancy_delta", "adaptive_reorder_point", "is_reorder_triggered"]
}
```

### 2.3 Kontrak Negosiasi & PO Vendor (Pilar 4 $\rightarrow$ Logistics & ERP)
Dihasilkan oleh Cognitive LLM Orchestrator (`tool_04_negotiate_and_issue_po`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PurchaseOrderIssuancePayload",
  "type": "object",
  "properties": {
    "po_number": { "type": "string", "example": "PO-45009821" },
    "sku_id": { "type": "string", "example": "BOX-CB-001" },
    "selected_vendor": { "type": "string", "example": "PT Mitra Logistik Prima" },
    "vendor_id": { "type": "string", "example": "VEND-001" },
    "initial_offer_price": { "type": "number", "example": 14200.0 },
    "discount_achieved_pct": { "type": "number", "example": 8.0 },
    "final_negotiated_price": { "type": "number", "example": 13064.0 },
    "quantity": { "type": "integer", "example": 50 },
    "total_po_value_idr": { "type": "number", "example": 653200.0 },
    "payment_terms": { "type": "string", "example": "Net-30" },
    "sap_bapi_status": { "type": "string", "example": "PO_CREATED_SUCCESS_BAPI_PO_CREATE1" }
  },
  "required": ["po_number", "sku_id", "selected_vendor", "final_negotiated_price", "quantity", "total_po_value_idr", "sap_bapi_status"]
}
```

### 2.4 Kontrak Ekstraksi OCR Surat Jalan Supir (Chatbot $\rightarrow$ Inbound Execution)
Dihasilkan oleh Deep Learning Model #2 Document Vision OCR (`tool_06_inbound_goods_receipt`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WaybillOCRExtractionPayload",
  "type": "object",
  "properties": {
    "waybill_no": { "type": "string", "example": "SJ-MLP-2026-0088" },
    "po_number": { "type": "string", "example": "PO-45009821" },
    "vendor_name": { "type": "string", "example": "PT Mitra Logistik Prima" },
    "vehicle_plate": { "type": "string", "example": "B 9821 TKO" },
    "driver_name": { "type": "string", "example": "Pak Joko Santoso" },
    "driver_phone": { "type": "string", "example": "+6281234567890" },
    "sku_id": { "type": "string", "example": "BOX-CB-001" },
    "received_quantity": { "type": "integer", "example": 50 },
    "stamped": { "type": "boolean", "example": true },
    "quality_condition": { "type": "string", "enum": ["PASSED_INTACT", "DAMAGED", "SUSPECT"], "example": "PASSED_INTACT" },
    "ocr_confidence": { "type": "number", "minimum": 0.0, "maximum": 1.0, "example": 0.962 }
  },
  "required": ["waybill_no", "po_number", "vendor_name", "received_quantity", "quality_condition", "ocr_confidence"]
}
```

### 2.5 Kontrak Dual Synchronization Goods Receipt (Inbound $\rightarrow$ Google Sheets & SAP MM)
Hasil mutasi akhir penerimaan barang:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GoodsReceiptDualSyncPayload",
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["SUCCESS", "FAILED", "QUARANTINED"], "example": "SUCCESS" },
    "dock_id": { "type": "string", "example": "DOCK-02" },
    "epod_barcode": { "type": "string", "example": "EPOD-45009821-BOXCB" },
    "received_quantity": { "type": "integer", "example": 50 },
    "google_sheets_synced": { "type": "boolean", "example": true },
    "google_sheets_row_id": { "type": "integer", "example": 142 },
    "sap_movement_type": { "type": "string", "example": "101 (Goods Receipt into Storage)" },
    "sap_material_document": { "type": "string", "example": "MATDOC-5009821" },
    "initial_sap_stock": { "type": "integer", "example": 60 },
    "final_sap_stock_balance": { "type": "integer", "description": "(60 - 14) + 50 = 96", "example": 96 },
    "closed_loop_complete": { "type": "boolean", "example": true },
    "execution_duration_ms": { "type": "number", "example": 48.5 }
  },
  "required": ["status", "dock_id", "epod_barcode", "received_quantity", "sap_material_document", "final_sap_stock_balance", "closed_loop_complete"]
}
```
