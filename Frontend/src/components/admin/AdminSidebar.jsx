import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";

const drawerWidth = 260;

function AdminSidebar() {
  const theme = useTheme();
  const location = useLocation();
  const isDark = theme.palette.mode === "dark";

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Products", icon: <InventoryIcon />, path: "/admin/products" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
    { text: "Customers", icon: <PeopleIcon />, path: "/admin/customers" },
    { text: "Inventory", icon: <StorefrontIcon />, path: "/admin/inventory" },
    { text: "Analytics", icon: <AssessmentIcon />, path: "/admin/analytics" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: isDark ? "#111827" : "#FFFFFF",
          borderRight: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
          color: isDark ? "#F9FAFB" : "#111827",
        },
      }}
    >
      {/* Logo Area */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            bgcolor: "#E23744",
            color: "white",
            width: 32,
            height: 32,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "1.1rem",
            transform: "rotate(-5deg)",
          }}
        >
          N
        </Box>
        <Typography variant="h6" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.03em" }}>
          nex<span style={{ color: "#E23744" }}>Admin</span>
        </Typography>
      </Box>

      <Divider sx={{ borderColor: isDark ? "#1F2937" : "#F3F4F6" }} />

      {/* Navigation List */}
      <Box sx={{ overflow: "auto", mt: 2, px: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ ml: 2, fontWeight: 700 }}>
          MANAGEMENT
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: isActive ? (isDark ? "rgba(226, 55, 68, 0.15)" : "#FFF5F5") : "transparent",
                    color: isActive ? "#E23744" : (isDark ? "#9CA3AF" : "#4B5563"),
                    "&:hover": {
                      bgcolor: isActive
                        ? (isDark ? "rgba(226, 55, 68, 0.2)" : "#FEE2E2")
                        : (isDark ? "#1F2937" : "#F3F4F6"),
                      color: isActive ? "#E23744" : (isDark ? "#F9FAFB" : "#111827"),
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Typography variant="overline" color="text.secondary" sx={{ ml: 2, fontWeight: 700, mt: 3, display: "block" }}>
          SYSTEM
        </Typography>
        <List sx={{ mt: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/profile"
              sx={{
                borderRadius: "10px",
                color: isDark ? "#9CA3AF" : "#4B5563",
                "&:hover": { bgcolor: isDark ? "#1F2937" : "#F3F4F6", color: isDark ? "#F9FAFB" : "#111827" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500, fontSize: "0.95rem" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Bottom Area */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Box sx={{ p: 2, bgcolor: isDark ? "#1F2937" : "#F9FAFB", borderRadius: "12px", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
          <Typography variant="body2" fontWeight="700">Need Help?</Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>Check our admin docs.</Typography>
          <Box component="a" href="#" sx={{ color: "#3B82F6", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}>
            Documentation
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default AdminSidebar;
