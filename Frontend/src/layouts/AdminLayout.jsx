import { Box } from "@mui/material";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { motion } from "framer-motion";

function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // To offset the fixed header
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0F172A" : "#F9FAFB"),
          overflowX: "hidden",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}

export default AdminLayout;