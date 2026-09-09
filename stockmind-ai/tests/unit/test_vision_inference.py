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
from computer_vision.scripts.inference import BoxDetector, lambda_handler


class TestVisionInference(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.project_root = Path(__file__).resolve().parent.parent.parent
        cls.model_path = cls.project_root / "computer_vision" / "models" / "best.pt"
        if not cls.model_path.exists():
            cls.model_path = cls.project_root / "models" / "weights" / "best.pt"

        # Cari citra uji dari test split dataset asli atau backup sintetis
        test_dir = cls.project_root / "computer_vision" / "data" / "test" / "images"
        if not test_dir.exists() or not any(test_dir.glob("*.jpg")):
            test_dir = cls.project_root / "computer_vision" / "data" / "_synthetic_backup" / "test_images"
        
        available_tests = list(test_dir.glob("*.jpg")) if test_dir.exists() else []
        if available_tests:
            cls.test_image_path = available_tests[0]
        else:
            cls.test_image_path = cls.project_root / "computer_vision" / "data" / "test_images" / "warehouse_box_test_0001.jpg"

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
        self.assertIn("detection", body)
        self.assertIn("inventory_status", body)
        self.assertIn("metadata", body)
        self.assertIn("summary_for_agent", body)
        self.assertIn("boxes", body["detection"])
        self.assertIn("count", body["detection"])
        self.assertIn("confidence_avg", body["detection"])


class TestVisionAgentContract(unittest.TestCase):
    """Kontrak output siap-konsumsi-agent (Bagian B): inventory_status, metadata, summary_for_agent."""

    @classmethod
    def setUpClass(cls):
        cls.project_root = Path(__file__).resolve().parent.parent.parent
        cls.model_path = cls.project_root / "computer_vision" / "models" / "best.pt"
        if not cls.model_path.exists():
            raise unittest.SkipTest("Model best.pt belum tersedia.")

        cls.detector = BoxDetector(model_path=str(cls.model_path), conf_threshold=0.25)

        test_dir = cls.project_root / "computer_vision" / "data" / "test" / "images"
        available_tests = list(test_dir.glob("*.jpg")) if test_dir.exists() else []
        cls.test_image_path = available_tests[0] if available_tests else None

        cls.empty_img_bytes = io.BytesIO()
        Image.new("RGB", (640, 640), (0, 0, 0)).save(cls.empty_img_bytes, format="JPEG")
        cls.empty_img_bytes = cls.empty_img_bytes.getvalue()

    def setUp(self):
        # Bersihkan env var threshold sebelum tiap test agar tidak saling memengaruhi
        for key in ("LOW_STOCK_THRESHOLD", "CRITICAL_STOCK_THRESHOLD"):
            os.environ.pop(key, None)

    def test_01_schema_has_all_top_level_sections(self):
        result = self.detector.detect_for_agent(str(self.test_image_path))
        for key in ("detection", "inventory_status", "metadata", "summary_for_agent"):
            self.assertIn(key, result, f"Key '{key}' harus ada di kontrak output agent")

    def test_02_inventory_status_consistent_with_detected_count_default_thresholds(self):
        """status harus konsisten dengan detected_count vs threshold default (LOW=10, CRITICAL=3)."""
        result = self.detector.detect_for_agent(str(self.test_image_path))
        count = result["detection"]["count"]
        status = result["inventory_status"]["status"]

        self.assertEqual(result["inventory_status"]["detected_count"], count)
        if count < 3:
            self.assertEqual(status, "CRITICAL")
        elif count < 10:
            self.assertEqual(status, "LOW")
        else:
            self.assertEqual(status, "NORMAL")

    def test_03_inventory_status_respects_configured_thresholds(self):
        """Threshold harus dibaca dari environment variable, bukan hardcode."""
        os.environ["LOW_STOCK_THRESHOLD"] = "1000"
        os.environ["CRITICAL_STOCK_THRESHOLD"] = "500"
        try:
            result = self.detector.detect_for_agent(str(self.test_image_path))
        finally:
            os.environ.pop("LOW_STOCK_THRESHOLD", None)
            os.environ.pop("CRITICAL_STOCK_THRESHOLD", None)

        # Dengan threshold dinaikkan jauh di atas jumlah deteksi wajar, status harus CRITICAL
        self.assertEqual(result["inventory_status"]["status"], "CRITICAL")
        self.assertIn("500", result["inventory_status"]["status_reason"])

    def test_04_summary_for_agent_always_nonempty_string(self):
        result = self.detector.detect_for_agent(str(self.test_image_path))
        self.assertIsInstance(result["summary_for_agent"], str)
        self.assertGreater(len(result["summary_for_agent"]), 0)

    def test_05_schema_valid_for_zero_detections(self):
        """Skema tetap valid & summary tetap ada untuk kasus count=0 (tidak ada deteksi)."""
        result = self.detector.detect_for_agent(self.empty_img_bytes)

        self.assertEqual(result["detection"]["count"], 0)
        self.assertEqual(result["inventory_status"]["detected_count"], 0)
        self.assertEqual(result["inventory_status"]["status"], "CRITICAL")
        self.assertIsInstance(result["summary_for_agent"], str)
        self.assertGreater(len(result["summary_for_agent"]), 0)

    def test_06_metadata_fields_present_and_typed(self):
        result = self.detector.detect_for_agent(str(self.test_image_path), camera_id="cam-01")
        metadata = result["metadata"]

        self.assertEqual(metadata["camera_id"], "cam-01")
        self.assertIsInstance(metadata["timestamp_utc"], str)
        self.assertTrue(metadata["timestamp_utc"].endswith("Z"))
        self.assertIsInstance(metadata["model_version"], str)
        self.assertIsInstance(metadata["inference_time_ms"], float)
        self.assertGreaterEqual(metadata["inference_time_ms"], 0.0)

    def test_07_camera_id_defaults_to_none(self):
        result = self.detector.detect_for_agent(str(self.test_image_path))
        self.assertIsNone(result["metadata"]["camera_id"])


if __name__ == "__main__":
    unittest.main()
