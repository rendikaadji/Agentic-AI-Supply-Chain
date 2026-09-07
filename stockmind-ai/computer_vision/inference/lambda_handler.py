"""
StockMind AI - Phase 1: Foundation & Vision System
Module: computer_vision/inference/lambda_handler.py
Deskripsi: AWS Lambda entrypoint adapter untuk Vision Inventory Agent (Agent #2).
"""

import os
import sys
from pathlib import Path

# Daftarkan root project dan computer_vision ke sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CV_ROOT = Path(__file__).resolve().parent.parent
for p in [str(PROJECT_ROOT), str(CV_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Default MODEL_PATH ke computer_vision/models/best.pt jika belum di-set di environment
DEFAULT_CV_MODEL = str(CV_ROOT / "models" / "best.pt")
if "MODEL_PATH" not in os.environ and os.path.exists(DEFAULT_CV_MODEL):
    os.environ["MODEL_PATH"] = DEFAULT_CV_MODEL

from computer_vision.scripts.inference import lambda_handler, BoxDetector, get_model

__all__ = ["lambda_handler", "BoxDetector", "get_model"]
