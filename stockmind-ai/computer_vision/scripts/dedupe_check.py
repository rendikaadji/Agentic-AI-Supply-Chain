"""
StockMind AI - Phase 1: Foundation & Vision System
Script: dedupe_check.py
Deskripsi: Mendeteksi near-duplicate antara test split dan train split (perceptual
            hashing / average-hash 8x8, tanpa dependensi eksternal - hanya Pillow).
            Dataset Roboflow publik sering menyebar augmentasi dari citra sumber yang
            sama ke train/valid/test secara acak, sehingga sebagian "test" sebenarnya
            sudah pernah dilihat modelnya (dalam varian lain) saat training.
            Output:
              - Laporan teks jumlah & daftar test image yang leaked (mirip citra train)
              - Subset test yang bersih (tanpa leak) disalin ke direktori terpisah
              - data.yaml varian yang menunjuk ke subset bersih tsb, siap dipakai
                langsung oleh evaluate_model.py (--data ... --split test)
"""

import sys
import shutil
import argparse
from pathlib import Path
from PIL import Image  # type: ignore

SUPPORTED_IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def parse_args():
    parser = argparse.ArgumentParser(description="Deteksi near-duplicate test vs train & ekspor subset test bersih")
    parser.add_argument("--data-dir", type=str, default="computer_vision/data", help="Direktori data (format Roboflow: train/valid/test dengan images/ + labels/)")
    parser.add_argument("--yaml-file", type=str, default="computer_vision/data/data.yaml", help="Path ke data.yaml asli")
    parser.add_argument("--hash-size", type=int, default=8, help="Ukuran average-hash (default 8 -> hash 64-bit)")
    parser.add_argument("--report-file", type=str, default="computer_vision/results/dedupe_report.txt", help="Lokasi laporan teks")
    parser.add_argument("--clean-subset-dir", type=str, default="computer_vision/data/test_clean", help="Direktori output subset test bersih")
    parser.add_argument("--clean-yaml", type=str, default="computer_vision/data/data_test_clean.yaml", help="Path data.yaml varian untuk subset bersih")
    return parser.parse_args()


def average_hash(img_path: Path, size: int) -> int:
    with Image.open(img_path) as im:
        im = im.convert("L").resize((size, size), Image.LANCZOS)
        pixels = list(im.getdata())
    avg = sum(pixels) / len(pixels)
    bits = "".join("1" if p > avg else "0" for p in pixels)
    return int(bits, 2)


def resolve(p_str: str, project_root: Path) -> Path:
    p = Path(p_str)
    if p.is_absolute():
        return p
    if (Path.cwd() / p).exists():
        return (Path.cwd() / p).resolve()
    return (project_root / p).resolve()


def main():
    args = parse_args()
    project_root = Path(__file__).resolve().parent.parent.parent
    data_dir = resolve(args.data_dir, project_root)
    yaml_path = resolve(args.yaml_file, project_root)
    report_path = resolve(args.report_file, project_root)
    clean_dir = resolve(args.clean_subset_dir, project_root)
    clean_yaml_path = resolve(args.clean_yaml, project_root)

    train_img_dir = data_dir / "train" / "images"
    test_img_dir = data_dir / "test" / "images"
    test_lbl_dir = data_dir / "test" / "labels"

    if not train_img_dir.exists() or not test_img_dir.exists():
        print(f"[!] Direktori train/test tidak ditemukan di {data_dir}")
        sys.exit(1)

    print("[*] Menghitung perceptual hash untuk seluruh citra train...")
    train_hashes = {}
    for img_path in sorted(train_img_dir.iterdir()):
        if img_path.suffix.lower() not in SUPPORTED_IMG_EXTS:
            continue
        train_hashes.setdefault(average_hash(img_path, args.hash_size), img_path.name)

    print("[*] Menghitung perceptual hash untuk seluruh citra test & mencocokkan ke train...")
    leaked, clean = [], []
    for img_path in sorted(test_img_dir.iterdir()):
        if img_path.suffix.lower() not in SUPPORTED_IMG_EXTS:
            continue
        h = average_hash(img_path, args.hash_size)
        if h in train_hashes:
            leaked.append((img_path.name, train_hashes[h]))
        else:
            clean.append(img_path.name)

    total = len(leaked) + len(clean)

    # Tulis laporan
    lines = [
        "================================================================================",
        "        STOCKMIND AI - LAPORAN DEDUPLIKASI TEST vs TRAIN (PERCEPTUAL HASH)     ",
        "================================================================================",
        f"Total citra test                     : {total}",
        f"Leaked (near-duplicate dengan train)  : {len(leaked)} ({len(leaked) / max(1, total) * 100:.1f}%)",
        f"Bersih (tidak ada near-duplicate)     : {len(clean)} ({len(clean) / max(1, total) * 100:.1f}%)",
        "--------------------------------------------------------------------------------",
        "DAFTAR TEST IMAGE YANG LEAKED (nama_test -> mirip nama_train):",
    ]
    for test_name, train_name in leaked:
        lines.append(f"  {test_name}  ->  {train_name}")
    lines.append("================================================================================")
    report_content = "\n".join(lines)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report_content, encoding="utf-8")
    print(report_content)
    print(f"\n[+] Laporan tersimpan di: {report_path}")

    # Ekspor subset bersih (images + labels) ke direktori terpisah
    clean_img_dir = clean_dir / "images"
    clean_lbl_dir = clean_dir / "labels"
    clean_img_dir.mkdir(parents=True, exist_ok=True)
    clean_lbl_dir.mkdir(parents=True, exist_ok=True)

    for name in clean:
        shutil.copy2(test_img_dir / name, clean_img_dir / name)
        lbl_name = Path(name).with_suffix(".txt").name
        src_lbl = test_lbl_dir / lbl_name
        if src_lbl.exists():
            shutil.copy2(src_lbl, clean_lbl_dir / lbl_name)

    print(f"[+] Subset test bersih ({len(clean)} citra) disalin ke: {clean_dir}")

    # Tulis data.yaml varian yang menunjuk ke subset bersih (untuk evaluate_model.py)
    import yaml  # type: ignore
    with open(yaml_path, "r", encoding="utf-8") as f:
        yaml_info = yaml.safe_load(f) or {}
    yaml_info["path"] = str(data_dir.resolve()).replace("\\", "/")
    yaml_info["test"] = "test_clean/images"
    with open(clean_yaml_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(yaml_info, f, sort_keys=False)

    print(f"[+] data.yaml subset bersih tersimpan di: {clean_yaml_path}")
    print("\nCara pakai untuk evaluasi kredibilitas ganda (Bagian A Langkah 4):")
    print(f"  python computer_vision/scripts/evaluate_model.py --data {args.yaml_file} --split test          # angka resmi Roboflow")
    print(f"  python computer_vision/scripts/evaluate_model.py --data {args.clean_yaml} --split test    # angka subset bersih")


if __name__ == "__main__":
    main()
