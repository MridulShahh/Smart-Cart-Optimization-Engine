import Navbar from "../components/common/Navbar";
import { motion } from "framer-motion";

function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ flexGrow: 1 }}
      >
        {children}
      </motion.main>
    </div>
  );
}

export default AdminLayout;