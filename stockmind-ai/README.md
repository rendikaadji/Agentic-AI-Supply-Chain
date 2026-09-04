# StockMind AI
**End-to-End Autonomous Supply Chain Orchestration System**

Jalur Kompetisi: Intelligent Supply Chain
Penyelenggara: Sokrates x AWS x SAP Partner — Agentic AI Hackathon 2026

## Ringkasan

StockMind AI adalah Multi-Agent System (MAS) yang menutup celah antara kondisi
fisik gudang dan sistem perencanaan enterprise (ERP), dengan menggabungkan
**Amazon Bedrock**, **Amazon Rekognition**, dan **SAP S/4HANA** dalam siklus
tertutup enam pilar rantai pasok.

## Struktur Folder

```
stockmind-ai/
├── agents/                    # Multi-agent system (4 agent inti + orchestrator)
│   ├── inventory_monitoring_agent/    # Deteksi Phantom Inventory (fisik vs ERP)
│   ├── demand_forecasting_agent/      # Peramalan permintaan, hitung SS & ROP
│   ├── negotiation_procurement_agent/ # Negosiasi & Draft PO berpagar SOP
│   ├── logistics_tracking_agent/      # Pelacakan & optimasi rute armada
│   └── orchestrator/                  # Koordinator siklus tertutup MAS
│
├── computer_vision/           # Verifikasi stok fisik dari kamera gudang
│   ├── models/
│   ├── inference/
│   ├── camera_ingestion/
│   └── rekognition_integration/
│
├── knowledge_base/            # RAG Knowledge Base & guardrail enterprise
│   ├── rag_documents/
│   ├── vector_store/
│   └── guardrails_policies/   # Batas belanja, diskon min 10%, rating vendor ≥4.0, Net-30/60
│
├── integrations/              # Konektor ke layanan AWS & SAP
│   ├── aws_bedrock/
│   ├── aws_eventbridge/       # Trigger event saat stok fisik capai ROP
│   ├── aws_step_functions/    # Orkestrasi Human-in-the-Loop
│   ├── aws_s3/                # Arsip log & rekaman audit
│   ├── aws_kms/                # Enkripsi arsip
│   ├── amazon_location_service/
│   └── sap_s4hana/            # Sinkronisasi PO & Goods Receipt
│
├── human_in_the_loop/         # Otorisasi digital satu klik manajer
│   ├── approval_workflows/
│   └── notifications/
│
├── data/
│   ├── synthetic_data/        # Skema data sintetis (Tahap 1)
│   ├── schemas/
│   └── sample_datasets/
│
├── backend/                   # API & business logic (kalkulasi SS/ROP, dll)
│   ├── api/
│   ├── services/
│   ├── models/
│   └── utils/
│
├── frontend/                  # Dashboard monitoring
│   ├── dashboard/
│   ├── components/
│   └── assets/
│
├── infra/                     # Infrastructure as Code
│   ├── cdk/
│   ├── terraform/
│   └── cloudformation/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                   # Skenario Demo Day end-to-end
│
├── docs/
│   ├── architecture/
│   ├── proposal/
│   └── api_docs/
│
├── scripts/
│   ├── deployment/
│   ├── data_seeding/
│   └── monitoring/
│
├── logs/
└── config/
```

## Logika Inti

- **Safety Stock & Reorder Point (adaptif):**
  `SS = Z × √(L × (σd)² + d² × (σL)²)`
  `ROP = (d × L) + SS`
  (Z = faktor service level, d = rerata konsumsi harian, σd = std. dev konsumsi,
  L = rerata lead time vendor, σL = std. dev pengiriman vendor)

- **Strict Enterprise Guardrails** (`knowledge_base/guardrails_policies/`):
  batas wewenang belanja, diskon minimal 10%, rating vendor ≥ 4,0, termin
  kredit Net-30/60.

- **Human-in-the-Loop:** alur dihentikan setelah Draft PO untuk otorisasi
  digital satu klik dari manajer Procurement/Finance sebelum PO diterbitkan
  ke SAP S/4HANA.

## Roadmap Implementasi (Agustus–Oktober 2026)

| Tahap | Periode | Fokus |
|---|---|---|
| 1 | 24 Agt – 10 Sep 2026 | Finalisasi proposal teknis & skema data sintetis SAP S/4HANA |
| 2 | Workshop & Enablement | Konfigurasi Bedrock Agents, RAG Knowledge Bases, tuning model CV |
| 3 | Integrasi & Orkestrasi | AWS Step Functions (HitL), Amazon Location Service, simulasi telemetri IoT |
| 4 | Demo Day — 31 Okt 2026 | Simulasi end-to-end: deteksi stok kritis → negosiasi AI → approval manajer → pelacakan rute → posting Goods Receipt |

## Sumber

Struktur ini disusun berdasarkan dokumen `StockMind_AI_Ringkasan_3_Halaman.docx`.
Salinan referensinya dapat diletakkan di `docs/proposal/`.
