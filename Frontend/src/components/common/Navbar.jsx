import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  InputBase,
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
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Category Icons
import LaptopIcon from "@mui/icons-material/Laptop";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AppsIcon from "@mui/icons-material/Apps";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { logout } from "../../redux/slices/authSlice";
import { setFilters, clearFilters } from "../../redux/slices/productSlice";
import { toggleDarkMode, setLanguage, setCurrency } from "../../redux/slices/settingsSlice";
import { t } from "../../constants/translations";
import { currencies } from "../../constants/currencies";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { darkMode, language, currency } = useSelector((state) => state.settings);

  const [locationName, setLocationName] = useState(
    localStorage.getItem("user_location") || "jamshedpur"
  );
  const [locationOpen, setLocationOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [currencyAnchor, setCurrencyAnchor] = useState(null);
  const [languageAnchor, setLanguageAnchor] = useState(null);

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

  const handleCurrencySelect = (code) => {
    dispatch(setCurrency(code));
    setCurrencyAnchor(null);
    toast.success(`Currency switched to ${code}`);
  };

  const handleLanguageSelect = (lang) => {
    dispatch(setLanguage(lang));
    setLanguageAnchor(null);
    toast.success(`Language switched to ${lang}`);
  };

  // Theme-adaptive colors
  const bgColor = isDark ? "#0F172A" : "white";
  const textColor = isDark ? "#F1F5F9" : "#111827";
  const subtleColor = isDark ? "#94A3B8" : "#4B5563";
  const borderColor = isDark ? "#334155" : "#E5E7EB";
  const hoverBg = isDark ? "#1E293B" : "#F3F4F6";
  const chipBg = isDark ? "#1E293B" : "#F3F4F6";

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
            {[t("ticker1", language), t("ticker2", language), t("ticker3", language), t("ticker4", language)].map((text, i) => (
              <Typography key={i} variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
                {text}
              </Typography>
            ))}
          </Stack>

          {/* Second duplicate set for seamless looping */}
          <Stack direction="row" spacing={8} sx={{ pr: 8, alignItems: "center" }}>
            {[t("ticker1", language), t("ticker2", language), t("ticker3", language), t("ticker4", language)].map((text, i) => (
              <Typography key={`d-${i}`} variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1, fontSize: "0.72rem" }}>
                {text}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Main Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: bgColor,
          color: textColor,
          borderBottom: `1px solid ${borderColor}`,
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
              color: textColor,
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
              color: subtleColor,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.85rem",
              display: { xs: "none", sm: "flex" },
              bgcolor: chipBg,
              px: 2,
              py: 0.8,
              borderRadius: "50px",
              "&:hover": { bgcolor: hoverBg },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem", lineHeight: 1 }}>
                {t("deliverTo", language)}
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: "0.85rem", color: textColor }}>
                {t("location", language)}: {locationName}
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
              bgcolor: chipBg,
              borderRadius: "50px",
              overflow: "hidden",
              border: `1px solid ${borderColor}`,
            }}
          >
            <InputBase
              placeholder={t("searchPlaceholder", language)}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: "0.9rem", color: textColor }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: isDark ? "#E23744" : "#111827",
                color: "white",
                px: 3,
                borderRadius: "0 50px 50px 0",
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": { bgcolor: isDark ? "#b82531" : "#1F2937" },
              }}
            >
              {t("search", language)}
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
                bgcolor: isDark ? "#422006" : "#FFFBEB",
                color: "#D97706",
                px: 1.5,
                py: 0.8,
                borderRadius: "50px",
                fontSize: "0.8rem",
                fontWeight: 700,
                border: `1px solid ${isDark ? "#78350F" : "#FEF3C7"}`,
              }}
            >
              <ElectricBoltIcon sx={{ fontSize: "1rem" }} />
              {t("oneDay", language)}
            </Box>

            {/* Currency selector */}
            <Button
              onClick={(e) => setCurrencyAnchor(e.currentTarget)}
              sx={{
                color: subtleColor,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              {currencies[currency]?.label || "₹ INR"}
            </Button>
            <Menu
              anchorEl={currencyAnchor}
              open={Boolean(currencyAnchor)}
              onClose={() => setCurrencyAnchor(null)}
            >
              {Object.keys(currencies).map((code) => (
                <MenuItem
                  key={code}
                  selected={currency === code}
                  onClick={() => handleCurrencySelect(code)}
                >
                  {currencies[code].label}
                </MenuItem>
              ))}
            </Menu>

            {/* Language selector */}
            <Button
              onClick={(e) => setLanguageAnchor(e.currentTarget)}
              sx={{
                color: subtleColor,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              🌐 {language}
            </Button>
            <Menu
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={() => setLanguageAnchor(null)}
            >
              {[
                { code: "EN", label: "🇺🇸 English" },
                { code: "HI", label: "🇮🇳 हिन्दी" },
                { code: "ES", label: "🇪🇸 Español" },
                { code: "FR", label: "🇫🇷 Français" },
              ].map((lang) => (
                <MenuItem
                  key={lang.code}
                  selected={language === lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Light/Dark mode icon toggle */}
            <IconButton onClick={() => dispatch(toggleDarkMode())} sx={{ color: subtleColor }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Wishlist */}
            <IconButton component={Link} to="/wishlist" sx={{ color: subtleColor }}>
              <FavoriteBorderIcon />
            </IconButton>

            {/* Cart */}
            <IconButton component={Link} to="/cart" sx={{ color: subtleColor }}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Auth Sign In / User menu */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleProfileOpen} sx={{ color: textColor }}>
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
                    <Typography fontWeight="600">{t("hi", language)}, {user?.fullName}</Typography>
                  </MenuItem>
                  {user?.role === "admin" && (
                    <MenuItem component={Link} to="/admin/dashboard" onClick={handleProfileClose}>
                      <DashboardIcon sx={{ mr: 1, fontSize: "1.1rem" }} /> {t("adminPanel", language)}
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to="/orders" onClick={handleProfileClose}>
                    {t("myOrders", language)}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "#E23744" }}>
                    {t("signOut", language)}
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
                  borderColor: textColor,
                  color: textColor,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "50px",
                  px: 2.5,
                  "&:hover": { bgcolor: hoverBg, borderColor: textColor },
                }}
              >
                {t("signIn", language)}
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Secondary Categories Navbar */}
      <Box
        sx={{
          bgcolor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
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
          { label: t("allItems", language), action: () => { dispatch(clearFilters()); setSearchVal(""); navigate("/shop"); }, icon: <AppsIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: t("laptops", language), action: () => { dispatch(clearFilters()); setSearchVal(""); navigate("/category/Laptops"); }, icon: <LaptopIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: t("accessories", language), action: () => { dispatch(clearFilters()); setSearchVal(""); navigate("/category/Accessories"); }, icon: <KeyboardIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: t("audioDevices", language), action: () => { dispatch(clearFilters()); setSearchVal(""); navigate("/category/Audio"); }, icon: <HeadphonesIcon sx={{ fontSize: "1.1rem" }} /> },
          { label: t("aiRecommendations", language), action: () => { navigate("/ai-picks"); }, icon: <AutoAwesomeIcon sx={{ fontSize: "1.1rem", color: "#FFB300" }} />, highlighted: true },
        ].map((item) => (
          <Button
            key={item.label}
            onClick={item.action}
            startIcon={item.icon}
            sx={{
              color: item.highlighted ? "#E23744" : subtleColor,
              fontWeight: 700,
              fontSize: "0.8rem",
              px: 2,
              py: 0.8,
              borderRadius: "50px",
              textTransform: "none",
              border: item.highlighted ? "1px solid #E23744" : `1px solid ${borderColor}`,
              minWidth: "max-content",
              transition: "all 0.2s ease-in-out",
              bgcolor: item.highlighted ? (isDark ? "rgba(226, 55, 68, 0.15)" : "#FFF5F5") : "transparent",
              "&:hover": {
                borderColor: "#E23744",
                color: "#E23744",
                bgcolor: isDark ? "rgba(226, 55, 68, 0.15)" : "#FFF5F5",
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
        <DialogTitle fontWeight="bold">{t("updateLocation", language)}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("enterLocation", language)}
            fullWidth
            variant="outlined"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationOpen(false)}>{t("cancel", language)}</Button>
          <Button onClick={handleLocationSave} variant="contained">{t("save", language)}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Navbar;