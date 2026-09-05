"""
StockMind AI - Phase 1: Foundation & Vision System
Script: scripts/train_yolov8.py
Deskripsi: Backward-compatibility proxy yang mengarahkan eksekusi dan impor ke
            submodul resmi di computer_vision.scripts.train_yolov8.
"""

import sys
from pathlib import Path

# Pastikan root workspace dan computer_vision terdaftar di sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CV_ROOT = PROJECT_ROOT / "computer_vision"
for p in [str(PROJECT_ROOT), str(CV_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from computer_vision.scripts.train_yolov8 import (
    parse_args,
    check_dependencies,
    run_training,
)

__all__ = ["parse_args", "check_dependencies", "run_training"]

if __name__ == "__main__":
    run_training()
