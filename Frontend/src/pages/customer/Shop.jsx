import { useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
  Rating,
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilters, clearFilters } from "../../redux/slices/productSlice";
import ProductCard from "../../components/product/ProductCard";

function Shop() {
  const dispatch = useDispatch();
  const { items: products, filters, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handlePriceChange = (event, newValue) => {
    dispatch(setFilters({ priceRange: newValue }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleRatingChange = (e) => {
    dispatch(setFilters({ rating: Number(e.target.value) }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sortBy: e.target.value }));
  };

  // Client side filtering & sorting for instant speed
  const filteredProducts = products
    .filter((product) => {
      // Search check
      const nameMatch = (product.productName || product.name || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      
      // Category check
      const categoryMatch = !filters.category || product.category === filters.category;

      // Price check
      const priceMatch =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      // Rating check
      const ratingMatch = (product.rating || 0) >= filters.rating;

      return nameMatch && categoryMatch && priceMatch && ratingMatch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.price - b.price;
      if (filters.sortBy === "price_desc") return b.price - a.price;
      if (filters.sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (b.popularity || 0) - (a.popularity || 0); // default is popularity
    });

  return (
    <MainLayout>
      <Container sx={{ mt: 5, mb: 10 }}>
        <Typography
          variant="h3"
          fontWeight="900"
          mb={4}
          sx={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Tech Catalog
        </Typography>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="700">
                    Filters
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => dispatch(clearFilters())}
                    sx={{ textTransform: "none", color: "#E23744", fontWeight: 600 }}
                  >
                    Clear All
                  </Button>
                </Stack>

                {/* Categories */}
                <FormControl component="fieldset" sx={{ mb: 4, width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1.5, color: "#111827" }}>
                    Category
                  </FormLabel>
                  <RadioGroup value={filters.category} onChange={handleCategoryChange}>
                    <FormControlLabel value="" control={<Radio />} label="All Categories" />
                    <FormControlLabel value="Laptops" control={<Radio />} label="Laptops" />
                    <FormControlLabel value="Accessories" control={<Radio />} label="Accessories" />
                    <FormControlLabel value="Audio" control={<Radio />} label="Audio" />
                  </RadioGroup>
                </FormControl>

                {/* Price Slider */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight="700" mb={1.5}>
                    Price Range
                  </Typography>
                  <Slider
                    value={filters.priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={60000}
                    step={500}
                    color="primary"
                  />
                  <Stack direction="row" justifyContent="space-between" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      ₹{filters.priceRange[0].toLocaleString("en-IN")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{filters.priceRange[1].toLocaleString("en-IN")}
                    </Typography>
                  </Stack>
                </Box>

                {/* Rating */}
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1.5, color: "#111827" }}>
                    Minimum Rating
                  </FormLabel>
                  <RadioGroup value={filters.rating.toString()} onChange={handleRatingChange}>
                    <FormControlLabel value="0" control={<Radio />} label="Show All" />
                    <FormControlLabel value="4.5" control={<Radio />} label="4.5 ★ & above" />
                    <FormControlLabel value="4" control={<Radio />} label="4.0 ★ & above" />
                    <FormControlLabel value="3" control={<Radio />} label="3.0 ★ & above" />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Listing */}
          <Grid item xs={12} md={9}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
              mb={4}
            >
              <Typography color="text.secondary" fontWeight="500">
                Showing {filteredProducts.length} results
                {filters.search && ` for "${filters.search}"`}
              </Typography>

              {/* Sorting */}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                  sx={{ borderRadius: "50px" }}
                >
                  <MenuItem value="popularity">Popularity</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Empty state */}
            {filteredProducts.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  No Products Found
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  We couldn't find any products matching your filters. Try resetting them.
                </Typography>
                <Button variant="contained" onClick={() => dispatch(clearFilters())} sx={{ borderRadius: "50px" }}>
                  Reset Filters
                </Button>
              </Box>
            )}

            {/* Product Grid */}
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default Shop;