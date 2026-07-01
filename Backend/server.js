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

// Seeding function to initialize database if empty
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Database empty. Seeding with initial products...");
      const products = require('./src/data/seedProducts.json');
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