import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2067dc",
    },

    secondary: {
      main: "#ffbd4a",
    },

    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },

    text: {
      primary: "#13213a",
      secondary: "#596579",
    },
  },

  typography: {
    fontFamily: "Arial, sans-serif",
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;