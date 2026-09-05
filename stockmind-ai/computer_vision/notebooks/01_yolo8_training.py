"""
StockMind AI - Phase 1: Foundation & Vision System
Script: 01_yolo8_training.py
Deskripsi: Script training YOLOv8n murni berbasis .py (pengganti .ipynb).
            Dapat dijalankan langsung di Google Colab maupun di environment lokal/server:
            Contoh: python notebooks/01_yolo8_training.py --epochs 50 --batch 8
"""

import sys
from pathlib import Path

# Pastikan root workspace ada di sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CV_ROOT = Path(__file__).resolve().parent.parent
for p in [str(PROJECT_ROOT), str(CV_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from computer_vision.scripts.train_yolov8 import run_training

if __name__ == "__main__":
    run_training()
