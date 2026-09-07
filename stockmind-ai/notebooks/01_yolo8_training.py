"""
StockMind AI - Phase 1: Foundation & Vision System
Script: 01_yolo8_training.py
Deskripsi: Script training YOLOv8n murni berbasis .py (pengganti .ipynb).
            Mendukung eksekusi langsung dari root workspace maupun Colab:
            Contoh: python notebooks/01_yolo8_training.py --epochs 50 --batch 8
"""

import sys
from pathlib import Path

# Pastikan root workspace dan folder computer_vision terdaftar di sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CV_ROOT = PROJECT_ROOT / "computer_vision"
for p in [str(PROJECT_ROOT), str(CV_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from computer_vision.scripts.train_yolov8 import run_training

if __name__ == "__main__":
    run_training()
