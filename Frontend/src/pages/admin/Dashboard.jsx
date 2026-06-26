import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const dataSales = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 19000 },
  { name: "Mar", sales: 32000 },
  { name: "Apr", sales: 48000 },
  { name: "May", sales: 55000 },
  { name: "Jun", sales: 78000 },
];

const dataPie = [
  { name: "Laptops", value: 55000, color: "#E23744" },
  { name: "Accessories", value: 18000, color: "#FFB300" },
  { name: "Audio", value: 5000, color: "#111827" },
];

function Dashboard() {
  const stats = [
    { title: "Total Revenue", value: "₹78,000", icon: <AttachMoneyIcon />, color: "#E23744" },
    { title: "Total Users", value: "148", icon: <PeopleIcon />, color: "#FFB300" },
    { title: "Orders Placed", value: "32", icon: <ShoppingBagIcon />, color: "#111827" },
    { title: "Recommendations", value: "512", icon: <AutoAwesomeIcon />, color: "#3B82F6" },
  ];

  return (
    <AdminLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Admin Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" component={Link} to="/admin/products" sx={{ bgcolor: "#111827" }}>
              Manage Products
            </Button>
            <Button variant="outlined" component={Link} to="/admin/analytics">
              View Analytics
            </Button>
          </Stack>
        </Stack>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={6}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="800" mt={1}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ color: "white", bgcolor: stat.color, p: 1.5, borderRadius: "12px", display: "flex" }}>
                      {stat.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Grid */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Revenue Trends (INR)
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={dataSales}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E23744" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#E23744" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#E23744" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Sales by Category
              </Typography>
              <Box sx={{ width: "100%", height: 200, display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8">
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1} mt={2}>
                {dataPie.map((item, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography variant="body2" fontWeight="600">{item.name}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">₹{item.value.toLocaleString("en-IN")}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders / Alerts */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Recent Orders
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Order #3142 — by Sophia Sterling" secondary="₹56,200 | Express Delivery | Paid" />
                  <Typography variant="body2" color="#16A34A" fontWeight="600">Dispatched</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Order #3141 — by Sophia Sterling" secondary="₹1,200 | Standard Delivery | COD" />
                  <Typography variant="body2" color="#FFB300" fontWeight="600">Pending</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Order #3140 — by Sophia Sterling" secondary="₹8,000 | Express Delivery | Paid" />
                  <Typography variant="body2" color="#16A34A" fontWeight="600">Delivered</Typography>
                </ListItem>
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none", p: 3 }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Recommendation Insights
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Wireless Mouse" secondary="Paired with Laptops. Acceptance rate: 64%" />
                  <Typography variant="body2" fontWeight="600">High Score</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Laptop Bag" secondary="Paired with Laptops. Acceptance rate: 42%" />
                  <Typography variant="body2" fontWeight="600">Medium Score</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Mechanical Keyboard" secondary="Paired with Laptops. Acceptance rate: 28%" />
                  <Typography variant="body2" fontWeight="600">Medium Score</Typography>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}

export default Dashboard;
