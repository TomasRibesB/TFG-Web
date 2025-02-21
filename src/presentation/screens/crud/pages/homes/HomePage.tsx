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

interface Reminder {
  id: number;
  reminder: string;
}

interface Appointment {
  id: number;
  patientName: string;
  date: Date;
  status: "Pendiente" | "Aceptado" | "Rechazado";
}

interface UnreservedAppointment {
  id: number;
  date: Date;
}

const rows: Reminder[] = [
  {
    id: 1,
    reminder:
      "Revisión mensual con el paciente Juan Pérez para evaluar avances y ajustar la dieta según resultados.",
  },
  {
    id: 2,
    reminder:
      "Control de peso programado con María López, verificar cumplimiento de metas semanales.",
  },
  {
    id: 3,
    reminder:
      "Evaluación de dieta con Carlos García, revisar si se requieren suplementos adicionales.",
  },
  {
    id: 4,
    reminder:
      "Consulta de seguimiento con Ana Martínez para discutir resultados de análisis recientes.",
  },
  {
    id: 5,
    reminder:
      "Revisión de análisis de Luis Rodríguez, prestar atención a niveles de colesterol.",
  },
  {
    id: 6,
    reminder:
      "Control de peso con Laura Fernández, motivar para mantener rutina de ejercicios.",
  },
  {
    id: 7,
    reminder:
      "Evaluación de dieta con Pedro Sánchez, introducir nuevos alimentos ricos en fibra.",
  },
];

export const HomePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "Juan Pérez",
      date: new Date(),
      status: "Pendiente",
    },
    {
      id: 2,
      patientName: "María López",
      date: new Date(),
      status: "Aceptado",
    },
    {
      id: 3,
      patientName: "Carlos García",
      date: new Date(),
      status: "Rechazado",
    },
    {
      id: 4,
      patientName: "Ana Martínez",
      date: new Date(),
      status: "Pendiente",
    },
    {
      id: 5,
      patientName: "Luis Rodríguez",
      date: new Date(),
      status: "Pendiente",
    },
    {
      id: 6,
      patientName: "Laura Fernández",
      date: new Date(),
      status: "Pendiente",
    },
    {
      id: 7,
      patientName: "Pedro Sánchez",
      date: new Date(),
      status: "Pendiente",
    },
  ]);
  const [clients, setClients] = useState<Partial<User>[]>();

  const [unreservedAppointments, setUnreservedAppointments] = useState<
    UnreservedAppointment[]
  >([
    {
      id: 1,
      date: new Date(),
    },
  ]);

  const [newAppointmentDateTime, setNewAppointmentDateTime] =
    useState<string>("");

  const handleAccept = (id: number) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Aceptado" }
          : appointment
      )
    );
  };

  const handleReject = (id: number) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Rechazado" }
          : appointment
      )
    );
  };

  const handleCreateAppointment = () => {
    if (newAppointmentDateTime) {
      const date = new Date(newAppointmentDateTime);
      const newUnreservedAppointment: UnreservedAppointment = {
        id: unreservedAppointments.length + 1,
        date: date,
      };
      setUnreservedAppointments([
        ...unreservedAppointments,
        newUnreservedAppointment,
      ]);
      setNewAppointmentDateTime("");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const clientes: Partial<User>[] = (await StorageAdapter.getItem('clientes')) || [];

    setClients(clientes);
  }
  

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
                14
              </Typography>
              <Typography variant="h6">Abiertos</Typography>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h4" sx={{ color: "primary.main" }}>
                3
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
            {rows.map((row) => (
              <Card
                key={row.id}
                sx={{ mb: 3, scrollSnapAlign: "start" }}
                elevation={0}
              >
                <CardContent sx={{ padding: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <NotificationsNoneIcon
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                        color: "primary.main",
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "0.9rem" },
                        wordBreak: "break-word",
                        ml: 1,
                      }}
                    >
                      {row.reminder}
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
            {appointments.map((appointment) => (
              <Card key={appointment.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {appointment.patientName}
                  </Typography>
                  <Typography variant="body1">
                    Fecha: {appointment.date.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Estado: {appointment.status}
                  </Typography>
                  {appointment.status === "Pendiente" && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2, borderRadius: "8px" }}
                        size="medium"
                        onClick={() => handleAccept(appointment.id)}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ mr: 2, borderRadius: "8px" }}
                        size="medium"
                        onClick={() => handleReject(appointment.id)}
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
            {unreservedAppointments.map((unreserved) => (
              <Card key={unreserved.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    Fecha: {unreserved.date.toLocaleString()}
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
