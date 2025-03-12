import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Button,
  Typography,
  Grid2,
  Box,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Chat } from "../../../components/Chat"; // ajusta la ruta según corresponda
import {
  getTicketsRequest,
  updateTicketConsentimientoRequest,
} from "../../../../services/tickets";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { Ticket } from "../../../../infrastructure/interfaces/ticket";
import { User } from "../../../../infrastructure/interfaces/user";
import { EstadoConsentimiento } from "../../../../infrastructure/enums/estadoConsentimiento";
import { getProfesionalsByUserForTicketsCreationRequest } from "../../../../services/user";

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Partial<User>[]>([]);
  const [selectedClient, setSelectedClient] = useState<Partial<User> | null>(
    null
  );
  const [profesionals, setProfesionals] = useState<Partial<User>>({});
  const [selectedProfesional, setSelectedProfesional] = useState<Partial<User>>(
    {}
  );
  const [isModalNewTicketOpen, setIsModalNewTicketOpen] =
    useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const ticketsData = await getTicketsRequest();
    setTickets(ticketsData);
    const user: Partial<User> | null = await StorageAdapter.getItem("user");
    setUser(user);
    setLoading(false);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    if (
      ticket.consentimientoUsuario === EstadoConsentimiento.Aceptado &&
      ticket.consentimientoReceptor === EstadoConsentimiento.Aceptado &&
      ticket.consentimientoSolicitante === EstadoConsentimiento.Aceptado
    ) {
      console.log("Ticket seleccionado", ticket);
      setSelectedTicket(ticket);
    }
  };

  const handleAccept = async (id: number) => {
    await updateTicketConsentimientoRequest(id, EstadoConsentimiento.Aceptado);
    fetchData();
  };

  const handleReject = async (id: number) => {
    await updateTicketConsentimientoRequest(id, EstadoConsentimiento.Rechazado);
    fetchData();
  };

  const handleOpenModalNewTicket = async () => {
    setIsModalNewTicketOpen(true);
    const clients: Partial<User>[] | null = await StorageAdapter.getItem(
      "clientes"
    );
    setClients(clients ?? []);
  };

  useEffect(() => {
    if (selectedClient && selectedClient.id && isModalNewTicketOpen) {
      getProfesionals(selectedClient.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const getProfesionals = async (id: number) => {
    const response = await getProfesionalsByUserForTicketsCreationRequest(id);
    setProfesionals(response);
  };

  return (
    <Grid2
      container
      spacing={2}
      sx={{ height: "95.4%", backgroundColor: "background.paper", pb: 4 }}
    >
      {/* Grid2 más pequeño: Listado de Tickets */}
      <Grid2
        size={{ xs: 12, md: 4, lg: 3 }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        {/* Encabezado con título y botón para agregar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Tickets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlaylistAddIcon />}
            sx={{ mt: { xs: 2, md: 0 } }}
            onClick={handleOpenModalNewTicket}
          >
            Agregar
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Typography variant="body1">Cargando...</Typography>
        ) : tickets.length > 0 ? (
          tickets.map((item) => (
            <Card
              key={item.id}
              sx={{ mb: 2, cursor: "pointer" }}
              onClick={() => handleSelectTicket(item)}
            >
              <CardHeader
                title={item.asunto}
                subheader={`Creado: ${new Date(
                  item.fechaCreacion!
                ).toLocaleDateString()}`}
                titleTypographyProps={{ variant: "h6" }}
                subheaderTypographyProps={{ variant: "body2" }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 1,
                  }}
                >
                  <Chip
                    icon={<InfoIcon />}
                    label={
                      item.consentimientoUsuario ===
                      EstadoConsentimiento.Aceptado
                        ? item.consentimientoReceptor ===
                          EstadoConsentimiento.Aceptado
                          ? item.consentimientoSolicitante ===
                            EstadoConsentimiento.Aceptado
                            ? "Activo"
                            : "Pendiente de aceptación"
                          : "Pendiente de aceptación"
                        : "Pendiente de autorización del cliente"
                    }
                    sx={{ m: 0.5 }}
                  />
                  {user && item.solicitante?.id !== user.id && (
                    <Box sx={{ display: "flex", alignItems: "center", m: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {item.solicitante?.firstName}{" "}
                        {item.solicitante?.lastName}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", m: 0.5 }}>
                    <PersonIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {item.receptor?.firstName} {item.receptor?.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", m: 0.5 }}>
                    <PersonIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Yo</Typography>
                  </Box>
                </Box>
                {item?.solicitante?.id !== user?.id &&
                item.receptor?.id === user?.id &&
                item.consentimientoReceptor !==
                  EstadoConsentimiento.Aceptado ? (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(item.id!);
                      }}
                    >
                      Aceptar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(item.id!);
                      }}
                    >
                      Rechazar
                    </Button>
                  </Box>
                ) : item.consentimientoUsuario ===
                    EstadoConsentimiento.Aceptado &&
                  item.consentimientoReceptor ===
                    EstadoConsentimiento.Aceptado &&
                  item.consentimientoSolicitante ===
                    EstadoConsentimiento.Aceptado ? (
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTicket(item);
                    }}
                  >
                    Ver Ticket
                  </Button>
                ) : item.solicitante?.id === user?.id ? (
                  <Typography variant="body2">
                    Esperando respuesta de los otros usuarios...
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2">No se encontraron tickets.</Typography>
        )}
      </Grid2>
      {/* Grid2 mayor: Chat o placeholder */}
      <Grid2
        size={{ xs: 12, md: 8, lg: 9 }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
          display: "flex",
        }}
      >
        {!selectedTicket?.id || !user?.id ? (
          <Typography variant="body1" sx={{ m: "auto" }}>
            Seleccione un ticket para ver el chat.
          </Typography>
        ) : (
          <Chat ticketId={selectedTicket.id} userId={user.id} />
        )}
      </Grid2>
    </Grid2>
  );
};
