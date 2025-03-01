import {
  Grid2,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { Verified, Pending } from "@mui/icons-material";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";
import { User } from "../../../../infrastructure/interfaces/user";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { Role } from "../../../../infrastructure/enums/roles";

export const ProfilePage = () => {
  const [image, setValue] = useState<File[] | undefined>(undefined);
  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  interface HandleChangeEvent {
    target: {
      image: File[] | undefined;
    };
  }

  const handleChange = (newValue: HandleChangeEvent["target"]["image"]) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    fetch();
  }, []);

  const fetch = async () => {
    const user: Partial<User> = (await StorageAdapter.getItem("user")) || {};
    setUser(user);
    setFristName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setLoading(false);
  };

  const handleSaveChanges = () => {
    setLoading(true);
  };

  const handleChangePassword = () => {
    setLoading(true);
  };

  const handleUploadImage = () => {
    setLoading(true);
  };

  return (
    <Grid2
      container
      spacing={2}
      direction="row"
      sx={{ height: "95.4%", pb: 4 }}
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
          <Grid2 container spacing={2} direction="row" alignItems="center">
            {/* Avatar a la izquierda */}
            <Grid2>
              <Avatar
                alt="Foto de Perfil"
                src="/ruta/a/tu/foto.jpg"
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: 48,
                }}
              >
                {user.firstName?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid2>

            {/* Columna de información a la derecha */}
            <Grid2 container direction="column" spacing={1}>
              {/* Nombre */}
              <Grid2>
                <Typography variant="body1">
                  {(user.firstName?.charAt(0)?.toUpperCase() ?? "") +
                    user.firstName?.slice(1).toLowerCase()}{" "}
                  {(user.lastName?.charAt(0).toUpperCase() ?? "") +
                    user.lastName?.slice(1).toLowerCase()}
                </Typography>
              </Grid2>

              {/* Profesión */}
              <Grid2>
                <Typography variant="body1">
                  {user.role === Role.Profesional
                    ? "Profesional - " +
                      (user.userTipoProfesionales
                        ?.map((tipo) => tipo.tipoProfesional?.profesion)
                        .filter((profesion) => profesion !== undefined)
                        .join(", ") || "N/E")
                    : (user.role?.charAt(0).toUpperCase() ?? "") +
                      (user.role?.slice(1).toLocaleLowerCase() ?? "")}
                </Typography>
              </Grid2>

              {/* Certificación */}
              <Grid2>
                <Chip
                  icon={
                    user.userTipoProfesionales?.some(
                      (tipo) => tipo.certificadora
                    ) ? (
                      <Verified />
                    ) : (
                      <Pending />
                    )
                  }
                  label={
                    user.userTipoProfesionales?.some(
                      (tipo) => tipo.certificadora
                    )
                      ? `Certificado por ${user.userTipoProfesionales
                          ?.filter((tipo) => tipo.certificadora)
                          .map((tipo) => tipo.certificadora)
                          .join(", ")}`
                      : "Sin certificar"
                  }
                  color={
                    user.userTipoProfesionales?.some(
                      (tipo) => tipo.certificadora
                    )
                      ? "success"
                      : "warning"
                  }
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Grid2>
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
                disabled
                value={fristName}
                onChange={(e) => setFristName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            disabled={
              ((!fristName || !lastName || !email) && email !== user.email) ||
              loading
            }
            onClick={handleSaveChanges}
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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setNewPassword(e.target.value)}
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
                onChange={(e) => setRepeatPassword(e.target.value)}
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
            disabled={
              !password ||
              !newPassword ||
              !repeatPassword ||
              newPassword !== repeatPassword ||
              loading
            }
            onClick={handleChangePassword}
          >
            Cambiar Contraseña
          </Button>
        </form>
        <Divider sx={{ mt: 4 }} />
        <Grid2
          container
          sx={{
            mt: 3,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
          }}
        >
          <MuiFileInput
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
            label="Subir Imagen de Perfil"
            onChange={handleChange}
            value={image}
            sx={{ width: "100%", borderRadius: "8px", mr: 2 }}
            getInputText={(files) =>
              files?.length === 1
                ? "1 archivo seleccionado"
                : `${files?.length} archivos seleccionados`
            }
            multiple
            inputProps={{ accept: ".png, .jpeg, .jpg, .pdf" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: "8px" }}
            size="large"
            disabled={!image || loading}
            onClick={handleUploadImage}
          >
            Subir
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
