"""
StockMind AI - Phase 1: Foundation & Vision System
Module: computer_vision/inference/lambda_handler.py
Deskripsi: AWS Lambda entrypoint adapter untuk Vision Inventory Agent (Agent #2).
"""

import sys
from pathlib import Path

# Daftarkan root project ke sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from scripts.inference import lambda_handler, BoxDetector, get_model

__all__ = ["lambda_handler", "BoxDetector", "get_model"]
