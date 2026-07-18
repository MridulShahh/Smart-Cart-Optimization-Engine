import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      toast.success(result.payload.message || "Reset link sent!");
    } else {
      toast.error(result.payload || "Failed to send reset link");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#FAFAFA" }}>
      <Paper elevation={0} sx={{ width: "100%", maxWidth: "400px", p: 5, borderRadius: "24px", border: "1px solid #E5E7EB", bgcolor: "white" }}>
        <Typography variant="h4" fontWeight="900" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Reset Password
        </Typography>
        <Typography color="text.secondary" mb={3} sx={{ fontSize: "0.9rem" }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ bgcolor: "#111827", color: "white", fontWeight: 700, py: 1.5, borderRadius: "10px", "&:hover": { bgcolor: "#1F2937" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
