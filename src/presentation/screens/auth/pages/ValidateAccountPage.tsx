import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { verifyEmailRequest } from "../../../../services/auth";

export const ValidateAccountPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      checkToken(token);
    }
  }, [token]);

  const checkToken = async (token: string) => {
    if (await verifyEmailRequest(token)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {isValid === null ? (
        <Typography variant="h5" align="center">
          Validando cuenta...
        </Typography>
      ) : isValid ? (
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
            Cuenta Validada
          </Typography>
          <Typography variant="body1">
            Su cuenta ha sido confirmada exitosamente.
          </Typography>
        </Box>
      ) : (
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
            El token proporcionado es inválido o ha expirado.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ValidateAccountPage;
