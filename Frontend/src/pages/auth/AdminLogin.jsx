import { useState } from "react";
import { Box, Button, Grid, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await dispatch(adminLogin({ email, password }));
    if (adminLogin.fulfilled.match(result)) {
      toast.success(`Admin access granted. Welcome, ${result.payload.user.fullName}.`);
      navigate("/admin/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0F172A" }}>
      <Paper elevation={24} sx={{ width: "100%", maxWidth: "400px", p: 5, borderRadius: "24px", bgcolor: "#1E293B", color: "white" }}>
        <Stack alignItems="center" mb={4}>
          <Box sx={{ bgcolor: "rgba(226, 55, 68, 0.1)", p: 2, borderRadius: "50%", mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ color: "#E23744", fontSize: "3rem" }} />
          </Box>
          <Typography variant="h4" fontWeight="900" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Admin Portal
          </Typography>
          <Typography color="#9CA3AF" textAlign="center" sx={{ fontSize: "0.9rem" }}>
            Restricted access. Authorized personnel only.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Admin Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: "#9CA3AF" } }}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  color: "white",
                  "& fieldset": { borderColor: "#475569" },
                  "&:hover fieldset": { borderColor: "#E23744" },
                  "&.Mui-focused fieldset": { borderColor: "#E23744" }
                } 
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ style: { color: "#9CA3AF" } }}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  color: "white",
                  "& fieldset": { borderColor: "#475569" },
                  "&:hover fieldset": { borderColor: "#E23744" },
                  "&.Mui-focused fieldset": { borderColor: "#E23744" }
                } 
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{
                bgcolor: "#E23744",
                color: "white",
                fontWeight: 800,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                "&:hover": { bgcolor: "#b82531" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Access Systems"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
