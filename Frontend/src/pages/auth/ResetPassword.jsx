import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/slices/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successfully. You can now log in.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Failed to reset password");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#FAFAFA" }}>
      <Paper elevation={0} sx={{ width: "100%", maxWidth: "400px", p: 5, borderRadius: "24px", border: "1px solid #E5E7EB", bgcolor: "white" }}>
        <Typography variant="h4" fontWeight="900" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
          New Password
        </Typography>
        <Typography color="text.secondary" mb={3} sx={{ fontSize: "0.9rem" }}>
          Enter your new password below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
