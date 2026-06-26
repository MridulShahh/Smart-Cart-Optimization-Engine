import { useState } from "react";
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import { clearCart } from "../../redux/slices/cartSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import toast from "react-hot-toast";

const steps = ["Shipping Details", "Delivery Method", "Payment Method"];

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { totalPrice, items: cartItems } = useSelector((state) => state.cart);

  const [activeStep, setActiveStep] = useState(0);

  // Form states
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.fullName || "",
    address: "",
    city: "",
    zipCode: "",
    phone: user?.phone || "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleInputChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!shippingForm.fullName || !shippingForm.address || !shippingForm.city || !shippingForm.zipCode || !shippingForm.phone) {
        toast.error("Please fill in all shipping details");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = () => {
    dispatch(clearCart(user?.id));
    setActiveStep(3); // Go to success page
    toast.success("Order placed successfully! 🎉");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="700" mb={1}>
                Shipping Address
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="fullName"
                label="Full Name"
                fullWidth
                value={shippingForm.fullName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="phone"
                label="Phone Number"
                fullWidth
                value={shippingForm.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="address"
                label="Address Line"
                fullWidth
                value={shippingForm.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="city"
                label="City"
                fullWidth
                value={shippingForm.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="zipCode"
                label="Pincode / Zip Code"
                fullWidth
                value={shippingForm.zipCode}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="700" mb={3}>
              Choose Delivery Option
            </Typography>
            <RadioGroup value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
              <Paper sx={{ p: 2.5, mb: 2, borderRadius: "12px", border: "1px solid #E5E7EB" }} elevation={0}>
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight="700">Standard Delivery (3-5 Days)</Typography>
                      <Typography variant="body2" color="text.secondary">Free delivery on orders above ₹999</Typography>
                    </Box>
                  }
                />
              </Paper>
              <Paper sx={{ p: 2.5, borderRadius: "12px", border: "1px solid #E5E7EB" }} elevation={0}>
                <FormControlLabel
                  value="express"
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight="700">Express Next-Day Delivery (1-Day)</Typography>
                      <Typography variant="body2" color="text.secondary">Guaranteed 1-day speed for urgent tech needs. (₹99 surcharge below threshold)</Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight="700" mb={3}>
              Choose Payment Method
            </Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
              <Paper sx={{ p: 2, mb: 2, borderRadius: "12px", border: "1px solid #E5E7EB" }} elevation={0}>
                <FormControlLabel value="card" control={<Radio />} label="Credit or Debit Card" />
                {paymentMethod === "card" && (
                  <Stack spacing={2} mt={2} sx={{ maxWidth: 400 }}>
                    <TextField label="Card Number" fullWidth />
                    <Stack direction="row" spacing={2}>
                      <TextField label="Expiry Date (MM/YY)" fullWidth />
                      <TextField label="CVV" type="password" fullWidth />
                    </Stack>
                  </Stack>
                )}
              </Paper>
              <Paper sx={{ p: 2, mb: 2, borderRadius: "12px", border: "1px solid #E5E7EB" }} elevation={0}>
                <FormControlLabel value="razorpay" control={<Radio />} label="Razorpay / UPI / NetBanking" />
              </Paper>
              <Paper sx={{ p: 2, borderRadius: "12px", border: "1px solid #E5E7EB" }} elevation={0}>
                <FormControlLabel value="cod" control={<Radio />} label="Cash On Delivery (COD)" />
              </Paper>
            </RadioGroup>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10, maxWidth: "800px" }}>
        {activeStep === 3 ? (
          /* Order success block */
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", border: "1px solid #E5E7EB" }} elevation={0}>
            <CheckCircleIcon sx={{ fontSize: "5rem", color: "#16A34A", mb: 2 }} />
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
              Order Placed Successfully!
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Thank you for shopping with NexCart AI. Your order is confirmed and will be dispatched shortly.
            </Typography>

            {/* Tracking block */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: "#FAFAFA", borderRadius: "12px", border: "1px solid #E5E7EB", textAlign: "left" }} elevation={0}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <LocalShippingIcon sx={{ color: "#E23744" }} />
                <Typography variant="body1" fontWeight="700">Order Tracking Status</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={1}>
                <strong>Delivery Address:</strong> {shippingForm.address}, {shippingForm.city} - {shippingForm.zipCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> Dispatched / Est. delivery: <strong>1 Day (Tomorrow)</strong>
              </Typography>
            </Paper>

            <Button variant="contained" onClick={() => navigate("/")} sx={{ borderRadius: "50px", px: 4, py: 1.2 }}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #E5E7EB" }} elevation={0}>
            <Typography variant="h4" fontWeight="800" mb={4} sx={{ 
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center"
            }}>
              Checkout
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: "260px" }}>{renderStepContent(activeStep)}</Box>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" justifyContent="space-between">
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ color: "#4B5563", fontWeight: 600 }}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" onClick={handlePlaceOrder} sx={{ bgcolor: "#E23744", fontWeight: 700, borderRadius: "50px", px: 4 }}>
                  Place Order (₹{totalPrice.toLocaleString("en-IN")})
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ bgcolor: "#111827", fontWeight: 700, borderRadius: "50px", px: 4 }}>
                  Continue
                </Button>
              )}
            </Stack>
          </Paper>
        )}
      </Container>
    </MainLayout>
  );
}

export default Checkout;
