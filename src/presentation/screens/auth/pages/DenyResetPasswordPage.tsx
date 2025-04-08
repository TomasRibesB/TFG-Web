import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { denyPasswordResetRequest } from "../../../../services/auth"; // Refer to [src/services/auth.ts](src/services/auth.ts)

export const DenyResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setSuccess(false);
      setMessage("Token no válido.");
      setLoading(false);
      return;
    }

    const cancelRequest = async () => {
      try {
        const data = await denyPasswordResetRequest(token);
        if (!data) {
          setSuccess(false);
          setMessage("Token no válido.");
          return;
        }
        setSuccess(true);
        setMessage(
          "La solicitud para restablecer la contraseña se ha cancelado correctamente."
        );
      } catch (error) {
        setSuccess(false);
        setMessage(
          "Hubo un error al cancelar la solicitud de restablecimiento de contraseña."
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cancelRequest();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          p: 4,
          backgroundColor: success === false ? "error.light" : "success.light",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {success ? "Solicitud Cancelada" : "Error en la Cancelación"}
            </Typography>
            <Typography variant="body1">{message}</Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default DenyResetPasswordPage;
