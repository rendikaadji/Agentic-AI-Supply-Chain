"""
StockMind AI — Pilar 1: Demand Sensing Agent
Tech Stack: Amazon Bedrock (Claude 3.5 Sonnet) + Amazon SageMaker
Deskripsi : Menganalisis time-series penjualan SAP MM, sinyal pasar, dan seasonality untuk memproyeksikan kebutuhan 14 hari ke depan.

Contract Specifications:
- Input  : Historical sales time-series (SAP MM / CSV)
- Output : Demand forecast projection, stockout probability, alert spike
"""

__version__ = "1.0.0"
__pillar__ = "Pilar 1: Demand Sensing Agent"
