"""
StockMind AI — Central MAS Orchestrator
Tech Stack: AWS Step Functions + Amazon EventBridge
Deskripsi : State machine orkestrasi closed-loop yang mengelola transisi status antar ke-6 agen otonom rantai pasok.

Contract Specifications:
- Input  : Hourly cron event / critical stockout threshold trigger
- Output : End-to-end execution lifecycle state & audit logs
"""

__version__ = "1.0.0"
__pillar__ = "Central MAS Orchestrator"
