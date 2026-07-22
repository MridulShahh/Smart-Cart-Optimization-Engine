import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const Home = lazy(() => import("../pages/customer/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Shop = lazy(() => import("../pages/customer/Shop"));
const ProductDetails = lazy(() => import("../pages/customer/ProductDetails"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Wishlist = lazy(() => import("../pages/customer/Wishlist"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const Profile = lazy(() => import("../pages/customer/Profile"));
const Orders = lazy(() => import("../pages/customer/Orders"));
const AIPicks = lazy(() => import("../pages/customer/AIPicks"));

// Admin Pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const Relationships = lazy(() => import("../pages/admin/Relationships"));
const Analytics = lazy(() => import("../pages/admin/Analytics"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminCustomers = lazy(() => import("../pages/admin/Customers"));
const AdminInventory = lazy(() => import("../pages/admin/Inventory"));

// Simple route guard for admin protection
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
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

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress />
  </Box>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <AdminRoute>
              <AdminInventory />
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
    </Suspense>
  );
}

export default AppRoutes;