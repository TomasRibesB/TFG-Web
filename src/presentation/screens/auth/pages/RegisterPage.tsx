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
import { Delete } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { MuiFileInput } from "mui-file-input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Role } from "../../../../infrastructure/enums/roles";
import { getTipoProfesionalRequest } from "../../../../services/user";
import { TipoProfesional } from "../../../../infrastructure/interfaces/tipo-profesional";

interface HandleChangeEvent {
  target: {
    certificate: File | undefined;
  };
}

export const RegisterPage = () => {
  const [certificate, setCertificate] = useState<File | undefined>(undefined);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dni, setDni] = useState("");
  const [profesion, setProfesion] = useState<Role | "">("");
  const [tipoProfesional, setTipoProfesional] = useState<TipoProfesional[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const [tiposProfesional, setTiposProfesional] = useState<TipoProfesional[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const tiposProfesional = await getTipoProfesionalRequest();
      setTiposProfesional(tiposProfesional);
    } catch (err) {
      console.error(err);
    }
  };

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
    setLoading(true);
    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    if (nombre.length > 50) {
      setError("El nombre no puede tener más de 50 caracteres");
      setLoading(false);
      return;
    }
    if (!apellido.trim()) {
      setError("El apellido es obligatorio");
      setLoading(false);
      return;
    }
    if (apellido.length > 50) {
      setError("El apellido no puede tener más de 50 caracteres");
      setLoading(false);
      return;
    }
    if (!dni.trim()) {
      setError("El DNI es obligatorio");
      setLoading(false);
      return;
    }
    if (dni.length > 20) {
      setError("El DNI no puede tener más de 20 caracteres");
      setLoading(false);
      return;
    }
    if (!email) {
      setError("El correo electrónico es obligatorio");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no es válido");
      setLoading(false);
      return;
    }
    if (email.length > 50) {
      setError("El correo electrónico no puede tener más de 50 caracteres");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      setLoading(false);
      return;
    }
    if (password.length < 6 || password.length > 50) {
      setError("La contraseña debe tener entre 6 y 50 caracteres");
      setLoading(false);
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()])[A-Za-z\d@$!%*?&#^()]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial entre los siguientes: @$!%*?&#^()"
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    if (!profesion) {
      setError("La profesión es obligatoria");
      setLoading(false);
      return;
    }
    if (!certificate) {
      setError("El certificado es obligatorio");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones");
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        email,
        password,
        nombre,
        apellido,
        dni,
        profesion,
        profesion === Role.Profesional && tipoProfesional.length > 0
          ? tipoProfesional
              .map((tp) => tp.id)
              .filter((id): id is number => id !== undefined)
          : undefined,
        certificate
      );
      if (result !== true) {
        setError("No se pudo registrar el usuario");
        setLoading(false);
        return;
      }

      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDni("");
      setProfesion("");
      setCertificate(undefined);
      setTipoProfesional([]);
      setTermsAccepted(false);
      setError(
        "Se ha registrado correctamente, para iniciar sesion debe verificar su correo electrónico para activar su cuenta."
      );
      setLoading(false);
    } catch (err) {
      setError("No se pudo registrar");
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (
    newValue: HandleChangeEvent["target"]["certificate"] | null
  ) => {
    if (!newValue) return;
    setCertificate(newValue);
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
          {/* Dni */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
                setError("");
              }}
              label="DNI"
              variant="outlined"
              fullWidth
              placeholder="DNI"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid2>

          <Grid2 container size={12} spacing={2}>
            <Grid2 size={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Profesión</InputLabel>
                <Select
                  value={profesion}
                  onChange={(e) => {
                    setProfesion(e.target.value as Role);
                    setTipoProfesional([]);
                    setError("");
                  }}
                  label="Profesión"
                  placeholder="Tipo de usuario"
                  style={{ borderRadius: "8px" }}
                >
                  {Object.values(Role)
                    .filter((role) => role !== Role.Usuario)
                    .map((role) => {
                      const displayText =
                        role === Role.Profesional
                          ? "Otra profesión de la salud"
                          : role.charAt(0).toUpperCase() + role.slice(1);
                      return (
                        <MenuItem key={role} value={role}>
                          {displayText}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={6}>
              <MuiFileInput
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                  inputProps: {
                    accept: "video/*",
                  },
                  startAdornment: <UploadFileIcon />,
                }}
                label="Certificado Profesional"
                onChange={handleChange}
                value={certificate}
                clearIconButtonProps={{
                  title: "Limpiar",
                  children: <Delete />,
                }}
                fullWidth
                getInputText={(file) => file?.name || ""}
                inputProps={{ accept: ".png, .jpeg, .jpg, .pdf" }}
              />
            </Grid2>
          </Grid2>
          {profesion === Role.Profesional && (
            <Grid2 container size={12}>
              <Grid2 size={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo de profesional</InputLabel>
                  <Select
                    value={tipoProfesional[0]?.id || ""}
                    onChange={(e) => {
                      setTipoProfesional(
                        tiposProfesional.filter(
                          (tipo) => tipo.id === e.target.value
                        )
                      );
                      setError("");
                    }}
                    label="Tipo de profesional"
                    style={{ borderRadius: "8px" }}
                  >
                    {tiposProfesional.map((tipo) => {
                      const displayText = tipo.profesion
                        ? tipo.profesion.charAt(0).toUpperCase() +
                          tipo.profesion.slice(1)
                        : "";
                      return (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {displayText}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>
          )}
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
              disabled={loading}
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
