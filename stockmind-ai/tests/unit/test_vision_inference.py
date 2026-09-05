"""
StockMind AI - Phase 1: Foundation & Vision System
Unit Test: test_vision_inference.py
Deskripsi: Pengujian otomatis fungsionalitas script inferensi Vision Inventory Agent
            (scripts/inference.py) untuk memastikan kepatuhan kontrak AWS Lambda.
"""

import io
import os
import sys
import time
import json
import base64
import unittest
from pathlib import Path
from PIL import Image  # type: ignore

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Import modul inferensi
from scripts.inference import BoxDetector, lambda_handler


class TestVisionInference(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.project_root = Path(__file__).resolve().parent.parent.parent
        cls.model_path = cls.project_root / "models" / "weights" / "best.pt"
        cls.test_image_path = cls.project_root / "data" / "test_images" / "warehouse_box_test_0001.jpg"

        if not cls.model_path.exists():
            raise unittest.SkipTest("Model best.pt belum tersedia.")

        cls.detector = BoxDetector(model_path=str(cls.model_path), conf_threshold=0.25)

        # Buat dummy citra kosong (hitam pekat) untuk uji deteksi 0 box
        cls.empty_img_bytes = io.BytesIO()
        Image.new("RGB", (640, 640), (0, 0, 0)).save(cls.empty_img_bytes, format="JPEG")
        cls.empty_img_bytes = cls.empty_img_bytes.getvalue()

    def test_01_output_schema_contract(self):
        """Memvalidasi struktur skema JSON sesuai kontrak serah terima Backend Lead"""
        result = self.detector.detect(str(self.test_image_path))

        self.assertIn("boxes", result, "Key 'boxes' harus ada di response JSON")
        self.assertIn("count", result, "Key 'count' harus ada di response JSON")
        self.assertIn("confidence_avg", result, "Key 'confidence_avg' harus ada di response JSON")

        self.assertIsInstance(result["boxes"], list)
        self.assertIsInstance(result["count"], int)
        self.assertIsInstance(result["confidence_avg"], float)
        self.assertEqual(result["count"], len(result["boxes"]))

    def test_02_bounding_box_normalization(self):
        """Memastikan semua koordinat bounding box ter-normalisasi [0.0, 1.0]"""
        result = self.detector.detect(str(self.test_image_path))

        for idx, box in enumerate(result["boxes"]):
            for key in ["x", "y", "w", "h", "conf"]:
                self.assertIn(key, box, f"Key '{key}' harus ada di box #{idx}")

            x, y, w, h, conf = box["x"], box["y"], box["w"], box["h"], box["conf"]
            self.assertTrue(0.0 <= x <= 1.0, f"x ({x}) di luar range [0, 1]")
            self.assertTrue(0.0 <= y <= 1.0, f"y ({y}) di luar range [0, 1]")
            self.assertTrue(0.0 < w <= 1.0, f"w ({w}) di luar range (0, 1]")
            self.assertTrue(0.0 < h <= 1.0, f"h ({h}) di luar range (0, 1]")
            self.assertTrue(0.0 <= conf <= 1.0, f"conf ({conf}) di luar range [0, 1]")

    def test_03_empty_detection_scenario(self):
        """Memastikan jika tidak ada kardus terdeteksi, count=0 dan confidence_avg=0.0"""
        result = self.detector.detect(self.empty_img_bytes)

        self.assertEqual(result["count"], 0)
        self.assertEqual(len(result["boxes"]), 0)
        self.assertEqual(result["confidence_avg"], 0.0)

    def test_04_warm_inference_latency_benchmark(self):
        """Memvalidasi latensi warm-start inferensi memenuhi SLA AWS Lambda (< 500ms)"""
        # Warmup pass
        _ = self.detector.detect(str(self.test_image_path))

        # Benchmark 3 kali run berturut-turut
        latencies = []
        for _ in range(3):
            t0 = time.time()
            _ = self.detector.detect(str(self.test_image_path))
            t1 = time.time()
            latencies.append((t1 - t0) * 1000)

        avg_latency = sum(latencies) / len(latencies)
        print(f"\n[BENCHMARK] Average warm latency: {avg_latency:.2f} ms")

        # Target SLA: < 500 ms
        self.assertLess(avg_latency, 500.0, f"Latensi ({avg_latency:.2f}ms) melebihi batas 500ms")

    def test_05_lambda_handler_invocation(self):
        """Memvalidasi integrasi lambda_handler dengan simulasi payload API Gateway"""
        with open(self.test_image_path, "rb") as f:
            b64_str = base64.b64encode(f.read()).decode("utf-8")

        event = {
            "body": json.dumps({"image_base64": b64_str})
        }

        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)

        body = json.loads(response["body"])
        self.assertIn("boxes", body)
        self.assertIn("count", body)
        self.assertIn("confidence_avg", body)
        self.assertIn("latency_ms", body)

if __name__ == "__main__":
    unittest.main()
