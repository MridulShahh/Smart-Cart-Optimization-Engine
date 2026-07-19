import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== 'All') queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      
      const response = await api.get(`/products?${queryParams.toString()}`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.error || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || "Failed to fetch product details");
    }
  }
);

const initialState = {
  items: [],
  selectedProduct: null,
  filters: {
    category: "All",
    priceRange: [0, 500000],
    sort: "popular",
    search: ""
  },
  status: "idle",
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, addProductLocal, updateProductLocal, deleteProductLocal } = productSlice.actions;

export const selectFilteredProducts = (state) => state.products.items;

export default productSlice.reducer;
