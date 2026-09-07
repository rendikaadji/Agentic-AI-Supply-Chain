# Panduan & Laporan Subsystem Computer Vision — StockMind AI (Phase 1)

> **Subsystem:** Vision Inventory Agent (Pilar 2 dalam Closed-Loop Supply Chain MAS)  
> **Model:** YOLOv8n (`nano`) Cardboard Box Detection  
> **Status:** Phase 1 Complete (Foundation & Pipeline Verified)  
> **Kompetisi:** Sokrates × AWS × SAP Partner — Intelligent Supply Chain Hackathon 2026  

---

## Daftar Isi
1. [Ringkasan Peran Subsystem](#1-ringkasan-peran-subsystem)
2. [Spesifikasi Model & Hasil Evaluasi](#2-spesifikasi-model--hasil-evaluasi)
3. [Struktur Folder & Komponen Utama](#3-struktur-folder--komponen-utama)
4. [Panduan Langkah Pengujian Cepat (Quick Testing Guide)](#4-panduan-langkah-pengujian-cepat-quick-testing-guide)
   - [Langkah 1: Validasi Dataset](#langkah-1-validasi-dataset-validatedatasetpy)
   - [Langkah 2: Menjalankan Unit Tests](#langkah-2-menjalankan-unit-tests-testvisioninferencepy)
   - [Langkah 3: Evaluasi Model & mAP](#langkah-3-evaluasi-model--map-evaluatemodelpy)
   - [Langkah 4: Live Inferensi & Simulasi Lambda](#langkah-4-live-inferensi--simulasi-lambda-inferencepy)
   - [Langkah 5 (Opsional): Re-Training Model](#langkah-5-opsional-re-training-model-trainyolov8py)
5. [Kontrak Data & Skema Output (AWS Lambda & DynamoDB)](#5-kontrak-data--skema-output-aws-lambda--dynamodb)
6. [Integrasi dengan Dashboard Frontend](#6-integrasi-dengan-dashboard-frontend)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Ringkasan Peran Subsystem

Dalam siklus tertutup 6 pilar **StockMind AI**, **Vision Inventory Agent** bertindak sebagai *"mata otonom sistem"*:

$$\text{Demand Sensing} \longrightarrow \mathbf{\text{Vision Inventory (Pilar 2)}} \longrightarrow \text{Stock Reconciliation} \longrightarrow \text{Negotiation} \longrightarrow \text{Logistics} \longrightarrow \text{SAP GR}$$

### Masalah yang Diselesaikan:
- **Phantom Inventory Elimination**: Memverifikasi keberadaan fisik kotak kardus secara visual setiap jam (1 frame/jam) dan membandingkannya dengan saldo pembukuan di **SAP S/4HANA Materials Management (MM)**.
- **Deteksi Dini Stockout**: Jika saldo visual di rak lebih rendah daripada Reorder Point (ROP) adaptif, sistem langsung memicu *Disruption & Negotiation Agent* untuk pengadaan darurat otomatis.

---

## 2. Spesifikasi Model & Hasil Evaluasi

Model yang dikembangkan adalah **YOLOv8n (*nano*)** yang dioptimalkan untuk serverless environment (AWS Lambda / Edge IPC):

| Parameter / Metrik | Nilai Spesifikasi | Standar Target Hackathon | Status |
|---|---|---|---|
| **Arsitektur Model** | YOLOv8n (Single Class: `cardboard_box`) | Light Object Detection | `[PASS]` |
| **Ukuran File (`best.pt`)** | **5.96 MB** | $< 50.0$ MB (Batas AWS Lambda) | **`[PASS]`** |
| **Resolusi Input (`imgsz`)** | **640 × 640** (Aspect Ratio 1:1) | 640 × 640 | `[PASS]` |
| **Inference Latency** | **34.8 ms – 47.0 ms** (CPU Warm) | $< 50.0$ ms (SLA Operasional) | **`[PASS]`** |
| **Akurasi mAP@50** | **99.50%** | $\ge 85.0\%$ | **`[PASS]`** |
| **mAP@50-95** | **93.07%** | - | **`[PASS]`** |
| **Precision** | **100.00%** | - | **`[PASS]`** |
| **Recall** | **100.00%** | - | **`[PASS]`** |

> [!NOTE]
> Bobot `best.pt` saat ini dilatih menggunakan dataset 46 citra sintetis rak gudang untuk memvalidasi *end-to-end pipeline* (loss convergence, decoding bounding box, dan kontrak Lambda). Pipeline ini siap di-*retrain* dengan dataset Roboflow produksi menggunakan `computer_vision/scripts/train_yolov8.py`.

---

## 3. Struktur Folder & Komponen Utama

```text
computer_vision/
├── data/
│   ├── data.yaml                # Konfigurasi path dataset & definisi kelas (0: cardboard_box)
│   ├── train_images/ & labels/  # 30 citra pelatihan (137 bounding box)
│   ├── val_images/ & labels/    # 8 citra validasi (45 bounding box)
│   └── test_images/ & labels/   # 8 citra pengujian (40 bounding box)
├── models/
│   ├── best.pt                  # Bobot terbaik hasil training YOLOv8n (5.96 MB)
│   ├── last.pt                  # Checkpoint epoch terakhir
│   └── yolov8n.pt               # Base pretrained weights COCO
├── scripts/
│   ├── validate_dataset.py      # Validasi integritas anotasi & format YOLO
│   ├── train_yolov8.py          # Script pelatihan model dengan parameter augmentasi
│   ├── evaluate_model.py        # Evaluasi komprehensif mAP, precision, recall & confusion matrix
│   ├── inference.py             # BoxDetector standalone & AWS Lambda handler
│   └── seed_sample_dataset.py   # Seeder generator dataset sintetis
├── results/
│   ├── data_validation_report.txt  # Laporan teks detail validasi dataset
│   ├── model_evaluation_epoch50.csv # Log numerik mAP per split
│   ├── README_vision.md            # Catatan serah terima teknis Vision Lead
│   └── eval_plots/                 # Grafik PR curve, F1 curve, dan visualisasi deteksi
└── notebooks/
    └── 01_yolo8_training.py     # Entrypoint training alternatif
```

---

## 4. Panduan Langkah Pengujian Cepat (Quick Testing Guide)

Seluruh script dapat diuji oleh tim melalui terminal (PowerShell atau Command Prompt) dari direktori root proyek:

```powershell
cd c:\laragon\www\Agentic-AI-Supply-Chain\stockmind-ai
```

### Langkah 1: Validasi Dataset (`validate_dataset.py`)
Script ini memeriksa keberadaan file citra, kesesuaian file `.txt` YOLO, ketiadaan file korup, dan koordinat bounding box yang berada di rentang $[0.0, 1.0]$.

**Perintah:**
```powershell
.\.venv\Scripts\python.exe computer_vision/scripts/validate_dataset.py --data computer_vision/data/data.yaml
```

**Output yang Diharapkan:**
```text
================================================================================
           STOCKMIND AI — DATASET VALIDATION REPORT (PHASE 1)                  
           Subsystem: Vision Inventory Agent (Cardboard Box Detection)          
================================================================================
Status Validasi Keseluruhan : [PASS] VALID
Total Citra                 : 46
Total Bounding Box Kardus   : 222
Citra Korup                 : 0
Anotasi Out-of-Bounds       : 0
Laporan lengkap diekspor ke: results/data_validation_report.txt
```

---

### Langkah 2: Menjalankan Unit Tests (`test_vision_inference.py`)
Menguji kepatuhan kontrak output schema, penanganan citra kosong (0 box), dan status code 200 respons handler Lambda.

**Perintah:**
```powershell
.\.venv\Scripts\python.exe -m unittest tests/unit/test_vision_inference.py -v
```

**Output yang Diharapkan:**
```text
test_01_output_schema_contract (TestVisionInference) ... ok
test_02_empty_image_handling (TestVisionInference) ... ok
test_03_lambda_handler_simulation (TestVisionInference) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.082s

OK
```

---

### Langkah 3: Evaluasi Model & mAP (`evaluate_model.py`)
Mengevaluasi akurasi bobot `best.pt` pada split `test` (8 citra) dan menghasilkan visualisasi prediksi di folder `results/eval_plots/`.

**Perintah:**
```powershell
.\.venv\Scripts\python.exe computer_vision/scripts/evaluate_model.py --model computer_vision/models/best.pt --split test
```

**Output yang Diharapkan:**
```text
[+] Memulai evaluasi pada split: test
    * Kelas           : cardboard_box (Instances: 40)
    * Precision       : 100.00%
    * Recall          : 100.00%
    * mAP@50          : 99.50%
    * mAP@50-95       : 93.07%
[PASS] Target akurasi mAP@50 >= 85.0% terpenuhi!
Visualisasi dan confusion matrix disimpan di: computer_vision/results/eval_plots/
```

---

### Langkah 4: Live Inferensi & Simulasi Lambda (`inference.py`)
Menjalankan inferensi deteksi pada satu citra uji dan menghasilkan output terformat sesuai kontrak AWS Lambda.

**Perintah:**
```powershell
.\.venv\Scripts\python.exe computer_vision/scripts/inference.py --image computer_vision/data/test_images/warehouse_box_test_0001.jpg
```

**Output yang Diharapkan:**
```text
Running inference on warehouse_box_test_0001.jpg... Status: 200 OK | Count: 46 | Confidence: 0.92 | Latency: 35ms. Data saved to DynamoDB.
```

---

### Langkah 5 (Opsional): Re-Training Model (`train_yolov8.py`)
Jika tim ingin melatih ulang model dengan epoch atau augmentasi berbeda:

**Perintah:**
```powershell
.\.venv\Scripts\python.exe computer_vision/scripts/train_yolov8.py --epochs 50 --batch 8 --imgsz 640
```

---

## 5. Kontrak Data & Skema Output (AWS Lambda & DynamoDB)

### Format Input AWS Lambda Handler:
File `computer_vision/scripts/inference.py` menerima event dalam dua bentuk:
1. **Base64 String** (misal dikirim dari frontend/edge gateway):
   ```json
   {
     "image_base64": "<base64_encoded_jpeg_or_png>"
   }
   ```
2. **S3 URI** (gambar yang di-upload kamera ke bucket):
   ```json
   {
     "s3_bucket": "stockmind-raw-feeds",
     "s3_key": "cameras/cam-01/warehouse_box_test_0001.jpg"
   }
   ```

### Format Output JSON Kontrak (StatusCode 200):
```json
{
  "statusCode": 200,
  "body": {
    "boxes": [
      {
        "box_id": "BOX-001",
        "class_name": "cardboard_box",
        "confidence": 0.98,
        "bbox_normalized": [0.1282, 0.2574, 0.4952, 0.3847]
      },
      {
        "box_id": "BOX-002",
        "class_name": "cardboard_box",
        "confidence": 1.00,
        "bbox_normalized": [0.5574, 0.2405, 0.8835, 0.3828]
      }
    ],
    "count": 4,
    "confidence_avg": 0.938,
    "latency_ms": 34.8,
    "dynamodb_record": {
      "table": "stockmind-inventory-events",
      "partition_key": "WH-AISLE-A-CAM01",
      "timestamp": "2026-09-06T15:00:00Z",
      "status": "VALIDATED"
    }
  }
}
```

---

## 6. Integrasi dengan Dashboard Frontend

Pada antarmuka dashboard (`frontend/`):
1. **Rasio 1:1 Bujur Sangkar (`aspect-square`)**:  
   Viewport kamera gudang menggunakan rasio presisi $1:1$ bujur sangkar yang diselaraskan dengan resolusi input model YOLO ($640 \times 640\text{ px}$). Hal ini memastikan tidak ada pergeseran (*offset*) atau distorsi bounding box.
2. **Multi-Camera Switcher**:
   - `CAM-01`: Menampilkan `warehouse_box_test_0001.jpg` (4 kardus terdeteksi, confidence $0.80 - 1.00$).
   - `CAM-02`: Menampilkan `warehouse_box_test_0002.jpg` (5 kardus terdeteksi).
   - `CAM-03`: Menampilkan `warehouse_box_test_0003.jpg` (6 kardus terdeteksi).
3. **Execution Console**:  
   Keempat tombol di tab *Phase 1 Validation Pipeline* di dashboard langsung merefleksikan dan mensimulasikan script Python di atas secara interaktif.

---

## 7. Troubleshooting & FAQ

### 1. `ImportError: No module named 'ultralytics'`
Pastikan Anda menjalankan script menggunakan Python dari virtual environment proyek:
```powershell
.\.venv\Scripts\python.exe <path_to_script>
```

### 2. Apakah model memerlukan GPU khusus?
Tidak. Model `yolov8n.pt` dirancang ultra-ringan dengan latensi **35–47 ms pada CPU biasa**, sehingga sangat hemat biaya dan kompatibel dengan lingkungan serverless AWS Lambda (memori 1024 MB sudah lebih dari cukup).

### 3. Di mana kurva hasil evaluasi tersimpan?
Kurva PR (Precision-Recall), F1-Confidence, Confusion Matrix, dan gambar visualisasi deteksi bounding box tersimpan di:
`computer_vision/results/eval_plots/`

---
*Dibuat untuk Tim StockMind AI — Hak Cipta Hackathon 2026.*
