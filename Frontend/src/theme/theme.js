import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#E23744",
      },
      secondary: {
        main: "#FFB300",
      },
      background: {
        default: mode === "light" ? "#FAFAFA" : "#0F172A",
        paper: mode === "light" ? "#FFFFFF" : "#1E293B",
      },
      text: {
        primary: mode === "light" ? "#111827" : "#F1F5F9",
        secondary: mode === "light" ? "#6B7280" : "#94A3B8",
      },
      divider: mode === "light" ? "#E5E7EB" : "#334155",
    },

    typography: {
      fontFamily: "'Poppins', sans-serif",

      h1: {
        fontSize: "4rem",
        fontWeight: 700,
      },

      h2: {
        fontSize: "3rem",
        fontWeight: 700,
      },

      h3: {
        fontSize: "2rem",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 20,
    },
  });

export default getTheme;