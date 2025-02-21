import { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { User } from "../../../../../infrastructure/interfaces/user";
import { StorageAdapter } from "../../../../../config/adapters/storage-adapter";
import { Ticket } from "../../../../../infrastructure/interfaces/ticket";
import { Turno } from "../../../../../infrastructure/interfaces/turno";
import { EstadoTurno } from "../../../../../infrastructure/enums/estadosTurnos";

interface Recordatorio {
  id: number;
  tipo: string;
  fecha: Date;
  descripcion: string;
}

export const HomePage = () => {
  const [clients, setClients] = useState<Partial<User>[]>();
  const [tickets, setTickets] = useState<Ticket[]>();
  const [turnosLibres, setTurnosLibres] = useState<Turno[]>();
  const [turnosOcupados, setTurnosOcupados] = useState<Turno[]>();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);

  const [newAppointmentDateTime, setNewAppointmentDateTime] =
    useState<string>("");

  const handleAccept = (id: number) => {
    console.log("Accepting turno with id: ", id);
  };

  const handleReject = (id: number) => {
    console.log("Rejecting turno with id: ", id);
  };

  const handleCreateAppointment = () => {};

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const clientes: Partial<User>[] =
      (await StorageAdapter.getItem("clientes")) || [];
    const tickets: Ticket[] = (await StorageAdapter.getItem("tickets")) || [];
    const turnos: Turno[] = (await StorageAdapter.getItem("turnos")) || [];
    const recordatorios: Recordatorio[] =
      (await StorageAdapter.getItem("recordatorios")) || [];

    setClients(clientes);
    setTickets(tickets);

    const libres = turnos.filter((turno) => turno.paciente === null);
    const ocupados = turnos.filter((turno) => turno.paciente !== null);

    setTurnosLibres(libres);
    setTurnosOcupados(ocupados);
    setRecordatorios(recordatorios);
  };

  return (
    <Grid2
      container
      spacing={2}
      direction="column"
      sx={{ minHeight: "90vh", backgroundColor: "primary.paper" }}
    >
      {/* Primer Contenedor */}
      <Grid2 container spacing={2}>
        {/* Tarjeta de Clientes */}
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ backgroundColor: "background.paper", padding: 2 }}
        >
          <Box style={{ flexDirection: "column", display: "flex" }}>
            <Typography variant="h4">Clientes</Typography>
            <Typography variant="h2" sx={{ color: "primary.main" }}>
              {clients?.length}
            </Typography>
          </Box>
        </Grid2>
        {/* Tarjeta de Tickets */}
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Tickets
            </Typography>
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography variant="h4" sx={{ color: "primary.main" }}>
                {
                  tickets?.filter(
                    (ticket) =>
                      ticket.isAutorizado === true &&
                      ticket.isAceptado === true &&
                      ticket.isActive === true
                  ).length
                }
              </Typography>
              <Typography variant="h6">Abiertos</Typography>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h4" sx={{ color: "primary.main" }}>
                {
                  tickets?.filter(
                    (ticket) =>
                      ticket.isAutorizado === true &&
                      ticket.isAceptado === false &&
                      ticket.isActive === false
                  ).length
                }
              </Typography>
              <Typography variant="h6">Pendientes</Typography>
            </Stack>
          </Box>
        </Grid2>
        {/* Tarjeta de Recordatorios */}
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 12, md: 4 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Recordatorios
          </Typography>
          <Box
            className="custom-scrollbar"
            sx={{
              maxHeight: "10vh",
              overflowY: "auto",
              scrollSnapType: "y mandatory",
            }}
          >
            {recordatorios.map((recordatorio) => (
              // En HomePage.tsx
              <Card
                key={`reminder-${recordatorio.id}`}
                sx={{ mb: 3, scrollSnapAlign: "start" }}
                elevation={0}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <NotificationsNoneIcon
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                        color: "primary.main",
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: "0.9rem", sm: "1rem", md: "0.9rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {recordatorio.descripcion}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.9rem",
                            md: "0.8rem",
                          },
                          color: "text.secondary",
                        }}
                      >
                        {recordatorio.tipo}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.7rem" },
                      }}
                    >
                      {new Date(recordatorio.fecha).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid2>
      </Grid2>
      {/* Segundo Contenedor */}
      <Grid2 container spacing={2} sx={{ height: "60vh" }}>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 6 }}
          sx={{ backgroundColor: "background.paper", padding: 2 }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Listado de Turnos
          </Typography>
          <Box
            sx={{ maxHeight: "50vh", overflowY: "auto" }}
            className="custom-scrollbar"
          >
            {turnosOcupados?.map((turno) => (
              <Card key={`turno-${turno.id}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {turno.paciente.firstName} {turno.paciente.lastName}
                  </Typography>
                  <Typography variant="body1">
                    Fecha: {new Date(turno.fechaHora).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Estado: {turno.estado}
                  </Typography>
                  {turno.estado === EstadoTurno.Pendiente && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2, borderRadius: "8px" }}
                        size="medium"
                        onClick={() => handleAccept(turno.id)}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ mr: 2, borderRadius: "8px" }}
                        size="medium"
                        onClick={() => handleReject(turno.id)}
                      >
                        Rechazar
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid2>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 6 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            maxHeight: "60vh",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Crear Disponibilidad
          </Typography>
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            value={newAppointmentDateTime}
            onChange={(e) => setNewAppointmentDateTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, borderRadius: "8px" }}
            size="medium"
            onClick={handleCreateAppointment}
          >
            Crear Disponibilidad
          </Button>
          <Box
            sx={{ mt: 4, maxHeight: "35vh", overflowY: "auto" }}
            className="custom-scrollbar"
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Turnos Sin Reservar
            </Typography>
            {turnosLibres?.map((turno) => (
              <Card key={`unreserved-${turno.id}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    Fecha: {new Date(turno.fechaHora).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
