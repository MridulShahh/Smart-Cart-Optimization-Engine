import { useState } from "react";
import { AppBar, Toolbar, Box, IconButton, InputBase, Badge, Avatar, useTheme, Menu, MenuItem, Typography, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/slices/settingsSlice";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;

function AdminHeader() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const { darkMode } = useSelector((state) => state.settings);
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/login");
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/profile");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: isDark ? "#111827" : "#FFFFFF",
        borderBottom: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
        color: isDark ? "#F9FAFB" : "#111827",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: isDark ? "#1F2937" : "#F3F4F6",
            borderRadius: "8px",
            px: 2,
            py: 0.5,
            width: "400px",
          }}
        >
          <SearchIcon sx={{ color: "#9CA3AF", mr: 1, fontSize: "1.2rem" }} />
          <InputBase
            placeholder="Search products, orders, or customers..."
            sx={{ flex: 1, fontSize: "0.9rem", color: isDark ? "#F9FAFB" : "#111827" }}
          />
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => dispatch(toggleDarkMode())} sx={{ color: isDark ? "#9CA3AF" : "#4B5563" }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          <IconButton sx={{ color: isDark ? "#9CA3AF" : "#4B5563" }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1.5, pl: 2, borderLeft: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#E23744", fontSize: "0.9rem", fontWeight: "bold" }}>
                {user?.fullName?.charAt(0) || "A"}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 200,
                bgcolor: isDark ? "#1F2937" : "#FFFFFF",
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight="700">
                {user?.fullName || "Admin User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || "admin@nexcart.com"}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: isDark ? "#374151" : "#E5E7EB", my: 0.5 }} />
            <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: isDark ? "#9CA3AF" : "#4B5563" }} />
              <Typography variant="body2" fontWeight="500">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "#EF4444" }}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: "inherit" }} />
              <Typography variant="body2" fontWeight="600">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
