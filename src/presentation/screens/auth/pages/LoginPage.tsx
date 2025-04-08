import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Grid2,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { sendPasswordResetEmailRequest } from "../../../../services/auth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
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

      const result = await login(email, password);
      setLoading(false);
      if (result) {
        setError(result);
        return;
      } else {
        setError("");
      }
    } catch (err) {
      setError("No se pudo iniciar sesión");
      setLoading(false);
      console.error(err);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (!email) {
      setError("Pon solo tu correo electrónico para restablecer la contraseña");
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

    await sendPasswordResetEmailRequest(email)
      .then(() => {
        setError(
          "Se ha enviado un correo electrónico para restablecer la contraseña"
        );
        setLoading(false);
      })
      .catch((error) => {
        setError(
          "No se pudo enviar el correo electrónico para restablecer la contraseña"
        );
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form>
        <Grid2 container sx={{ p: 2 }}>
          <Grid2 size={12}>
            <TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              label="Contraseña"
              variant="outlined"
              fullWidth
              sx={{ mb: 4 }}
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
          {error && (
            <Grid2 size={12}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            </Grid2>
          )}
          <Grid2 size={12}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleLogin}
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
          <Grid2 size={12} sx={{ mt: 2 }}>
            <Typography variant="body2" align="center">
              ¿Olvidaste tu contraseña?{" "}
              <Link onClick={loading ? () => {} : () => handleResetPassword()}>
                Restablecer contraseña
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </form>
    </AuthLayout>
  );
};
