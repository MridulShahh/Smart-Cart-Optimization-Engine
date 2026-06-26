import {
  Container,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilters } from "../../redux/slices/productSlice";

const categories = [
  {
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
    count: "5 Products",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    count: "9 Products",
  },
  {
    name: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
    count: "2 Products",
  },
];

function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (name) => {
    dispatch(setFilters({ category: name }));
    navigate("/shop");
  };

  return (
    <Container sx={{ mt: 10, mb: 10 }}>
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight="900"
          gutterBottom
          sx={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}
        >
          Curated Tech Collections
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore top performance hardware curated for high-velocity workflows.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {categories.map((cat) => (
          <Grid
            xs={12}
            sm={4}
            key={cat.name}
          >
            <Box
              onClick={() => handleCategoryClick(cat.name)}
              sx={{
                position: "relative",
                height: 240,
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #E5E7EB",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(226, 55, 68, 0.12)",
                  borderColor: "#E23744",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 60%, rgba(0,0,0,0) 100%)",
                  zIndex: 1,
                  transition: "all 0.3s ease-in-out",
                },
                "&:hover::before": {
                  background: "linear-gradient(to top, rgba(226, 55, 68, 0.8) 0%, rgba(15, 23, 42, 0.15) 60%, rgba(0,0,0,0) 100%)",
                }
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={cat.image}
                alt={cat.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.08)",
                  }
                }}
              />

              {/* Text overlays */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  p: 3,
                  zIndex: 2,
                  color: "white"
                }}
              >
                <Typography variant="h5" fontWeight="900" sx={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.01em" }}>
                  {cat.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#FFB300", fontWeight: 800, textTransform: "uppercase", mt: 0.5, display: "block" }}>
                  {cat.count}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Categories;