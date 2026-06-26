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
          productName: "MacBook Pro 16\"",
          name: "MacBook Pro 16\"",
          price: 249900,
          description: "M3 Max chip with 14-core CPU and 30-core GPU, 36GB Unified Memory.",
          category: "Laptops",
          brand: "Apple",
          stock: 5,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
          tags: ["macbook", "pro", "apple", "laptop"],
          popularity: 99
        },
        {
          productName: "ROG Zephyrus G14",
          name: "ROG Zephyrus G14",
          price: 145000,
          description: "Ultra-slim premium gaming laptop with RTX 4060 and OLED display.",
          category: "Laptops",
          brand: "ASUS",
          stock: 12,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
          tags: ["gaming", "rog", "asus", "laptop"],
          popularity: 92
        },
        {
          productName: "ThinkPad X1 Carbon",
          name: "ThinkPad X1 Carbon",
          price: 135000,
          description: "Gen 11 ultra-light business laptop with Intel Core i7.",
          category: "Laptops",
          brand: "Lenovo",
          stock: 8,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80",
          tags: ["business", "thinkpad", "lenovo", "laptop"],
          popularity: 88
        },
        {
          productName: "MX Master 3S",
          name: "MX Master 3S",
          price: 8500,
          description: "Advanced ergonomic wireless mouse with MagSpeed scrolling.",
          category: "Accessories",
          brand: "Logitech",
          stock: 35,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
          tags: ["mouse", "wireless", "logitech", "accessory"],
          popularity: 96
        },
        {
          productName: "Keychron Q1 Pro",
          name: "Keychron Q1 Pro",
          price: 14000,
          description: "QMK/VIA fully customizable wireless mechanical keyboard.",
          category: "Accessories",
          brand: "Keychron",
          stock: 15,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80",
          tags: ["keyboard", "mechanical", "custom", "accessory"],
          popularity: 91
        },
        {
          productName: "Anker 737 Power Bank",
          name: "Anker 737 Power Bank",
          price: 12500,
          description: "24,000mAh 140W fast-charging power bank for laptops.",
          category: "Accessories",
          brand: "Anker",
          stock: 25,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
          tags: ["powerbank", "charger", "anker", "accessory"],
          popularity: 85
        },
        {
          productName: "WH-1000XM5",
          name: "WH-1000XM5",
          price: 29990,
          description: "Industry leading noise-canceling wireless headphones.",
          category: "Audio",
          brand: "Sony",
          stock: 18,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
          tags: ["headphones", "audio", "sony", "noise-canceling"],
          popularity: 98
        },
        {
          productName: "AirPods Pro (2nd Gen)",
          name: "AirPods Pro (2nd Gen)",
          price: 24900,
          description: "Premium wireless earbuds with active noise cancellation.",
          category: "Audio",
          brand: "Apple",
          stock: 40,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&q=80",
          tags: ["earbuds", "audio", "apple", "wireless"],
          popularity: 97
        },
        {
          productName: "Sonos Roam",
          name: "Sonos Roam",
          price: 19999,
          description: "Smart portable Wi-Fi and Bluetooth speaker.",
          category: "Audio",
          brand: "Sonos",
          stock: 22,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1608223652643-b9cb4d2f09d6?w=600&q=80",
          tags: ["speaker", "audio", "sonos", "bluetooth"],
          popularity: 89
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