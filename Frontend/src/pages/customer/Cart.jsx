import { useState } from "react";
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
  const { items: cartItems, totalPrice, totalItems } = useSelector((state) => state.cart);
  const { items: products } = useSelector((state) => state.products);

  const [promo, setPromo] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

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

  // Cross sell items for Sidebar
  const getCrossSellSuggestions = () => {
    if (cartItems.length === 0) return [];
    const inCartIds = cartItems.map(item => item.product._id);
    return products
      .filter((p) => !inCartIds.includes(p._id))
      .slice(0, 2);
  };

  const suggestions = getCrossSellSuggestions();

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
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <AutoAwesomeIcon sx={{ color: "#FFB300" }} />
                        <Typography variant="subtitle2" fontWeight="700" color="#D97706" sx={{ letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          AI Cart Optimization
                        </Typography>
                      </Stack>

                      <Stack spacing={2.5}>
                        {suggestions.map((item) => (
                          <Paper key={item._id} elevation={0} sx={{ p: 2, borderRadius: "12px", border: "1px solid #FEF3C7", bgcolor: "white" }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                              <Box
                                component="img"
                                src={item.image}
                                sx={{ width: 45, height: 45, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "6px" }}
                              />
                              <Box flex={1}>
                                <Typography variant="body2" fontWeight="700" sx={{ fontSize: "0.85rem" }}>
                                  {item.productName || item.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ₹{item.price.toLocaleString("en-IN")}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                onClick={() => {
                                  dispatch(updateCartItem({ userId: user?.id, productId: item._id, quantity: 1 }));
                                  toast.success(`Added suggestions to cart!`);
                                }}
                                sx={{ textTransform: "none", color: "#E23744", fontWeight: 700, fontSize: "0.75rem" }}
                              >
                                + Add
                              </Button>
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                              "Customers who bought {cartItems[0]?.product.productName} usually add {item.productName}."
                            </Typography>
                          </Paper>
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
