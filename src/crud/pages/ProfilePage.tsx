import {
  Grid2,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import { Verified, Pending, ErrorOutline } from "@mui/icons-material";

export const ProfilePage = () => {
  // Ejemplo de estado de certificación
  const certificationStatus = "Verificada"; // Puede ser "Pendiente", "Denegada"

  // Selección de icono y color según el estado
  const getStatusIcon = () => {
    if (certificationStatus === "Verificada") return <Verified />;
    if (certificationStatus === "Pendiente") return <Pending />;
    return <ErrorOutline />;
  };

  const getStatusColor = () => {
    if (certificationStatus === "Verificada") return "success";
    if (certificationStatus === "Pendiente") return "warning";
    return "error";
  };

  return (
    <Grid2
      container
      spacing={7}
      direction="column"
      sx={{ minHeight: "90vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      {/* Información de certificación */}
      <Grid2
        size={{ xs: 12 }}
        className="card-shadow"
        sx={{
          padding: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Grid2 container spacing={2} alignItems="center">
          <Grid2
            size={{ xs: 12, sm: 2 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Avatar
              alt="Foto de Perfil"
              src="/ruta/a/tu/foto.jpg"
              sx={{ width: 100, height: 100 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 10 }}>
            <Typography variant="h5">Certificación Profesional</Typography>
            <Chip
              icon={getStatusIcon()}
              label={certificationStatus}
              color={getStatusColor()}
              variant="outlined"
              sx={{ mt: 1, mb: 1 }}
            />
            <Typography variant="body1">Profesión: Nutricionista</Typography>
            <Typography variant="body1">
              Rol: Profesional de la Salud
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Formulario de edición de datos */}
      <Grid2
        size={{ xs: 12 }}
        className="card-shadow"
        sx={{
          padding: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Editar Información Personal
        </Typography>
        <form>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Apellido"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Confirmar Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid2>
          </Grid2>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Guardar Cambios
          </Button>
        </form>
      </Grid2>
    </Grid2>
  );
};
