import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Try to connect to backend api if it exists
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      // Mock login fallback for demonstration
      if (
        credentials.email === "admin@nexcart.com" &&
        credentials.password === "admin123"
      ) {
        return {
          token: "mock-admin-jwt-token",
          user: {
            id: "mock-admin-id",
            fullName: "Admin NexCart",
            email: "admin@nexcart.com",
            role: "admin",
            phone: "+91 9999999999",
          },
        };
      } else if (
        credentials.email === "customer@nexcart.com" &&
        credentials.password === "customer123"
      ) {
        return {
          token: "mock-customer-jwt-token",
          user: {
            id: "mock-customer-id",
            fullName: "Sophia Sterling",
            email: "customer@nexcart.com",
            role: "customer",
            phone: "+91 8888888888",
          },
        };
      }
      return rejectWithValue(error.message || "Invalid credentials. Use admin@nexcart.com / admin123 or customer@nexcart.com / customer123");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      // Mock signup fallback
      return {
        token: "mock-signup-jwt-token",
        user: {
          id: Math.random().toString(36).substr(2, 9),
          fullName: userData.fullName,
          email: userData.email,
          role: "customer",
          phone: userData.phone || "+91 1234567890",
        },
      };
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
