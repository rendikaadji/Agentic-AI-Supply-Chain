"""
StockMind AI — Pilar 2: Vision Inventory Agent
Tech Stack: YOLOv8n (Edge) + AWS Lambda + Amazon DynamoDB
Deskripsi : Adapter orkestrasi untuk memicu pemindaian visual berkala (1 frame/jam) dan sinkronisasi ke DynamoDB.

Contract Specifications:
- Input  : Edge camera image frames (CAM-01 s/d CAM-03)
- Output : Physical count, normalized bounding boxes, average confidence
"""

__version__ = "1.0.0"
__pillar__ = "Pilar 2: Vision Inventory Agent"
