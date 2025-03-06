import React from "react";
import { Grid2 } from "@mui/material";
import { Chat } from "../../../components/Chat"; // ajusta la ruta según corresponda

export const TicketsPage = () => {
  // Para demostrar, supongamos que obtienes ticketId y userId de algún hook o StorageAdapter
  const ticketId = 4; // Ejemplo
  const userId = 10; // Ejemplo

  return (
    <Grid2
      container
      spacing={2}
      sx={{ height: "95.4%", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        size={{ xs: 12, md: 4, lg: 3 }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        {/* Aquí podrías listar los tickets o mostrar otros controles */}
      </Grid2>
      <Grid2
        size={{
          xs: 12,
          md: 8,
          lg: 9,
        }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
          display: "flex",
        }}
      >
        <Chat ticketId={ticketId} userId={userId} />
      </Grid2>
    </Grid2>
  );
};
