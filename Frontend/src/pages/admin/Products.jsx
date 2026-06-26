import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import AdminLayout from "../../layouts/AdminLayout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";
import toast from "react-hot-toast";

function Products() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);

  const [open, setOpen] = useState(false);
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value, name: e.target.name === "productName" ? e.target.value : form.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Edit API call
        await api.put(`/products/${editingProduct._id}`, form);
        toast.success("Product updated successfully!");
      } else {
        // Create API call
        await api.post("/products", form);
        toast.success("Product created successfully!");
      }
      dispatch(fetchProducts());
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product removed from catalog");
        dispatch(fetchProducts());
      } catch (error) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  return (
    <AdminLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ bgcolor: "#E23744", "&:hover": { bgcolor: "#b82531" } }}
          >
            Add Product
          </Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB" }} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Brand</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={p.image}
                      sx={{ width: 40, height: 40, objectFit: "contain", bgcolor: "#FAFAFA", borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell fontWeight="600">{p.productName || p.name}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>₹{(p.price || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(p)} sx={{ color: "#3B82F6" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p._id)} sx={{ color: "#EF4444" }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog Form */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle fontWeight="bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} mt={1}>
                <TextField
                  name="productName"
                  label="Product Name"
                  value={form.productName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="brand"
                  label="Brand"
                  value={form.brand}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="category"
                  label="Category (e.g. Laptops, Accessories, Audio)"
                  value={form.category}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="price"
                    label="Price (INR)"
                    type="number"
                    value={form.price}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    name="stock"
                    label="Stock Count"
                    type="number"
                    value={form.stock}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Stack>
                <TextField
                  name="image"
                  label="Image URL"
                  value={form.image}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="description"
                  label="Description"
                  value={form.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: "#E23744" }}>
                Save Product
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}

export default Products;
