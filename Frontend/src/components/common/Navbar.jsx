import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Category Icons
import LaptopIcon from "@mui/icons-material/Laptop";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import SpaIcon from "@mui/icons-material/Spa";
import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AppsIcon from "@mui/icons-material/Apps";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { setFilters } from "../../redux/slices/productSlice";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const [locationName, setLocationName] = useState(
    localStorage.getItem("user_location") || "jamshedpur"
  );
  const [locationOpen, setLocationOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    dispatch(logout());
    handleProfileClose();
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setLocationName(tempLocation);
      localStorage.setItem("user_location", tempLocation);
      toast.success(`Location updated to ${tempLocation}`);
    }
    setLocationOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchVal }));
    navigate("/shop");
  };

  return (
    <Box>
      {/* Promotion Ticker Bar */}
      <Box
        sx={{
          bgcolor: "#111827",
          color: "#F9FAFB",
          py: 0.8,
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: "marquee 22s linear infinite",
            "@keyframes marquee": {
              "0%": { transform: "translateX(0%)" },
              "100%": { transform: "translateX(-50%)" }
            },
          }}
        >
          {/* First set of items */}
          <Stack direction="row" spacing={8} sx={{ pr: 8, alignItems: "center" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              ⚡ FREE DELIVERY ON ORDERS OVER ₹999!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🔥 PREMIUM TECH ACCESSORIES NOW IN STOCK!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🌟 EASY 15-DAY RETURNS & EXCHANGES!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🔒 100% SECURE CHECKOUT & FAST REFUNDS!
            </Typography>
          </Stack>

          {/* Second duplicate set of items for seamless looping */}
          <Stack direction="row" spacing={8} sx={{ pr: 8, alignItems: "center" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              ⚡ FREE DELIVERY ON ORDERS OVER ₹999!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🔥 PREMIUM TECH ACCESSORIES NOW IN STOCK!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🌟 EASY 15-DAY RETURNS & EXCHANGES!
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
              🔒 100% SECURE CHECKOUT & FAST REFUNDS!
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Main Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "#111827",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1, gap: 2 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            fontWeight="900"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1.65rem",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            <Box
              sx={{
                bgcolor: "#E23744",
                color: "white",
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "1.2rem",
                boxShadow: "0 4px 10px rgba(226, 55, 68, 0.3)",
                transform: "rotate(-5deg)",
              }}
            >
              N
            </Box>
            <span>nex<span style={{ color: "#E23744" }}>Cart</span><span style={{ fontSize: "0.75rem", verticalAlign: "super", color: "#FFB300", marginLeft: "3px", fontWeight: "800" }}>AI</span></span>
          </Typography>

          {/* Delivery Location */}
          <Button
            onClick={() => setLocationOpen(true)}
            startIcon={<LocationOnIcon sx={{ color: "#E23744" }} />}
            sx={{
              color: "#4B5563",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.85rem",
              display: { xs: "none", sm: "flex" },
              bgcolor: "#F3F4F6",
              px: 2,
              py: 0.8,
              borderRadius: "50px",
              "&:hover": { bgcolor: "#E5E7EB" },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem", lineHeight: 1 }}>
                DELIVER TO
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: "0.85rem", color: "#111827" }}>
                Location: {locationName}
              </Typography>
            </Box>
          </Button>

          {/* Search Box */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              flexGrow: 1,
              maxWidth: "500px",
              bgcolor: "#F3F4F6",
              borderRadius: "50px",
              overflow: "hidden",
              border: "1px solid #E5E7EB",
            }}
          >
            <InputBase
              placeholder="Search for laptops, wireless mouse, headphones..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: "0.9rem", color: "#111827" }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#111827",
                color: "white",
                px: 3,
                borderRadius: "0 50px 50px 0",
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": { bgcolor: "#1F2937" },
              }}
            >
              Search
            </Button>
          </Box>

          {/* Actions & Badges */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Speed Badge */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
                bgcolor: "#FFFBEB",
                color: "#D97706",
                px: 1.5,
                py: 0.8,
                borderRadius: "50px",
                fontSize: "0.8rem",
                fontWeight: 700,
                border: "1px solid #FEF3C7",
              }}
            >
              <ElectricBoltIcon sx={{ fontSize: "1rem" }} />
              1 Day
            </Box>

            {/* Currency selector mock */}
            <Button
              sx={{
                color: "#4B5563",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              ₹ INR
            </Button>

            {/* Language selector mock */}
            <Button
              sx={{
                color: "#4B5563",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              🌐 EN
            </Button>

            {/* Light/Dark mode icon toggle */}
            <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: "#4B5563" }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Wishlist */}
            <IconButton component={Link} to="/wishlist" sx={{ color: "#4B5563" }}>
              <FavoriteBorderIcon />
            </IconButton>

            {/* Cart */}
            <IconButton component={Link} to="/cart" sx={{ color: "#4B5563" }}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Auth Sign In / User menu */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleProfileOpen} sx={{ color: "#111827" }}>
                  <AccountCircleIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={handleProfileClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>
                    <Typography fontWeight="600">Hi, {user?.fullName}</Typography>
                  </MenuItem>
                  {user?.role === "admin" && (
                    <MenuItem component={Link} to="/admin/dashboard" onClick={handleProfileClose}>
                      <DashboardIcon sx={{ mr: 1, fontSize: "1.1rem" }} /> Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to="/orders" onClick={handleProfileClose}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "#E23744" }}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                startIcon={<AccountCircleIcon />}
                sx={{
                  borderColor: "#111827",
                  color: "#111827",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "50px",
                  px: 2.5,
                  "&:hover": { bgcolor: "#F3F4F6", borderColor: "#111827" },
                }}
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Secondary Categories Navbar */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #E5E7EB",
          py: 1.2,
          px: 3,
          display: "flex",
          justifyContent: "center",
          gap: 1.5,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {[
          { label: "All Items", action: () => { dispatch(setFilters({ category: "" })); navigate("/shop"); }, icon: <AppsIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Laptops", action: () => { dispatch(setFilters({ category: "Laptops" })); navigate("/shop"); }, icon: <LaptopIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Accessories", action: () => { dispatch(setFilters({ category: "Accessories" })); navigate("/shop"); }, icon: <KeyboardIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Audio Devices", action: () => { dispatch(setFilters({ category: "Audio" })); navigate("/shop"); }, icon: <HeadphonesIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "AI Recommendations", action: () => { navigate("/ai-picks"); }, icon: <AutoAwesomeIcon sx={{ fontSize: "1.1rem", color: "#FFB300" }} />, highlighted: true },
          { label: "Fashion", action: () => toast.error("Fashion Hub coming soon in Q3! 👗"), icon: <CheckroomIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Groceries", action: () => toast.error("Groceries delivery coming soon in Q4! 🍎"), icon: <LocalGroceryStoreIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Beauty", action: () => toast.error("Beauty & Cosmetics coming soon! 💄"), icon: <SpaIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Home Decor", action: () => toast.error("Home Furnishings coming soon! 🛋️"), icon: <HomeIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: "Sports Fitness", action: () => toast.error("Sports & Gear coming soon! ⚽"), icon: <SportsSoccerIcon sx={{ fontSize: "1.1rem" }} /> },
        ].map((item) => (
          <Button
            key={item.label}
            onClick={item.action}
            startIcon={item.icon}
            sx={{
              color: item.highlighted ? "#E23744" : "#4B5563",
              fontWeight: 700,
              fontSize: "0.8rem",
              px: 2,
              py: 0.8,
              borderRadius: "50px",
              textTransform: "none",
              border: item.highlighted ? "1px solid #E23744" : "1px solid #E5E7EB",
              minWidth: "max-content",
              transition: "all 0.2s ease-in-out",
              bgcolor: item.highlighted ? "#FFF5F5" : "white",
              "&:hover": {
                borderColor: "#E23744",
                color: "#E23744",
                bgcolor: "#FFF5F5",
                transform: "translateY(-1.2px)",
                boxShadow: "0 4px 8px rgba(226, 55, 68, 0.08)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* Geolocation Input Dialog */}
      <Dialog open={locationOpen} onClose={() => setLocationOpen(false)}>
        <DialogTitle fontWeight="bold">Update Delivery Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter pincode or city (e.g. jamshedpur)"
            fullWidth
            variant="outlined"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationOpen(false)}>Cancel</Button>
          <Button onClick={handleLocationSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Navbar;