import {
  Grid2,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { Verified, Pending, ErrorOutline } from "@mui/icons-material";
import { MuiFileInput } from "mui-file-input";
import React from "react";

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

  const [value, setValue] = React.useState<File[] | undefined>(undefined);

  interface HandleChangeEvent {
    target: {
      value: File[] | undefined;
    };
  }

  const handleChange = (newValue: HandleChangeEvent["target"]["value"]) => {
    setValue(newValue);
  };

  return (
    <Grid2
      container
      spacing={2}
      direction="row"
      sx={{ minHeight: "90vh", pb: 4 }}
    >
      {/* Información de certificación */}
      <Grid2 container size={{ xs: 12, md: 6 }} direction="column">
        <Grid2
          className="card-shadow"
          sx={{
            padding: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Grid2 container spacing={2} direction="column" alignItems="center">
            <Grid2>
              <Avatar
                alt="Foto de Perfil"
                src="/ruta/a/tu/foto.jpg"
                sx={{ width: 120, height: 120 }}
              />
            </Grid2>
            <Grid2>
              <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
                Certificación Profesional
              </Typography>
            </Grid2>
            <Grid2>
              <Chip
                icon={getStatusIcon()}
                label={certificationStatus}
                color={getStatusColor()}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Grid2>
            <Grid2>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Profesión: Nutricionista
              </Typography>
            </Grid2>
            <Grid2>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Rol: Profesional de la Salud
              </Typography>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2
          className="card-shadow"
          sx={{
            padding: 2,
            backgroundColor: "background.paper",
            flex: 1,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            Tareas Pendientes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            Sin tareas pendientes por el momento
          </Typography>
        </Grid2>
      </Grid2>

      {/* Formulario de edición de datos */}
      <Grid2
        size={{ xs: 12, md: 6 }}
        className="card-shadow"
        sx={{
          padding: 4,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Editar Información Personal
        </Typography>
        <form>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Apellido"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: "8px" }}
            size="large"
          >
            Guardar Cambios
          </Button>
        </form>
        <Divider sx={{ mt: 4 }} />
        <form>
          <Grid2 container spacing={3} sx={{ mt: 3 }}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contraseña Actual"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nueva Contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Repetir Contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                InputProps={{
                  style: {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: "8px" }}
            size="large"
          >
            Cambiar Contraseña
          </Button>
        </form>
        <Divider sx={{ mt: 4 }} />
        <Grid2 container sx={{ mt: 3 }}>
          <MuiFileInput
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
            label="Subir Imagen de Perfil"
            onChange={handleChange}
            value={value}
            fullWidth
            getInputText={(files) =>
              files?.length === 1
                ? "1 archivo seleccionado"
                : `${files?.length} archivos seleccionados`
            }
            multiple
            inputProps={{ accept: ".png, .jpeg, .jpg, .pdf" }}
          />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
