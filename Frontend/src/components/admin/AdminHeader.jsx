import { AppBar, Toolbar, Box, IconButton, InputBase, Badge, Avatar, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/slices/settingsSlice";

const drawerWidth = 260;

function AdminHeader() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === "dark";
  const { darkMode } = useSelector((state) => state.settings);

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
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#E23744", fontSize: "0.9rem", fontWeight: "bold" }}>A</Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
