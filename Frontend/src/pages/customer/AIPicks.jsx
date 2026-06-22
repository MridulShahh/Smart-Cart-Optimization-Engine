import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Stack,
  Rating,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { fetchProducts } from "../../redux/slices/productSlice";
import { addToCart, addLocalItem } from "../../redux/slices/cartSlice";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import toast from "react-hot-toast";

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function AIPicks() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const { items: cartItems, localItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Get active cart products (either logged in DB cart items or guest localItems)
  const activeCartProducts = user ? cartItems.map(item => item.product) : localItems;

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      // Default to the first Laptop if available, else first item
      const laptop = products.find(p => p.category === "Laptops");
      if (laptop) {
        setSelectedProductId(laptop._id);
      } else {
        setSelectedProductId(products[0]._id);
      }
    }
  }, [products, selectedProductId]);

  if (loading || products.length === 0) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
          <CircularProgress color="primary" />
        </Box>
      </MainLayout>
    );
  }

  const selectedProduct = products.find(p => p._id === selectedProductId) || products[0];

  // Scoring function: returns detailed factors for visual charting
  const calculateFactors = (productA, productB) => {
    // 1. Relationship score (40%)
    let rel = 0;
    if (productA.category !== productB.category) {
      if (productA.category === "Laptops" && productB.category === "Accessories") {
        rel = 100;
      } else if (productA.category === "Accessories" && productB.category === "Laptops") {
        rel = 80;
      } else if (productA.category === "Audio" && productB.category === "Accessories") {
        rel = 75;
      } else {
        rel = 50;
      }
    } else {
      rel = 40; // same category is less complementary than accessory pairings
    }

    // Matching tags bonus
    const commonTags = productA.tags?.filter(tag => productB.tags?.includes(tag)) || [];
    rel = Math.min(100, rel + commonTags.length * 10);

    // 2. Popularity (30%)
    const pop = productB.popularity || 50;

    // 3. Rating (20%)
    const rat = (productB.rating || 4.5) * 20;

    // 4. Price compatibility (10%)
    let priceComp = 0;
    if (productA.category === "Laptops") {
      priceComp = productB.price < productA.price ? 100 : 100 - (productB.price - productA.price) / 1000;
    } else {
      priceComp = 100 - Math.abs(productA.price - productB.price) / 100;
    }
    priceComp = Math.max(0, Math.min(100, priceComp));

    const finalScore = Math.round(rel * 0.4 + pop * 0.3 + rat * 0.2 + priceComp * 0.1);

    // Gemini dynamic description generators
    let explanation = "";
    if (productB.productName === "Wireless Mouse") {
      explanation = `Highly recommended to pair with your ${productA.productName}. A wireless ergonomic mouse frees up workstation space and increases overall work efficiency.`;
    } else if (productB.productName === "Mechanical Keyboard") {
      explanation = `Tactile keys pair perfectly with your ${productA.productName} for developer workloads. Offers unmatched responsiveness and durability.`;
    } else if (productB.productName === "Laptop Bag") {
      explanation = `Premium travel protection for your ${productA.productName}. Fits charger cables, hub accessories, and prevents scuffs or impact damage.`;
    } else if (productB.productName === "USB Hub") {
      explanation = `Crucial multi-port expansions. Perfect companion to hook up keyboards, external monitors, and storage drives to your workstation.`;
    } else if (productB.productName === "SSD 512GB" || productB.productName === "External Hard Drive 1TB") {
      explanation = `Expand your backup capacity. Recommended companion storage to store media, source code, and design files safely.`;
    } else if (productB.productName === "Headphones" || productB.productName === "Bluetooth Speaker") {
      explanation = `Premium acoustic feedback. Exceptional audio partner for team standups, streaming, and immersive music.`;
    } else {
      explanation = `${productB.productName} complements your setup. Tested by NexCart engineering as a highly compatible, high-rating companion item.`;
    }

    return {
      product: productB,
      score: finalScore,
      explanation,
      chartData: [
        { name: "Affinity Match", value: rel },
        { name: "Popularity Index", value: pop },
        { name: "User Rating", value: rat },
        { name: "Price Alignment", value: Math.round(priceComp) }
      ]
    };
  };

  // Compile recommendations for selected item
  const getSelectedProductRecommendations = () => {
    const list = products
      .filter(p => p._id !== selectedProduct._id)
      .map(item => calculateFactors(selectedProduct, item))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return list;
  };

  const selectedRecommendations = getSelectedProductRecommendations();

  // Compile recommendations for active cart products
  const getCartRecommendations = () => {
    if (activeCartProducts.length === 0) return [];
    
    // Sum compatibility factors across all cart items and average them
    const scoredMap = {};
    
    for (const cartProd of activeCartProducts) {
      if (!cartProd) continue;
      const list = products
        .filter(p => p._id !== cartProd._id && !activeCartProducts.some(cp => cp && cp._id === p._id));
      
      for (const item of list) {
        const factors = calculateFactors(cartProd, item);
        if (!scoredMap[item._id]) {
          scoredMap[item._id] = {
            product: item,
            totalScore: 0,
            count: 0,
            explanations: []
          };
        }
        scoredMap[item._id].totalScore += factors.score;
        scoredMap[item._id].count += 1;
        scoredMap[item._id].explanations.push(factors.explanation);
      }
    }

    const finalRecommendations = Object.values(scoredMap)
      .map(entry => {
        const avgScore = Math.round(entry.totalScore / entry.count);
        return {
          product: entry.product,
          score: avgScore,
          explanation: entry.explanations[0] || `${entry.product.productName} fits perfectly in your smart shopping cart configuration.`,
          chartData: [
            { name: "Affinity Match", value: avgScore },
            { name: "Popularity Index", value: entry.product.popularity || 50 },
            { name: "User Rating", value: (entry.product.rating || 4.5) * 20 },
            { name: "Price Alignment", value: 85 }
          ]
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return finalRecommendations;
  };

  const cartRecommendations = getCartRecommendations();

  const handleAddToCartClick = (prod) => {
    if (user) {
      dispatch(addToCart({ userId: user.id, productId: prod._id, quantity: 1 }));
    } else {
      dispatch(addLocalItem({ productId: prod._id, quantity: 1, product: prod }));
    }
    toast.success(`${prod.productName || prod.name} added to cart! 🛒`);
  };

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        {/* Header Hero Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1.5}>
            <AutoAwesomeIcon sx={{ color: "#E23744", fontSize: "2rem" }} />
            <Typography
              variant="h3"
              fontWeight="900"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(90deg, #111827 0%, #E23744 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NexCart AI Recommendations
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" maxWidth="600px" sx={{ mx: "auto" }}>
            Real-time cart pairing algorithm using Gemini-guided compatibility indices, pricing ratios, and purchasing streaks.
          </Typography>
        </Box>

        {/* Custom Navigation Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          centered
          sx={{
            mb: 5,
            "& .MuiTabs-indicator": { bgcolor: "#E23744", height: "3px" },
            "& .MuiTab-root": { fontWeight: 700, textTransform: "none", fontSize: "1rem" }
          }}
        >
          <Tab label="Interactive Compatibility Tester" />
          <Tab label="Personalized Cart Picks" />
        </Tabs>

        {activeTab === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={ANIMATION_VARIANTS}>
            {/* Tab 0 Content: Selector & Sandbox Analyzer */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    border: "1px solid #E5E7EB",
                    bgcolor: "white",
                  }}
                >
                  <Typography variant="h6" fontWeight="800" gutterBottom mb={3}>
                    Choose Hardware
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="sandbox-product-label">Analyze Item</InputLabel>
                    <Select
                      labelId="sandbox-product-label"
                      value={selectedProductId}
                      label="Analyze Item"
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      sx={{ borderRadius: "12px" }}
                    >
                      {products.map(p => (
                        <MenuItem key={p._id} value={p._id}>
                          {p.productName} ({p.brand})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedProduct && (
                    <Box sx={{ textAlign: "center" }}>
                      <Box
                        component="img"
                        src={selectedProduct.image}
                        alt={selectedProduct.productName}
                        sx={{
                          height: 180,
                          objectFit: "contain",
                          mb: 2,
                          bgcolor: "#F9FAFB",
                          p: 2,
                          borderRadius: "16px",
                          width: "100%"
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="800">
                        {selectedProduct.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        by {selectedProduct.brand} | {selectedProduct.category}
                      </Typography>
                      <Typography variant="h6" fontWeight="800" color="#E23744">
                        ₹{selectedProduct.price.toLocaleString("en-IN")}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/product/${selectedProduct._id}`}
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{ mt: 3, borderRadius: "50px", textTransform: "none", fontWeight: 700 }}
                      >
                        View Specs
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Recommendations List with Chart Indicators */}
              <Grid item xs={12} md={8}>
                <Stack spacing={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InsightsIcon color="primary" />
                    <Typography variant="h5" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                      AI Suggested Pairs
                    </Typography>
                  </Box>

                  {selectedRecommendations.map((rec) => (
                    <Card
                      key={rec.product._id}
                      sx={{
                        borderRadius: "24px",
                        border: "1px solid #E5E7EB",
                        boxShadow: "none",
                        overflow: "visible",
                        position: "relative",
                        bgcolor: "white"
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={4} alignItems="center">
                          {/* Product Thumbnail */}
                          <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
                            <Box
                              component="img"
                              src={rec.product.image}
                              sx={{
                                height: 110,
                                objectFit: "contain",
                                bgcolor: "#FAFAFA",
                                borderRadius: "16px",
                                p: 1,
                                maxWidth: "100%"
                              }}
                            />
                            <Typography variant="subtitle2" fontWeight="800" sx={{ mt: 1.5 }}>
                              {rec.product.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ₹{rec.product.price.toLocaleString("en-IN")}
                            </Typography>
                          </Grid>

                          {/* Chart indicators */}
                          <Grid item xs={12} sm={5}>
                            <Typography variant="caption" fontWeight="800" color="text.secondary" display="block" mb={1} sx={{ letterSpacing: "0.05em" }}>
                              COMPATIBILITY SCORE FACTOR BREAKDOWN
                            </Typography>
                            <Box sx={{ height: 120, width: "100%" }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={rec.chartData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                                  <XAxis type="number" domain={[0, 100]} hide />
                                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: "10px", fontWeight: 700, fill: "#4B5563" }} />
                                  <Tooltip formatter={(value) => [`${value}%`]} />
                                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={10}>
                                    {rec.chartData.map((entry, index) => {
                                      const colors = ["#E23744", "#3B82F6", "#10B981", "#F59E0B"];
                                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                    })}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </Grid>

                          {/* Explanation and CTA */}
                          <Grid item xs={12} sm={4}>
                            <Box
                              sx={{
                                bgcolor: "#FFFBEB",
                                border: "1px dashed #FFB300",
                                p: 2.5,
                                borderRadius: "16px",
                                mb: 2,
                              }}
                            >
                              <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
                                <AutoAwesomeIcon sx={{ color: "#D97706", fontSize: "1.1rem" }} />
                                <Typography variant="caption" fontWeight="800" color="#D97706">
                                  Score: {rec.score}% MATCH
                                </Typography>
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.4 }}>
                                "{rec.explanation}"
                              </Typography>
                            </Box>

                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleAddToCartClick(rec.product)}
                              startIcon={<ShoppingBagIcon />}
                              sx={{
                                bgcolor: "#111827",
                                color: "white",
                                fontWeight: 700,
                                borderRadius: "50px",
                                py: 1.2,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#E23744" }
                              }}
                            >
                              Add Companion
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={ANIMATION_VARIANTS}>
            {/* Tab 1 Content: Personalized Picks based on shopping cart */}
            {activeCartProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" fontWeight="800" mb={2}>
                  Your Cart is Empty
                </Typography>
                <Typography color="text.secondary" mb={4} maxWidth="480px" sx={{ mx: "auto" }}>
                  Add products to your cart and our Smart Recommendation Engine will calculate bespoke affinity items with custom explanations.
                </Typography>
                <Button component={Link} to="/shop" variant="contained" sx={{ borderRadius: "50px", px: 4, py: 1.5, fontWeight: 700 }}>
                  Explore Products
                </Button>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {/* Active Items */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: "24px",
                      border: "1px solid #E5E7EB",
                      bgcolor: "white",
                    }}
                  >
                    <Typography variant="h6" fontWeight="800" mb={3}>
                      Your Smart Cart
                    </Typography>

                    <Stack spacing={2}>
                      {activeCartProducts.map((p, idx) => p && (
                        <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "center", p: 1.5, border: "1px solid #F3F4F6", borderRadius: "12px" }}>
                          <Box
                            component="img"
                            src={p.image}
                            sx={{ width: 50, height: 50, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "8px" }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="700">
                              {p.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ₹{p.price.toLocaleString("en-IN")}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12} md={8}>
                  <Stack spacing={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon color="primary" />
                      <Typography variant="h5" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        Bespoke Cart Optimizations
                      </Typography>
                    </Box>

                    {cartRecommendations.map((rec) => (
                      <Card
                        key={rec.product._id}
                        sx={{
                          borderRadius: "24px",
                          border: "1px solid #E5E7EB",
                          boxShadow: "none",
                          bgcolor: "white",
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Grid container spacing={4} alignItems="center">
                            {/* Product Info */}
                            <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
                              <Box
                                component="img"
                                src={rec.product.image}
                                sx={{
                                  height: 110,
                                  objectFit: "contain",
                                  bgcolor: "#FAFAFA",
                                  borderRadius: "16px",
                                  p: 1,
                                  maxWidth: "100%"
                                }}
                              />
                              <Typography variant="subtitle2" fontWeight="800" sx={{ mt: 1.5 }}>
                                {rec.product.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                ₹{rec.product.price.toLocaleString("en-IN")}
                              </Typography>
                            </Grid>

                            {/* Chart factors */}
                            <Grid item xs={12} sm={5}>
                              <Typography variant="caption" fontWeight="800" color="text.secondary" display="block" mb={1}>
                                FIT COMPATIBILITY FACTOR INDEX
                              </Typography>
                              <Box sx={{ height: 120, width: "100%" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={rec.chartData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: "10px", fontWeight: 700, fill: "#4B5563" }} />
                                    <Tooltip formatter={(value) => [`${value}%`]} />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={10}>
                                      {rec.chartData.map((entry, index) => {
                                        const colors = ["#E23744", "#3B82F6", "#10B981", "#F59E0B"];
                                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                      })}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </Box>
                            </Grid>

                            {/* Gemini Explanation box */}
                            <Grid item xs={12} sm={4}>
                              <Box
                                sx={{
                                  bgcolor: "#FFFBEB",
                                  border: "1px dashed #FFB300",
                                  p: 2.5,
                                  borderRadius: "16px",
                                  mb: 2,
                                }}
                              >
                                <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
                                  <AutoAwesomeIcon sx={{ color: "#D97706", fontSize: "1.1rem" }} />
                                  <Typography variant="caption" fontWeight="800" color="#D97706">
                                    Affinity Index: {rec.score}%
                                  </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.4 }}>
                                  "{rec.explanation}"
                                </Typography>
                              </Box>

                              <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleAddToCartClick(rec.product)}
                                startIcon={<ShoppingBagIcon />}
                                sx={{
                                  bgcolor: "#111827",
                                  color: "white",
                                  fontWeight: 700,
                                  borderRadius: "50px",
                                  py: 1.2,
                                  textTransform: "none",
                                  "&:hover": { bgcolor: "#E23744" }
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            )}
          </motion.div>
        )}
      </Container>
    </MainLayout>
  );
}

export default AIPicks;
