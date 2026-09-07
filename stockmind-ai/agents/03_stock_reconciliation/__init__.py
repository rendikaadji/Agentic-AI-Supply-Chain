"""
StockMind AI — Pilar 3: Stock Reconciliation Agent
Tech Stack: Bedrock Agent Core + SAP S/4HANA MM OData
Deskripsi : Membandingkan saldo fisik visual vs pembukuan SAP MM, menghitung Dynamic Safety Stock & Adaptive ROP.

Contract Specifications:
- Input  : DynamoDB physical count + SAP MM recorded stock
- Output : Discrepancy delta, phantom inventory alert, emergency RFQ trigger
"""

__version__ = "1.0.0"
__pillar__ = "Pilar 3: Stock Reconciliation Agent"
