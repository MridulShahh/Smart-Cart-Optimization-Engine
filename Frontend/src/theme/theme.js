import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E23744",
    },

    secondary: {
      main: "#FFB300",
    },

    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
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

export default theme;