"""
StockMind AI - Phase 1: Foundation & Vision System
Script: validate_dataset.py
Deskripsi: Memvalidasi dataset deteksi kotak kardus (cardboard box) format YOLOv8:
            - Menghitung jumlah citra per split (train, val, test)
            - Memvalidasi integritas file citra (deteksi corrupt images)
            - Memvalidasi format label bounding box (normalisasi 0-1, token count, class_id)
            - Mendeteksi label kosong, missing labels, atau unlabelled images
            - Menghasilkan data_validation_report.txt terstruktur
"""

import sys
import argparse
from pathlib import Path
from PIL import Image  # type: ignore
import yaml  # type: ignore

SUPPORTED_IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def parse_args():
    parser = argparse.ArgumentParser(description="Validasi Dataset YOLOv8 untuk StockMind AI")
    parser.add_argument("--data-dir", type=str, default="data", help="Direktori data")
    parser.add_argument("--yaml-file", type=str, default="data/data.yaml", help="Path ke data.yaml")
    parser.add_argument("--report-file", type=str, default="results/data_validation_report.txt", help="Lokasi output laporan")
    return parser.parse_args()

def load_data_yaml(yaml_path: Path):
    if not yaml_path.exists():
        return None
    try:
        with open(yaml_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"[!] Warning: Gagal membaca {yaml_path}: {e}")
        return None

def find_split_directories(data_dir: Path, split: str):
    """
    Menemukan direktori citra dan label untuk split tertentu,
    mendukung format 'data/{split}_images' dan standar 'data/images/{split}'.
    """
    # 1. Cek format data/{split}_images
    candidate_img_1 = data_dir / f"{split}_images"
    candidate_lbl_1 = data_dir / f"{split}_labels"

    # 2. Cek format data/images/{split}
    candidate_img_2 = data_dir / "images" / split
    candidate_lbl_2 = data_dir / "labels" / split

    if candidate_img_1.exists() and any(candidate_img_1.iterdir()):
        img_dir = candidate_img_1
        lbl_dir = candidate_lbl_1 if candidate_lbl_1.exists() else candidate_img_1
    elif candidate_img_2.exists() and any(candidate_img_2.iterdir()):
        img_dir = candidate_img_2
        lbl_dir = candidate_lbl_2 if candidate_lbl_2.exists() else candidate_img_2
    else:
        # Fallback ke candidate 1 walaupun kosong
        img_dir = candidate_img_1
        lbl_dir = candidate_lbl_1

    return img_dir, lbl_dir

def find_label_file(img_path: Path, lbl_dir: Path):
    """
    Mencari file label .txt yang cocok untuk file citra
    """
    stem = img_path.stem
    # 1. Cek di direktori label terpisah
    lbl_candidate_1 = lbl_dir / f"{stem}.txt"
    if lbl_candidate_1.exists():
        return lbl_candidate_1

    # 2. Cek di direktori yang sama dengan gambar
    lbl_candidate_2 = img_path.parent / f"{stem}.txt"
    if lbl_candidate_2.exists():
        return lbl_candidate_2

    # 3. Cek pola data/labels/split jika gambar di data/images/split
    parts = list(img_path.parts)
    if "images" in parts:
        idx = parts.index("images")
        parts[idx] = "labels"
        candidate = Path(*parts).with_suffix(".txt")
        if candidate.exists():
            return candidate

    return None

def validate_split(split_name: str, img_dir: Path, lbl_dir: Path, expected_classes: dict):
    """
    Validasi satu split data (train, val, atau test).
    """
    stats = {
        "split": split_name,
        "img_dir": str(img_dir),
        "lbl_dir": str(lbl_dir),
        "total_images": 0,
        "corrupt_images": [],
        "missing_labels": [],
        "empty_labels": [],
        "valid_labels": 0,
        "total_boxes": 0,
        "class_counts": {},
        "invalid_format_boxes": [],
        "out_of_bounds_boxes": [],
        "warnings": [],
        "widths": [],
        "heights": []
    }

    if not img_dir.exists():
        stats["warnings"].append(f"Direktori citra tidak ditemukan: {img_dir}")
        return stats

    image_files = [p for p in img_dir.iterdir() if p.suffix.lower() in SUPPORTED_IMG_EXTS]
    stats["total_images"] = len(image_files)

    for img_path in sorted(image_files):
        # 1. Uji Integritas Gambar
        try:
            with Image.open(img_path) as im:
                im.verify()
            # Buka ulang untuk membaca size (verify menutup file)
            with Image.open(img_path) as im:
                w, h = im.size
                if w <= 0 or h <= 0:
                    stats["corrupt_images"].append((img_path.name, "Dimensi citra 0"))
                    continue
        except Exception as e:
            stats["corrupt_images"].append((img_path.name, str(e)))
            continue

        # 2. Uji File Label
        lbl_path = find_label_file(img_path, lbl_dir)
        if lbl_path is None or not lbl_path.exists():
            stats["missing_labels"].append(img_path.name)
            continue

        try:
            with open(lbl_path, "r", encoding="utf-8") as lf:
                lines = [line.strip() for line in lf.readlines() if line.strip()]
        except Exception as e:
            stats["invalid_format_boxes"].append((img_path.name, f"Gagal membaca label: {e}"))
            continue

        if not lines:
            # File label ada tapi kosong (background/negative image di YOLO)
            stats["empty_labels"].append(img_path.name)
            continue

        stats["valid_labels"] += 1
        has_box_error = False

        for line_idx, line in enumerate(lines, start=1):
            tokens = line.split()
            if len(tokens) != 5:
                stats["invalid_format_boxes"].append(
                    (img_path.name, f"Baris {line_idx}: Diharapkan 5 token (class xc yc w h), ditemukan {len(tokens)}")
                )
                has_box_error = True
                continue

            cls_str, xc_str, yc_str, w_str, h_str = tokens
            
            # Cek class_id
            try:
                cls_id = int(cls_str)
            except ValueError:
                stats["invalid_format_boxes"].append(
                    (img_path.name, f"Baris {line_idx}: class_id bukan integer '{cls_str}'")
                )
                continue

            # Cek float coordinates
            try:
                xc = float(xc_str)
                yc = float(yc_str)
                bw = float(w_str)
                bh = float(h_str)
            except ValueError:
                stats["invalid_format_boxes"].append(
                    (img_path.name, f"Baris {line_idx}: Koordinat bbox bukan float valid")
                )
                continue

            # Cek normalisasi [0.0, 1.0]
            if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 <= bw <= 1.0 and 0.0 <= bh <= 1.0):
                stats["out_of_bounds_boxes"].append(
                    (img_path.name, f"Baris {line_idx}: Nilai normalisasi di luar [0, 1]: xc={xc}, yc={yc}, w={bw}, h={bh}")
                )
                continue

            # Validasi lebar dan tinggi harus > 0
            if bw <= 0 or bh <= 0:
                stats["out_of_bounds_boxes"].append(
                    (img_path.name, f"Baris {line_idx}: Lebar atau tinggi bbox <= 0 (w={bw}, h={bh})")
                )
                continue

            # Cek class name
            cls_name = expected_classes.get(cls_id, f"class_{cls_id}") if expected_classes else f"class_{cls_id}"
            stats["class_counts"][cls_name] = stats["class_counts"].get(cls_name, 0) + 1
            stats["total_boxes"] += 1
            stats["widths"].append(bw)
            stats["heights"].append(bh)

    return stats

def generate_report(data_dir: Path, yaml_info: dict, split_stats: dict, output_path: Path):
    """
    Menyusun laporan validasi dataset lengkap ke file teks.
    """
    total_imgs_all = sum(s["total_images"] for s in split_stats.values())
    total_boxes_all = sum(s["total_boxes"] for s in split_stats.values())
    total_corrupt_all = sum(len(s["corrupt_images"]) for s in split_stats.values())
    total_missing_lbl = sum(len(s["missing_labels"]) for s in split_stats.values())
    total_invalid_box = sum(len(s["invalid_format_boxes"]) + len(s["out_of_bounds_boxes"]) for s in split_stats.values())

    is_overall_valid = (total_corrupt_all == 0 and total_invalid_box == 0 and total_imgs_all > 0)

    lines = []
    lines.append("================================================================================")
    lines.append("           STOCKMIND AI — DATASET VALIDATION REPORT (PHASE 1)                  ")
    lines.append("           Subsystem: Vision Inventory Agent (Cardboard Box Detection)          ")
    lines.append("================================================================================")
    lines.append(f"Status Validasi Keseluruhan : {'[PASS] VALID' if is_overall_valid else '[FAIL] PERLU TINDAKAN'}")
    lines.append(f"Lokasi Dataset              : {data_dir.resolve()}")
    lines.append(f"Konfigurasi data.yaml       : {'Ditemukan' if yaml_info else 'Tidak ditemukan / Standar fallback'}")
    if yaml_info and "names" in yaml_info:
        lines.append(f"Daftar Kelas (Classes)      : {yaml_info['names']}")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("RINGKASAN METRIK GLOBAL:")
    lines.append(f"  * Total Citra               : {total_imgs_all}")
    lines.append(f"  * Total Bounding Box Kardus : {total_boxes_all}")
    lines.append(f"  * Rata-rata BBox per Citra  : {(total_boxes_all / max(1, total_imgs_all)):.2f}")
    lines.append(f"  * Citra Korup               : {total_corrupt_all}")
    lines.append(f"  * Citra Tanpa File Label    : {total_missing_lbl}")
    lines.append(f"  * Anotasi Invalid / Out-of-Bounds: {total_invalid_box}")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("DETAIL PER SPLIT:")

    for split, s in split_stats.items():
        pct = (s["total_images"] / max(1, total_imgs_all)) * 100
        avg_box = (s["total_boxes"] / max(1, s["total_images"]))
        lines.append(f"\n[Split: {split.upper()}]")
        lines.append(f"  - Folder Citra         : {s['img_dir']}")
        lines.append(f"  - Folder Label         : {s['lbl_dir']}")
        lines.append(f"  - Jumlah Citra         : {s['total_images']} ({pct:.1f}% dari total)")
        lines.append(f"  - Total Bounding Box   : {s['total_boxes']} (avg {avg_box:.2f}/citra)")
        lines.append(f"  - Citra Korup          : {len(s['corrupt_images'])}")
        lines.append(f"  - Missing Label Files  : {len(s['missing_labels'])}")
        lines.append(f"  - Empty Labels (Neg)   : {len(s['empty_labels'])}")
        lines.append(f"  - Invalid Box Format   : {len(s['invalid_format_boxes'])}")
        lines.append(f"  - Out of Bounds Coord  : {len(s['out_of_bounds_boxes'])}")
        
        if s["class_counts"]:
            lines.append("  - Distribusi Kelas     :")
            for cls_name, count in s["class_counts"].items():
                lines.append(f"      * {cls_name}: {count} box")
        
        if s["widths"] and s["heights"]:
            min_w, max_w = min(s["widths"]), max(s["widths"])
            min_h, max_h = min(s["heights"]), max(s["heights"])
            avg_w = sum(s["widths"]) / len(s["widths"])
            avg_h = sum(s["heights"]) / len(s["heights"])
            lines.append(f"  - Statistik Ukuran Box (Norm 0-1):")
            lines.append(f"      * Width  (min/avg/max): {min_w:.4f} / {avg_w:.4f} / {max_w:.4f}")
            lines.append(f"      * Height (min/avg/max): {min_h:.4f} / {avg_h:.4f} / {max_h:.4f}")

        if s["corrupt_images"]:
            lines.append("  - [!] Daftar File Korup:")
            for fname, err in s["corrupt_images"][:5]:
                lines.append(f"      * {fname}: {err}")

        if s["invalid_format_boxes"]:
            lines.append("  - [!] Daftar Format Invalid:")
            for fname, err in s["invalid_format_boxes"][:5]:
                lines.append(f"      * {fname}: {err}")

        if s["out_of_bounds_boxes"]:
            lines.append("  - [!] Koordinat Di Luar Range [0, 1]:")
            for fname, err in s["out_of_bounds_boxes"][:5]:
                lines.append(f"      * {fname}: {err}")

    lines.append("\n================================================================================")
    lines.append("KESIMPULAN & REKOMENDASI UNTUK VISION/ML LEAD:")
    if is_overall_valid:
        lines.append("  [OK] Seluruh citra utuh dan terbaca dengan baik oleh modul PIL/OpenCV.")
        lines.append("  [OK] Seluruh koordinat bounding box ter-normalisasi 0-1 dan siap untuk YOLOv8.")
        lines.append("  [OK] Dataset siap digunakan untuk proses training model (Tahap 2).")
    else:
        lines.append("  [PERHATIAN] Ditemukan anomali integritas atau format label.")
        lines.append("  Segera perbaiki file korup atau normalisasi ulang koordinat sebelum training.")
    lines.append("================================================================================\n")

    report_content = "\n".join(lines)

    # Simpan ke output_path (results/data_validation_report.txt)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    # Simpan juga salinan langsung ke root data_validation_report.txt untuk kemudahan inspeksi
    root_report = data_dir.parent / "data_validation_report.txt"
    try:
        with open(root_report, "w", encoding="utf-8") as f:
            f.write(report_content)
    except Exception:
        pass

    return report_content, is_overall_valid

def main():
    args = parse_args()
    project_root = Path(__file__).resolve().parent.parent
    data_dir = project_root / args.data_dir
    yaml_path = project_root / args.yaml_file
    report_path = project_root / args.report_file

    print("[*] Memulai validasi dataset YOLOv8...")
    print(f"[*] Root direktori data : {data_dir}")

    yaml_info = load_data_yaml(yaml_path)
    expected_classes = {}
    if yaml_info and "names" in yaml_info:
        raw_names = yaml_info["names"]
        if isinstance(raw_names, list):
            expected_classes = {i: name for i, name in enumerate(raw_names)}
        elif isinstance(raw_names, dict):
            expected_classes = {int(k): v for k, v in raw_names.items()}

    split_stats = {}
    for split in ["train", "val", "test"]:
        img_dir, lbl_dir = find_split_directories(data_dir, split)
        stats = validate_split(split, img_dir, lbl_dir, expected_classes)
        split_stats[split] = stats

    report_content, is_valid = generate_report(data_dir, yaml_info, split_stats, report_path)
    print(report_content)
    print(f"[+] Laporan validasi tersimpan di: {report_path}")

    sys.exit(0 if is_valid else 1)

if __name__ == "__main__":
    main()
