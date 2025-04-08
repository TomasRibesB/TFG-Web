import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  resetPasswordRequest,
  verifyPasswordResetTokenRequest,
} from "../../../../services/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { token } = useParams<{ token: string }>();
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!token) {
      setError("Token no válido o ha expirado.");
      setLoading(true);
      return;
    }
    const verifyToken = async () => {
      try {
        const data = await verifyPasswordResetTokenRequest(token);
        setTokenValid(data);
        setLoading(false);
      } catch {
        setError("Token no válido o ha expirado.");
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleReset = async () => {
    if (!newPassword) {
      setError("La contraseña es obligatoria");
      setLoading(true);
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 50) {
      setError("La contraseña debe tener entre 8 y 50 caracteres");
      setLoading(false);
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"
      );
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const data = await resetPasswordRequest(token as string, newPassword);
    if (data) {
      setSuccessMsg(
        "Contraseña restablecida con éxito. Puedes iniciar sesión."
      );
      setErrorMsg("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  if (tokenValid === false) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "error.light",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Token Inválido
          </Typography>
          <Typography variant="body1">
            El token proporcionado no es válido o ha expirado.
          </Typography>
        </Box>
      </Container>
    );
  }
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Verificando Token...
        </Typography>
      </Container>
    );
  }

  if (successMsg) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "success.light",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Contraseña Restablecida
          </Typography>
          <Typography variant="body1">{successMsg}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Restablecer Contraseña
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Nueva Contraseña"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setErrorMsg("");
          }}
          fullWidth
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
        <TextField
          label="Confirmar Nueva Contraseña"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMsg("");
          }}
          fullWidth
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
        {errorMsg && (
          <Typography color="error" variant="body2">
            {errorMsg}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          sx={{ mt: 2, borderRadius: "8px" }}
          disabled={loading}
        >
          Resetear Contraseña
        </Button>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "error.main" }}
        >
          {error}
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
