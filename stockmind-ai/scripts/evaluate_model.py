"""
StockMind AI - Phase 1: Foundation & Vision System
Script: evaluate_model.py
Deskripsi: Script evaluasi komprehensif model YOLOv8n untuk deteksi kotak kardus:
            - Menghitung mAP50, mAP50-95, precision, recall (global & per-class)
            - Menghasilkan confusion matrix & visualisasi inferensi citra uji
            - Menyimpan hasil ke results/model_evaluation_epoch50.csv
            - Menganalisis target akurasi (mAP50 >= 85%) dan memberikan saran tuning otomatis jika < 85%
"""

import os
import sys
import csv
import glob
import shutil
import argparse
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser(description="Evaluasi Model YOLOv8n untuk StockMind AI")
    parser.add_argument("--model", type=str, default="models/weights/best.pt", help="Path ke weights model (best.pt)")
    parser.add_argument("--data", type=str, default="data/data.yaml", help="Path ke data.yaml")
    parser.add_argument("--split", type=str, default="test", choices=["test", "val", "train"], help="Split evaluasi (default: test)")
    parser.add_argument("--imgsz", type=int, default=640, help="Ukuran resolusi citra")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold")
    parser.add_argument("--iou", type=float, default=0.6, help="NMS IoU threshold")
    parser.add_argument("--output-csv", type=str, default="results/model_evaluation_epoch50.csv", help="Path file output CSV")
    parser.add_argument("--plots-dir", type=str, default="results/eval_plots", help="Direktori penyimpanan plot & confusion matrix")
    return parser.parse_args()

def check_dependencies():
    try:
        import cv2
        import torch
        from ultralytics import YOLO
        return True
    except ImportError as e:
        print(f"[!] Error dependensi: {e}")
        return False

def generate_prediction_visualizations(model, test_img_dir: Path, output_pred_dir: Path, conf: float = 0.25):
    """
    Menjalankan inferensi dan menyimpan visualisasi bounding box pada gambar-gambar uji
    """
    output_pred_dir.mkdir(parents=True, exist_ok=True)
    supported_exts = {".jpg", ".jpeg", ".png", ".bmp"}
    img_files = [p for p in test_img_dir.iterdir() if p.suffix.lower() in supported_exts]

    if not img_files:
        return 0

    saved_count = 0
    for img_path in img_files:
        results = model.predict(source=str(img_path), conf=conf, verbose=False)
        for r in results:
            annotated_bgr = r.plot()  # Mengembalikan array numpy BGR
            out_file = output_pred_dir / f"pred_{img_path.name}"
            import cv2
            cv2.imwrite(str(out_file), annotated_bgr)
            saved_count += 1

    return saved_count

def provide_tuning_recommendations(map50: float, precision: float, recall: float):
    """
    Memberikan analisis diagnostik dan saran teknis lanjutan jika akurasi < 85%
    """
    print("\n=================================================================")
    print("      DIAGNOSTIK & REKOMENDASI TUNING (VISION/ML LEAD)          ")
    print("=================================================================")
    if map50 >= 0.85:
        print("[PASS] Akurasi mAP50 (>= 85%) telah memenuhi kriteria kelulusan Phase 1.")
        print("Model siap diekspor untuk deployment Lambda oleh Backend Lead.")
        print("=================================================================")
        return

    print(f"[WARNING] mAP50 saat ini: {map50 * 100:.2f}% (Target: >= 85.00%).")
    print("Diagnostik anomali & rencana aksi optimalisasi:")
    
    # Analisis gap Precision vs Recall
    if recall > precision * 2:
        print("  1. Tingginya False Positives (Precision Rendah):")
        print("     - Model cenderung mendeteksi banyak area non-kardus sebagai kardus.")
        print("     - Rekomendasi: Naikkan confidence threshold saat evaluasi (misal conf=0.35-0.50).")
        print("     - Tingkatkan variasi latar belakang negatif (kosong) pada dataset.")
    elif precision > recall * 2:
        print("  1. Tingginya False Negatives (Recall Rendah):")
        print("     - Banyak kardus di rak terlewat oleh model.")
        print("     - Rekomendasi: Turunkan confidence threshold atau naikkan variasi sudut kamera & bayangan.")

    print("\n  2. Strategi Pelatihan (Training Strategy):")
    print("     - Tambah Epoch: Jika baru berjalan sedikit epoch (misal 2-10 epoch), lanjutkan training hingga 50-100 epoch.")
    print("     - Optimizer: Coba gunakan optimizer 'AdamW' dengan cosine lr scheduler ('cos_lr=True').")
    print("     - Learning Rate: Turunkan lr0 awal ke 0.005 untuk stabilitas konvergensi.")

    print("\n  3. Perluasan Dataset Gudang (Dataset Scaling via Roboflow):")
    print("     - Gunakan Roboflow API untuk menarik dataset nyata warehouse boxes (100-300+ real images).")
    print("     - Tambahkan variasi kardus: kardus rusak/penyot, kardus bertumpuk rapat, dan kardus bermotif print.")

    print("\n  4. Augmentasi Khusus Lingkungan Racking Gudang:")
    print("     - Aktifkan Mosaic Augmentation (mosaic=1.0) untuk mengenali kardus berukuran kecil di rak jauh.")
    print("     - Tambahkan variasi pencahayaan ekstrem (hsv_v=0.6) untuk simulasi lorong gudang remang.")
    print("=================================================================")

def run_evaluation():
    args = parse_args()
    project_root = Path(__file__).resolve().parent.parent

    model_path = (project_root / args.model).resolve()
    data_path = (project_root / args.data).resolve()
    csv_path = (project_root / args.output_csv).resolve()
    plots_dir = (project_root / args.plots_dir).resolve()

    print("=================================================================")
    print("       STOCKMIND AI — MODEL EVALUATION PIPELINE (PHASE 1)       ")
    print("=================================================================")
    print(f"Model Path       : {model_path}")
    print(f"Data Config      : {data_path}")
    print(f"Evaluation Split : {args.split}")
    print(f"Image Resolution : {args.imgsz}")
    print(f"Confidence Thresh: {args.conf}")
    print(f"IoU NMS Thresh   : {args.iou}")
    print(f"CSV Output       : {csv_path}")
    print(f"Plots Directory  : {plots_dir}")
    print("-----------------------------------------------------------------")

    if not model_path.exists():
        print(f"[!] Error: Model weight tidak ditemukan di: {model_path}")
        sys.exit(1)

    if not data_path.exists():
        print(f"[!] Error: data.yaml tidak ditemukan di: {data_path}")
        sys.exit(1)

    if not check_dependencies():
        sys.exit(1)

    from ultralytics import YOLO

    print("[*] Memuat model YOLOv8n...")
    model = YOLO(str(model_path))

    print(f"[*] Menjalankan evaluasi pada split '{args.split}'...")
    val_results = model.val(
        data=str(data_path),
        split=args.split,
        imgsz=args.imgsz,
        conf=args.conf,
        iou=args.iou,
        plots=True,
        project=str(plots_dir.parent),
        name=plots_dir.name,
        exist_ok=True,
        verbose=False
    )

    # Ekstraksi metrik global
    map50 = float(val_results.box.map50)
    map50_95 = float(val_results.box.map)
    mean_precision = float(val_results.box.mp)
    mean_recall = float(val_results.box.mr)

    # Ekstraksi metrik per-class
    names = val_results.names
    p_per_class = val_results.box.p
    r_per_class = val_results.box.r
    map50_per_class = val_results.box.all_ap[:, 0] if hasattr(val_results.box, "all_ap") and val_results.box.all_ap.shape[1] > 0 else [map50]
    map_per_class = val_results.box.maps if hasattr(val_results.box, "maps") else [map50_95]

    print("\n-----------------------------------------------------------------")
    print("                      METRIK EVALUASI                           ")
    print("-----------------------------------------------------------------")
    print(f"Split                : {args.split.upper()}")
    print(f"mAP@50               : {map50 * 100:.2f}%  (Target: >= 85.00%)")
    print(f"mAP@50-95            : {map50_95 * 100:.2f}%")
    print(f"Mean Precision       : {mean_precision * 100:.2f}%")
    print(f"Mean Recall          : {mean_recall * 100:.2f}%")
    target_met = map50 >= 0.85
    print(f"Status Target Akurasi: {'[PASS]' if target_met else '[BELUM TERCAPAI]'}")
    print("-----------------------------------------------------------------")

    # Tulis hasil ke CSV
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["split", "class_id", "class_name", "precision", "recall", "map50", "map50_95", "target_met_85"])
        
        # Tulis baris per kelas
        for cls_id, cls_name in names.items():
            cls_p = float(p_per_class[cls_id]) if cls_id < len(p_per_class) else mean_precision
            cls_r = float(r_per_class[cls_id]) if cls_id < len(r_per_class) else mean_recall
            cls_map50 = float(map50_per_class[cls_id]) if cls_id < len(map50_per_class) else map50
            cls_map = float(map_per_class[cls_id]) if cls_id < len(map_per_class) else map50_95

            writer.writerow([
                args.split,
                cls_id,
                cls_name,
                f"{cls_p:.4f}",
                f"{cls_r:.4f}",
                f"{cls_map50:.4f}",
                f"{cls_map:.4f}",
                "YES" if cls_map50 >= 0.85 else "NO"
            ])
            print(f"Class [{cls_id}] {cls_name:<15} | P: {cls_p*100:5.1f}% | R: {cls_r*100:5.1f}% | mAP50: {cls_map50*100:5.1f}%")

        # Tulis baris summary ALL
        writer.writerow([
            args.split,
            "ALL",
            "all_classes",
            f"{mean_precision:.4f}",
            f"{mean_recall:.4f}",
            f"{map50:.4f}",
            f"{map50_95:.4f}",
            "YES" if target_met else "NO"
        ])

    print(f"\n[+] Hasil evaluasi CSV tersimpan di: {csv_path}")

    # Generate Visualisasi Prediksi pada Gambar Uji
    test_img_dir = project_root / "data" / f"{args.split}_images"
    if test_img_dir.exists():
        pred_out_dir = plots_dir / "predictions"
        saved = generate_prediction_visualizations(model, test_img_dir, pred_out_dir, conf=args.conf)
        print(f"[+] Visualisasi prediksi {saved} citra uji tersimpan di: {pred_out_dir}")

    # Cek Confusion Matrix files yang digenerate Ultralytics
    cm_candidates = [
        plots_dir / "confusion_matrix.png",
        plots_dir / "confusion_matrix_normalized.png",
        plots_dir / "val_batch0_pred.jpg"
    ]
    found_plots = [str(p.name) for p in cm_candidates if p.exists()]
    if found_plots:
        print(f"[+] Confusion matrix & visualisasi batch tersedia: {', '.join(found_plots)}")

    # Berikan rekomendasi tuning
    provide_tuning_recommendations(map50, mean_precision, mean_recall)

if __name__ == "__main__":
    run_evaluation()
