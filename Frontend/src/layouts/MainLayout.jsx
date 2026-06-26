import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { motion } from "framer-motion";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ flexGrow: 1 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export default MainLayout;