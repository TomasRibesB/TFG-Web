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
import { User } from "../../../../infrastructure/interfaces/user";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { Ticket } from "../../../../infrastructure/interfaces/ticket";
import { Turno } from "../../../../infrastructure/interfaces/turno";
import { EstadoTurno } from "../../../../infrastructure/enums/estadosTurnos";

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

  const handleCreateAppointment = () => {
    // Lógica para crear disponibilidad
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const clientes: Partial<User>[] =
      (await StorageAdapter.getItem("clientes")) || [];
    const tickets: Ticket[] = (await StorageAdapter.getItem("tickets")) || [];
    const turnos: Turno[] = (await StorageAdapter.getItem("turnos")) || [];
    const recordatorios: Recordatorio[] =
      (await StorageAdapter.getItem("recordatorios")) || [];

    setClients(clientes);
    setTickets(tickets);
    setTurnosLibres(turnos.filter((turno) => turno.paciente === null));
    setTurnosOcupados(turnos.filter((turno) => turno.paciente !== null));
    setRecordatorios(recordatorios);
  };

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "primary.paper",
        p: 2,
        gap: 2,
      }}
    >
      {/* Primera fila: Tarjetas de resumen con altura fija */}
      <Grid2 container spacing={2} sx={{ flex: "0 0 30%" }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              backgroundColor: "background.paper",
              height: "100%",
              boxShadow: 3,
              display: "flex",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Alinea a la izquierda
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                Clientes
              </Typography>
              <Typography variant="h2" sx={{ color: "primary.main" }}>
                {clients?.length}
              </Typography>
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              backgroundColor: "background.paper",
              height: "100%",
              boxShadow: 3,
              display: "flex",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Alinea a la izquierda
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                Tickets
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-start"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography variant="h4" sx={{ color: "primary.main" }}>
                  {
                    tickets?.filter(
                      (ticket) =>
                        ticket.isAutorizado &&
                        ticket.isAceptado &&
                        ticket.isActive
                    ).length
                  }
                </Typography>
                <Typography variant="h6">Abiertos</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-start"
                spacing={1}
              >
                <Typography variant="h4" sx={{ color: "primary.main" }}>
                  {
                    tickets?.filter(
                      (ticket) =>
                        ticket.isAutorizado &&
                        !ticket.isAceptado &&
                        !ticket.isActive
                    ).length
                  }
                </Typography>
                <Typography variant="h6">Pendientes</Typography>
              </Stack>
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: "background.paper",
              height: "100%",
              boxShadow: 3,
              p: 2,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Recordatorios
            </Typography>
            <Box sx={{ maxHeight: "100%", pr: 1 }}>
              {recordatorios.map((recordatorio) => (
                <Card
                  key={`reminder-${recordatorio.id}`}
                  sx={{ mb: 2, boxShadow: 0 }}
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
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                              md: "0.9rem",
                            },
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
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.7rem",
                          },
                        }}
                      >
                        {new Date(recordatorio.fecha).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Card>
        </Grid2>
      </Grid2>

      {/* Segunda fila: Turnos y Crear Disponibilidad */}
      <Grid2 container spacing={2} sx={{ flex: 1, alignItems: "stretch" }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              backgroundColor: "background.paper",
              height: "100%",
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Listado de Turnos
            </Typography>
            <Box sx={{ flexGrow: 1, pr: 1 }}>
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
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              backgroundColor: "background.paper",
              height: "100%",
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              p: 2,
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
              InputLabelProps={{ shrink: true }}
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
            <Box sx={{ flexGrow: 1, mt: 2, pr: 1 }}>
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
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};
