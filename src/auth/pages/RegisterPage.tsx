import {
  Grid2,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";

export const RegisterPage = () => {
  return (
    <AuthLayout titlle="Registrarse">
      <form>
        <Grid2 container sx={{ p: 2 }}>
          <Grid2 size={12}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Nombre"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Apellido"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
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
              sx={{ mb: 2 }}
              type="password"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Repite contraseña"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              type="password"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          <Grid2 size={12}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Profesión</InputLabel>
              <Select
                label="Profesión"
                placeholder="Tipo de usuario"
                style={{ borderRadius: "50px" }}
              >
                <MenuItem value="nutricionista">Nutricionista</MenuItem>
                <MenuItem value="entrenador">Entrenador</MenuItem>
                <MenuItem value="profesional">Profesional de la salud</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={12}>
            <FormControlLabel
              sx={{ mb: 2 }}
              control={
                <Checkbox
                  sx={{
                    color: "primary.main",
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{" "}
                  <Link component={RouterLink} to="/auth/terms/profesional">
                    terminos y condiciones
                  </Link>{" "}
                  para el uso de la plataforma.
                </Typography>
              }
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
              ¿Ya tienes una cuenta?{" "}
              <Link component={RouterLink} to="/auth/login">
                Inicia sesión
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </form>
    </AuthLayout>
  );
};
