// Override mongoose cache with our custom mock
const mockMongoose = require('./src/utils/mockMongoose.js');
require.cache[require.resolve('mongoose')] = {
  id: require.resolve('mongoose'),
  exports: mockMongoose,
  loaded: true
};

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const Product = require("./src/models/Product");

dotenv.config();

// Seeding function for the 16 IT products
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Seeding database with 16 IT products...");
      const products = [
        {
          productName: "Laptop",
          name: "Laptop",
          price: 55000,
          description: "High-performance laptop with 16GB RAM and 512GB SSD.",
          category: "Laptops",
          brand: "Dell",
          stock: 10,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
          tags: ["pc", "computer", "work", "electronics"],
          popularity: 90
        },
        {
          productName: "Wireless Mouse",
          name: "Wireless Mouse",
          price: 1200,
          description: "Ergonomic wireless mouse with silent clicks.",
          category: "Accessories",
          brand: "Logitech",
          stock: 50,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
          tags: ["mouse", "accessory", "electronics", "laptop"],
          popularity: 95
        },
        {
          productName: "Mechanical Keyboard",
          name: "Mechanical Keyboard",
          price: 3500,
          description: "Tactile mechanical keyboard with RGB backlighting.",
          category: "Accessories",
          brand: "Keychron",
          stock: 25,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
          tags: ["keyboard", "accessory", "electronics", "laptop"],
          popularity: 85
        },
        {
          productName: "Laptop Bag",
          name: "Laptop Bag",
          price: 1800,
          description: "Slim water-resistant laptop backpack with USB port.",
          category: "Accessories",
          brand: "Lenovo",
          stock: 30,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
          tags: ["bag", "accessory", "travel", "laptop"],
          popularity: 75
        },
        {
          productName: "Monitor",
          name: "Monitor",
          price: 14500,
          description: "27-inch IPS borderless monitor with 144Hz refresh rate.",
          category: "Laptops",
          brand: "LG",
          stock: 15,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
          tags: ["display", "screen", "computer", "electronics"],
          popularity: 80
        },
        {
          productName: "Headphones",
          name: "Headphones",
          price: 4500,
          description: "Active noise-cancelling Bluetooth headphones.",
          category: "Audio",
          brand: "Sony",
          stock: 20,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
          tags: ["audio", "headphones", "music", "electronics"],
          popularity: 88
        },
        {
          productName: "Webcam",
          name: "Webcam",
          price: 2200,
          description: "Full HD 1080p webcam with dual microphone.",
          category: "Accessories",
          brand: "Logitech",
          stock: 15,
          rating: 4.3,
          image: "https://images.unsplash.com/photo-1603539958975-d144342410a5?w=600&q=80",
          tags: ["camera", "video", "accessory", "laptop"],
          popularity: 65
        },
        {
          productName: "USB Hub",
          name: "USB Hub",
          price: 900,
          description: "4-in-1 USB-C hub with HDMI and USB 3.0 ports.",
          category: "Accessories",
          brand: "Anker",
          stock: 100,
          rating: 4.2,
          image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
          tags: ["usb", "hub", "accessory", "laptop"],
          popularity: 70
        },
        {
          productName: "SSD 512GB",
          name: "SSD 512GB",
          price: 4500,
          description: "Superfast NVMe M.2 internal solid state drive.",
          category: "Laptops",
          brand: "Samsung",
          stock: 40,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1597872200969-2b65dff6b304?w=600&q=80",
          tags: ["storage", "ssd", "computer", "electronics"],
          popularity: 82
        },
        {
          productName: "Bluetooth Speaker",
          name: "Bluetooth Speaker",
          price: 2800,
          description: "IPX7 waterproof portable bluetooth speaker.",
          category: "Audio",
          brand: "JBL",
          stock: 35,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80",
          tags: ["audio", "speaker", "music", "wireless"],
          popularity: 92
        },
        {
          productName: "Laptop Charger",
          name: "Laptop Charger",
          price: 1500,
          description: "Universal 65W USB-C laptop charger power adapter.",
          category: "Accessories",
          brand: "Lenovo",
          stock: 20,
          rating: 4.1,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
          tags: ["charger", "power", "accessory", "laptop"],
          popularity: 60
        },
        {
          productName: "Gaming Mouse Pad",
          name: "Gaming Mouse Pad",
          price: 600,
          description: "Extended gaming mouse pad with anti-fray stitched edges.",
          category: "Accessories",
          brand: "Razer",
          stock: 50,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
          tags: ["mousepad", "accessory", "gaming", "laptop"],
          popularity: 78
        },
        {
          productName: "External Hard Drive 1TB",
          name: "External Hard Drive 1TB",
          price: 4200,
          description: "Durable external hard drive with USB 3.0 support.",
          category: "Laptops",
          brand: "WD",
          stock: 25,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80",
          tags: ["storage", "hdd", "computer", "backup"],
          popularity: 74
        },
        {
          productName: "Gaming Mouse",
          name: "Gaming Mouse",
          price: 2500,
          description: "High-precision RGB gaming mouse with programmable buttons.",
          category: "Accessories",
          brand: "Razer",
          stock: 30,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
          tags: ["mouse", "accessory", "gaming", "laptop"],
          popularity: 89
        },
        {
          productName: "Webcam Pro",
          name: "Webcam Pro",
          price: 5500,
          description: "Ultra HD 4K webcam with HDR and auto-focus.",
          category: "Accessories",
          brand: "Logitech",
          stock: 10,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1603539958975-d144342410a5?w=600&q=80",
          tags: ["camera", "video", "accessory", "pro"],
          popularity: 62
        },
        {
          productName: "WiFi Router",
          name: "WiFi Router",
          price: 3200,
          description: "Dual-band gigabit smart WiFi router.",
          category: "Laptops",
          brand: "TP-Link",
          stock: 20,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
          tags: ["wifi", "router", "network", "electronics"],
          popularity: 76
        }
      ];
      await Product.insertMany(products);
      console.log("Database seeded successfully.");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};

const runBackend = async () => {
  await connectDB();
  await seedDatabase();
};

runBackend();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes")); 
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Smart Cart Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});