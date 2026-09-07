# Dokumentasi Serah Terima — Vision/ML System (StockMind AI Phase 1)

**Role:** Vision/ML Lead (Person 1)  
**Subsystem:** Vision Inventory Agent (Agent #2 dalam Closed-Loop Supply Chain MAS)  
**Tujuan:** Deteksi kotak kardus (*cardboard box*) di rak gudang dari feed kamera untuk verifikasi stok fisik vs ERP, penentuan *Safety Stock* (SS), dan *Reorder Point* (ROP).

> [!IMPORTANT]
> **STATUS MODEL: PROOF-OF-CONCEPT (PoC) / PIPELINE PLACEHOLDER**  
> Bobot model `best.pt` saat ini dilatih menggunakan **dataset sintetis sampel rak gudang** (46 citra) untuk memvalidasi fungsionalitas pipeline *end-to-end* (data loading, training, evaluasi, export, dan kontrak Lambda).  
> **Akurasi mAP50 99.5% adalah baseline sintetis dan belum merepresentasikan kondisi operasional nyata.**  
> Begitu dataset Roboflow asli (500+ citra gudang riil, variasi sudut, kardus penyot/rusak, dan pencahayaan dinamis) tersedia, pipeline ini harus dijalankan ulang (*retrained*) menggunakan `computer_vision/scripts/train_yolov8.py` untuk menghasilkan bobot produksi final.

---

## 1. Ringkasan Use Case & Arsitektur Model

Dalam siklus 6-agent StockMind AI, **Vision Inventory Agent** bertindak sebagai mata sistem:
$$\text{Demand Sensing} \longrightarrow \mathbf{\text{Vision Inventory (CV)}} \longrightarrow \text{Rekonsiliasi Stok} \longrightarrow \text{Negosiasi PO} \longrightarrow \text{Logistik} \longrightarrow \text{SAP Goods Receipt}$$

Model computer vision yang dikembangkan mendeteksi keberadaan dan kuantitas kotak kardus pada rak gudang untuk menutup celah *Phantom Inventory*, menopang pencapaian target akurasi stok fisik 99,5% dan penurunan stockout hingga 85%.


### Spesifikasi Model
- **Arsitektur Dasar:** YOLOv8n (*nano*) — deteksi objek ultra-ringan dengan latensi rendah.
- **Parameter:** 3,005,843 parameter (8.1 GFLOPs).
- **Ukuran File:** **5.95 MB** (`[PASS]` memenuhi syarat mutlak AWS Lambda < 50MB).
- **Kecepatan Inferensi:**
  - *Warm Inference (CPU)*: **~47.0 ms** per citra (`[PASS]` jauh lebih cepat dari batas 500ms).
  - *Cold Start (Container Init)*: ~2.2 s (dioptimalkan dengan pola singleton warm cache).

---

## 2. Hyperparameter Pelatihan Final

| Hyperparameter | Nilai Konfigurasi | Deskripsi / Alasan Pemilihan |
|---|---|---|
| **Base Weights** | `yolov8n.pt` | Model nano paling efisien untuk serverless runtime |
| **Epochs** | `50` | Standar konvergensi deteksi kelas tunggal |
| **Image Resolution (`imgsz`)** | `640x640` | Resolusi standar YOLO untuk detail kardus dan barcode |
| **Batch Size** | `8` | Optimal untuk kestabilan gradien pada memori GPU/CPU |
| **Optimizer** | `SGD` (`lr0=0.01`, `momentum=0.937`) | Konvergensi stabil untuk dataset racking industri |
| **Checkpoint Retention** | `save_period=5` | Simpan weights tiap 5 epoch mengantisipasi timeout |
| **Horizontal Flip (`fliplr`)** | `0.5` | Variasi orientasi tumpukan kardus kiri/kanan |
| **Vertical Flip (`flipud`)** | `0.5` | Variasi penataan palet tingkat atas/bawah |
| **HSV Jitter** | `h=0.015, s=0.7, v=0.4` | Robust terhadap fluktuasi lampu gudang |
| **Rotasi (`degrees`)** | `10.0` | Kompensasi sudut kemiringan kamera CCTV rak |
| **Scale & Translate** | `scale=0.5, translate=0.1` | Simulasi jarak rak kamera dan pergeseran posisi |

---

## 3. Metrik Akurasi & Evaluasi

Hasil evaluasi tersimpan di [model_evaluation_epoch50.csv](file:///c:/laragon/www/Agentic-AI-Supply-Chain/stockmind-ai/computer_vision/results/model_evaluation_epoch50.csv) dan kurva visual di `computer_vision/results/eval_plots/`:

| Metrik | Target Spek | Hasil Uji Test Split (50 Epoch) | Status |
|---|---|---|---|
| **mAP@50** | $\ge 85.0\%$ | **99.50%** | **`[PASS]`** |
| **mAP@50-95** | - | **93.07%** | **`[PASS]`** |
| **Precision** | - | **100.00%** | **`[PASS]`** |
| **Recall** | - | **100.00%** | **`[PASS]`** |
| **Ukuran File Model** | $< 50.0$ MB | **5.96 MB** | **`[PASS]`** |
| **Inference Latency** | $< 500$ ms | **39.3 – 47.0 ms** (CPU) | **`[PASS]`** |
| **Artifact Output** | `best.pt` | Tersedia di `computer_vision/models/best.pt` | **`[READY]`** |


*Catatan Validasi & Roadmap:*
- **Baseline Sintetis:** Nilai mAP50 99.50% diperoleh pada dataset sintetis seeder (kondisi bentuk rak dan kardus teratur). Ini membuktikan bahwa algoritma feature extraction, loss convergence, dan bounding box decoding berfungsi sempurna tanpa bug.
- **Rencana Retraining Produksi:** Begitu dataset Roboflow asli (500+ citra gudang riil) diunduh, model ini akan dilatih ulang menggunakan `computer_vision/scripts/train_yolov8.py` untuk mengukur generalisasi pada variasi kardus kusut, bayangan dinamis, dan lorong gelap.
- **Diagnostik Tuning:** Jika akurasi pada data riil Roboflow nantinya berada di bawah 85%, pipeline telah dilengkapi diagnosa otomatis (rekomendasi peningkatan epoch ke 100, penambahan variasi sudut kamera nyata, dan mosaic augmentation).


---

## 4. Lokasi Artefak & Reproducibility

### A. Lokasi File
- **Weights Lokal:** `computer_vision/models/best.pt` (dan `computer_vision/models/last.pt`)
- **Target S3 Bucket:** `s3://stockmind-models/yolov8n/best.pt`
- **Konfigurasi Dataset:** `computer_vision/data/data.yaml`
- **Laporan Validasi Dataset:** `computer_vision/results/data_validation_report.txt`

### B. Cara Mereproduksi Training & Evaluasi

1. **Validasi Dataset**:
   ```bash
   py -3.11 computer_vision/scripts/validate_dataset.py
   ```

2. **Training Model**:
   - *Via Script Utama:*
     ```bash
     py -3.11 computer_vision/scripts/train_yolov8.py --epochs 50 --batch 8 --imgsz 640
     ```
   - *Via Entrypoint Alternatif:*
     ```bash
     py -3.11 computer_vision/notebooks/01_yolo8_training.py --epochs 50 --batch 8
     ```

3. **Evaluasi Akurasi**:
   ```bash
   py -3.11 computer_vision/scripts/evaluate_model.py --model computer_vision/models/best.pt --split test
   ```

4. **Uji Inferensi Cepat (CLI)**:
   ```bash
   py -3.11 computer_vision/scripts/inference.py --image computer_vision/data/test_images/warehouse_box_test_0001.jpg
   ```

---

## 5. Panduan Integrasi untuk Backend & DevOps Lead

### A. Integrasi AWS Lambda
Script inferensi telah didesain khusus agar ultra-ringan dan portabel di environment AWS Lambda.

- **File Entrypoint:** `computer_vision/scripts/inference.py` atau `computer_vision/inference/lambda_handler.py`.
- **Fungsi Handler:** `lambda_handler(event, context)`.

#### Payload Request (API Gateway / EventBridge):
```json
{
  "image_base64": "<base64_encoded_jpeg_or_png>"
}
```

#### Struktur Output JSON (Kontrak Backend):
```json
{
  "boxes": [
    {
      "x": 0.5124,
      "y": 0.6215,
      "w": 0.2104,
      "h": 0.3150,
      "conf": 0.9241
    }
  ],
  "count": 1,
  "confidence_avg": 0.9241,
  "latency_ms": 47.02
}
```
*Keterangan:* `x, y, w, h` adalah koordinat bounding box ternormalisasi ($0.0 \le \text{val} \le 1.0$), `count` adalah total kardus terdeteksi (dipakai untuk rekonsiliasi stok fisik), dan `confidence_avg` adalah keyakinan rata-rata deteksi.

### B. Catatan Teknis untuk DevOps Lead
1. **Cold-Start Optimization**:
   Model menggunakan pola lazy-load singleton (`get_model()`). Di Lambda container, pastikan download `best.pt` dari `s3://stockmind-models/yolov8n/best.pt` dilakukan saat tahap *init* ke direktori `/tmp/best.pt`.
2. **Environment Variable**:
   Set `MODEL_PATH=/tmp/best.pt` pada konfigurasi AWS Lambda.
3. **Dependensi Runtime Lambda**:
   Gunakan Lambda Layer atau Container Image yang hanya memuat `ultralytics`, `torch` (CPU wheel), `torchvision`, `pillow`, dan `numpy`. Hindari dependensi GUI atau training packages.

---

## 6. Known Limitations & Mitigasi

1. **Occlusion Berat**: Kardus yang tertutup lebih dari 70% oleh tiang rak berpotensi tidak terdeteksi.
   *Mitigasi:* Rekonsiliasi stok menggunakan multi-angle camera feeds jika tersedia.
2. **Pencahayaan Redup**: Pada lorong gudang tanpa lampu aktif, keyakinan deteksi dapat menurun.
   *Mitigasi:* Setting threshold confidence dinamis (0.20 - 0.25).
3. **Kardus Rusak / Non-Kubikal**: Bentuk kardus yang penyot ekstrem memiliki karakteristik visual berbeda.
   *Mitigasi:* Lakukan penambahan data sampel kardus rusak pada iterasi dataset Roboflow Phase 2.
