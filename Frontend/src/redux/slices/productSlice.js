import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Mock product catalog (fallback when backend is unreachable) ────────────
const mockProducts = [
  // ── Laptops ──
  {
    _id: "mock-laptop-001",
    productName: "Dell Inspiron 15 Laptop",
    category: "Laptops",
    brand: "Dell",
    price: 60000,
    rating: 4.5,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=400",
    description: "15.6\" Full HD display, Intel Core i5, 8GB RAM, 512GB SSD. Perfect for work and entertainment.",
  },
  {
    _id: "mock-laptop-002",
    productName: "HP Pavilion Gaming Laptop",
    category: "Laptops",
    brand: "HP",
    price: 75000,
    rating: 4.6,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400",
    description: "15.6\" FHD 144Hz, AMD Ryzen 7, 16GB RAM, 512GB SSD, NVIDIA GTX 1650. Built for gamers.",
  },
  {
    _id: "mock-laptop-003",
    productName: "MacBook Air M2",
    category: "Laptops",
    brand: "Apple",
    price: 114900,
    rating: 4.8,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
    description: "13.6\" Liquid Retina, Apple M2 chip, 8GB RAM, 256GB SSD. Supercharged by Apple Silicon.",
  },
  {
    _id: "mock-laptop-004",
    productName: "Lenovo ThinkPad X1 Carbon",
    category: "Laptops",
    brand: "Lenovo",
    price: 135000,
    rating: 4.7,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400",
    description: "14\" 2.8K OLED, Intel Core i7, 16GB RAM, 512GB SSD. The gold standard for business laptops.",
  },

  // ── Accessories ──
  {
    _id: "mock-acc-001",
    productName: "Logitech MX Master 3S",
    category: "Accessories",
    brand: "Logitech",
    price: 9999,
    rating: 4.7,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=400",
    description: "Wireless performance mouse with 8K DPI tracking, quiet clicks, and MagSpeed scroll.",
  },
  {
    _id: "mock-acc-002",
    productName: "Razer BlackWidow V4",
    category: "Accessories",
    brand: "Razer",
    price: 14999,
    rating: 4.6,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400",
    description: "Mechanical gaming keyboard with Razer Green switches, RGB Chroma, and magnetic wrist rest.",
  },
  {
    _id: "mock-acc-003",
    productName: "Dell UltraSharp 27\" Monitor",
    category: "Accessories",
    brand: "Dell",
    price: 35000,
    rating: 4.5,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=400",
    description: "27\" 4K UHD IPS monitor with USB-C hub, 99% sRGB, and factory-calibrated colors.",
  },
  {
    _id: "mock-acc-004",
    productName: "Anker USB-C Hub 7-in-1",
    category: "Accessories",
    brand: "Anker",
    price: 3499,
    rating: 4.4,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&q=80&w=400",
    description: "7-in-1 USB-C adapter with HDMI 4K, 100W PD, USB 3.0 ports, and SD card reader.",
  },
  {
    _id: "mock-acc-005",
    productName: "Laptop Stand Aluminum",
    category: "Accessories",
    brand: "AmazonBasics",
    price: 1899,
    rating: 4.3,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400",
    description: "Ergonomic aluminum laptop riser, adjustable height, foldable design for portability.",
  },
  {
    _id: "mock-acc-006",
    productName: "Corsair Mouse Pad XXL",
    category: "Accessories",
    brand: "Corsair",
    price: 1599,
    rating: 4.3,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1616763355548-1b11f2b35e83?auto=format&fit=crop&q=80&w=400",
    description: "Extended gaming mouse pad with micro-weave fabric, anti-skid base, and spill-proof coating.",
  },

  // ── Audio ──
  {
    _id: "mock-audio-001",
    productName: "Sony WH-1000XM5",
    category: "Audio",
    brand: "Sony",
    price: 29990,
    rating: 4.8,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400",
    description: "Industry-leading noise cancelling headphones with 30-hour battery, Hi-Res Audio, and multipoint.",
  },
  {
    _id: "mock-audio-002",
    productName: "JBL Tune 760NC",
    category: "Audio",
    brand: "JBL",
    price: 4999,
    rating: 4.3,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    description: "Wireless over-ear headphones with Active Noise Cancelling, JBL Pure Bass, and 50-hour battery.",
  },
  {
    _id: "mock-audio-003",
    productName: "boAt Airdopes 141",
    category: "Audio",
    brand: "boAt",
    price: 1299,
    rating: 4.1,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=400",
    description: "True wireless earbuds with ENx noise cancellation, BEAST mode, and 42-hour total playtime.",
  },
  {
    _id: "mock-audio-004",
    productName: "Marshall Stanmore II",
    category: "Audio",
    brand: "Marshall",
    price: 34999,
    rating: 4.7,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400",
    description: "Iconic Bluetooth speaker with powerful multi-directional sound, analog controls, and classic rock design.",
  },

  // ── Clothing ──
  {
    _id: "mock-cloth-001",
    productName: "Tech-Wear Hoodie",
    category: "Clothing",
    brand: "NexCart Originals",
    price: 2499,
    rating: 4.4,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400",
    description: "Premium cotton-blend hoodie with hidden cable routing pocket and minimalist tech logo.",
  },
  {
    _id: "mock-cloth-002",
    productName: "Developer T-Shirt",
    category: "Clothing",
    brand: "NexCart Originals",
    price: 999,
    rating: 4.2,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400",
    description: "100% combed cotton tee with 'Hello World' design. Available in Black, White, and Navy.",
  },

  // ── Home & Living ──
  {
    _id: "mock-home-001",
    productName: "Smart LED Desk Lamp",
    category: "Home & Living",
    brand: "Mi",
    price: 2999,
    rating: 4.5,
    popularity: "High",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=400",
    description: "WiFi-connected desk lamp with adjustable color temperature, brightness control, and app support.",
  },
  {
    _id: "mock-home-002",
    productName: "Ergonomic Office Chair",
    category: "Home & Living",
    brand: "GreenSoul",
    price: 18999,
    rating: 4.4,
    popularity: "Medium",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400",
    description: "High-back mesh chair with lumbar support, adjustable armrests, and breathable mesh back.",
  },
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
