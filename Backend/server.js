const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./src/config/db");
const { errorHandler } = require("./src/middleware/errorHandler");

dotenv.config();

const runBackend = async () => {
  await connectDB();
};

runBackend();

const app = express();

// Security middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));
app.use("/api/brands", require("./src/routes/brandRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/reviews", require("./src/routes/reviewRoutes"));
app.use("/api/coupons", require("./src/routes/couponRoutes"));
app.use("/api/banners", require("./src/routes/bannerRoutes"));
app.use("/api/homepage", require("./src/routes/homepageSectionRoutes"));
app.use("/api/settings", require("./src/routes/settingRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes")); 
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));
app.use("/api/analytics", require("./src/routes/analyticsRoutes"));

app.get("/", (req, res) => {
  res.send("Smart Cart Backend Running 🚀");
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});