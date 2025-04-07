const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://tech-ann.vercel.app",
    "https://be-vue-node.vercel.app",
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};

app.use(cors(corsOptions));

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

app.get("/api/best-products", (req, res) => {
  res.json(data["best-products"]);
});

app.get("/api/products", (req, res) => {
  res.json(data["products"]);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = data.products.find((p) => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.get("/api/keranjangs", (req, res) => {
  res.json(data["keranjangs"]);
});

app.post("/api/keranjangs", (req, res) => {
  const newKeranjang = req.body;
  newKeranjang.id = (Math.random() + 1).toString(36).substring(7);
  data.keranjangs.push(newKeranjang);
  res.status(201).json(newKeranjang);
});

app.delete("/api/keranjangs/:id", (req, res) => {
  const { id } = req.params;
  data.keranjangs = data.keranjangs.filter((keranjang) => keranjang.id !== id);
  res.status(204).end();
});

app.get("/api/pesanans", (req, res) => {
  res.json(data["pesanans"]);
});
app.post("/api/checkout", (req, res) => {
  if (data.keranjangs.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Keranjang kosong" });
  }

  const invoice = {
    id: `INV-${Date.now()}`,
    date: new Date().toISOString(),
    items: [...data.keranjangs],
    total: data.keranjangs.reduce(
      (acc, item) => acc + item.jumlah_pesanan * item.products.harga,
      0
    ),
  };

  data.pesanans.push(invoice);
  data.keranjangs = [];

  res.json({
    success: true,
    invoice,
    message: "Checkout berhasil",
  });
});

app.post("/api/download-struk", async (req, res) => {
  const { invoice } = req.body;

  if (!invoice) {
    return res
      .status(400)
      .json({ success: false, message: "Invoice tidak ditemukan" });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Mengirimkan HTML untuk dirender dengan Puppeteer
    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Struk Pembelian</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100 py-10">
        <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-xl font-bold">Toko Laptop AnnTech</h1>
            <p class="text-sm">Jl. Teknologi No. 123, Jakarta</p>
            <p class="text-sm">Telp: (021) 555-1234</p>
            <h2 class="text-lg font-bold text-green-600 mb-2">STRUK PEMBELIAN</h2>
            <p class="text-xs text-gray-600">Tanggal: ${new Date(
              invoice.date
            ).toLocaleDateString("id-ID")}</p>
          </div>

          <div class="mb-8">
            <div class="border-b mb-4"></div>
            <div class="text-xs">
              ${invoice.items
                .map(
                  (item) => `
                <div class="mb-2 flex justify-between">
                  <div>
                    <p class="font-medium">${item.products.nama}</p>
                    <p class="text-gray-600">${
                      item.jumlah_pesanan
                    } x Rp${item.products.harga.toLocaleString("id-ID")}</p>
                  </div>
                  <p>Rp${(
                    item.jumlah_pesanan * item.products.harga
                  ).toLocaleString("id-ID")}</p>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="mt-6 text-right border-t pt-4">
              <p class="text-sm font-bold">Total: Rp${invoice.total.toLocaleString(
                "id-ID"
              )}</p>
            </div>
          </div>

          <div class="text-center text-xs mt-8 text-gray-500">
            <p>Terima kasih telah berbelanja di AnnTech</p>
            <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(invoiceHtml, { waitUntil: "domcontentloaded" });
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();

    res.contentType("image/png");
    res.send(screenshotBuffer);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan saat mengambil screenshot",
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
