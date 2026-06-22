import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slider,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import AdminLayout from "../../layouts/AdminLayout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import toast from "react-hot-toast";

function Relationships() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);

  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Seed some mock relationships dynamically for the editor UI
      const mockRels = [
        { id: "rel-1", parent: "Laptop", child: "Wireless Mouse", score: 95 },
        { id: "rel-2", parent: "Laptop", child: "Mechanical Keyboard", score: 85 },
        { id: "rel-3", parent: "Laptop", child: "Laptop Bag", score: 75 },
        { id: "rel-4", parent: "Laptop", child: "Laptop Charger", score: 60 },
        { id: "rel-5", parent: "Webcam Pro", child: "USB Hub", score: 82 },
      ];
      setRelationships(mockRels);
    }
  }, [products]);

  const handleScoreChange = (id, newValue) => {
    setRelationships((prev) =>
      prev.map((rel) => (rel.id === id ? { ...rel, score: newValue } : rel))
    );
  };

  const handleSave = () => {
    toast.success("Product relationships updated successfully!");
  };

  return (
    <AdminLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              Product Relationships
            </Typography>
            <Typography color="text.secondary" mt={0.5}>
              Configure cross-sell affinity scores. (40% weight in recommendation engine logic)
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<AutoAwesomeIcon />}
            sx={{ bgcolor: "#E23744", "&:hover": { bgcolor: "#b82531" } }}
          >
            Save Affinity Rules
          </Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB" }} elevation={0}>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell><strong>Parent Product</strong></TableCell>
                <TableCell><strong>Companion Suggestion</strong></TableCell>
                <TableCell sx={{ width: "40%" }}><strong>Relationship Score (Aaffinity)</strong></TableCell>
                <TableCell align="right"><strong>Strength</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relationships.map((rel) => (
                <TableRow key={rel.id}>
                  <TableCell fontWeight="600">{rel.parent}</TableCell>
                  <TableCell>{rel.child}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Slider
                        value={rel.score}
                        onChange={(e, val) => handleScoreChange(rel.id, val)}
                        min={0}
                        max={100}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="body2" fontWeight="700" sx={{ minWidth: 28 }}>
                        {rel.score}%
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" fontWeight="600" sx={{ color: rel.score > 80 ? "#16A34A" : rel.score > 50 ? "#FFB300" : "#6B7280" }}>
                    {rel.score > 80 ? "Very Strong" : rel.score > 50 ? "Moderate" : "Weak"}
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

export default Relationships;
