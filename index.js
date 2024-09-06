const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Data JSON
const data = {
  "best-products": [
    {
      id: "1",
      kode: "K-01",
      nama: "Lenovo LOQ",
      harga: 16000,
      is_ready: true,
      gambar: "sate-ayam.jpg",
    },
    {
      id: "2",
      kode: "K-02",
      nama: "Lenovo Legion",
      harga: 14000,
      is_ready: true,
      gambar: "nasi-goreng-telor.jpg",
    },
    {
      id: "3",
      kode: "K-03",
      nama: "Macbook Air 2022",
      harga: 12000,
      is_ready: true,
      gambar: "nasi-rames.jpg",
    },
  ],
  products: [
    {
      id: "1",
      kode: "K-01",
      nama: "Lenovo LOQ",
      harga: 16000,
      is_ready: true,
      gambar: "sate-ayam.jpg",
    },
    {
      id: "2",
      kode: "K-02",
      nama: "Lenovo Legion",
      harga: 14000,
      is_ready: true,
      gambar: "nasi-goreng-telor.jpg",
    },
    {
      id: "3",
      kode: "K-03",
      nama: "Macbook Air 2022",
      harga: 12000,
      is_ready: true,
      gambar: "nasi-rames.jpg",
    },
    {
      id: "4",
      kode: "K-04",
      nama: "Macbook Pro M3",
      harga: 14000,
      is_ready: true,
      gambar: "nasi-rames.jpg",
    },
    {
      id: "5",
      kode: "K-05",
      nama: "Acer Nitro V15",
      harga: 13000,
      is_ready: true,
      gambar: "mie-goreng.jpg",
    },
    {
      id: "6",
      kode: "Advan Work Plus",
      nama: "Bakso",
      harga: 10000,
      is_ready: true,
      gambar: "bakso.jpg",
    },
    {
      id: "7",
      kode: "K-07",
      nama: "Asus ROG STRIX",
      harga: 5000,
      is_ready: true,
      gambar: "pangsit.jpg",
    },
    {
      id: "8",
      kode: "K-08",
      nama: "Dell Inspiron",
      harga: 5000,
      is_ready: true,
      gambar: "kentang-goreng.jpg",
    },
    {
      id: "9",
      kode: "K-09",
      nama: "HP Pavilion",
      harga: 18000,
      is_ready: true,
      gambar: "lontong-opor-ayam.jpg",
    },
  ],
  keranjangs: [
    {
      id: "c3be",
      jumlah_pesanan: 12,
      keterangan_tambahan: "aww",
      products: {
        id: "2",
        kode: "K-02",
        nama: "Lenovo Legion",
        harga: 14000,
        is_ready: true,
        gambar: "nasi-goreng-telor.jpg",
      },
    },
  ],
  pesanans: [],
};

// Endpoints
app.get("/api/best-products", (req, res) => {
  res.json(data["best-products"]);
});

app.get("/api/products", (req, res) => {
  res.json(data["products"]);
});

app.get("/api/keranjangs", (req, res) => {
  res.json(data["keranjangs"]);
});

app.get("/api/pesanans", (req, res) => {
  res.json(data["pesanans"]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
