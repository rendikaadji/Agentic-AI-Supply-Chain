"""
StockMind AI - Computer Vision Inference Package
"""
from .lambda_handler import lambda_handler, BoxDetector, get_model

__all__ = ["lambda_handler", "BoxDetector", "get_model"]
