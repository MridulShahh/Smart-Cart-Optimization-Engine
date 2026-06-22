import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
  Rating,
  Divider,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import { fetchProducts } from "../../redux/slices/productSlice";
import { addToCart, addLocalItem } from "../../redux/slices/cartSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
      }
    }
  }, [products, id]);

  if (loading || !product) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress color="primary" />
        </Box>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ userId: user.id, productId: product._id, quantity: 1 }));
    } else {
      dispatch(addLocalItem({ productId: product._id, quantity: 1, product }));
    }
    toast.success(`${product.productName || product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleWishlistToggle = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist! ❤️");
  };

  // Recommendation Scoring Logic
  // Recommendation Score = 40% Product Relationship + 30% Popularity + 20% Rating + 10% Price Compatibility
  const getAIRecommendations = () => {
    const scoredList = products
      .filter((p) => p._id !== product._id)
      .map((item) => {
        // 1. Relationship score (40%)
        let rel = 0;
        if (item.category !== product.category) {
          // accessories match computers/audio well
          if (product.category === "Laptops" && item.category === "Accessories") {
            rel = 100;
          } else if (product.category === "Accessories" && item.category === "Laptops") {
            rel = 80;
          } else {
            rel = 40;
          }
        } else {
          rel = 50; // same category is good but accessories complement devices better
        }

        // 2. Popularity score (30%)
        const pop = item.popularity || 50;

        // 3. Rating score (20%)
        const rat = (item.rating || 4.5) * 20;

        // 4. Price compatibility (10%)
        // Accessories should be cheaper than main product
        let priceComp = 0;
        if (product.category === "Laptops") {
          priceComp = item.price < product.price ? 100 : 100 - (item.price - product.price) / 1000;
        } else {
          priceComp = 100 - Math.abs(product.price - item.price) / 100;
        }
        priceComp = Math.max(0, Math.min(100, priceComp));

        const finalScore = rel * 0.4 + pop * 0.3 + rat * 0.2 + priceComp * 0.1;

        // Realistic AI explanations template
        let aiExplanation = "";
        if (item.productName === "Wireless Mouse") {
          aiExplanation = "Wireless Mouse is recommended because customers frequently purchase it with Laptops. It improves navigation and workstation ergonomics.";
        } else if (item.productName === "Mechanical Keyboard") {
          aiExplanation = "A mechanical keyboard increases typing velocity and accuracy. Great pairing with your newly selected computer.";
        } else if (item.productName === "Laptop Bag") {
          aiExplanation = "Travel securely. A durable water-resistant laptop bag offers safety pads and accessory pockets for portable workstations.";
        } else {
          aiExplanation = `${item.productName} complements your purchase. It has a high rating and provides vital accessory compatibility for daily use.`;
        }

        return { product: item, score: Math.round(finalScore), aiExplanation };
      });

    return [...scoredList].sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const recommendations = getAIRecommendations();

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        {/* Breadcrumb style */}
        <Typography variant="body2" color="text.secondary" mb={3}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link> /{" "}
          <Link to="/shop" style={{ textDecoration: "none", color: "inherit" }}>Shop</Link> /{" "}
          <span style={{ color: "#E23744", fontWeight: 600 }}>{product.productName || product.name}</span>
        </Typography>

        <Grid container spacing={6}>
          {/* Left Gallery */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #E5E7EB",
                bgcolor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: "320px", md: "460px" },
              }}
            >
              <Box
                component="img"
                src={product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80"}
                alt={product.productName || product.name}
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Paper>
          </Grid>

          {/* Right Product Details Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {product.brand}
            </Typography>

            <Typography
              variant="h3"
              fontWeight="900"
              gutterBottom
              sx={{ fontFamily: "'Poppins', sans-serif", fontSize: { xs: "2rem", md: "2.8rem" }, mt: 1 }}
            >
              {product.productName || product.name}
            </Typography>

            {/* Ratings */}
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Rating value={product.rating || 4.5} precision={0.1} readOnly sx={{ color: "#FFB300" }} />
              <Typography variant="body1" fontWeight="600" color="text.primary">
                {product.rating || 4.5} ★
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Typography variant="body2" color="text.secondary">
                ({product.popularity || 45} orders generated)
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="800" color="#E23744" mb={3}>
              ₹{(product.price || 0).toLocaleString("en-IN")}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph mb={4} sx={{ lineHeight: 1.7 }}>
              {product.description || "The ultimate tool for your digital desk. Experience high reliability, premium build quality, and startup-grade performance backed by NexCart quality assurance standards."}
            </Typography>

            {/* In Stock status */}
            <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
              <VerifiedIcon sx={{ color: product.stock > 0 ? "#16A34A" : "#6B7280" }} />
              <Typography variant="body2" fontWeight="600" color={product.stock > 0 ? "#16A34A" : "#6B7280"}>
                {product.stock > 0 ? `In Stock (Only ${product.stock} items left!)` : "Out of Stock"}
              </Typography>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={2} mb={4}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                sx={{
                  flexGrow: 1,
                  bgcolor: "#E23744",
                  fontWeight: 700,
                  py: 1.8,
                  borderRadius: "50px",
                  "&:hover": { bgcolor: "#b82531" },
                }}
              >
                Buy Now
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                startIcon={<ShoppingBagIcon />}
                sx={{
                  flexGrow: 1,
                  bgcolor: "#111827",
                  fontWeight: 700,
                  py: 1.8,
                  borderRadius: "50px",
                  "&:hover": { bgcolor: "#1F2937" },
                }}
              >
                Add to Cart
              </Button>
              <IconButton onClick={handleWishlistToggle} sx={{ border: "1px solid #E5E7EB", p: 1.8, borderRadius: "50%" }}>
                {wishlisted ? <FavoriteIcon sx={{ color: "#E23744" }} /> : <FavoriteBorderIcon />}
              </IconButton>
            </Stack>

            <Divider />

            {/* Shipping indicator */}
            <Stack direction="row" spacing={3} mt={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShippingIcon sx={{ color: "#4B5563" }} />
                <Typography variant="caption" fontWeight="600" color="text.secondary">
                  FREE 1-DAY EXPRESS DELIVERY
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Tab specifications */}
        <Box sx={{ mt: 10 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tab label="Specifications" sx={{ fontWeight: 700, textTransform: "none" }} />
            <Tab label="Reviews" sx={{ fontWeight: 700, textTransform: "none" }} />
          </Tabs>

          {tabValue === 0 && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E5E7EB", bgcolor: "white" }}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={4}><Typography variant="subtitle2" fontWeight="700">Category</Typography></Grid>
                <Grid item xs={6} sm={8}><Typography variant="body2" color="text.secondary">{product.category}</Typography></Grid>
                
                <Grid item xs={6} sm={4}><Typography variant="subtitle2" fontWeight="700">Brand</Typography></Grid>
                <Grid item xs={6} sm={8}><Typography variant="body2" color="text.secondary">{product.brand}</Typography></Grid>
                
                <Grid item xs={6} sm={4}><Typography variant="subtitle2" fontWeight="700">Stock Available</Typography></Grid>
                <Grid item xs={6} sm={8}><Typography variant="body2" color="text.secondary">{product.stock} units</Typography></Grid>

                <Grid item xs={6} sm={4}><Typography variant="subtitle2" fontWeight="700">Tags</Typography></Grid>
                <Grid item xs={6} sm={8}><Typography variant="body2" color="text.secondary">{(product.tags || []).join(", ") || "Smart Tech, Accessory"}</Typography></Grid>
              </Grid>
            </Paper>
          )}

          {tabValue === 1 && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E5E7EB", bgcolor: "white" }}>
              <Stack spacing={4}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="700">Mridul (SkillTurtle)</Typography>
                    <Rating value={5} readOnly size="small" sx={{ color: "#FFB300" }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Absolutely phenomenal! Works exactly as described. The integration with the cart optimization is seamless and helps me discover necessary companion accessories instantly.
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="700">Sophia Sterling</Typography>
                    <Rating value={4.5} readOnly size="small" sx={{ color: "#FFB300" }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Super high quality build and fast shipping. Highly recommended.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </Box>

        {/* AI Recommendations Section */}
        <Box sx={{ mt: 10 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={4}>
            <AutoAwesomeIcon sx={{ color: "#E23744" }} />
            <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              AI Smart Recommendations
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {recommendations.map((rec) => (
              <Grid item xs={12} md={4} key={rec.product._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    border: "1px solid #E5E7EB",
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-6px)" },
                  }}
                >
                  <Box>
                    <Box component={Link} to={`/product/${rec.product._id}`} sx={{ display: "block", textAlign: "center", mb: 2 }}>
                      <Box
                        component="img"
                        src={rec.product.image}
                        sx={{ height: 140, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "12px", p: 1 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase" }}>
                      {rec.product.brand}
                    </Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: "1rem", mb: 1 }}>
                      {rec.product.productName || rec.product.name}
                    </Typography>
                    <Typography variant="subtitle2" color="#E23744" fontWeight="800" mb={2}>
                      ₹{rec.product.price.toLocaleString("en-IN")}
                    </Typography>

                    {/* Gemini AI explanation callout */}
                    <Box sx={{ bgcolor: "#FFFBEB", border: "1px dashed #FFB300", p: 2, borderRadius: "12px", mb: 3 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
                        <AutoAwesomeIcon sx={{ color: "#D97706", fontSize: "0.95rem" }} />
                        <Typography variant="caption" fontWeight="700" color="#D97706">
                          AI Compatibility Score: {rec.score}%
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.4, fontStyle: "italic" }}>
                        "{rec.aiExplanation}"
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (user) {
                        dispatch(addToCart({ userId: user.id, productId: rec.product._id, quantity: 1 }));
                      } else {
                        dispatch(addLocalItem({ productId: rec.product._id, quantity: 1, product: rec.product }));
                      }
                      toast.success(`${rec.product.productName || rec.product.name} added to cart! 🛒`);
                    }}
                    sx={{
                      bgcolor: "#111827",
                      color: "white",
                      fontWeight: 600,
                      borderRadius: "50px",
                      py: 1,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#E23744" },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </MainLayout>
  );
}

export default ProductDetails;
