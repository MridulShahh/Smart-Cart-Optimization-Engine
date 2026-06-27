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
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import api from "../../services/api";
import { useState, useEffect } from "react";

const dataAcceptance = [
  { name: "Wireless Mouse", rate: 64 },
  { name: "Laptop Bag", rate: 42 },
  { name: "Keyboard", rate: 28 },
  { name: "Charger", rate: 15 },
  { name: "Mouse Pad", rate: 48 },
];

const dataGrowth = [
  { month: "Jan", users: 10, sales: 5 },
  { month: "Feb", users: 25, sales: 12 },
  { month: "Mar", users: 50, sales: 24 },
  { month: "Apr", users: 80, sales: 38 },
  { month: "May", users: 110, sales: 50 },
  { month: "Jun", users: 148, sales: 78 },
];

const topRecs = [
  { product: "Wireless Mouse", recommended: 154, accepted: 98, rate: "64%" },
  { product: "Laptop Bag", recommended: 112, accepted: 47, rate: "42%" },
  { product: "Mechanical Keyboard", recommended: 85, accepted: 24, rate: "28%" },
  { product: "Gaming Mouse Pad", recommended: 54, accepted: 26, rate: "48%" },
];

function Analytics() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/analytics/dashboard");
        if (res?.success) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Container sx={{ mt: 5, mb: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </AdminLayout>
    );
  }

  // Fallback data for charts (can be made dynamic later)
  const dataAcceptance = statsData?.mostAccepted?.map(item => ({
    name: item.product.productName || item.product.name,
    rate: item.count
  })) || [];

  const topRecs = statsData?.topRecommended?.map(item => {
    const acceptedCount = statsData.mostAccepted?.find(a => a.product._id === item.product._id)?.count || 0;
    const rate = item.count > 0 ? ((acceptedCount / item.count) * 100).toFixed(0) + "%" : "0%";
    return {
      product: item.product.productName || item.product.name,
      recommended: item.count,
      accepted: acceptedCount,
      rate
    };
  }) || [];

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
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  Acceptance Rate
                </Typography>
                <Typography variant="h4" fontWeight="850" mt={1} color="#E23744">
                  44.5%
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  +4.2% since last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  Additional Revenue Generated
                </Typography>
                <Typography variant="h4" fontWeight="850" mt={1} color="#16A34A">
                  ₹24,800
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  31.8% of total e-commerce sales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  AI Assistant Chat Queries
                </Typography>
                <Typography variant="h4" fontWeight="850" mt={1} color="#FFB300">
                  184
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Gemini API response time: ~1.2s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recharts section */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Acceptance Rate per Accessory (%)
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={dataAcceptance}>
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                    <YAxis stroke="#9CA3AF" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#E23744" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Sales Growth vs User Growth
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={dataGrowth}>
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#FFB300" strokeWidth={3} name="Total Users" />
                    <Line type="monotone" dataKey="sales" stroke="#E23744" strokeWidth={3} name="Total Sales (k)" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Detail table */}
        <Typography variant="h6" fontWeight="700" mb={3}>
          Acceptance Details
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB" }} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell><strong>Suggested Product</strong></TableCell>
                <TableCell><strong>Times Recommended</strong></TableCell>
                <TableCell><strong>Times Accepted</strong></TableCell>
                <TableCell align="right"><strong>Acceptance Rate</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topRecs.map((rec, idx) => (
                <TableRow key={idx}>
                  <TableCell fontWeight="600">{rec.product}</TableCell>
                  <TableCell>{rec.recommended}</TableCell>
                  <TableCell>{rec.accepted}</TableCell>
                  <TableCell align="right" fontWeight="600" color="#16A34A">
                    {rec.rate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AdminLayout>
  );
}

export default Analytics;
