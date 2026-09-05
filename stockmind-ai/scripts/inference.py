"""
StockMind AI - Phase 1: Foundation & Vision System
Script: inference.py
Deskripsi: Script inferensi deteksi kotak kardus (cardboard box) ultra-ringan
            untuk integrasi AWS Lambda oleh Backend Lead.

Spesifikasi:
- Bebas dependensi berat (tidak ada import training seperti matplotlib, pandas, roboflow).
- Input: image bytes, numpy array, atau path file citra.
- Output JSON terstandarisasi:
  {
    "boxes": [{"x": 0.5, "y": 0.6, "w": 0.2, "h": 0.3, "conf": 0.92}],
    "count": 3,
    "confidence_avg": 0.89
  }
- Target latensi < 500ms per citra.
"""

import io
import os
import sys
import json
import time
import base64
import argparse
from pathlib import Path
from typing import Union, Dict, Any, List

# Konfigurasi path default model (prioritas: ENV VAR -> /tmp/best.pt Lambda -> local path)
DEFAULT_LOCAL_MODEL = str(Path(__file__).resolve().parent.parent / "models" / "weights" / "best.pt")
DEFAULT_MODEL_PATH = os.environ.get("MODEL_PATH", "/tmp/best.pt" if os.path.exists("/tmp/best.pt") else DEFAULT_LOCAL_MODEL)

# Global model cache untuk Lambda Warm Start
_GLOBAL_MODEL = None

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

def lambda_handler(event: Dict[str, Any], context: Any = None) -> Dict[str, Any]:
    """
    AWS Lambda Handler entry point untuk integrasi Backend Lead.
    Menerima base64 encoded image dari API Gateway atau event S3.
    """
    start_time = time.time()
    try:
        # 1. Ekstraksi payload gambar
        body = event.get("body", event)
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:
                pass

        image_bytes = None
        if isinstance(body, dict):
            if "image_base64" in body:
                image_bytes = base64.b64decode(body["image_base64"])
            elif "image" in body:
                image_bytes = base64.b64decode(body["image"])
        elif isinstance(body, bytes):
            image_bytes = body

        if not image_bytes:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Payload gambar tidak ditemukan. Kirimkan JSON {'image_base64': '...'}"})
            }

        # 2. Eksekusi deteksi
        detector = BoxDetector()
        result = detector.detect(image_bytes)

        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        result["latency_ms"] = elapsed_ms

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
    args = parser.parse_args()

    img_path = Path(args.image)
    if not img_path.exists():
        print(json.dumps({"error": f"File gambar tidak ditemukan: {img_path}"}))
        sys.exit(1)

    t0 = time.time()
    detector = BoxDetector(model_path=args.model, conf_threshold=args.conf)
    result = detector.detect(img_path)
    t_elapsed = (time.time() - t0) * 1000

    # Output JSON standar sesuai spesifikasi kontrak
    output_json = json.dumps(result, indent=2)
    print(output_json)

    # Info latensi untuk verifikasi target < 500ms
    sys.stderr.write(f"\n[INFO] Inference latency: {t_elapsed:.2f} ms (Target Lambda: < 500 ms)\n")

if __name__ == "__main__":
    main()
