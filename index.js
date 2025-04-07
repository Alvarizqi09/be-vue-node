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

// Convert HTML to Image using Puppeteer
app.post("/api/generate-image", async (req, res) => {
  const { invoiceData } = req.body; // Invoice data should be passed from the frontend

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content for rendering
    const htmlContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            ${generateTailwindCSS()}
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <h1 class="text-3xl font-bold text-green-600 mb-2">Invoice #${
              invoiceData.id
            }</h1>
            <p>Terima kasih telah berbelanja!</p>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceData.items
                    .map(
                      (item) => `
                        <tr>
                          <td>${item.products.nama} (${
                        item.jumlah_pesanan
                      }x)</td>
                          <td>Rp${
                            item.jumlah_pesanan * item.products.harga
                          }</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div>Total: Rp${invoiceData.total}</div>
          </div>
        </body>
      </html>
    `;

    // Set the page content
    await page.setContent(htmlContent);

    // Screenshot and save the image
    const imageBuffer = await page.screenshot({ type: "png" }); // Can be 'jpeg' or 'png'

    // Send the image as a response
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);

    await browser.close();
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Failed to generate image." });
  }
});

// Helper function to include TailwindCSS (You can configure this according to your build)
const generateTailwindCSS = () => `
  body { font-family: Arial, sans-serif; padding: 20px; }
  .invoice-container { width: 100%; max-width: 600px; margin: auto; }
  h1 { text-align: center; color: #34D399; }
  table { width: 100%; margin-top: 20px; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
  tr:nth-child(even) { background-color: #f9f9f9; }
  .total { font-weight: bold; margin-top: 20px; text-align: right; }
`;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
