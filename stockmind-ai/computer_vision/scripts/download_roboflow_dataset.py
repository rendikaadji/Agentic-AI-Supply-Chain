"""
StockMind AI - Phase 1: Vision Inventory Agent
Script: download_roboflow_dataset.py
Deskripsi: Mengunduh dataset Cardboard Box Detection asli dari Roboflow Universe
            menggunakan Roboflow Python SDK dan menyimpan ke direktori data/.
"""

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Cari dan muat file .env dari root proyek atau folder stockmind-ai
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CV_DIR = Path(__file__).resolve().parent.parent

for env_candidate in [ROOT_DIR / ".env", CV_DIR / ".env", Path.cwd() / ".env"]:
    if env_candidate.exists():
        load_dotenv(env_candidate)
        break
else:
    load_dotenv()  # Fallback default

def parse_args():
    parser = argparse.ArgumentParser(description="Download Roboflow Cardboard Box Detection Dataset")
    parser.add_argument(
        "--api-key",
        type=str,
        default=os.getenv("ROBOFLOW_API_KEY", ""),
        help="Roboflow API Key (default dari ROBOFLOW_API_KEY di .env)"
    )
    parser.add_argument(
        "--workspace",
        type=str,
        default=os.getenv("ROBOFLOW_WORKSPACE", "instance-segmentation-zza7a"),
        help="Roboflow workspace slug"
    )
    parser.add_argument(
        "--project",
        type=str,
        default=os.getenv("ROBOFLOW_PROJECT", "cardboard-box-detection-rjrm9"),
        help="Roboflow project slug"
    )
    parser.add_argument(
        "--version",
        type=int,
        default=int(os.getenv("ROBOFLOW_VERSION", "1")),
        help="Nomor versi dataset Roboflow (default: 1)"
    )
    parser.add_argument(
        "--format",
        type=str,
        default="yolov8",
        help="Format ekspor (default: yolov8)"
    )
    parser.add_argument(
        "--location",
        type=str,
        default=str(CV_DIR / "data"),
        help="Direktori penyimpanan dataset"
    )
    return parser.parse_args()

def main():
    args = parse_args()

    api_key = args.api_key.strip()
    if not api_key:
        print("[!] ERROR: ROBOFLOW_API_KEY tidak ditemukan!")
        print("    Silakan buat file .env dan tambahkan:")
        print("    ROBOFLOW_API_KEY=your_roboflow_api_key_here")
        print("    Atau jalankan dengan argumen: --api-key <YOUR_KEY>")
        sys.exit(1)

    print(f"[*] Menghubungkan ke Roboflow Universe...")
    print(f"    - Workspace : {args.workspace}")
    print(f"    - Project   : {args.project}")
    print(f"    - Version   : {args.version}")
    print(f"    - Format    : {args.format}")
    print(f"    - Target Dir: {args.location}")

    try:
        from roboflow import Roboflow
    except ImportError:
        print("[!] ERROR: Package 'roboflow' belum terinstal. Jalankan: pip install roboflow")
        sys.exit(1)

    try:
        rf = Roboflow(api_key=api_key)
        workspace = rf.workspace(args.workspace)
        project = workspace.project(args.project)
        version = project.version(args.version)
        print(f"[+] Berhasil mengakses project. Memulai pengunduhan dataset...")
        
        target_path = Path(args.location)
        target_path.mkdir(parents=True, exist_ok=True)
        
        dataset = version.download(args.format, location=str(target_path), overwrite=True)
        print(f"\n[✓] SUKSES! Dataset berhasil diunduh ke: {dataset.location}")
        
        # Cek data.yaml hasil unduhan
        downloaded_yaml = Path(dataset.location) / "data.yaml"
        if downloaded_yaml.exists():
            print(f"[+] data.yaml ditemukan di: {downloaded_yaml}")
            with open(downloaded_yaml, "r", encoding="utf-8") as f:
                print("--- Isi data.yaml awal ---")
                print(f.read())
                print("--------------------------")
        else:
            print("[!] Peringatan: data.yaml tidak ditemukan di root hasil unduhan.")

    except Exception as e:
        print(f"[!] GAGAL mengunduh dataset dari Roboflow: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
