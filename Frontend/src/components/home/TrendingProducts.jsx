import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import ProductCard from "../product/ProductCard";
import { motion } from "framer-motion";

function TrendingProducts() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const categories = ["All", "Laptops", "Accessories", "Audio"];

  const filteredProducts = products
    .filter((p) => activeTab === 0 || p.category === categories[activeTab])
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 4);

  return (
    <Container sx={{ mt: 10 }}>
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight="900"
          gutterBottom
          sx={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}
        >
          Trending Hardware
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}>
          Discover what other buyers are loving. High-demand workstation accessories, verified compatibility ratings, and AI-optimized selections.
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          centered
          sx={{
            mb: 4,
            "& .MuiTabs-indicator": { bgcolor: "#E23744", height: "3px" },
            "& .MuiTab-root": { fontWeight: 700, textTransform: "none", fontSize: "0.95rem", color: "#9CA3AF", "&.Mui-selected": { color: "#111827" } }
          }}
        >
          <Tab label="All Trending" />
          <Tab label="Laptops" />
          <Tab label="Accessories" />
          <Tab label="Audio Devices" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Grid container spacing={4}>
            {filteredProducts.map((product) => (
              <Grid
                xs={12}
                sm={6}
                md={3}
                key={product._id}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Container>
  );
}

export default TrendingProducts;