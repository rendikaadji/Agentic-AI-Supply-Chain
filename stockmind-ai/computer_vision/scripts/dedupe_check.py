"""
StockMind AI - Phase 1: Foundation & Vision System
Script: dedupe_check.py
Deskripsi: CLI standalone untuk tahap data cleaning "deteksi near-duplicate
           test vs train". Logic-nya ada di computer_vision/pipeline/data_cleaning.py
           (reusable, bisa dipanggil langsung dari kode lain di pipeline data cleaning);
           script ini hanya menangani argparse dan pencetakan ringkasan ke terminal.
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from computer_vision.pipeline.data_cleaning import dedupe_test_against_train


def parse_args():
    parser = argparse.ArgumentParser(description="Deteksi near-duplicate test vs train & ekspor subset test bersih")
    parser.add_argument("--data-dir", type=str, default="computer_vision/data", help="Direktori data (format Roboflow: train/valid/test dengan images/ + labels/)")
    parser.add_argument("--yaml-file", type=str, default="computer_vision/data/data.yaml", help="Path ke data.yaml asli")
    parser.add_argument("--hash-size", type=int, default=8, help="Ukuran average-hash (default 8 -> hash 64-bit)")
    parser.add_argument("--report-file", type=str, default="computer_vision/results/dedupe_report.txt", help="Lokasi laporan teks")
    parser.add_argument("--clean-subset-dir", type=str, default="computer_vision/data/test_clean", help="Direktori output subset test bersih")
    parser.add_argument("--clean-yaml", type=str, default="computer_vision/data/data_test_clean.yaml", help="Path data.yaml varian untuk subset bersih")
    return parser.parse_args()


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

    if not (data_dir / "train" / "images").exists() or not (data_dir / "test" / "images").exists():
        print(f"[!] Direktori train/test tidak ditemukan di {data_dir}")
        sys.exit(1)

    print("[*] Menghitung perceptual hash untuk seluruh citra train & test, mencocokkan near-duplicate...")
    result = dedupe_test_against_train(
        data_dir=data_dir,
        yaml_path=yaml_path,
        report_path=report_path,
        clean_subset_dir=clean_dir,
        clean_yaml_path=clean_yaml_path,
        hash_size=args.hash_size,
    )

    print(result.report_content)
    print(f"\n[+] Laporan tersimpan di: {result.report_path}")
    print(f"[+] Subset test bersih ({len(result.clean)} citra) disalin ke: {result.clean_dir}")
    print(f"[+] data.yaml subset bersih tersimpan di: {result.clean_yaml_path}")
    print("\nCara pakai untuk evaluasi kredibilitas ganda (Bagian A Langkah 4):")
    print(f"  python computer_vision/scripts/evaluate_model.py --data {args.yaml_file} --split test          # angka resmi Roboflow")
    print(f"  python computer_vision/scripts/evaluate_model.py --data {args.clean_yaml} --split test    # angka subset bersih")


if __name__ == "__main__":
    main()
