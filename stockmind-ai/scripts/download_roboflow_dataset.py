"""
StockMind AI - Shortcut script untuk mengunduh dataset Roboflow
"""
import sys
from pathlib import Path

# Arahkan ke script di computer_vision/scripts
SCRIPT_PATH = Path(__file__).resolve().parent.parent / "computer_vision" / "scripts" / "download_roboflow_dataset.py"

if __name__ == "__main__":
    import runpy
    runpy.run_path(str(SCRIPT_PATH), run_name="__main__")
