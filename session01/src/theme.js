import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",  // bleu moderne
    },
    secondary: {
      main: "#9333ea",  // violet
    },
    background: {
      default: "#f8fafc", // gris très clair
    }
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h5: {
      fontWeight: 600,
    },
  },
});

export default theme;
