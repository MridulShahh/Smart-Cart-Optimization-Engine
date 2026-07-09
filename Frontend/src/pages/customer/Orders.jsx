import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatPrice } from "../../constants/currencies";
import { t } from "../../constants/translations";

function Orders() {
  const { user } = useSelector((state) => state.auth);
  const { currency, language } = useSelector((state) => state.settings);

  // Mock orders data for the demo
  const mockOrders = [
    {
      id: "ORD-948573",
      date: new Date().toLocaleDateString(),
      status: "Processing",
      total: 45000,
      items: [
        {
          name: "Logitech MX Master 3S",
          qty: 1,
          price: 9999,
          image: "https://images.unsplash.com/photo-1527814050087-379381547961?auto=format&fit=crop&q=80&w=200",
        },
        {
          name: "Dell UltraSharp 27",
          qty: 1,
          price: 35001,
          image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=200",
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10, minHeight: "60vh" }}>
        <Typography variant="h3" fontWeight="900" mb={4} sx={{ fontFamily: "'Poppins', sans-serif" }}>
          {t("myOrders", language) || "My Orders"}
        </Typography>

        {mockOrders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" fontWeight="700" gutterBottom>
              You haven't placed any orders yet.
            </Typography>
            <Button variant="contained" component={Link} to="/shop" sx={{ mt: 2, borderRadius: "50px" }}>
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Stack spacing={4}>
            {mockOrders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                    mb={3}
                    pb={3}
                    borderBottom="1px solid"
                    borderColor="divider"
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Order Placed: {order.date}
                      </Typography>
                      <Typography variant="h6" fontWeight="800">
                        {order.id}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="h6" fontWeight="800" color="#E23744">
                          {formatPrice(order.total, currency)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={order.status === "Processing" ? <LocalShippingIcon /> : <CheckCircleIcon />}
                        label={order.status}
                        color={order.status === "Processing" ? "warning" : "success"}
                        sx={{ fontWeight: "700" }}
                      />
                    </Stack>
                  </Stack>

                  <Grid container spacing={3}>
                    {order.items.map((item, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: "12px",
                              bgcolor: "background.default",
                            }}
                          />
                          <Box>
                            <Typography variant="body1" fontWeight="700">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.qty}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                              {formatPrice(item.price, currency)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </MainLayout>
  );
}

export default Orders;
