import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { fetchProducts } from "../../redux/slices/productSlice";
import ProductCard from "../../components/product/ProductCard";

function Wishlist() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);

  // For visual demo, let's pre-populate 2 items if products are loaded
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length > 0) {
      // Pick Laptop and Keyboard as sample favorites
      const favorites = products.filter(
        (p) => p.productName === "Laptop" || p.productName === "Mechanical Keyboard"
      );
      setWishlistItems(favorites);
    }
  }, [products]);

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h3" fontWeight="900" mb={4} sx={{ fontFamily: "'Poppins', sans-serif" }}>
          My Wishlist
        </Typography>

        {wishlistItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" fontWeight="700" gutterBottom>
              Your Wishlist is Empty
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Tap the heart icon on catalog items to save them for later.
            </Typography>
            <Button variant="contained" component={Link} to="/shop" sx={{ borderRadius: "50px" }}>
              Explore Catalog
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {wishlistItems.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
}

export default Wishlist;
