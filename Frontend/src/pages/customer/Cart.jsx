import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import { updateCartItem, removeFromCart, clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartId, items: cartItems, totalPrice, totalItems } = useSelector((state) => state.cart);
  const { items: products } = useSelector((state) => state.products);

  const [promo, setPromo] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user?.id && cartItems.length > 0) {
        try {
          const res = await api.get(`/recommendations/${user.id}`);
          if (res?.success && res?.recommendations) {
            setRecommendations(res.recommendations);
            
            // Fetch explanations
            for (const rec of res.recommendations) {
              const expRes = await api.post("/recommendations/explain", {
                cartProducts: cartItems.map(item => item.product),
                recommendedProduct: rec.product
              });
              if (expRes?.success) {
                setExplanations(prev => ({...prev, [rec.product._id]: expRes.explanation}));
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch recommendations", error);
        }
      } else {
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  }, [user, cartItems]);

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === "NEXSMART15") {
      setDiscountPercent(15);
      toast.success("Promo code NEXSMART15 applied! 15% discount active 🎉");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleQtyChange = (productId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1) return;
    dispatch(updateCartItem({ userId: user?.id, productId, quantity: nextQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ userId: user?.id, productId }));
    toast.success("Item removed from cart");
  };

  const discountAmount = Math.round(totalPrice * (discountPercent / 100));
  const shipping = totalPrice > 999 ? 0 : totalPrice === 0 ? 0 : 99;
  const finalTotal = totalPrice - discountAmount + shipping;

    // Use state recommendations
    const suggestions = recommendations.slice(0, 2);

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h3" fontWeight="900" mb={4} sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" fontWeight="700" gutterBottom>
              Your Cart is Empty
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Add some high-velocity IT gear and accessories to get started.
            </Typography>
            <Button variant="contained" component={Link} to="/shop" sx={{ borderRadius: "50px" }}>
              Shop Now
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items list */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {cartItems.map((item) => (
                  <Card
                    key={item.product._id}
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "none",
                      bgcolor: "white",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} sm={2}>
                          <Box
                            component="img"
                            src={item.product.image}
                            alt={item.product.productName || item.product.name}
                            sx={{ width: "100%", height: 80, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "12px" }}
                          />
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="body1" fontWeight="700" color="#111827">
                                {item.product.productName || item.product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                by {item.product.brand}
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="800" color="#E23744">
                              ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconButton onClick={() => handleQtyChange(item.product._id, item.quantity, -1)} size="small">
                                <RemoveIcon sx={{ fontSize: "1.1rem" }} />
                              </IconButton>
                              <Typography fontWeight="700">{item.quantity}</Typography>
                              <IconButton onClick={() => handleQtyChange(item.product._id, item.quantity, 1)} size="small">
                                <AddIcon sx={{ fontSize: "1.1rem" }} />
                              </IconButton>
                            </Stack>

                            <IconButton onClick={() => handleRemove(item.product._id)} sx={{ color: "#EF4444" }}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            {/* Sidebar Summary & AI Suggestions */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                {/* Order Summary */}
                <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="700" mb={3}>
                      Order Summary
                    </Typography>

                    <Stack spacing={2} mb={3}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Subtotal ({totalItems} items)</Typography>
                        <Typography fontWeight="600">₹{totalPrice.toLocaleString("en-IN")}</Typography>
                      </Stack>

                      {discountPercent > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="text.secondary">Discount ({discountPercent}%)</Typography>
                          <Typography fontWeight="600" color="#16A34A">-₹{discountAmount.toLocaleString("en-IN")}</Typography>
                        </Stack>
                      )}

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Delivery Charge</Typography>
                        <Typography fontWeight="600" color={shipping === 0 ? "#16A34A" : "text.primary"}>
                          {shipping === 0 ? "FREE" : `₹${shipping}`}
                        </Typography>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight="700" color="#111827">Order Total</Typography>
                        <Typography variant="h6" fontWeight="900" color="#E23744">
                          ₹{finalTotal.toLocaleString("en-IN")}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Promo Box */}
                    <Stack direction="row" spacing={1} mb={4}>
                      <TextField
                        size="small"
                        placeholder="Promo Code"
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        fullWidth
                        sx={{ input: { fontSize: "0.85rem" } }}
                      />
                      <Button variant="outlined" onClick={handleApplyPromo} sx={{ borderColor: "#111827", color: "#111827" }}>
                        Apply
                      </Button>
                    </Stack>

                    <Button
                      component={Link}
                      to="/checkout"
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "#E23744",
                        color: "white",
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: "50px",
                        "&:hover": { bgcolor: "#b82531" },
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Add-on Recommendations */}
                {suggestions.length > 0 && (
                  <Card sx={{ borderRadius: "16px", border: "1px dashed #FFB300", bgcolor: "#FFFBEB", boxShadow: "none" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <AutoAwesomeIcon sx={{ color: "#FFB300" }} />
                        <Typography variant="h6" fontWeight="700">
                          Smart AI Add-ons
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        {suggestions.map((item) => (
                          <Box key={item.product._id} sx={{ p: 2, borderRadius: "12px", border: "1px solid #FEF3C7", bgcolor: "white" }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                              <Box
                                component="img"
                                src={item.product.image}
                                sx={{ width: 60, height: 60, borderRadius: "12px", objectFit: "cover", bgcolor: "white" }}
                              />
                              <Box flex={1}>
                                <Typography variant="subtitle2" fontWeight="600">{item.product.productName || item.product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">₹{item.product.price.toLocaleString()}</Typography>
                              </Box>
                              <Button
                                size="small"
                                onClick={() => {
                                  dispatch(updateCartItem({ userId: user?.id, productId: item.product._id, quantity: 1 }));
                                  toast.success(`Added ${item.product.productName || item.product.name} to cart!`);
                                  
                                  // Track acceptance
                                  if (cartId) {
                                    api.post("/recommendations/accept", {
                                      cartId,
                                      productId: item.product._id
                                    }).catch(console.error);
                                  }
                                }}
                                sx={{ textTransform: "none", color: "#E23744", fontWeight: 700, fontSize: "0.75rem" }}
                              >
                                + Add
                              </Button>
                            </Stack>
                            {explanations[item.product._id] && (
                              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#8b6f1e', fontStyle: 'italic', bgcolor: 'rgba(255,179,0,0.1)', p: 1, borderRadius: 1 }}>
                                "{explanations[item.product._id]}"
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
}

export default Cart;
