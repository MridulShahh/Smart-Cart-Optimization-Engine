import { Container, Typography, Box, Avatar, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminLayout from "../../layouts/AdminLayout";
import { useTheme } from "@mui/material/styles";

function Customers() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const customers = [
    { id: "CUST-001", name: "Sophia Sterling", email: "sophia.s@example.com", spent: 120500, status: "Active" },
    { id: "CUST-002", name: "Rahul Sharma", email: "rahul.sharma@example.com", spent: 45000, status: "Active" },
    { id: "CUST-003", name: "Emily Chen", email: "emily.chen@example.com", spent: 8200, status: "Inactive" },
    { id: "CUST-004", name: "Michael Ross", email: "mross@example.com", spent: 210000, status: "Active" },
    { id: "CUST-005", name: "Aisha Khan", email: "aisha.k@example.com", spent: 1500, status: "Blocked" },
  ];

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32, bgcolor: isDark ? "#374151" : "#F3F4F6", color: isDark ? "#F9FAFB" : "#4B5563", fontSize: "0.85rem", fontWeight: "bold" }}>
          {params.row.name.charAt(0)}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    { field: "name", headerName: "Customer Name", flex: 1 },
    { field: "email", headerName: "Email Address", flex: 1 },
    {
      field: "spent",
      headerName: "Total Spent",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">₹{params.value.toLocaleString("en-IN")}</Typography>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        let color = "success";
        if (params.value === "Inactive") color = "default";
        if (params.value === "Blocked") color = "error";
        
        return <Chip label={params.value} size="small" color={color} sx={{ fontWeight: 600 }} />;
      }
    },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 10 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Customers
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            View and manage your registered users.
          </Typography>
        </Box>

        <Box sx={{ height: "70vh", width: "100%", bgcolor: isDark ? "#1F2937" : "#FFFFFF", borderRadius: "16px", p: 1, border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
          <DataGrid
            rows={customers}
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

export default Customers;
