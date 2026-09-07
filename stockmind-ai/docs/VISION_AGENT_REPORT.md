# Vision Inventory Agent (Pilar 2) — Technical Report & Testing Guide

Dokumentasi lengkap dan panduan pengujian subsystem Computer Vision telah tersedia di:
- **[computer_vision/README.md](../computer_vision/README.md)**

### Ringkasan Teknis:
- **Model:** YOLOv8n (`nano`) — Single class: `cardboard_box`
- **Ukuran File Bobot:** `5.96 MB` (`best.pt`)
- **Akurasi mAP@50:** `99.50%` (Target >= 85%)
- **Kecepatan Inferensi:** `~34.8 ms` (CPU Warm / AWS Lambda ready)
- **Status Fase:** Phase 1 Complete (Foundation & Pipeline Verified)

### Ringkasan Perintah Pengujian CLI:
```powershell
# 1. Validasi Integritas Dataset
.\.venv\Scripts\python.exe computer_vision/scripts/validate_dataset.py --data computer_vision/data/data.yaml

# 2. Jalankan Unit Tests Kontrak Output
.\.venv\Scripts\python.exe -m unittest tests/unit/test_vision_inference.py -v

# 3. Evaluasi Akurasi mAP
.\.venv\Scripts\python.exe computer_vision/scripts/evaluate_model.py --model computer_vision/models/best.pt --split test

# 4. Inferensi Deteksi & Handler Lambda
.\.venv\Scripts\python.exe computer_vision/scripts/inference.py --image computer_vision/data/test_images/warehouse_box_test_0001.jpg
```
