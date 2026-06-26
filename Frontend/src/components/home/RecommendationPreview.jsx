import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  Rating,
  Button,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const sampleRecommendation = {
  cartItem: {
    productName: "Laptop",
    brand: "Dell",
    price: 55000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"
  },
  suggestions: [
    {
      _id: "mock-mouse-id",
      productName: "Wireless Mouse",
      brand: "Logitech",
      price: 1200,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
      rating: 4.5,
      aiExplanation: "Logitech Wireless Mouse is recommended because customers frequently purchase it with Laptops. It has a high rating and improves office ergonomics."
    },
    {
      _id: "mock-kb-id",
      productName: "Mechanical Keyboard",
      brand: "Keychron",
      price: 3500,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
      rating: 4.7,
      aiExplanation: "Keychron Mechanical Keyboard provides tactile feedback that pairs perfectly with Dell Laptops for programmers."
    }
  ]
};

function RecommendationPreview() {
  const handleQuickAdd = (productName) => {
    toast.success(`${productName} added to cart via AI suggestion! 🛒`);
  };

  return (
    <Container sx={{ mt: 10 }}>
      {/* Promotion banner style */}
      <Box
        sx={{
          bgcolor: "#FFFBEB",
          border: "1px dashed #FFB300",
          borderRadius: "20px",
          p: { xs: 4, md: 5 },
          mb: 6,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <AutoAwesomeIcon sx={{ color: "#FFB300" }} />
          <Typography variant="subtitle1" fontWeight="700" color="#D97706" sx={{ letterSpacing: "0.05em", textTransform: "uppercase" }}>
            NexCart AI Optimization Engine
          </Typography>
        </Stack>

        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          {/* Cart preview */}
          <Grid xs={12} md={4}>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", color: "#111827" }}>
              Smart Cart AI Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              When you add items to your cart, our engine computes a Compatibility Score and Gemini explains the connection in real-time.
            </Typography>

            <Paper sx={{ p: 2, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "white" }} elevation={0}>
              <Typography variant="subtitle2" fontWeight="700" mb={1.5} color="text.secondary">
                YOUR CART (1 ITEM)
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={sampleRecommendation.cartItem.image}
                  sx={{ width: 60, height: 60, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "8px" }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="700" color="#111827">
                    {sampleRecommendation.cartItem.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Brand: {sampleRecommendation.cartItem.brand}
                  </Typography>
                  <Typography variant="body2" fontWeight="600" color="#E23744">
                    ₹{sampleRecommendation.cartItem.price.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* AI recommendations */}
          <Grid xs={12} md={8}>
            <Stack spacing={3}>
              {sampleRecommendation.suggestions.map((suggestion) => (
                <Card
                  key={suggestion._id}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "none",
                    bgcolor: "white",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid xs={3} sm={2}>
                        <Box
                          component="img"
                          src={suggestion.image}
                          sx={{ width: "100%", height: 70, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "8px" }}
                        />
                      </Grid>
                      <Grid xs={9} sm={10}>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box>
                            <Typography variant="body1" fontWeight="700" color="#111827">
                              {suggestion.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              by {suggestion.brand}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="800" color="#E23744">
                            ₹{suggestion.price.toLocaleString("en-IN")}
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            bgcolor: "#F9FAFB",
                            p: 1.5,
                            borderRadius: "8px",
                            mb: 2,
                            border: "1px solid #F3F4F6",
                          }}
                        >
                          <AutoAwesomeIcon sx={{ color: "#E23744", fontSize: "1.1rem", mt: 0.2 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.4 }}>
                            "{suggestion.aiExplanation}"
                          </Typography>
                        </Box>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Rating value={suggestion.rating} readOnly size="small" sx={{ color: "#FFB300" }} />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuickAdd(suggestion.productName)}
                            startIcon={<ShoppingBagIcon />}
                            sx={{
                              borderColor: "#111827",
                              color: "#111827",
                              fontWeight: 600,
                              borderRadius: "50px",
                              textTransform: "none",
                              fontSize: "0.75rem",
                              "&:hover": { bgcolor: "#111827", color: "white" }
                            }}
                          >
                            Add Suggestion
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

import { Paper } from "@mui/material";
export default RecommendationPreview;