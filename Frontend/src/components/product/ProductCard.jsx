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
import { keyframes } from "@mui/system";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

function ProductCard({ product, index = 0 }) {
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
    toast.success(`${product.productName || product.name} added to cart! 🛒`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const getPopBadge = () => {
    if (product.popularity > 88) return <Chip label="Best Seller" size="small" sx={{ bgcolor: "rgba(255, 179, 0, 0.9)", color: "#111827", fontWeight: 800, borderRadius: "8px", backdropFilter: "blur(4px)", boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)" }} />;
    if (product.rating > 4.6) return <Chip label="Top Rated" size="small" sx={{ bgcolor: "rgba(226, 55, 68, 0.9)", color: "white", fontWeight: 800, borderRadius: "8px", backdropFilter: "blur(4px)", boxShadow: "0 4px 12px rgba(226, 55, 68, 0.3)" }} />;
    return null;
  };

  return (
    <Box sx={{
      perspective: "1000px",
      height: "100%",
      animation: `${fadeInUp} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`,
      animationDelay: `${index * 0.1}s`
    }}>
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.8)",
          background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,1)",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          "&:hover": {
            transform: "translateY(-12px) rotateX(4deg)",
            boxShadow: "0 25px 50px rgba(17, 24, 39, 0.12), inset 0 1px 0 rgba(255,255,255,1)",
            borderColor: "rgba(229, 231, 235, 0.8)",
            "& .product-image": {
              transform: "scale(1.1) translateY(-5px)",
            },
            "& .add-btn": {
              background: "linear-gradient(135deg, #E23744 0%, #B91C1C 100%)",
              color: "white",
              transform: "scale(1.02)",
              boxShadow: "0 8px 20px rgba(226, 55, 68, 0.3)",
            }
          },
        }}
      >
        {/* Badges */}
        <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          {getPopBadge()}
        </Box>

        {/* Media Link */}
        <Box component={Link} to={`/product/${product._id}`} sx={{ 
          display: "block", 
          overflow: "hidden", 
          background: "radial-gradient(circle at center, #ffffff 0%, #f3f4f6 100%)",
          pt: 4, 
          pb: 2
        }}>
          <CardMedia
            className="product-image"
            component="img"
            height="220"
            image={product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80"}
            alt={product.productName || product.name}
            sx={{
              objectFit: "contain",
              p: 2,
              filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.1))",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </Box>

        <CardContent sx={{ 
          p: 3, 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="800"
              sx={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}
            >
              {product.brand}
            </Typography>

            <Typography
              variant="h6"
              component={Link}
              to={`/product/${product._id}`}
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                lineHeight: 1.3,
                mb: 1.5,
                mt: 0.5,
                textDecoration: "none",
                color: "#111827",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "2.6em",
                transition: "color 0.2s",
                "&:hover": { color: "#E23744" }
              }}
            >
              {product.productName || product.name}
            </Typography>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Rating value={product.rating || 4.5} precision={0.1} readOnly size="small" sx={{ color: "#FFB300" }} />
              <Typography variant="body2" color="text.secondary" fontWeight="700">
                {product.rating || 4.5}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography
              color="#111827"
              variant="h5"
              fontWeight="900"
              sx={{ mb: 2.5, letterSpacing: "-0.02em" }}
            >
              ₹{(product.price || 0).toLocaleString("en-IN")}
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                className="add-btn"
                fullWidth
                variant="contained"
                onClick={handleAddToCart}
                startIcon={<ShoppingBagIcon />}
                sx={{
                  bgcolor: "#111827",
                  color: "white",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "14px",
                  py: 1.2,
                  fontSize: "0.95rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 12px rgba(17,24,39,0.15)",
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={`/product/${product._id}`}
                sx={{
                  borderColor: "rgba(229, 231, 235, 1)",
                  color: "#4B5563",
                  borderRadius: "14px",
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: "#111827", bgcolor: "#111827", color: "white" },
                  minWidth: "auto",
                  px: 2,
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProductCard;