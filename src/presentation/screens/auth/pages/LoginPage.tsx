import React, { useState } from "react";
import { Button, TextField, Typography, Grid2, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { loginRequest } from "../../../../services/auth"; // Llama al servicio de login

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
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
      // Llamada al servicio de login
      await loginRequest(email, password);
      // Redirige a la home u otra ruta en caso de éxito
      navigate("/");
    } catch (err) {
      setError("No se pudo iniciar sesión");
      console.error(err);
    }
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
              type="password"
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
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
        </Grid2>
      </form>
    </AuthLayout>
  );
};
