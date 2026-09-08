"""
StockMind AI - Phase 1: Foundation & Vision System
Script: inference.py
Deskripsi: Script inferensi deteksi kotak kardus (cardboard box) ultra-ringan
            untuk integrasi AWS Lambda oleh Backend Lead.

Spesifikasi:
- Bebas dependensi berat (tidak ada import training seperti matplotlib, pandas, roboflow).
- Input: image bytes, numpy array, atau path file citra.
- Output JSON deteksi mentah (BoxDetector.detect):
  {
    "boxes": [{"x": 0.5, "y": 0.6, "w": 0.2, "h": 0.3, "conf": 0.92}],
    "count": 3,
    "confidence_avg": 0.89
  }
- Output JSON siap-konsumsi-agent (BoxDetector.detect_for_agent, dipakai lambda_handler & CLI):
  lihat "Kontrak Output untuk Konsumsi Agent" di computer_vision/results/README_vision.md.
- Target latensi < 500ms per citra.
"""

import io
import os
import sys
import json
import time
import base64
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Union, Dict, Any, List, Optional

# Konfigurasi path default model (prioritas: ENV VAR -> /tmp/best.pt Lambda -> local path)
_MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
DEFAULT_LOCAL_MODEL = str(_MODELS_DIR / "best.pt" if (_MODELS_DIR / "best.pt").exists() else _MODELS_DIR / "weights" / "best.pt")
DEFAULT_MODEL_PATH = os.environ.get("MODEL_PATH", "/tmp/best.pt" if os.path.exists("/tmp/best.pt") else DEFAULT_LOCAL_MODEL)

# Global model cache untuk Lambda Warm Start
_GLOBAL_MODEL = None

def _get_stock_thresholds():
    """Ambang batas status inventaris, dibaca fresh tiap panggilan agar bisa dikonfigurasi
    tanpa ubah kode (env var), dan agar unit test bisa mengubahnya per-kasus."""
    low = int(os.environ.get("LOW_STOCK_THRESHOLD", "10"))
    critical = int(os.environ.get("CRITICAL_STOCK_THRESHOLD", "3"))
    return low, critical


def _compute_inventory_status(detected_count: int, low_threshold: int, critical_threshold: int):
    if detected_count < critical_threshold:
        return "CRITICAL", f"detected_count ({detected_count}) below configured CRITICAL threshold ({critical_threshold})"
    if detected_count < low_threshold:
        return "LOW", f"detected_count ({detected_count}) below configured LOW threshold ({low_threshold})"
    return "NORMAL", f"detected_count ({detected_count}) at or above configured LOW threshold ({low_threshold})"


def _build_summary_for_agent(count: int, confidence_avg: float, status: str, low_threshold: int, critical_threshold: int) -> str:
    if count == 0:
        return f"Tidak ada cardboard box yang terdeteksi pada frame ini. Status inventaris: {status}."

    conf_pct = round(confidence_avg * 100)
    if status == "NORMAL":
        status_note = f"NORMAL (di atas ambang batas {low_threshold} unit)"
    elif status == "LOW":
        status_note = f"LOW (di bawah ambang batas {low_threshold} unit)"
    else:
        status_note = f"CRITICAL (di bawah ambang batas kritis {critical_threshold} unit)"

    return (
        f"Terdeteksi {count} unit cardboard box pada frame ini dengan rata-rata keyakinan {conf_pct}%. "
        f"Status inventaris: {status_note}."
    )


def get_model(model_path: str = None):
    """
    Lazy-loading singleton model untuk performa optimal pada AWS Lambda warm start.
    """
    global _GLOBAL_MODEL
    if _GLOBAL_MODEL is None:
        from ultralytics import YOLO
        target_path = model_path or DEFAULT_MODEL_PATH
        if not os.path.exists(target_path):
            # Fallback jika model di /tmp belum ada, cari di models/weights lokal
            if os.path.exists(DEFAULT_LOCAL_MODEL):
                target_path = DEFAULT_LOCAL_MODEL
            else:
                raise FileNotFoundError(f"Model weight tidak ditemukan di {target_path} maupun {DEFAULT_LOCAL_MODEL}")
        _GLOBAL_MODEL = YOLO(target_path)
    return _GLOBAL_MODEL

class BoxDetector:
    def __init__(self, model_path: str = None, conf_threshold: float = 0.25):
        self.model = get_model(model_path)
        self.conf_threshold = conf_threshold

    def detect(self, image_input: Union[bytes, str, Path, Any]) -> Dict[str, Any]:
        """
        Fungsi inferensi utama.
        Menerima bytes citra, path file, atau PIL Image / numpy array,
        mengembalikan dictionary terstandarisasi.
        """
        from PIL import Image

        # Konversi bytes ke PIL Image
        if isinstance(image_input, bytes):
            image = Image.open(io.BytesIO(image_input)).convert("RGB")
        elif isinstance(image_input, (str, Path)):
            image = Image.open(str(image_input)).convert("RGB")
        else:
            image = image_input

        img_w, img_h = image.size

        # Jalankan inferensi YOLO
        results = self.model.predict(
            source=image,
            conf=self.conf_threshold,
            verbose=False
        )

        detected_boxes: List[Dict[str, float]] = []
        conf_sum = 0.0

        if results and len(results) > 0:
            result = results[0]
            boxes = result.boxes
            if boxes is not None and len(boxes) > 0:
                xyxy_list = boxes.xyxy.cpu().numpy()
                conf_list = boxes.conf.cpu().numpy()

                for xyxy, conf in zip(xyxy_list, conf_list):
                    x1, y1, x2, y2 = xyxy
                    # Hitung koordinat normalisasi YOLO (0.0 s/d 1.0)
                    w = (x2 - x1) / img_w
                    h = (y2 - y1) / img_h
                    x_c = (x1 + x2) / (2.0 * img_w)
                    y_c = (y1 + y2) / (2.0 * img_h)

                    conf_float = float(conf)
                    conf_sum += conf_float

                    detected_boxes.append({
                        "x": round(float(x_c), 4),
                        "y": round(float(y_c), 4),
                        "w": round(float(w), 4),
                        "h": round(float(h), 4),
                        "conf": round(conf_float, 4)
                    })

        count = len(detected_boxes)
        confidence_avg = round(conf_sum / count, 4) if count > 0 else 0.0

        return {
            "boxes": detected_boxes,
            "count": count,
            "confidence_avg": confidence_avg
        }

    def detect_for_agent(self, image_input: Union[bytes, str, Path, Any], camera_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Deteksi + kontrak output siap-konsumsi-agent (Stock Reconciliation Agent / Bedrock Agent).
        Lihat "Kontrak Output untuk Konsumsi Agent" di computer_vision/results/README_vision.md.
        """
        t0 = time.time()
        detection = self.detect(image_input)
        inference_time_ms = round((time.time() - t0) * 1000, 2)

        low_threshold, critical_threshold = _get_stock_thresholds()
        status, status_reason = _compute_inventory_status(detection["count"], low_threshold, critical_threshold)
        summary = _build_summary_for_agent(
            detection["count"], detection["confidence_avg"], status, low_threshold, critical_threshold
        )

        return {
            "detection": detection,
            "inventory_status": {
                "sku": "CARDBOARD_BOX",
                "detected_count": detection["count"],
                "status": status,
                "status_reason": status_reason,
            },
            "metadata": {
                "camera_id": camera_id,
                "timestamp_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "model_version": os.environ.get("MODEL_VERSION", "yolov8s-v2-roboflow"),
                "inference_time_ms": inference_time_ms,
            },
            "summary_for_agent": summary,
        }

def lambda_handler(event: Dict[str, Any], context: Any = None) -> Dict[str, Any]:
    """
    AWS Lambda Handler entry point untuk integrasi Backend Lead.
    Menerima base64 encoded image dari API Gateway atau event S3.
    """
    try:
        # 1. Ekstraksi payload gambar
        body = event.get("body", event)
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:
                pass

        image_bytes = None
        camera_id = None
        if isinstance(body, dict):
            if "image_base64" in body:
                image_bytes = base64.b64decode(body["image_base64"])
            elif "image" in body:
                image_bytes = base64.b64decode(body["image"])
            camera_id = body.get("camera_id")
        elif isinstance(body, bytes):
            image_bytes = body

        if not image_bytes:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Payload gambar tidak ditemukan. Kirimkan JSON {'image_base64': '...'}"})
            }

        # 2. Eksekusi deteksi + pengayaan kontrak agent
        detector = BoxDetector()
        result = detector.detect_for_agent(image_bytes, camera_id=camera_id)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(result)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }

def main():
    parser = argparse.ArgumentParser(description="Inference CLI untuk Deteksi Kotak Kardus StockMind AI")
    parser.add_argument("--image", type=str, required=True, help="Path ke file citra input")
    parser.add_argument("--model", type=str, default=None, help="Path ke file best.pt")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold (default: 0.25)")
    parser.add_argument("--camera-id", type=str, default=None, help="Camera ID opsional untuk metadata")
    parser.add_argument("--raw", action="store_true", help="Cetak output deteksi mentah (tanpa pengayaan kontrak agent)")
    args = parser.parse_args()

    img_path = Path(args.image)
    if not img_path.exists():
        print(json.dumps({"error": f"File gambar tidak ditemukan: {img_path}"}))
        sys.exit(1)

    detector = BoxDetector(model_path=args.model, conf_threshold=args.conf)
    if args.raw:
        result = detector.detect(img_path)
    else:
        result = detector.detect_for_agent(img_path, camera_id=args.camera_id)

    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
