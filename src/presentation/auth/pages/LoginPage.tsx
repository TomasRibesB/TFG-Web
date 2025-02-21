import { Button, TextField, Typography, Grid2, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout title="Iniciar sesión">
      <form>
        <Grid2 container sx={{ p: 2 }}>
          <Grid2 size={12}>
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="correo@ejemplo.com"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              sx={{ mb: 4 }}
              type="password"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Entrar
            </Button>
          </Grid2>
          <Grid2 size={12} sx={{ mt: 2 }}>
            <Typography variant="body2" align="center">
              ¿No tienes cuenta?{" "}
              <Link component={RouterLink} to="/auth/register">
                Regístrate
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </form>
    </AuthLayout>
  );
};
