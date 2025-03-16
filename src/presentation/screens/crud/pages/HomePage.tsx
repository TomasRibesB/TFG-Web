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
import {
  createTurnoRequest,
  updateTurnoRequest,
  removeTurnoRequest,
} from "../../../../services/turnos";

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

  // Función para crear disponibilidad
  const handleCreateAppointment = async () => {
    try {
      // Se crea un turno sin paciente asignado y se obtiene el turno creado
      const nuevoTurno = await createTurnoRequest({
        fechaHora: new Date(newAppointmentDateTime),
      });
      setNewAppointmentDateTime("");
      // Agregar el nuevo turno a la lista de turnos libres
      setTurnosLibres((prev) => (prev ? [...prev, nuevoTurno] : [nuevoTurno]));
    } catch (error) {
      console.error("Error al crear la disponibilidad", error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      // Se actualiza el estado del turno a Confirmado (ya está asignado por otro proceso)
      const updatedTurno = await updateTurnoRequest({
        id,
        estado: EstadoTurno.Confirmado,
      });
      // Actualizar la UI: mover de turnosLibres a turnosOcupados
      setTurnosLibres((prev) =>
        prev ? prev.filter((turno) => turno.id !== id) : []
      );
      setTurnosOcupados((prev) =>
        prev ? [...prev, updatedTurno as Turno] : [updatedTurno as Turno]
      );
    } catch (error) {
      console.error("Error al aceptar el turno", error);
    }
  };

  // Función para rechazar un turno (actualiza su estado a Cancelado)
  const handleReject = async (id: number) => {
    try {
      // Se actualiza el turno a Cancelado
      const updatedTurno = await updateTurnoRequest({
        id,
        estado: EstadoTurno.Cancelado,
      });
      // Actualizar el state: quitar de turnosLibres o actualizar en turnosOcupados
      setTurnosLibres((prev) =>
        prev ? prev.filter((turno) => turno.id !== id) : []
      );
      setTurnosOcupados((prev) =>
        prev
          ? prev.map((turno) =>
              turno.id === id ? (updatedTurno as Turno) : turno
            )
          : []
      );
    } catch (error) {
      console.error("Error al rechazar el turno", error);
    }
  };

  const handleDeleteFreeTurn = async (id: number) => {
    try {
      await removeTurnoRequest(id);
      setTurnosLibres((prev) =>
        prev ? prev.filter((turno) => turno.id !== id) : []
      );
    } catch (error) {
      console.error("Error al eliminar el turno", error);
    }
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
      {/* Primera fila: Tarjetas de resumen */}
      <Grid2 container spacing={2} sx={{ flex: "0 0 30%" }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            className="card-shadow"
            sx={{
              backgroundColor: "background.paper",
              p: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
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
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            className="card-shadow"
            sx={{
              backgroundColor: "background.paper",
              p: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
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
                        ticket.consentimientoReceptor &&
                        ticket.consentimientoSolicitante &&
                        ticket.consentimientoUsuario
                    ).length
                  }
                </Typography>
                <Typography variant="h6">Abiertos</Typography>
              </Stack>
              <Stack direction="row" justifyContent="flex-start" spacing={1}>
                <Typography variant="h4" sx={{ color: "primary.main" }}>
                  {
                    tickets?.filter(
                      (ticket) =>
                        (!ticket.consentimientoReceptor ||
                          !ticket.consentimientoSolicitante ||
                          !ticket.consentimientoUsuario) &&
                        !ticket.fechaBaja
                    ).length
                  }
                </Typography>
                <Typography variant="h6">Pendientes</Typography>
              </Stack>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box
            className="card-shadow"
            sx={{
              backgroundColor: "background.paper",
              p: 2,
              height: "100%",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Recordatorios
            </Typography>
            <Box sx={{ maxHeight: "15vh", pr: 1, overflowY: "auto" }}>
              {recordatorios.map((recordatorio) => (
                <Card
                  key={`reminder-${recordatorio.id}-${recordatorio.tipo}-${recordatorio.fecha}`}
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
          </Box>
        </Grid2>
      </Grid2>

      {/* Segunda fila: Turnos y Crear Disponibilidad */}
      <Grid2 container spacing={2} sx={{ flex: 1, alignItems: "stretch" }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box
            className="card-shadow"
            sx={{ backgroundColor: "background.paper", p: 2, height: "58vh" }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Listado de Turnos
            </Typography>
            <Box sx={{ flexGrow: 1, pr: 1, overflowY: "auto", height: "48vh" }}>
              {turnosOcupados?.map((turno) => (
                <Card key={`turno-${turno.id}`} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">
                      {turno.paciente
                        ? `${turno.paciente.firstName} ${turno.paciente.lastName}`
                        : "Sin asignar"}
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
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box
            className="card-shadow"
            sx={{ backgroundColor: "background.paper", p: 2, height: "58vh" }}
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
              inputProps={{
                min: new Date().toISOString().substring(0, 16),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2, borderRadius: "8px" }}
              size="medium"
              disabled={!newAppointmentDateTime}
              onClick={handleCreateAppointment}
            >
              Crear Disponibilidad
            </Button>
            <Box
              sx={{
                flexGrow: 1,
                mt: 2,
                pr: 1,
                overflowY: "auto",
                height: "34vh",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Turnos Sin Reservar
              </Typography>
              {turnosLibres?.map((turno) => (
                <Card key={`unreserved-${turno.id}`} sx={{ mb: 2 }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">
                      Fecha: {new Date(turno.fechaHora).toLocaleString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteFreeTurn(turno.id)}
                      sx={{ mt: 1 }}
                    >
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};
