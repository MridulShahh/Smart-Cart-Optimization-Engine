import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/customer/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Shop from "../pages/customer/Shop";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Wishlist from "../pages/customer/Wishlist";
import Checkout from "../pages/customer/Checkout";
import Profile from "../pages/customer/Profile";
import AIPicks from "../pages/customer/AIPicks";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Relationships from "../pages/admin/Relationships";
import Analytics from "../pages/admin/Analytics";

import { useSelector } from "react-redux";

// Simple route guard for admin protection
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/ai-picks" element={<AIPicks />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <Products />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/relationships"
        element={
          <AdminRoute>
            <Relationships />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;