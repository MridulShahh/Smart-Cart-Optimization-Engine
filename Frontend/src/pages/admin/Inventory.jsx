import { Container, Typography, Box, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminLayout from "../../layouts/AdminLayout";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";

function Inventory() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDark = theme.palette.mode === "dark";
  const { items: products, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "SKU / ID", width: 220, valueGetter: (value, row) => row._id },
    { 
      field: "productName", 
      headerName: "Product Name", 
      flex: 1, 
      valueGetter: (value, row) => row.productName || row.name,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">{params.value}</Typography>
      )
    },
    { 
      field: "stock", 
      headerName: "Available Stock", 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="800" color={params.value < 10 ? "error.main" : "text.primary"}>
          {params.value} units
        </Typography>
      )
    },
    {
      field: "status",
      headerName: "Inventory Status",
      width: 150,
      renderCell: (params) => {
        const stock = params.row.stock;
        let color = "success";
        let label = "In Stock";
        if (stock === 0) { color = "error"; label = "Out of Stock"; }
        else if (stock < 10) { color = "warning"; label = "Low Stock"; }
        
        return <Chip label={label} size="small" color={color} sx={{ fontWeight: 600 }} />;
      }
    },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 10 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Monitor and adjust stock levels across your catalog.
          </Typography>
        </Box>

        <Box sx={{ height: "70vh", width: "100%", bgcolor: isDark ? "#1F2937" : "#FFFFFF", borderRadius: "16px", p: 1, border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            loading={status === "loading"}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 15 } },
            }}
            pageSizeOptions={[15, 25, 50]}
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

export default Inventory;
