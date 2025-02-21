import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./";

interface Props {
    children: React.ReactNode;
}

export const AppTheme = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <CssBaseline />
    </ThemeProvider>
  );
};
