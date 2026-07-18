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
  useTheme,
  IconButton,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";

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
  { name: "Accessories", value: 18000, color: "#F59E0B" },
  { name: "Audio", value: 5000, color: "#10B981" },
];

function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const stats = [
    { title: "Total Revenue", value: "₹78,000", increase: "+14%", icon: <AttachMoneyIcon sx={{ fontSize: "1.8rem" }}/>, color: "#E23744" },
    { title: "Total Users", value: "148", increase: "+5%", icon: <PeopleIcon sx={{ fontSize: "1.8rem" }}/>, color: "#F59E0B" },
    { title: "Orders Placed", value: "32", increase: "+12%", icon: <ShoppingBagIcon sx={{ fontSize: "1.8rem" }}/>, color: "#10B981" },
    { title: "Conversion Rate", value: "4.2%", increase: "+1.1%", icon: <TrendingUpIcon sx={{ fontSize: "1.8rem" }}/>, color: "#3B82F6" },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 10 }}>
        {/* Header Section */}
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} mb={4} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Welcome back, Admin. Here's what's happening with your store today.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" component={Link} to="/admin/analytics" sx={{ borderRadius: "8px", fontWeight: 600 }}>
              Export Report
            </Button>
            <Button variant="contained" component={Link} to="/admin/products" startIcon={<AddIcon />} sx={{ bgcolor: "#E23744", borderRadius: "8px", fontWeight: 600 }}>
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* Top KPI Stats */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} sm={6} lg={3} key={idx}>
              <Card 
                sx={{ 
                  borderRadius: "16px", 
                  border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, 
                  boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  bgcolor: isDark ? "#1F2937" : "#FFFFFF",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": { transform: "translateY(-2px)", transition: "all 0.2s ease", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
                }}
              >
                <Box sx={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: `radial-gradient(circle, ${stat.color} 0%, rgba(255,255,255,0) 70%)`, opacity: 0.1, transform: "translate(30%, -30%)" }} />
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="800" mt={1} color={isDark ? "#F9FAFB" : "#111827"}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" fontWeight="600" color="#10B981" mt={1} display="flex" alignItems="center" gap={0.5}>
                        <TrendingUpIcon sx={{ fontSize: "1rem" }} /> {stat.increase} this month
                      </Typography>
                    </Box>
                    <Box sx={{ color: stat.color, bgcolor: isDark ? "rgba(0,0,0,0.2)" : `${stat.color}15`, p: 1.5, borderRadius: "12px", display: "flex" }}>
                      {stat.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: "16px", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, boxShadow: "none", p: 3, bgcolor: isDark ? "#1F2937" : "#FFFFFF" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="700">
                  Revenue Trends
                </Typography>
                <Button size="small" variant="text" sx={{ color: "text.secondary", fontWeight: 600 }}>This Year</Button>
              </Stack>
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={dataSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E23744" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E23744" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", backgroundColor: isDark ? "#111827" : "#FFFFFF" }}
                      itemStyle={{ color: isDark ? "#F9FAFB" : "#111827", fontWeight: "bold" }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#E23744" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: "16px", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, boxShadow: "none", p: 3, height: "100%", bgcolor: isDark ? "#1F2937" : "#FFFFFF" }}>
              <Typography variant="h6" fontWeight="700" mb={3}>
                Sales by Category
              </Typography>
              <Box sx={{ width: "100%", height: 220, display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#8884d8" paddingAngle={5} stroke="none">
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={2} mt={3}>
                {dataPie.map((item, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography variant="body2" fontWeight="600">{item.name}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">₹{item.value.toLocaleString("en-IN")}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Section: Recent Orders & Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: "16px", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, boxShadow: "none", p: 0, bgcolor: isDark ? "#1F2937" : "#FFFFFF", overflow: "hidden" }}>
              <Box sx={{ p: 3, borderBottom: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="700">Recent Orders</Typography>
                <Button component={Link} to="/admin/orders" size="small" sx={{ fontWeight: 600 }}>View All</Button>
              </Box>
              <List disablePadding>
                {[
                  { id: "ORD-3142", customer: "Sophia Sterling", total: "₹56,200", status: "Processing", color: "#F59E0B", date: "Today, 14:32" },
                  { id: "ORD-3141", customer: "Rahul Sharma", total: "₹12,400", status: "Shipped", color: "#3B82F6", date: "Today, 11:15" },
                  { id: "ORD-3140", customer: "Emily Chen", total: "₹4,100", status: "Delivered", color: "#10B981", date: "Yesterday, 16:45" },
                ].map((order, idx, arr) => (
                  <Box key={order.id}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <Avatar sx={{ bgcolor: isDark ? "#374151" : "#F3F4F6", color: isDark ? "#F9FAFB" : "#4B5563", width: 40, height: 40, mr: 2, fontWeight: "bold" }}>
                        {order.customer.charAt(0)}
                      </Avatar>
                      <ListItemText 
                        primary={<Typography fontWeight="600" variant="body2">{order.customer}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{order.id} • {order.date}</Typography>} 
                      />
                      <Stack alignItems="flex-end">
                        <Typography fontWeight="700" variant="body2">{order.total}</Typography>
                        <Box sx={{ mt: 0.5, bgcolor: `${order.color}15`, color: order.color, px: 1, py: 0.25, borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>
                          {order.status}
                        </Box>
                      </Stack>
                    </ListItem>
                    {idx < arr.length - 1 && <Divider sx={{ borderColor: isDark ? "#374151" : "#F3F4F6" }} />}
                  </Box>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: "16px", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, boxShadow: "none", p: 3, bgcolor: isDark ? "#1F2937" : "#FFFFFF", height: "100%" }}>
              <Typography variant="h6" fontWeight="700" mb={3}>Quick Actions</Typography>
              <Stack spacing={2}>
                <Button component={Link} to="/admin/products" variant="outlined" startIcon={<InventoryIcon />} sx={{ justifyContent: "flex-start", py: 1.5, borderRadius: "8px", color: isDark ? "#F9FAFB" : "#111827", borderColor: isDark ? "#374151" : "#E5E7EB" }}>
                  Manage Inventory
                </Button>
                <Button component={Link} to="/admin/orders" variant="outlined" startIcon={<ShoppingBagIcon />} sx={{ justifyContent: "flex-start", py: 1.5, borderRadius: "8px", color: isDark ? "#F9FAFB" : "#111827", borderColor: isDark ? "#374151" : "#E5E7EB" }}>
                  Fulfill Orders
                </Button>
                <Button component={Link} to="/admin/customers" variant="outlined" startIcon={<PeopleIcon />} sx={{ justifyContent: "flex-start", py: 1.5, borderRadius: "8px", color: isDark ? "#F9FAFB" : "#111827", borderColor: isDark ? "#374151" : "#E5E7EB" }}>
                  View Customers
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}

export default Dashboard;
