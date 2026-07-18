import { Container, Typography, Box, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminLayout from "../../layouts/AdminLayout";
import { useTheme } from "@mui/material/styles";

function Orders() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const orders = [
    { id: "ORD-3142", customer: "Sophia Sterling", total: 56200, status: "Processing", date: "2023-10-24" },
    { id: "ORD-3141", customer: "Rahul Sharma", total: 12400, status: "Shipped", date: "2023-10-24" },
    { id: "ORD-3140", customer: "Emily Chen", total: 4100, status: "Delivered", date: "2023-10-23" },
    { id: "ORD-3139", customer: "Michael Ross", total: 89000, status: "Processing", date: "2023-10-22" },
    { id: "ORD-3138", customer: "Aisha Khan", total: 1500, status: "Cancelled", date: "2023-10-21" },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", width: 130 },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "date", headerName: "Date", width: 130 },
    {
      field: "total",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">₹{params.value.toLocaleString("en-IN")}</Typography>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "Processing") color = "warning";
        if (params.value === "Shipped") color = "info";
        if (params.value === "Delivered") color = "success";
        if (params.value === "Cancelled") color = "error";
        
        return <Chip label={params.value} size="small" color={color} sx={{ fontWeight: 600 }} />;
      }
    },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 10 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Orders
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage and fulfill customer orders.
          </Typography>
        </Box>

        <Box sx={{ height: "70vh", width: "100%", bgcolor: isDark ? "#1F2937" : "#FFFFFF", borderRadius: "16px", p: 1, border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
          <DataGrid
            rows={orders}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 15 } },
            }}
            pageSizeOptions={[15, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": { borderBottom: `1px solid ${isDark ? "#374151" : "#F3F4F6"}` },
              "& .MuiDataGrid-columnHeaders": { bgcolor: isDark ? "#111827" : "#F9FAFB", borderBottom: "none" },
            }}
          />
        </Box>
      </Container>
    </AdminLayout>
  );
}

export default Orders;
