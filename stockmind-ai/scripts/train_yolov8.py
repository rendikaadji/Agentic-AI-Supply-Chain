"""
StockMind AI - Phase 1: Foundation & Vision System
Script: train_yolov8.py
Deskripsi: Script training YOLOv8n untuk deteksi kotak kardus (cardboard box) gudang.
            Mendukung training lokal maupun remote dengan parameter:
            - Model dasar: YOLOv8n (nano, ringan untuk Lambda target <50MB)
            - Hyperparameter: epochs=50, imgsz=640, batch=8, optimizer='SGD'
            - Augmentasi: flipud, fliplr, hsv, rotasi (degrees), scale, translate
            - Retensi checkpoint berkala (save_period)
            - Ekspor otomatis model final ke models/weights/best.pt
"""

import os
import sys
import shutil
import argparse
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser(description="Training YOLOv8n untuk StockMind AI Cardboard Box Detection")
    parser.add_argument("--data", type=str, default="data/data.yaml", help="Path ke data.yaml")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Pretrained model base (default: yolov8n.pt)")
    parser.add_argument("--epochs", type=int, default=50, help="Jumlah epoch (default: 50)")
    parser.add_argument("--imgsz", type=int, default=640, help="Resolusi citra input (default: 640)")
    parser.add_argument("--batch", type=int, default=8, help="Ukuran batch (default: 8)")
    parser.add_argument("--optimizer", type=str, default="SGD", choices=["SGD", "Adam", "AdamW"], help="Optimizer (default: SGD)")
    parser.add_argument("--lr0", type=float, default=0.01, help="Initial learning rate")
    parser.add_argument("--save-period", type=int, default=5, help="Simpan checkpoint tiap N epoch")
    parser.add_argument("--device", type=str, default="", help="Device: '0', 'cpu', atau kosong untuk auto-detect")
    parser.add_argument("--project", type=str, default="results/train", help="Direktori output training runs")
    parser.add_argument("--name", type=str, default="cardboard_box_yolov8n", help="Nama sub-run training")
    parser.add_argument("--export-dir", type=str, default="models/weights", help="Direktori export final model")
    return parser.parse_args()

def check_dependencies():
    try:
        import torch
        from ultralytics import YOLO
        return True
    except ImportError as e:
        print(f"[!] Error: Dependensi belum lengkap: {e}")
        print("    Jalankan: pip install ultralytics torch")
        return False

def run_training():
    args = parse_args()
    project_root = Path(__file__).resolve().parent.parent

    # Resolusi path absolut
    data_yaml_path = (project_root / args.data).resolve()
    export_dir = (project_root / args.export_dir).resolve()
    project_dir = (project_root / args.project).resolve()

    print("=================================================================")
    print("      STOCKMIND AI — VISION/ML TRAINING PIPELINE (PHASE 1)      ")
    print("      Model: YOLOv8n (Cardboard Box Detection)                  ")
    print("=================================================================")
    print(f"Data YAML Config : {data_yaml_path}")
    print(f"Base Model       : {args.model}")
    print(f"Epochs           : {args.epochs}")
    print(f"Image Size       : {args.imgsz}")
    print(f"Batch Size       : {args.batch}")
    print(f"Optimizer        : {args.optimizer} (lr0={args.lr0})")
    print(f"Checkpoint Period: Setiap {args.save_period} epoch")
    print(f"Export Target    : {export_dir}")
    print("-----------------------------------------------------------------")

    if not data_yaml_path.exists():
        print(f"[!] File konfigurasi dataset tidak ditemukan: {data_yaml_path}")
        sys.exit(1)

    if not check_dependencies():
        sys.exit(1)

    import torch
    from ultralytics import YOLO

    # Deteksi hardware
    if args.device:
        device = args.device
    else:
        device = "0" if torch.cuda.is_available() else "cpu"

    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() and device != "cpu" else "CPU Mode"
    print(f"Hardware Compute : {device} ({gpu_name})")
    print("Augmentasi Aktif :")
    print("  * Horizontal Flip (fliplr=0.5)")
    print("  * Vertical Flip   (flipud=0.5)")
    print("  * HSV Augmentation(h=0.015, s=0.7, v=0.4)")
    print("  * Rotation        (degrees=10.0)")
    print("  * Scale & Trans   (scale=0.5, translate=0.1)")
    print("-----------------------------------------------------------------")
    print("[*] Menginisialisasi base model...")

    model = YOLO(args.model)

    print("[*] Memulai proses training YOLOv8n...")
    results = model.train(
        data=str(data_yaml_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        optimizer=args.optimizer,
        lr0=args.lr0,
        device=device,
        save=True,
        save_period=args.save_period,
        # Augmentasi standar industri gudang
        fliplr=0.5,
        flipud=0.5,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=10.0,
        scale=0.5,
        translate=0.1,
        # Lokasi penyimpanan run
        project=str(project_dir),
        name=args.name,
        exist_ok=True,
        verbose=True
    )

    save_dir = Path(results.save_dir) if hasattr(results, "save_dir") else project_dir / args.name
    weights_dir = save_dir / "weights"
    best_weight_src = weights_dir / "best.pt"
    last_weight_src = weights_dir / "last.pt"

    print("\n=================================================================")
    print("                   TRAINING SELESAI                             ")
    print("=================================================================")
    print(f"Run Output Directory : {save_dir}")

    # Buat direktori export jika belum ada
    export_dir.mkdir(parents=True, exist_ok=True)

    if best_weight_src.exists():
        final_best_dest = export_dir / "best.pt"
        shutil.copy2(best_weight_src, final_best_dest)
        file_size_mb = final_best_dest.stat().st_size / (1024 * 1024)

        print(f"[OK] best.pt berhasil disalin ke: {final_best_dest}")
        print(f"     Ukuran Model : {file_size_mb:.2f} MB")
        
        # Validasi batas ukuran < 50MB untuk Lambda deployment
        if file_size_mb < 50.0:
            print(f"     Status Ukuran: [PASS] < 50MB (Sesuai spesifikasi AWS Lambda)")
        else:
            print(f"     Status Ukuran: [WARNING] Model > 50MB ({file_size_mb:.2f} MB)")

    if last_weight_src.exists():
        final_last_dest = export_dir / "last.pt"
        shutil.copy2(last_weight_src, final_last_dest)
        print(f"[OK] last.pt checkpoint tersimpan di: {final_last_dest}")

    print("\nTarget S3 Upload (DevOps / Backend):")
    print("  s3://stockmind-models/yolov8n/best.pt")
    print("=================================================================")

if __name__ == "__main__":
    run_training()
