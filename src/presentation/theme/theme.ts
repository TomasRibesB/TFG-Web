import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(120, 69, 172)",
      contrastText: "rgb(255, 255, 255)", // Equivalente a onPrimary
    },
    secondary: {
      main: "rgb(102, 90, 111)",
      contrastText: "rgb(255, 255, 255)", // Equivalente a onSecondary
    },
    error: {
      main: "rgb(186, 26, 26)",
      contrastText: "rgb(255, 255, 255)", // Equivalente a onError
    },
    background: {
      default: "rgb(255, 251, 255)",
      paper: "#F8F3F9", // Equivalente a surface.main
    },
    text: {
      primary: "rgb(29, 27, 30)", // Equivalente a onBackground
      secondary: "rgb(74, 69, 78)", // Equivalente a onSurfaceVariant
    },
  },
});