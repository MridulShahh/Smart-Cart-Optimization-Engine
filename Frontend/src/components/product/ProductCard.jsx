import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Rating,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addLocalItem } from "../../redux/slices/cartSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      dispatch(addToCart({ userId: user.id, productId: product._id, quantity: 1 }));
    } else {
      dispatch(addLocalItem({ productId: product._id, quantity: 1, product }));
    }
    toast.success(`${product.productName || product.name} added to cart! 🛒`);
  };

  const getPopBadge = () => {
    if (product.popularity > 88) return <Chip label="Best Seller" size="small" sx={{ bgcolor: "#FFB300", color: "#111827", fontWeight: 700, borderRadius: "6px" }} />;
    if (product.rating > 4.6) return <Chip label="Top Rated" size="small" sx={{ bgcolor: "#E23744", color: "white", fontWeight: 700, borderRadius: "6px" }} />;
    return null;
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #F3F4F6",
        bgcolor: "white",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 30px rgba(17, 24, 39, 0.08)",
          borderColor: "#E5E7EB",
        },
      }}
    >
      {/* Badges */}
      <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
        {getPopBadge()}
      </Box>

      {/* Media Link */}
      <Box component={Link} to={`/product/${product._id}`} sx={{ display: "block", overflow: "hidden", bgcolor: "#FAFAFA" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80"}
          alt={product.productName || product.name}
          sx={{
            objectFit: "contain",
            p: 2,
            transition: "transform 0.5s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="700"
            sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            {product.brand}
          </Typography>

          <Typography
            variant="h6"
            component={Link}
            to={`/product/${product._id}`}
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              lineHeight: 1.3,
              mb: 1,
              mt: 0.5,
              textDecoration: "none",
              color: "#111827",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: "2.6em",
              "&:hover": { color: "#E23744" }
            }}
          >
            {product.productName || product.name}
          </Typography>

          {/* Rating */}
          <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
            <Rating value={product.rating || 4.5} precision={0.1} readOnly size="small" sx={{ color: "#FFB300" }} />
            <Typography variant="body2" color="text.secondary" fontWeight="600">
              {product.rating || 4.5}
            </Typography>
          </Stack>
        </Box>

        <Box>
          <Typography
            color="#E23744"
            variant="h6"
            fontWeight="800"
            sx={{ mb: 2 }}
          >
            ₹{(product.price || 0).toLocaleString("en-IN")}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddToCart}
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: "#111827",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "50px",
                py: 1,
                fontSize: "0.85rem",
                "&:hover": { bgcolor: "#E23744" },
              }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to={`/product/${product._id}`}
              sx={{
                borderColor: "#E5E7EB",
                color: "#4B5563",
                borderRadius: "50px",
                "&:hover": { borderColor: "#111827", bgcolor: "#F9FAFB" },
                minWidth: "auto",
                px: 2,
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: "1.1rem" }} />
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;