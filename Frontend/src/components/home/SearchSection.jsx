import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import ScratchCard from "../common/ScratchCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PaymentIcon from "@mui/icons-material/Payment";
import AutorenewIcon from "@mui/icons-material/Autorenew";

function SearchSection() {
  return (
    <Container sx={{ mt: 10 }}>
      <Grid container spacing={4} sx={{ alignItems: "center" }}>
        {/* Gamified scratch card promotion */}
        <Grid xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: "24px",
              bgcolor: "white",
              border: "1px solid #E5E7EB",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
              Unlock Extra Savings!
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Try scratching our daily streak card to reveal exclusive coupon codes! Keep scratching to increase your streak level and qualify for premium reward catalogs.
            </Typography>
            <ScratchCard />
          </Box>
        </Grid>

        {/* Feature badges */}
        <Grid xs={12} md={6}>
          <Typography
            variant="h4"
            fontWeight="800"
            mb={4}
            sx={{ fontFamily: "'Poppins', sans-serif", textAlign: { xs: "center", md: "left" } }}
          >
            NexCart Standards
          </Typography>

          <Grid container spacing={3}>
            {/* Feature 1 */}
            <Grid xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "#FEE2E2", p: 1.5, borderRadius: "50%", color: "#E23744", display: "flex" }}>
                  <LocalShippingIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="#111827">
                    Free Delivery
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    On all orders above ₹999
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Feature 2 */}
            <Grid xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "#FEF3C7", p: 1.5, borderRadius: "50%", color: "#FFB300", display: "flex" }}>
                  <WorkspacePremiumIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="#111827">
                    Premium Quality
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    100% genuine products
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Feature 3 */}
            <Grid xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "#E0F2FE", p: 1.5, borderRadius: "50%", color: "#0284C7", display: "flex" }}>
                  <PaymentIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="#111827">
                    Secure Payments
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SSL Encrypted checkout
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Feature 4 */}
            <Grid xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ bgcolor: "#DCFCE7", p: 1.5, borderRadius: "50%", color: "#16A34A", display: "flex" }}>
                  <AutorenewIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="#111827">
                    15-Day Returns
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hassle-free refund policy
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SearchSection;