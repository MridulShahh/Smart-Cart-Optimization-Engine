import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/customer/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Shop from "../pages/customer/Shop";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Wishlist from "../pages/customer/Wishlist";
import Checkout from "../pages/customer/Checkout";
import Profile from "../pages/customer/Profile";
import Orders from "../pages/customer/Orders";
import AIPicks from "../pages/customer/AIPicks";

// Admin Pages
import AdminLogin from "../pages/auth/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Relationships from "../pages/admin/Relationships";
import Analytics from "../pages/admin/Analytics";
import AdminOrders from "../pages/admin/Orders";
import AdminCustomers from "../pages/admin/Customers";
import AdminInventory from "../pages/admin/Inventory";

// Generated Admin CMS Pages
import Categories from "../pages/admin/Categorys"; // Generator used Categorys
import Brands from "../pages/admin/Brands";
import Coupons from "../pages/admin/Coupons";
import Banners from "../pages/admin/Banners";
import Users from "../pages/admin/Users";

import { useSelector } from "react-redux";

// Simple route guard for admin protection
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "superadmin")) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// Route guard for authenticated users (checkout, profile, etc.)
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
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
      <Route path="/category/:categoryName" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route path="/ai-picks" element={<AIPicks />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
      <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
      <Route path="/admin/relationships" element={<AdminRoute><Relationships /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      
      {/* New CMS Routes */}
      <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
      <Route path="/admin/brands" element={<AdminRoute><Brands /></AdminRoute>} />
      <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
      <Route path="/admin/banners" element={<AdminRoute><Banners /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;