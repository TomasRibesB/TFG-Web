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
  IconButton,
  InputAdornment,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { MuiFileInput } from "mui-file-input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { registerRequest } from "../../../../services/auth";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const [value, setValue] = useState<File[] | undefined>(undefined);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profesion, setProfesion] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  interface HandleChangeEvent {
    target: {
      value: File[] | undefined;
    };
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleRegister = async () => {
    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!apellido.trim()) {
      setError("El apellido es obligatorio");
      return;
    }
    if (!email) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no es válido");
      return;
    }
    if (email.length > 50) {
      setError("El correo electrónico no puede tener más de 50 caracteres");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }
    if (password.length < 6 || password.length > 50) {
      setError("La contraseña debe tener entre 6 y 50 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!profesion) {
      setError("La profesión es obligatoria");
      return;
    }
    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    // Aquí se pueden agregar validaciones adicionales según se requiera

    try {
      // Se podría enviar también nombre, apellido, profesión y comprobante si el servicio lo soporta
      await registerRequest({email, password, firstName: nombre, lastName: apellido, dni: ""});
      navigate("/"); // Redirige a la ruta deseada
    } catch (err) {
      setError("No se pudo registrar");
      console.error(err);
    }
  };

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
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
              label="Nombre"
              variant="outlined"
              fullWidth
              placeholder="Nombre"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>
          {/* Apellido */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                setError("");
              }}
              label="Apellido"
              variant="outlined"
              fullWidth
              placeholder="Apellido"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>
          {/* Correo electrónico */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              placeholder="correo@ejemplo.com"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>
          {/* Contraseña */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              label="Contraseña"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          {/* Repite contraseña */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              label="Confirmar Contraseña"
              variant="outlined"
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          {/* Profesión */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Profesión</InputLabel>
              <Select
                value={profesion}
                onChange={(e) => {
                  setProfesion(e.target.value);
                  setError("");
                }}
                label="Profesión"
                placeholder="Tipo de usuario"
                style={{ borderRadius: "8px" }}
              >
                <MenuItem value="nutricionista">Nutricionista</MenuItem>
                <MenuItem value="entrenador">Entrenador</MenuItem>
                <MenuItem value="profesional">
                  Profesional de la salud
                </MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          {/* Comprobante de profesión */}
          <Grid2 container size={12}>
            <Grid2 size={10}>
              <MuiFileInput
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
                label="Certificado Profesional"
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
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    setError("");
                  }}
                  sx={{
                    color: "primary.main",
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{" "}
                  <Link
                    component={RouterLink}
                    to="/auth/terms/profesional"
                    target="_blank"
                  >
                    términos y condiciones
                  </Link>{" "}
                  para el uso de la plataforma.
                </Typography>
              }
            />
          </Grid2>
          {/* Mostrar errores */}
          {error && (
            <Grid2 size={12}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            </Grid2>
          )}
          {/* Botón Enviar */}
          <Grid2 size={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              sx={{
                borderRadius: "8px",
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
