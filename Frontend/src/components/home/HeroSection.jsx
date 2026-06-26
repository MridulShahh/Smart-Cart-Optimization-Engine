import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const slides = [
  {
    title: "Premium Laptops & Workstations",
    subtitle: "UP TO 20% OFF ON HIGH-PERFORMANCE GEAR",
    description: "Upgrade your productivity with next-gen Dell laptops, high-speed SSDs, and premium IPS monitors built for creators and developers.",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1920&q=90",
    link: "/shop?category=Laptops",
  },
  {
    title: "Ultimate Gaming Accessories",
    subtitle: "TACTILE & PRECISION PERIPHERALS",
    description: "Gain the competitive edge with Keychron mechanical keyboards, Razer gaming mice, and extended mouse pads designed for enthusiasts.",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1920&q=90",
    link: "/shop?category=Accessories",
  },
  {
    title: "Immersive Sound & Audio Experience",
    subtitle: "CRYSTAL CLEAR HI-FI AUDIO",
    description: "Immerse yourself in legendary Sony noise-cancelling headphones and JBL waterproof Bluetooth speakers with long battery life.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&q=90",
    link: "/shop?category=Audio",
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "360px", sm: "460px", md: "500px" },
        width: "100%",
        overflow: "hidden",
        bgcolor: "#0F172A",
        display: "flex",
        alignItems: "center"
      }}
    >
      {slides.map((slide, idx) => (
        <Box
          key={idx}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            display: idx === current ? "flex" : "none",
            alignItems: "center",
            zIndex: idx === current ? 1 : 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Left-to-right dark gradient overlay for text legibility */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: {
                xs: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
                sm: "linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.55) 55%, rgba(15, 23, 42, 0.1) 100%)"
              },
              zIndex: 1,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center" }}>
            <Grid container sx={{ width: "100%" }}>
              {/* Left text column */}
              <Grid xs={12} sm={8} md={7}>
                <Box sx={{ color: "white" }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#FFB300",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      mb: 1.5,
                      display: "block",
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      mb: 2,
                      fontWeight: 900,
                      fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
                      lineHeight: 1.15,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontSize: "1.02rem",
                      color: "#D1D5DB",
                      lineHeight: 1.6,
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      component={Link}
                      to={slide.link}
                      variant="contained"
                      sx={{
                        bgcolor: "#E23744",
                        color: "white",
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        borderRadius: "50px",
                        "&:hover": { bgcolor: "#b82531" },
                      }}
                    >
                      Explore Collection
                    </Button>
                    <Button
                      component={Link}
                      to="/shop"
                      variant="outlined"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: 700,
                        px: 3,
                        borderRadius: "50px",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" },
                      }}
                    >
                      View All
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ))}

      {/* Slide Arrow Controllers */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          zIndex: 20,
        }}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          zIndex: 20,
        }}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
}

export default HeroSection;