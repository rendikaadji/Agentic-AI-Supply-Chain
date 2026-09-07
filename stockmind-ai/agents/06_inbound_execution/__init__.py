"""
StockMind AI — Pilar 6: Inbound Execution Agent
Tech Stack: AWS IoT Core + SAP S/4HANA BAPI (BAPI_GOODSMVT_CREATE)
Deskripsi : Memverifikasi barcode e-PoD di dok penerimaan gudang dan mengeksekusi posting Goods Receipt (GR 101) otomatis.

Contract Specifications:
- Input  : Scanned e-PoD barcode + PO document verification
- Output : SAP Material Document (GR 101), final stock balance restoration
"""

__version__ = "1.0.0"
__pillar__ = "Pilar 6: Inbound Execution Agent"
