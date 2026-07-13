import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Mock product catalog (fallback when backend is unreachable) ────────────
const mockProducts = [
  {
    "productName": "Laptop",
    "name": "Laptop",
    "price": 55000,
    "description": "High-performance laptop with 16GB RAM and 512GB SSD.",
    "category": "Laptops",
    "brand": "Dell",
    "stock": 10,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
    "tags": [
      "pc",
      "computer",
      "work",
      "electronics"
    ],
    "popularity": 90,
    "_id": "mock-id-0"
  },
  {
    "productName": "Wireless Mouse",
    "name": "Wireless Mouse",
    "price": 1200,
    "description": "Ergonomic wireless mouse with silent clicks.",
    "category": "Accessories",
    "brand": "Logitech",
    "stock": 50,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
    "tags": [
      "mouse",
      "accessory",
      "electronics",
      "laptop"
    ],
    "popularity": 95,
    "_id": "mock-id-1"
  },
  {
    "productName": "Mechanical Keyboard",
    "name": "Mechanical Keyboard",
    "price": 3500,
    "description": "Tactile mechanical keyboard with RGB backlighting.",
    "category": "Accessories",
    "brand": "Keychron",
    "stock": 25,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    "tags": [
      "keyboard",
      "accessory",
      "electronics",
      "laptop"
    ],
    "popularity": 85,
    "_id": "mock-id-2"
  },
  {
    "productName": "Laptop Bag",
    "name": "Laptop Bag",
    "price": 1800,
    "description": "Slim water-resistant laptop backpack with USB port.",
    "category": "Accessories",
    "brand": "Lenovo",
    "stock": 30,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    "tags": [
      "bag",
      "accessory",
      "travel",
      "laptop"
    ],
    "popularity": 75,
    "_id": "mock-id-3"
  },
  {
    "productName": "Monitor",
    "name": "Monitor",
    "price": 14500,
    "description": "27-inch IPS borderless monitor with 144Hz refresh rate.",
    "category": "Laptops",
    "brand": "LG",
    "stock": 15,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    "tags": [
      "display",
      "screen",
      "computer",
      "electronics"
    ],
    "popularity": 80,
    "_id": "mock-id-4"
  },
  {
    "productName": "Headphones",
    "name": "Headphones",
    "price": 4500,
    "description": "Active noise-cancelling Bluetooth headphones.",
    "category": "Audio",
    "brand": "Sony",
    "stock": 20,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    "tags": [
      "audio",
      "headphones",
      "music",
      "electronics"
    ],
    "popularity": 88,
    "_id": "mock-id-5"
  },
  {
    "productName": "Webcam",
    "name": "Webcam",
    "price": 2200,
    "description": "Full HD 1080p webcam with dual microphone.",
    "category": "Accessories",
    "brand": "Logitech",
    "stock": 15,
    "rating": 4.3,
    "image": "/webcam.png",
    "tags": [
      "camera",
      "video",
      "accessory",
      "laptop"
    ],
    "popularity": 65,
    "_id": "mock-id-6"
  },
  {
    "productName": "USB Hub",
    "name": "USB Hub",
    "price": 900,
    "description": "4-in-1 USB-C hub with HDMI and USB 3.0 ports.",
    "category": "Accessories",
    "brand": "Anker",
    "stock": 100,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
    "tags": [
      "usb",
      "hub",
      "accessory",
      "laptop"
    ],
    "popularity": 70,
    "_id": "mock-id-7"
  },
  {
    "productName": "SSD 512GB",
    "name": "SSD 512GB",
    "price": 4500,
    "description": "Superfast NVMe M.2 internal solid state drive.",
    "category": "Laptops",
    "brand": "Samsung",
    "stock": 40,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
    "tags": [
      "storage",
      "ssd",
      "computer",
      "electronics"
    ],
    "popularity": 82,
    "_id": "mock-id-8"
  },
  {
    "productName": "Bluetooth Speaker",
    "name": "Bluetooth Speaker",
    "price": 2800,
    "description": "IPX7 waterproof portable bluetooth speaker.",
    "category": "Audio",
    "brand": "JBL",
    "stock": 35,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80",
    "tags": [
      "audio",
      "speaker",
      "music",
      "wireless"
    ],
    "popularity": 92,
    "_id": "mock-id-9"
  },
  {
    "productName": "Laptop",
    "name": "Laptop",
    "price": 55000,
    "description": "High-performance laptop with 16GB RAM and 512GB SSD.",
    "category": "Laptops",
    "brand": "Dell",
    "stock": 10,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
    "tags": [
      "pc",
      "computer",
      "work",
      "electronics"
    ],
    "popularity": 90,
    "_id": "mock-id-10"
  },
  {
    "productName": "MacBook Pro 16\"",
    "name": "MacBook Pro 16\"",
    "price": 249900,
    "description": "M3 Max chip with 14-core CPU and 30-core GPU, 36GB Unified Memory.",
    "category": "Laptops",
    "brand": "Apple",
    "stock": 5,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    "tags": [
      "macbook",
      "pro",
      "apple",
      "laptop"
    ],
    "popularity": 99,
    "_id": "mock-id-11"
  },
  {
    "productName": "ROG Zephyrus G14",
    "name": "ROG Zephyrus G14",
    "price": 145000,
    "description": "Ultra-slim premium gaming laptop with RTX 4060 and OLED display.",
    "category": "Laptops",
    "brand": "ASUS",
    "stock": 12,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
    "tags": [
      "gaming",
      "rog",
      "asus",
      "laptop"
    ],
    "popularity": 92,
    "_id": "mock-id-12"
  },
  {
    "productName": "ThinkPad X1 Carbon",
    "name": "ThinkPad X1 Carbon",
    "price": 135000,
    "description": "Gen 11 ultra-light business laptop with Intel Core i7.",
    "category": "Laptops",
    "brand": "Lenovo",
    "stock": 8,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80",
    "tags": [
      "business",
      "thinkpad",
      "lenovo",
      "laptop"
    ],
    "popularity": 88,
    "_id": "mock-id-13"
  },
  {
    "productName": "MX Master 3S",
    "name": "MX Master 3S",
    "price": 8500,
    "description": "Advanced ergonomic wireless mouse with MagSpeed scrolling.",
    "category": "Accessories",
    "brand": "Logitech",
    "stock": 35,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
    "tags": [
      "mouse",
      "wireless",
      "logitech",
      "accessory"
    ],
    "popularity": 96,
    "_id": "mock-id-14"
  },
  {
    "productName": "Keychron Q1 Pro",
    "name": "Keychron Q1 Pro",
    "price": 14000,
    "description": "QMK/VIA fully customizable wireless mechanical keyboard.",
    "category": "Accessories",
    "brand": "Keychron",
    "stock": 15,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80",
    "tags": [
      "keyboard",
      "mechanical",
      "custom",
      "accessory"
    ],
    "popularity": 91,
    "_id": "mock-id-15"
  },
  {
    "productName": "Anker 737 Power Bank",
    "name": "Anker 737 Power Bank",
    "price": 12500,
    "description": "24,000mAh 140W fast-charging power bank for laptops.",
    "category": "Accessories",
    "brand": "Anker",
    "stock": 25,
    "rating": 4.7,
    "image": "/powerbank.png",
    "tags": [
      "powerbank",
      "charger",
      "anker",
      "accessory"
    ],
    "popularity": 85,
    "_id": "mock-id-16"
  },
  {
    "productName": "WH-1000XM5",
    "name": "WH-1000XM5",
    "price": 29990,
    "description": "Industry leading noise-canceling wireless headphones.",
    "category": "Audio",
    "brand": "Sony",
    "stock": 18,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
    "tags": [
      "headphones",
      "audio",
      "sony",
      "noise-canceling"
    ],
    "popularity": 98,
    "_id": "mock-id-17"
  },
  {
    "productName": "AirPods Pro (2nd Gen)",
    "name": "AirPods Pro (2nd Gen)",
    "price": 24900,
    "description": "Premium wireless earbuds with active noise cancellation.",
    "category": "Audio",
    "brand": "Apple",
    "stock": 40,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&q=80",
    "tags": [
      "earbuds",
      "audio",
      "apple",
      "wireless"
    ],
    "popularity": 97,
    "_id": "mock-id-18"
  },
  {
    "productName": "Sonos Roam",
    "name": "Sonos Roam",
    "price": 19999,
    "description": "Smart portable Wi-Fi and Bluetooth speaker.",
    "category": "Audio",
    "brand": "Sonos",
    "stock": 22,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
    "tags": [
      "speaker",
      "audio",
      "sonos",
      "bluetooth"
    ],
    "popularity": 89,
    "_id": "mock-id-19"
  },
  {
    "productName": "Classic White T-Shirt",
    "name": "Classic White T-Shirt",
    "price": 800,
    "description": "Premium 100% cotton everyday t-shirt.",
    "category": "Clothing",
    "brand": "Essentials",
    "stock": 100,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    "tags": [
      "clothing",
      "shirt",
      "casual",
      "apparel"
    ],
    "popularity": 75,
    "_modelName": "Product",
    "_id": "64df94ae328a35fdb70f961a"
  },
  {
    "productName": "Running Shoes",
    "name": "Running Shoes",
    "price": 4500,
    "description": "Lightweight breathable sneakers for running and training.",
    "category": "Clothing",
    "brand": "Nike",
    "stock": 45,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "tags": [
      "shoes",
      "sneakers",
      "sports",
      "footwear"
    ],
    "popularity": 88,
    "_modelName": "Product",
    "_id": "64df94ae328a35fdb70f961b"
  },
  {
    "productName": "Ceramic Coffee Mug",
    "name": "Ceramic Coffee Mug",
    "price": 450,
    "description": "Minimalist matte finish 350ml ceramic coffee mug.",
    "category": "Home & Living",
    "brand": "HomeStyle",
    "stock": 150,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    "tags": [
      "mug",
      "coffee",
      "kitchen",
      "home"
    ],
    "popularity": 65,
    "_modelName": "Product",
    "_id": "64df94ae328a35fdb70f961c"
  },
  {
    "productName": "Indoor Desk Plant",
    "name": "Indoor Desk Plant",
    "price": 650,
    "description": "Low maintenance indoor succulent to brighten your workspace.",
    "category": "Home & Living",
    "brand": "GreenThumb",
    "stock": 30,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    "tags": [
      "plant",
      "decor",
      "home",
      "desk"
    ],
    "popularity": 82,
    "_modelName": "Product",
    "_id": "64df94ae328a35fdb70f961d"
  }
];

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products");
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (response && Array.isArray(response.data)) data = response.data;
      else if (response && response.data && Array.isArray(response.data.data)) data = response.data.data;
      else data = [];

      // If backend returned empty array, fall back to mock
      if (data.length === 0) return mockProducts;

      // Ensure all products have images (backend data might not have them)
      return data.map((p) => ({
        ...p,
        image: p.image || `https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=400`,
      }));
    } catch (error) {
      // Fallback to mock catalog when backend is unreachable
      console.info("Backend unavailable — loading mock product catalog");
      return mockProducts;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      let data = null;
      if (response && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
         data = response.data.data || response.data;
      } else {
         data = response.data || response || null;
      }
      return data;
    } catch (error) {
      // Fallback: find product from the already-loaded items in the store
      const { products } = getState();
      const found = products.items.find((p) => p._id === id);
      if (found) return found;
      return rejectWithValue(error.message || "Failed to fetch product details");
    }
  }
);

const initialState = {
  items: [],
  selectedProduct: null,
  filters: {
    category: "",
    priceRange: [0, 250000],
    rating: 0,
    search: "",
    sortBy: "popularity", // popularity | price_asc | price_desc | rating
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
