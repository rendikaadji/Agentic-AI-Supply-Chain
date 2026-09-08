"""
StockMind AI - Computer Vision Data Pipeline
Modul: data_cleaning.py
Deskripsi: Tahap data cleaning untuk dataset deteksi objek berformat YOLO
           (train/valid/test dengan images/ + labels/). Saat ini mencakup
           deteksi near-duplicate antara test split dan train split
           (perceptual hashing / average-hash, tanpa dependensi eksternal
           selain Pillow).

           Dataset Roboflow publik sering menyebar augmentasi dari citra
           sumber yang sama ke train/valid/test secara acak, sehingga
           sebagian "test" sebenarnya sudah pernah dilihat modelnya (dalam
           varian lain) saat training. Fungsi di modul ini mendeteksi hal
           tersebut dan mengekspor subset test yang bersih (tanpa leak),
           siap dipakai langsung oleh evaluate_model.py (--data ... --split test).

           Fungsi di sini dipanggil sebagai tahap pipeline data cleaning dan
           tetap bisa dieksekusi standalone via CLI (lihat scripts/dedupe_check.py).
"""

import shutil
from pathlib import Path
from typing import NamedTuple

from PIL import Image  # type: ignore

SUPPORTED_IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


class DedupeResult(NamedTuple):
    total: int
    leaked: list
    clean: list
    report_content: str
    report_path: Path
    clean_dir: Path
    clean_yaml_path: Path


def average_hash(img_path: Path, size: int = 8) -> int:
    """Hitung perceptual hash (average-hash) dari sebuah citra."""
    with Image.open(img_path) as im:
        im = im.convert("L").resize((size, size), Image.LANCZOS)
        pixels = list(im.getdata())
    avg = sum(pixels) / len(pixels)
    bits = "".join("1" if p > avg else "0" for p in pixels)
    return int(bits, 2)


def dedupe_test_against_train(
    data_dir: Path,
    yaml_path: Path,
    report_path: Path,
    clean_subset_dir: Path,
    clean_yaml_path: Path,
    hash_size: int = 8,
) -> DedupeResult:
    """
    Deteksi near-duplicate test vs train, tulis laporan teks, dan ekspor
    subset test bersih (images + labels) beserta data.yaml varian yang
    menunjuknya. Path di data.yaml varian ditulis relatif terhadap
    lokasi file yaml itu sendiri, supaya portable lintas komputer/OS.

    Mengembalikan DedupeResult berisi ringkasan hasil (dipakai baik oleh
    CLI standalone maupun pipeline lain yang memanggil fungsi ini).
    """
    import yaml  # type: ignore

    train_img_dir = data_dir / "train" / "images"
    test_img_dir = data_dir / "test" / "images"
    test_lbl_dir = data_dir / "test" / "labels"

    if not train_img_dir.exists() or not test_img_dir.exists():
        raise FileNotFoundError(f"Direktori train/test tidak ditemukan di {data_dir}")

    train_hashes = {}
    for img_path in sorted(train_img_dir.iterdir()):
        if img_path.suffix.lower() not in SUPPORTED_IMG_EXTS:
            continue
        train_hashes.setdefault(average_hash(img_path, hash_size), img_path.name)

    leaked, clean = [], []
    for img_path in sorted(test_img_dir.iterdir()):
        if img_path.suffix.lower() not in SUPPORTED_IMG_EXTS:
            continue
        h = average_hash(img_path, hash_size)
        if h in train_hashes:
            leaked.append((img_path.name, train_hashes[h]))
        else:
            clean.append(img_path.name)

    total = len(leaked) + len(clean)

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

    # Ekspor subset bersih (images + labels) ke direktori terpisah
    clean_img_dir = clean_subset_dir / "images"
    clean_lbl_dir = clean_subset_dir / "labels"
    clean_img_dir.mkdir(parents=True, exist_ok=True)
    clean_lbl_dir.mkdir(parents=True, exist_ok=True)

    for name in clean:
        shutil.copy2(test_img_dir / name, clean_img_dir / name)
        lbl_name = Path(name).with_suffix(".txt").name
        src_lbl = test_lbl_dir / lbl_name
        if src_lbl.exists():
            shutil.copy2(src_lbl, clean_lbl_dir / lbl_name)

    # Tulis data.yaml varian yang menunjuk ke subset bersih (untuk evaluate_model.py).
    # "path" ditulis relatif (".") terhadap lokasi yaml, bukan absolute path, supaya
    # portable di komputer/OS lain (lihat computer_vision/data/data.yaml untuk konvensi yang sama).
    with open(yaml_path, "r", encoding="utf-8") as f:
        yaml_info = yaml.safe_load(f) or {}
    yaml_info["path"] = "."
    yaml_info["test"] = "test_clean/images"
    clean_yaml_path.parent.mkdir(parents=True, exist_ok=True)
    with open(clean_yaml_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(yaml_info, f, sort_keys=False)

    return DedupeResult(
        total=total,
        leaked=leaked,
        clean=clean,
        report_content=report_content,
        report_path=report_path,
        clean_dir=clean_subset_dir,
        clean_yaml_path=clean_yaml_path,
    )
