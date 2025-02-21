import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";

export const SessionLoader = () => {
  const { authRedirection } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authRedirection().finally(() => setLoading(false));
  }, [authRedirection]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  return <Outlet />;
};
