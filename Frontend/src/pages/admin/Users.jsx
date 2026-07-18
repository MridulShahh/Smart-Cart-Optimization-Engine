import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../services/api";
import toast from "react-hot-toast";

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingId(item._id);
    } else {
      setFormData({ name: "", description: "" });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
        toast.success("Updated successfully");
      } else {
        await api.post("/users", formData);
        toast.success("Created successfully");
      }
      fetchItems();
      handleClose();
    } catch (err) {
      toast.error(err.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (err) {
      toast.error(err.error || "Delete failed");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Manage Users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: "#E23744" }}>
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F8FAFC" }}>
              <TableCell>Name / Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name || item.title || item.code || item.fullName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit" : "Add"} User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Name / Title / Code" fullWidth
            value={formData.name || formData.title || formData.code || formData.fullName || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value, code: e.target.value, fullName: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#E23744" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
