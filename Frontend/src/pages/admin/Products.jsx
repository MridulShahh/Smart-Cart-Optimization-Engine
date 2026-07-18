import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  TextField,
  Stack,
  useTheme,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProductLocal, updateProductLocal, deleteProductLocal } from "../../redux/slices/productSlice";
import AdminLayout from "../../layouts/AdminLayout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import api from "../../services/api";
import toast from "react-hot-toast";

function Products() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { items: products, status } = useSelector((state) => state.products);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    productName: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        productName: product.productName || product.name,
        name: product.productName || product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description || "",
      });
    } else {
      setEditingProduct(null);
      setForm({
        productName: "",
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        image: "",
        description: "",
      });
    }
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value, name: e.target.name === "productName" ? e.target.value : form.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form);
        toast.success("Product updated successfully!");
        dispatch(fetchProducts());
      } else {
        await api.post("/products", form);
        toast.success("Product created successfully!");
        dispatch(fetchProducts());
      }
      handleClose();
    } catch (error) {
      // Mock Fallback for Demo Mode (when Vercel backend is missing)
      if (editingProduct) {
        dispatch(updateProductLocal({ ...form, _id: editingProduct._id }));
        toast.success("Product updated locally (Demo Mode)!");
      } else {
        dispatch(addProductLocal({ ...form, _id: `demo-${Date.now()}` }));
        toast.success("Product created locally (Demo Mode)!");
      }
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully!");
        dispatch(fetchProducts());
      } catch (error) {
        // Mock Fallback for Demo Mode
        dispatch(deleteProductLocal(id));
        toast.success("Product deleted locally (Demo Mode)!");
      }
    }
  };

  // DataGrid Columns Definition
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 70,
      renderCell: (params) => (
        <Avatar src={params.value} variant="rounded" sx={{ width: 40, height: 40, bgcolor: isDark ? "#374151" : "#F3F4F6", img: { objectFit: "contain", p: 0.5 } }} />
      ),
      sortable: false,
      filterable: false,
    },
    { 
      field: "productName", 
      headerName: "Product Name", 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => row.productName || row.name,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">{params.value}</Typography>
      )
    },
    { field: "category", headerName: "Category", width: 130 },
    { field: "brand", headerName: "Brand", width: 120 },
    { 
      field: "price", 
      headerName: "Price", 
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600">₹{(params.value || 0).toLocaleString("en-IN")}</Typography>
      )
    },
    {
      field: "stock",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const stock = params.value;
        let color = "success";
        let label = "In Stock";
        if (stock === 0) { color = "error"; label = "Out of Stock"; }
        else if (stock < 10) { color = "warning"; label = "Low Stock"; }
        
        return <Chip label={label} size="small" color={color} sx={{ fontWeight: 600, height: 24, fontSize: "0.75rem" }} />;
      }
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon sx={{ color: "#3B82F6" }}/>} label="Edit" onClick={() => handleOpen(params.row)} />,
        <GridActionsCellItem icon={<DeleteIcon sx={{ color: "#EF4444" }}/>} label="Delete" onClick={() => handleDelete(params.row._id)} />,
      ],
    },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              Products
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Manage your entire product catalog, pricing, and stock.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ bgcolor: "#E23744", fontWeight: 600, borderRadius: "8px", "&:hover": { bgcolor: "#b82531" } }}
          >
            Add Product
          </Button>
        </Stack>

        <Box sx={{ height: "70vh", width: "100%", bgcolor: isDark ? "#1F2937" : "#FFFFFF", borderRadius: "16px", p: 1, border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            loading={status === "loading"}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
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
              "& .MuiDataGrid-toolbarContainer": { p: 2, pb: 1 },
            }}
          />
        </Box>

        {/* Drawer for Add/Edit Form */}
        <Drawer anchor="right" open={drawerOpen} onClose={handleClose} PaperProps={{ sx: { width: { xs: "100%", sm: 500 }, bgcolor: isDark ? "#111827" : "#FFFFFF" } }}>
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }}>
            <Typography variant="h6" fontWeight="800">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Typography>
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, overflowY: "auto", height: "calc(100% - 140px)" }}>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box sx={{ width: 120, height: 120, borderRadius: "16px", border: `2px dashed ${isDark ? "#374151" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", bgcolor: isDark ? "#1F2937" : "#F9FAFB" }}>
                  {form.image ? (
                    <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <PhotoCameraIcon sx={{ fontSize: "2.5rem", color: isDark ? "#4B5563" : "#9CA3AF" }} />
                  )}
                </Box>
              </Box>

              <TextField name="productName" label="Product Name" value={form.productName} onChange={handleInputChange} fullWidth required />
              
              <Stack direction="row" spacing={2}>
                <TextField name="brand" label="Brand" value={form.brand} onChange={handleInputChange} fullWidth required />
                <TextField name="category" label="Category" value={form.category} onChange={handleInputChange} fullWidth required />
              </Stack>
              
              <Stack direction="row" spacing={2}>
                <TextField name="price" label="Price (INR)" type="number" value={form.price} onChange={handleInputChange} fullWidth required />
                <TextField name="stock" label="Stock Count" type="number" value={form.stock} onChange={handleInputChange} fullWidth required />
              </Stack>
              
              <TextField name="image" label="Image URL" value={form.image} onChange={handleInputChange} fullWidth required helperText="Provide a direct URL to the product image." />
              
              <TextField name="description" label="Description" value={form.description} onChange={handleInputChange} multiline rows={4} fullWidth />
            </Stack>
          </Box>

          <Box sx={{ p: 3, borderTop: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`, display: "flex", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" fullWidth sx={{ borderRadius: "8px", fontWeight: 600 }}>Cancel</Button>
            <Button type="submit" variant="contained" fullWidth onClick={handleSubmit} sx={{ bgcolor: "#E23744", borderRadius: "8px", fontWeight: 600 }}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </Box>
        </Drawer>
      </Container>
    </AdminLayout>
  );
}

export default Products;
