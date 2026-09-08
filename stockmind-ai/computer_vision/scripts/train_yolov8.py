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
    parser.add_argument("--data", type=str, default="computer_vision/data/data.yaml", help="Path ke data.yaml")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Pretrained model base (default: yolov8n.pt)")
    parser.add_argument("--epochs", type=int, default=100, help="Jumlah epoch maksimum (default: 100, dihentikan otomatis oleh --patience)")
    parser.add_argument("--patience", type=int, default=20, help="Early stopping: hentikan jika tidak ada peningkatan setelah N epoch (default: 20)")
    parser.add_argument("--imgsz", type=int, default=640, help="Resolusi citra input (default: 640)")
    parser.add_argument("--batch", type=int, default=8, help="Ukuran batch (default: 8)")
    parser.add_argument("--workers", type=int, default=8, help="Jumlah dataloader worker per train/val (default: 8 -> turunkan misal 4 jika RAM sistem terbatas, mosaic+mixup pada dataset besar rakus RAM per worker)")
    parser.add_argument("--optimizer", type=str, default="AdamW", choices=["SGD", "Adam", "AdamW"], help="Optimizer (default: AdamW, bandingkan dengan --optimizer SGD)")
    parser.add_argument("--lr0", type=float, default=None, help="Initial learning rate (default: auto -> 0.002 untuk Adam/AdamW, 0.01 untuk SGD)")
    parser.add_argument("--cos-lr", dest="cos_lr", action="store_true", default=True, help="Aktifkan cosine LR annealing (default: aktif)")
    parser.add_argument("--no-cos-lr", dest="cos_lr", action="store_false", help="Nonaktifkan cosine LR annealing (pakai linear default)")
    parser.add_argument("--hsv-v", type=float, default=0.6, help="Augmentasi variasi brightness (default: 0.6, dinaikkan dari 0.4 untuk simulasi lorong gudang temaram)")
    parser.add_argument("--save-period", type=int, default=5, help="Simpan checkpoint tiap N epoch")
    parser.add_argument("--device", type=str, default="", help="Device: '0', 'cpu', atau kosong untuk auto-detect")
    parser.add_argument("--project", type=str, default="computer_vision/results/train", help="Direktori output training runs")
    parser.add_argument("--name", type=str, default="cardboard_box_yolov8n", help="Nama sub-run training")
    parser.add_argument("--export-dir", type=str, default="computer_vision/models", help="Direktori export final model")
    parser.add_argument("--resume", action="store_true", help="Lanjutkan training dari checkpoint last.pt terakhir (run --project/--name yang sama) alih-alih mulai dari base model")
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
    if args.lr0 is None:
        # lr0=0.01 di-tuning untuk SGD; Adam/AdamW butuh LR jauh lebih rendah agar stabil
        args.lr0 = 0.01 if args.optimizer == "SGD" else 0.002
    project_root = Path(__file__).resolve().parent.parent.parent

    # Resolusi path absolut (fleksibel jika dijalankan dari root atau subfolder)
    data_path = Path(args.data)
    data_yaml_path = data_path if data_path.is_absolute() else (project_root / args.data).resolve()
    if not data_yaml_path.exists() and (Path.cwd() / args.data).exists():
        data_yaml_path = (Path.cwd() / args.data).resolve()

    exp_path = Path(args.export_dir)
    export_dir = exp_path if exp_path.is_absolute() else (project_root / args.export_dir).resolve()

    proj_path = Path(args.project)
    project_dir = proj_path if proj_path.is_absolute() else (project_root / args.project).resolve()

    print("=================================================================")
    print("      STOCKMIND AI — VISION/ML TRAINING PIPELINE (PHASE 1)      ")
    print("      Model: YOLOv8n (Cardboard Box Detection)                  ")
    print("=================================================================")
    print(f"Data YAML Config : {data_yaml_path}")
    print(f"Base Model       : {args.model}")
    print(f"Epochs           : {args.epochs}")
    print(f"Image Size       : {args.imgsz}")
    print(f"Batch Size       : {args.batch}")
    print(f"Optimizer        : {args.optimizer} (lr0={args.lr0}, cos_lr={args.cos_lr})")
    print(f"Early Stopping   : patience={args.patience} epoch")
    print(f"Checkpoint Period: Setiap {args.save_period} epoch")
    print(f"Export Target    : {export_dir}")
    print("-----------------------------------------------------------------")

    if not data_yaml_path.exists():
        print(f"[!] File konfigurasi dataset tidak ditemukan: {data_yaml_path}")
        sys.exit(1)

    import yaml
    try:
        with open(data_yaml_path, "r", encoding="utf-8") as f:
            y_info = yaml.safe_load(f)
        if y_info:
            actual_data_dir = str(data_yaml_path.parent.resolve()).replace("\\", "/")
            y_info["path"] = actual_data_dir
            with open(data_yaml_path, "w", encoding="utf-8") as f:
                yaml.safe_dump(y_info, f, sort_keys=False)
    except Exception as e:
        print(f"[*] Info auto-resolving data.yaml: {e}")

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
    print(f"  * HSV Augmentation(h=0.015, s=0.7, v={args.hsv_v})")
    print("  * Rotation        (degrees=10.0)")
    print("  * Scale & Trans   (scale=0.5, translate=0.1)")
    print("  * Mosaic (Dense)  (mosaic=1.0 - 4 citra komposit)")
    print("  * Mixup (Occlusion)(mixup=0.15 - blending kardus bertumpuk)")
    print("  * Perspective     (perspective=0.0005 - koreksi CCTV)")
    print("  * Random Erasing  (erasing=0.2 - simulasi halangan lakban/strapping)")
    print("-----------------------------------------------------------------")
    resume_ckpt = project_dir / args.name / "weights" / "last.pt"
    if args.resume and resume_ckpt.exists():
        print(f"[*] Melanjutkan training dari checkpoint: {resume_ckpt}")
        model = YOLO(str(resume_ckpt))
        print("[*] Memulai proses training (resume)...")
        results = model.train(resume=True, workers=args.workers)
    else:
        if args.resume:
            print(f"[!] --resume diminta tapi checkpoint tidak ditemukan di {resume_ckpt}, mulai dari base model.")
        print("[*] Menginisialisasi base model...")
        model = YOLO(args.model)
        print("[*] Memulai proses training YOLOv8n...")
        results = model.train(
        data=str(data_yaml_path),
        epochs=args.epochs,
        patience=args.patience,
        imgsz=args.imgsz,
        batch=args.batch,
        workers=args.workers,
        optimizer=args.optimizer,
        lr0=args.lr0,
        cos_lr=args.cos_lr,
        device=device,
        save=True,
        save_period=args.save_period,
        # Augmentasi canggih untuk skenario gudang rumit & oklusi padat
        fliplr=0.5,
        flipud=0.5,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=args.hsv_v,  # dinaikkan dari 0.4 -> simulasi lorong gudang temaram/pencahayaan tidak merata
        degrees=10.0,
        scale=0.5,
        translate=0.1,
        mosaic=1.0,        # Menggabungkan 4 scene komposit untuk melatih deteksi multi-box padat
        mixup=0.15,        # Blending 2 citra untuk menangani kardus saling menumpuk/tertutupi (oklusi)
        perspective=0.0005,# Distorsi sudut kamera CCTV langit-langit gudang
        erasing=0.2,       # Simulasi kardus tertutup sebagian (partial occlusion)
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
