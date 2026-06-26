import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully! Welcome to the smart club ⚡");
  };

  return (
    <Box
      sx={{
        mt: 12,
        pt: 8,
        pb: 4,
        bgcolor: "#111827",
        color: "#9CA3AF",
        borderTop: "1px solid #1F2937",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={6}>
          {/* Brand Col */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight="900"
              color="white"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              next<span style={{ color: "#E23744" }}>Cart</span>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 3, lineHeight: 1.7 }}>
              NexCart AI is a startup-grade smart cart optimization engine designed to make shopping smarter, faster, and powered by Gemini AI explanations.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <IconButton sx={{ color: "white", bgcolor: "#1F2937", "&:hover": { bgcolor: "#E23744" } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: "#1F2937", "&:hover": { bgcolor: "#E23744" } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: "#1F2937", "&:hover": { bgcolor: "#E23744" } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: "#1F2937", "&:hover": { bgcolor: "#E23744" } }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2.5}>
            <Typography variant="h6" fontWeight="700" color="white" gutterBottom sx={{ fontSize: "1rem" }}>
              Shop Categories
            </Typography>
            <Stack spacing={1.5} mt={2}>
              <Typography variant="body2" component={Link} to="/shop" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Laptops & Notebooks
              </Typography>
              <Typography variant="body2" component={Link} to="/shop" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Peripherals & Hubs
              </Typography>
              <Typography variant="body2" component={Link} to="/shop" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Audio Devices
              </Typography>
              <Typography variant="body2" component={Link} to="/shop" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Keyboards & Mice
              </Typography>
            </Stack>
          </Grid>

          {/* Company Info */}
          <Grid item xs={6} md={2.5}>
            <Typography variant="h6" fontWeight="700" color="white" gutterBottom sx={{ fontSize: "1rem" }}>
              Our Company
            </Typography>
            <Stack spacing={1.5} mt={2}>
              <Typography variant="body2" component={Link} to="/" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                About Us
              </Typography>
              <Typography variant="body2" component={Link} to="/" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Careers
              </Typography>
              <Typography variant="body2" component={Link} to="/" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                Press & News
              </Typography>
              <Typography variant="body2" component={Link} to="/" sx={{ color: "#9CA3AF", textDecoration: "none", "&:hover": { color: "white" } }}>
                AI recommendation logic
              </Typography>
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="700" color="white" gutterBottom sx={{ fontSize: "1rem" }}>
              Join the Smart Club
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              Get updates on early-bird pricing, AI insights, and newly arrived devices.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: "flex", gap: 1 }}>
              <TextField
                placeholder="Email address"
                size="small"
                fullWidth
                sx={{
                  bgcolor: "#1F2937",
                  borderRadius: "8px",
                  input: { color: "white", fontSize: "0.85rem" },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                }}
              />
              <Button type="submit" variant="contained" sx={{ bgcolor: "#E23744", color: "white", "&:hover": { bgcolor: "#b82531" } }}>
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#1F2937" }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} NexCart AI. Shop Smarter. Powered by AI.
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
            Designed in Poppins & Inter. Made for investors demo.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;