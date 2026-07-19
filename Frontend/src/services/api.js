import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://smart-cart-backend-nji9.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-refresh token if 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.error === "Invalid token") {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
          // Direct axios call to avoid interceptor loop
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { token: refreshToken });
          
          if (res.data.success) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            
            // Dispatch to redux would happen in a real app, here we just update storage and retry
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            
            // Re-run original request with new token
            const retryResponse = await axios(originalRequest);
            return retryResponse.data;
          }
        } catch (refreshError) {
          // Refresh failed, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
