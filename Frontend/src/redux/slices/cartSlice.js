import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return { items: [], totalItems: 0, totalPrice: 0 };
      const response = await api.get(`/cart/${userId}`);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        // Fallback for guest cart
        dispatch(addLocalItem({ productId, quantity }));
        return null;
      }
      const response = await api.post(`/cart/${userId}/add`, { productId, quantity });
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        dispatch(updateLocalQuantity({ productId, quantity }));
        return null;
      }
      const response = await api.put(`/cart/${userId}/update`, { productId, quantity });
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update item quantity");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        dispatch(removeLocalItem(productId));
        return null;
      }
      const response = await api.delete(`/cart/${userId}/remove/${productId}`);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        dispatch(clearLocalCart());
        return null;
      }
      const response = await api.delete(`/cart/${userId}/clear`);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

const getLocalCart = () => {
  return JSON.parse(localStorage.getItem("guest_cart")) || { items: [], totalItems: 0, totalPrice: 0 };
};

const saveLocalCart = (cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    loadLocalCart: (state) => {
      const local = getLocalCart();
      state.items = local.items;
      state.totalItems = local.totalItems;
      state.totalPrice = local.totalPrice;
    },
    addLocalItem: (state, action) => {
      // For local items we need product details. Let's handle it inside UI components or fallback placeholder
      const { productId, quantity, product } = action.payload;
      const existing = state.items.find(item => item.product._id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          product: product,
          quantity,
          price: product.price
        });
      }
      // recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      saveLocalCart({ items: state.items, totalItems: state.totalItems, totalPrice: state.totalPrice });
    },
    updateLocalQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      saveLocalCart({ items: state.items, totalItems: state.totalItems, totalPrice: state.totalPrice });
    },
    removeLocalItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      saveLocalCart({ items: state.items, totalItems: state.totalItems, totalPrice: state.totalPrice });
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem("guest_cart");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items || [];
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items || [];
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const { loadLocalCart, addLocalItem, updateLocalQuantity, removeLocalItem, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
