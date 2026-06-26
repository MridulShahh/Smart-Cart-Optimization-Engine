import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  TextField,
  Divider,
  LinearProgress,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SaveIcon from "@mui/icons-material/Save";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const availableAvatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80", // Developer
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80", // Designer
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80", // Gamer
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80", // Creator
];

const achievements = [
  { name: "Deal Hunter", desc: "Revealed discount from Scratch Card", icon: "🎟️", unlocked: true },
  { name: "Cart Optimizer", desc: "Added an AI recommendation product", icon: "⚡", unlocked: true },
  { name: "Streak Starter", desc: "Kept a 3-day shopping visit streak", icon: "🔥", unlocked: true },
  { name: "Tech Enthusiast", desc: "Placed an order on the catalog", icon: "💻", unlocked: false },
];

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load preferences or fall back to defaults
  const [avatar, setAvatar] = useState(
    localStorage.getItem("user_avatar") || availableAvatars[0]
  );
  const [prefBrand, setPrefBrand] = useState(
    localStorage.getItem("user_pref_brand") || "Logitech"
  );
  const [prefSpeed, setPrefSpeed] = useState(
    localStorage.getItem("user_pref_speed") || "express"
  );

  const [form, setForm] = useState({
    fullName: user?.fullName || "Sophian Sterling",
    phone: user?.phone || "+91 9999999999",
    email: user?.email || "customer@nexcart.com",
  });

  const handleAvatarSelect = (url) => {
    setAvatar(url);
    localStorage.setItem("user_avatar", url);
    toast.success("Avatar updated successfully! 👤");
  };

  const handleSavePreferences = () => {
    localStorage.setItem("user_pref_brand", prefBrand);
    localStorage.setItem("user_pref_speed", prefSpeed);
    toast.success("Shopping preferences saved! 💾");
  };

  const streakDays = Number(localStorage.getItem("shopping_streak") || 3);
  const streakPercent = Math.min(100, (streakDays / 7) * 100);

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h3" fontWeight="900" mb={4} sx={{ fontFamily: "'Poppins', sans-serif" }}>
          User Dashboard
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column - Avatar & Streaks */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Profile Card */}
              <Card sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3, textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block", mx: "auto", mb: 2 }}>
                  <Avatar src={avatar} sx={{ width: 120, height: 120, border: "4px solid #E23744" }} />
                </Box>
                <Typography variant="h5" fontWeight="800">{form.fullName}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>{form.email}</Typography>
                <Chip label={user?.role === "admin" ? "Store Administrator" : "Club Customer"} size="small" sx={{ mt: 1, bgcolor: "#E23744", color: "white" }} />

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" fontWeight="700" mb={2}>
                  Select Profile Avatar
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {availableAvatars.map((url, idx) => (
                    <Avatar
                      key={idx}
                      src={url}
                      onClick={() => handleAvatarSelect(url)}
                      sx={{
                        width: 42,
                        height: 42,
                        cursor: "pointer",
                        border: avatar === url ? "3px solid #E23744" : "1px solid #E5E7EB",
                        transition: "all 0.2s",
                        "&:hover": { transform: "scale(1.15)" },
                      }}
                    />
                  ))}
                </Stack>
              </Card>

              {/* Streak Tracker Card */}
              <Card sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3, bgcolor: "#FFFBEB" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <LocalFireDepartmentIcon sx={{ color: "#F59E0B", fontSize: "2rem" }} />
                  <Typography variant="h6" fontWeight="800" color="#B45309">
                    Daily Shopping Streak
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Visit NexCart daily to grow your streak level and unlock exclusive reward catalogs.
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1}>
                  <Typography variant="h3" fontWeight="900" color="#B45309">{streakDays} Days</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">LEVEL 1 STREAKER</Typography>
                </Stack>

                <LinearProgress variant="determinate" value={streakPercent} sx={{ height: 8, borderRadius: 4, bgcolor: "#FEF3C7", "& .MuiLinearProgress-bar": { bgcolor: "#F59E0B" } }} />
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  {7 - streakDays} more visits to level up!
                </Typography>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column - User settings & preferences */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* Profile Details Edit Form */}
              <Card sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", boxShadow: "none", p: 4 }}>
                <Typography variant="h6" fontWeight="750" mb={3}>
                  Account Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Full Name" name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Phone Number" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Email Address" disabled value={form.email} fullWidth />
                  </Grid>
                </Grid>
              </Card>

              {/* Shopping Preferences */}
              <Card sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", boxShadow: "none", p: 4 }}>
                <Typography variant="h6" fontWeight="750" mb={3}>
                  Shopping Preferences
                </Typography>

                <Stack spacing={4}>
                  <Box>
                    <FormLabel sx={{ fontWeight: 700, color: "#111827", display: "block", mb: 1.5 }}>
                      Favorite Tech Brand
                    </FormLabel>
                    <RadioGroup row value={prefBrand} onChange={(e) => setPrefBrand(e.target.value)}>
                      <FormControlLabel value="Dell" control={<Radio />} label="Dell" />
                      <FormControlLabel value="Logitech" control={<Radio />} label="Logitech" />
                      <FormControlLabel value="Razer" control={<Radio />} label="Razer" />
                      <FormControlLabel value="JBL" control={<Radio />} label="JBL" />
                    </RadioGroup>
                  </Box>

                  <Box>
                    <FormLabel sx={{ fontWeight: 700, color: "#111827", display: "block", mb: 1.5 }}>
                      Default Shipping Preference
                    </FormLabel>
                    <RadioGroup row value={prefSpeed} onChange={(e) => setPrefSpeed(e.target.value)}>
                      <FormControlLabel value="standard" control={<Radio />} label="Standard (3-5 Days)" />
                      <FormControlLabel value="express" control={<Radio />} label="Express Next-Day (1-Day)" />
                    </RadioGroup>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePreferences}
                    sx={{
                      bgcolor: "#111827",
                      alignSelf: "flex-start",
                      borderRadius: "50px",
                      px: 4,
                      py: 1.2,
                    }}
                  >
                    Save Preferences
                  </Button>
                </Stack>
              </Card>

              {/* Achievements Badge list */}
              <Card sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", boxShadow: "none", p: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                  <EmojiEventsIcon sx={{ color: "#FFB300" }} />
                  <Typography variant="h6" fontWeight="750">
                    Unlocked Milestones
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  {achievements.map((ach, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid #E5E7EB",
                          bgcolor: ach.unlocked ? "white" : "#FAFAFA",
                          filter: ach.unlocked ? "none" : "grayscale(1)",
                          opacity: ach.unlocked ? 1 : 0.6,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="h4">{ach.icon}</Typography>
                          <Box>
                            <Typography variant="body1" fontWeight="700" color="#111827">
                              {ach.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ach.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default Profile;
