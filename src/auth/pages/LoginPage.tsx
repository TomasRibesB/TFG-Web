import { Button, TextField, Typography, Grid2, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const LoginPage = () => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        className="card-shadow"
        size={2.2}
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }} align="center">
          Iniciar sesión
        </Typography>
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
                    borderRadius: "50px",
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
                    borderRadius: "50px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={12}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "50px",
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
      </Grid2>
    </Grid2>
  );
};
