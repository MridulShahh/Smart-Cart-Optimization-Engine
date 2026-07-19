import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

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

      // Ensure all products have images (backend data might not have them)
      return data.map((p) => ({
        ...p,
        image: p.image || `https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=400`,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch products");
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
    addProductLocal: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProductLocal: (state, action) => {
      const index = state.items.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProductLocal: (state, action) => {
      state.items = state.items.filter(p => p._id !== action.payload);
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

export const { setFilters, clearFilters, clearSelectedProduct, addProductLocal, updateProductLocal, deleteProductLocal } = productSlice.actions;
export default productSlice.reducer;
