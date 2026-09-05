"""
StockMind AI - Phase 1: Foundation & Vision System
Script: seed_sample_dataset.py
Deskripsi: Menghasilkan dataset sampel sintetis citra kotak kardus (cardboard box)
            di rak gudang beserta anotasi label YOLOv8 (format normalisasi 0-1)
            untuk split train, val, dan test.
"""

import os
import random
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont  # type: ignore

def generate_warehouse_box_image(img_id: int, width: int = 640, height: int = 640):
    """
    Menghasilkan citra sintetis gudang dengan rak dan kotak kardus,
    serta mengembalikan list bounding box berformat YOLO: [class_id, x_c, y_c, w, h]
    """
    # Warna latar belakang gudang (dinding & lantai abu-abu beton)
    bg_colors = [
        (45, 50, 58),
        (55, 60, 68),
        (70, 75, 85),
        (38, 42, 48)
    ]
    bg = random.choice(bg_colors)
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    # Gambar lantai gudang
    floor_y = int(height * 0.75)
    floor_color = (60, 62, 65)
    draw.rectangle([0, floor_y, width, height], fill=floor_color)
    
    # Garis lantai perspektif / marka keselamatan gudang (kuning-hitam)
    for i in range(0, width, 80):
        draw.line([(i, floor_y), (i - 40, height)], fill=(180, 160, 40), width=3)

    # Gambar struktur rak gudang (warna biru/oranye khas racking industri)
    rack_color = random.choice([(25, 75, 140), (210, 85, 20), (50, 90, 120)])
    shelf_y1 = int(height * 0.38)
    shelf_y2 = int(height * 0.68)
    shelf_thickness = 16

    # Tiang vertikal rak
    draw.rectangle([30, 40, 50, floor_y], fill=rack_color)
    draw.rectangle([width - 50, 40, width - 30, floor_y], fill=rack_color)
    draw.rectangle([width // 2 - 10, 40, width // 2 + 10, floor_y], fill=rack_color)

    # Palang horizontal rak
    draw.rectangle([20, shelf_y1, width - 20, shelf_y1 + shelf_thickness], fill=rack_color)
    draw.rectangle([20, shelf_y2, width - 20, shelf_y2 + shelf_thickness], fill=rack_color)

    # Palet kayu pada rak bawah
    pallet_color = (150, 110, 70)
    draw.rectangle([55, shelf_y2 - 12, width - 55, shelf_y2], fill=pallet_color)

    boxes_yolo = []

    # Variasi warna kardus cokelat
    box_shades = [
        (193, 154, 107),  # Classic cardboard tan
        (180, 138, 90),   # Medium brown box
        (205, 168, 120),  # Light kraft cardboard
        (165, 122, 76),   # Darker shipping carton
        (215, 178, 130),  # Fresh cardboard
    ]

    tape_colors = [
        (170, 145, 95),   # Brown packing tape
        (230, 225, 200),  # Transparent/white tape
        (200, 190, 140),
    ]

    # Generate kotak pada rak 1 (tengah) dan rak 2 (bawah)
    shelves = [
        {"base_y": shelf_y1, "min_boxes": 1, "max_boxes": 3},
        {"base_y": shelf_y2 - 12, "min_boxes": 2, "max_boxes": 4}
    ]

    for shelf in shelves:
        base_y = shelf["base_y"]
        num_boxes = random.randint(shelf["min_boxes"], shelf["max_boxes"])
        
        # Hitung slot horizontal
        available_w = width - 140
        slot_w = available_w // max(1, num_boxes)

        for b in range(num_boxes):
            bw = random.randint(int(slot_w * 0.65), int(slot_w * 0.95))
            bh = random.randint(70, 130)

            # Posisi x
            slot_start = 70 + b * slot_w
            bx = random.randint(slot_start, max(slot_start, slot_start + slot_w - bw))
            by = base_y - bh

            # Pastikan berada di dalam canvas
            bx = max(10, min(width - bw - 10, bx))
            by = max(10, min(height - bh - 10, by))

            box_fill = random.choice(box_shades)
            border_fill = (max(0, box_fill[0] - 40), max(0, box_fill[1] - 40), max(0, box_fill[2] - 40))

            # Gambar badan kardus
            draw.rectangle([bx, by, bx + bw, by + bh], fill=box_fill, outline=border_fill, width=2)

            # Detail kardus: lipatan tengah & lakban
            tape_color = random.choice(tape_colors)
            tape_w = random.randint(12, 20)
            tape_x = bx + (bw // 2) - (tape_w // 2)
            draw.rectangle([tape_x, by, tape_x + tape_w, by + bh], fill=tape_color)

            # Garis lipatan atas kardus
            draw.line([(bx, by + 18), (bx + bw, by + 18)], fill=border_fill, width=1)

            # Label pengiriman / barcode putih di muka kardus
            label_w = random.randint(25, 45)
            label_h = random.randint(18, 30)
            lx = bx + random.randint(6, max(7, bw - label_w - 6))
            ly = by + random.randint(22, max(23, bh - label_h - 6))
            draw.rectangle([lx, ly, lx + label_w, ly + label_h], fill=(245, 245, 240), outline=(100, 100, 100))
            
            # Garis barcode mikro
            for bc in range(lx + 4, lx + label_w - 4, 3):
                draw.line([(bc, ly + 4), (bc, ly + label_h - 4)], fill=(40, 40, 40), width=1)

            # Hitung koordinat normalisasi YOLO (0 to 1)
            x_center = (bx + (bw / 2.0)) / width
            y_center = (by + (bh / 2.0)) / height
            norm_w = bw / width
            norm_h = bh / height

            # Validasi batasan [0, 1]
            x_center = max(0.0001, min(0.9999, x_center))
            y_center = max(0.0001, min(0.9999, y_center))
            norm_w = max(0.0001, min(0.9999, norm_w))
            norm_h = max(0.0001, min(0.9999, norm_h))

            # class_id = 0 (cardboard_box)
            boxes_yolo.append((0, x_center, y_center, norm_w, norm_h))

    # Tulis watermark kecil identifier sintetis
    draw.text((15, 15), f"StockMind AI CV - Cam Feed #{img_id:04d}", fill=(200, 200, 200))

    return img, boxes_yolo

def seed_dataset(base_dir: Path, counts: dict):
    """
    Men-generate dataset ke folder train_images, val_images, test_images
    dan label-nya di train_labels, val_labels, test_labels serta cadangan format YOLO standar.
    """
    total_images = 0
    total_boxes = 0

    print("=================================================================")
    print("StockMind AI - Seeding Synthetic Warehouse Cardboard Box Dataset")
    print("=================================================================")

    for split, count in counts.items():
        img_dir = base_dir / f"{split}_images"
        lbl_dir = base_dir / f"{split}_labels"
        
        # Cadangan kompatibilitas YOLOv8 default (data/images/split dan data/labels/split)
        yolo_img_dir = base_dir / "images" / split
        yolo_lbl_dir = base_dir / "labels" / split

        img_dir.mkdir(parents=True, exist_ok=True)
        lbl_dir.mkdir(parents=True, exist_ok=True)
        yolo_img_dir.mkdir(parents=True, exist_ok=True)
        yolo_lbl_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n[+] Memproses split '{split}': {count} citra...")

        split_boxes = 0
        for i in range(1, count + 1):
            file_stem = f"warehouse_box_{split}_{i:04d}"
            img, boxes = generate_warehouse_box_image(img_id=i, width=640, height=640)

            # Simpan file gambar JPG
            img_path = img_dir / f"{file_stem}.jpg"
            img.save(img_path, format="JPEG", quality=92)
            
            # Simpan duplikat ke kompatibilitas standard yolo structure
            yolo_img_path = yolo_img_dir / f"{file_stem}.jpg"
            img.save(yolo_img_path, format="JPEG", quality=92)

            # Simpan anotasi label YOLO .txt
            label_lines = [
                f"{cls_id} {xc:.6f} {yc:.6f} {w:.6f} {h:.6f}"
                for cls_id, xc, yc, w, h in boxes
            ]
            label_content = "\n".join(label_lines) + "\n"

            # 1. Simpan di split_labels/
            lbl_path = lbl_dir / f"{file_stem}.txt"
            with open(lbl_path, "w", encoding="utf-8") as f:
                f.write(label_content)

            # 2. Simpan di labels/split/ (standar Ultralytics)
            yolo_lbl_path = yolo_lbl_dir / f"{file_stem}.txt"
            with open(yolo_lbl_path, "w", encoding="utf-8") as f:
                f.write(label_content)

            # 3. Simpan cadangan di samping file image (fallback YOLOv8)
            with open(img_dir / f"{file_stem}.txt", "w", encoding="utf-8") as f:
                f.write(label_content)

            split_boxes += len(boxes)

        print(f"    -> Berhasil membuat {count} citra dan {split_boxes} bounding box kardus di split '{split}'.")
        total_images += count
        total_boxes += split_boxes

    print("\n-----------------------------------------------------------------")
    print(f"Total Citra Dibuat        : {total_images}")
    print(f"Total Kotak Kardus Anotasi: {total_boxes}")
    print(f"Rata-rata Kardus per Citra: {total_boxes / total_images:.2f}")
    print("Lokasi Dataset             :", base_dir.resolve())
    print("=================================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed sample dataset for StockMind AI CV")
    parser.add_argument("--data-dir", type=str, default="computer_vision/data", help="Root data directory")
    parser.add_argument("--train-count", type=int, default=30, help="Jumlah gambar train")
    parser.add_argument("--val-count", type=int, default=8, help="Jumlah gambar val")
    parser.add_argument("--test-count", type=int, default=8, help="Jumlah gambar test")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent.parent
    target_data_dir = project_root / args.data_dir

    counts = {
        "train": args.train_count,
        "val": args.val_count,
        "test": args.test_count
    }

    seed_dataset(target_data_dir, counts)
