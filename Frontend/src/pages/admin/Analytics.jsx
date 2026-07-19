import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import api from "../../services/api";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/recommendations");
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  const {
    mostRecommended = [],
    mostAccepted = [],
    totalRecommendationRevenue = 0,
    totalRecommendedItemsSold = 0,
    acceptanceRate = 0,
    acceptanceByProduct = [],
    revenueByProduct = [],
    historyByMonth = [],
  } = data || {};

  // Build chart data for acceptance bar chart
  const barChartData = acceptanceByProduct.slice(0, 6).map((p) => ({
    name: p.name?.length > 15 ? p.name.substring(0, 15) + "…" : p.name,
    rate: p.rate,
  }));

  // Build chart data for history line chart
  const lineChartData = historyByMonth.map((h) => ({
    month: h._id,
    recommendations: h.total,
    accepted: h.accepted,
  }));

  // Detail table (merge most recommended data)
  const tableData = mostRecommended.map((p) => ({
    product: p.productName || p.name,
    recommended: p.recommendationCount || 0,
    accepted: p.recommendationAcceptances || 0,
    rate: p.recommendationCount > 0
      ? Math.round((p.recommendationAcceptances / p.recommendationCount) * 100) + "%"
      : "0%",
  }));

  return (
    <AdminLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={4}>
          <AutoAwesomeIcon sx={{ color: "#E23744", fontSize: "2.2rem" }} />
          <Typography variant="h3" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Recommendation Analytics
          </Typography>
        </Stack>

        {/* Overview cards */}
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <ThumbUpIcon sx={{ color: "#E23744", fontSize: "1.2rem" }} />
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    Acceptance Rate
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="850" mt={1} color="#E23744">
                  {acceptanceRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Of all recommendations shown
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <AttachMoneyIcon sx={{ color: "#16A34A", fontSize: "1.2rem" }} />
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    Additional Revenue Generated
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="850" mt={1} color="#16A34A">
                  ₹{totalRecommendationRevenue.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  {totalRecommendedItemsSold} items sold via recommendations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <TrendingUpIcon sx={{ color: "#FFB300", fontSize: "1.2rem" }} />
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    Total Recommendations Shown
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="850" mt={1} color="#FFB300">
                  {mostRecommended.reduce((sum, p) => sum + (p.recommendationCount || 0), 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Across {mostRecommended.length} products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts section */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Acceptance Rate per Product (%)
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                {barChartData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                      <YAxis stroke="#9CA3AF" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#E23744" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <Typography color="text.secondary">No acceptance data yet</Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Recommendation Trends (Monthly)
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                {lineChartData.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={lineChartData}>
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="recommendations" stroke="#FFB300" strokeWidth={3} name="Shown" />
                      <Line type="monotone" dataKey="accepted" stroke="#E23744" strokeWidth={3} name="Accepted" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <Typography color="text.secondary">No monthly trend data yet</Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Most Recommended Products */}
        <Typography variant="h6" fontWeight="700" mb={3}>
          Most Recommended Products
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", mb: 5 }} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell align="center"><strong>Times Recommended</strong></TableCell>
                <TableCell align="center"><strong>Times Accepted</strong></TableCell>
                <TableCell align="right"><strong>Acceptance Rate</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length > 0 ? tableData.map((rec, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Typography fontWeight="600">{rec.product}</Typography>
                  </TableCell>
                  <TableCell align="center">{rec.recommended}</TableCell>
                  <TableCell align="center">{rec.accepted}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="600" color="#16A34A">{rec.rate}</Typography>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" py={3}>No recommendation data yet. Recommendations will appear here as customers use the system.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Revenue by Recommended Product */}
        {revenueByProduct.length > 0 && (
          <>
            <Typography variant="h6" fontWeight="700" mb={3}>
              Revenue from Recommended Products
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB" }} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                  <TableRow>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell align="center"><strong>Units Sold</strong></TableCell>
                    <TableCell align="right"><strong>Revenue</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByProduct.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Typography fontWeight="600">{item.productName}</Typography></TableCell>
                      <TableCell align="center">{item.unitsSold}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="700" color="#16A34A">₹{item.revenue.toLocaleString("en-IN")}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </AdminLayout>
  );
}

export default Analytics;
