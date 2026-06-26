import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Grid
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await dispatch(signupUser(form));
    if (signupUser.fulfilled.match(result)) {
      toast.success(`Account created successfully! Welcome, ${result.payload.user.fullName}!`);
      navigate("/");
    } else {
      toast.error(result.payload || "Signup failed");
    }
  };

  const handleGoogleSignup = async () => {
    const result = await dispatch(signupUser({
      fullName: "Sophia Sterling (Google)",
      email: "customer@nexcart.com",
      phone: "+91 9999999999",
      password: "customer123"
    }));
    if (signupUser.fulfilled.match(result)) {
      toast.success("Successfully registered via Google account!");
      navigate("/");
    } else {
      toast.success("Signed in successfully via Google account!");
      navigate("/");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#FFFFFF" }}>
      <Grid container sx={{ width: "100%" }}>
        {/* Left cover panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 6,
            position: "relative",
            background: "linear-gradient(rgba(17, 24, 39, 0.65), rgba(17, 24, 39, 0.65)), url('https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1000&q=80') center/cover no-repeat",
            color: "white"
          }}
        >
          {/* Logo */}
          <Typography
            variant="h4"
            fontWeight="900"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "-0.03em"
            }}
          >
            next<span style={{ color: "#FFB300" }}>Cart</span>
          </Typography>

          {/* Banner Text */}
          <Box sx={{ my: "auto", maxWidth: "480px" }}>
            <Typography
              variant="h2"
              fontWeight="900"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.2,
                mb: 3,
                fontSize: "3.2rem"
              }}
            >
              Experience Premium Tech & Workspace Gear
            </Typography>
            <Typography variant="body1" sx={{ color: "#E5E7EB", fontSize: "1.1rem", lineHeight: 1.6 }}>
              Join the elite circle. Discover catalog items from top brands (Dell, Logitech, Razer, Sony) and unlock gamified benefits as you shop.
            </Typography>
          </Box>

          {/* Footer Streaks */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)"
              }}
            >
              <LocalFireDepartmentIcon sx={{ color: "#FFB300", fontSize: "2rem" }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="800">
                Daily Shopping Streaks
              </Typography>
              <Typography variant="caption" sx={{ color: "#D1D5DB" }}>
                Maintain your visit streak and earn exclusive promo code unlocks.
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Right Auth Panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 8 },
            bgcolor: "#FAFAFA"
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: "460px",
              p: 5,
              borderRadius: "24px",
              border: "1px solid #E5E7EB",
              bgcolor: "white"
            }}
          >
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}>
              Welcome Back
            </Typography>
            <Typography color="text.secondary" mb={3} sx={{ fontSize: "0.9rem" }}>
              Sign up to track streaks and unlock rewards.
            </Typography>

            {/* Navigation Tabs */}
            <Tabs
              value={1}
              onChange={(e, val) => {
                if (val === 0) navigate("/login");
              }}
              sx={{
                mb: 4,
                borderBottom: "1px solid #E5E7EB",
                "& .MuiTabs-indicator": { bgcolor: "#111827", height: "3px" },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: "#9CA3AF",
                  px: 0,
                  mr: 4,
                  minWidth: "auto",
                  "&.Mui-selected": { color: "#111827" }
                }
              }}
            >
              <Tab label="SIGN IN" />
              <Tab label="REGISTER" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  value={form.fullName}
                  onChange={handleInputChange}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />

                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />

                <TextField
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={form.phone}
                  onChange={handleInputChange}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />

                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={!loading && <ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#111827",
                    color: "white",
                    fontWeight: 700,
                    py: 1.5,
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    "&:hover": { bgcolor: "#1F2937" }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                </Button>

                {/* Google Sign-in Align */}
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ letterSpacing: "0.05em" }}>
                    OR CONTINUE WITH
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
                    onClick={handleGoogleSignup}
                    sx={{
                      borderColor: "#E5E7EB",
                      color: "#111827",
                      fontWeight: 750,
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      px: 3,
                      py: 1,
                      "&:hover": { borderColor: "#111827", bgcolor: "#FAFAFA" }
                    }}
                  >
                    Google
                  </Button>
                </Stack>

                {/* Demo Note */}
                <Box
                  sx={{
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    p: 2.5,
                    mt: 2
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.5, display: "block" }}>
                    <strong>Demo Access Note:</strong> You can register a new account or sign in with any email and password. Session values will be stored immediately.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Signup;