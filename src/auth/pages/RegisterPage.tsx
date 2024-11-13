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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { MuiFileInput } from "mui-file-input";
import React from "react";

export const RegisterPage = () => {
  const [value, setValue] = React.useState<File[] | undefined>(undefined);

  interface HandleChangeEvent {
    target: {
      value: File[] | undefined;
    };
  }

  const handleChange = (newValue: HandleChangeEvent["target"]["value"]) => {
    setValue(newValue);
  };

  return (
    <AuthLayout title="Registrarse" isLarger>
      <form>
        <Grid2 container spacing={2} sx={{ p: 2 }}>
          {/* Nombre */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              placeholder="Nombre"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          {/* Apellido */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              placeholder="Apellido"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          {/* Correo electrónico */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              placeholder="correo@ejemplo.com"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          {/* Contraseña */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              type="password"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          {/* Repite contraseña */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Repite contraseña"
              variant="outlined"
              fullWidth
              type="password"
              InputProps={{
                style: {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid2>
          {/* Profesión */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
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
          {/* Comprobante de profesión */}
          <Grid2 container size={12}>
            <Grid2 size={10}>
              <MuiFileInput
                InputProps={{
                  style: {
                    borderRadius: "50px",
                  },
                }}
                label="Comprobante de profesión"
                onChange={handleChange}
                value={value}
                fullWidth
                getInputText={(files) =>
                  files?.length === 1
                    ? "1 archivo seleccionado"
                    : `${files?.length} archivos seleccionados`
                }
                multiple
                inputProps={{ accept: ".png, .jpeg, .jpg, .pdf" }}
              />
            </Grid2>
            <Grid2
              size={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UploadFileIcon style={{ fontSize: 40 }} color="primary" />
            </Grid2>
          </Grid2>
          {/* Aceptar términos */}
          <Grid2 size={12}>
            <FormControlLabel
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
                  <Link component={RouterLink} to="/auth/terms/profesional" target="_blank">
                    términos y condiciones
                  </Link>{" "}
                  para el uso de la plataforma.
                </Typography>
              }
            />
          </Grid2>
          {/* Botón Enviar */}
          <Grid2 size={12}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "50px",
                textTransform: "none",
              }}
            >
              Enviar
            </Button>
          </Grid2>
          {/* Enlace Iniciar sesión */}
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
