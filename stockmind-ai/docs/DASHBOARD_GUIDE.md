# StockMind AI: Enterprise Dashboard Guide & System Flow

Dokumentasi resmi alur kerja antarmuka sistem orkestrasi rantai pasok otonom **StockMind AI**.

Dokumentasi lengkap pengembangan dan panduan menjalankan aplikasi tersedia di:
- [Panduan Frontend & Demo Day](../frontend/README.md)

---

## 1. Alur Orkestrasi Rantai Pasok Otonom (Closed-Loop)

```
[1. Demand Sensing (Bedrock)] 
          │ (Deteksi lonjakan pesanan +24%)
          ▼
[2. Vision Inventory (YOLOv8 Edge)] 
          │ (Hitung fisik di rak gudang: 46 Boxes)
          ▼
[3. Stock Reconciliation (SAP MM)] 
          │ (Disparitas terdeteksi: 46 fisik vs 60 SAP -> Defisit -14 unit)
          │ (Hitung Dynamic Safety Stock & Reorder Point)
          ▼
[4. Disruption & Negotiation (Bedrock KB + SAP Ariba)] 
          │ (Otomasi RFQ ke 3 vendor rekanan, negosiasi harga, terbitkan PO #45009821)
          ▼
[5. Logistics Route (Amazon Location Service)] 
          │ (Rute dinamis armada, mitigasi kemacetan jalan tol, hemat demurrage)
          ▼
[6. Inbound Execution (AWS IoT + SAP BAPI)] 
          │ (Scan e-PoD barcode di dock -> Eksekusi Goods Receipt GR 101 instan)
          ▼
[Siklus Menutup: Saldo SAP MM Otomatis Bertambah Menjadi 96 Unit]
```

---

## 2. Cara Cepat Menjalankan Dashboard
```bash
cd frontend
npm install
npm run dev
```
Buka browser: `http://127.0.0.1:5173/`
