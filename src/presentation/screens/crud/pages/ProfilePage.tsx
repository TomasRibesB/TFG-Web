import {
  Grid2,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Verified, Pending } from "@mui/icons-material";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";
import { User } from "../../../../infrastructure/interfaces/user";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { Role } from "../../../../infrastructure/enums/roles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  updateEmailRequest,
  updatePasswordRequest,
  uploadImageRequest,
} from "../../../../services/user";
import { ImageAvatar } from "../../../components/ImageAvatar";

export const ProfilePage = () => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorImagen, setErrorImagen] = useState("");
  const [flagUpdateImage, setFlagUpdateImage] = useState<Date | undefined>(
    undefined
  );

  interface HandleChangeEvent {
    target: {
      image: File | undefined;
    };
  }

  const handleChange = (
    newValue: HandleChangeEvent["target"]["image"] | null
  ) => {
    if (!newValue) return;
    setImage(newValue);
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

  const handleSaveChanges = async () => {
    if (!email) {
      setErrorEmail("El correo electrónico es obligatorio");
      return;
    }
    if (email === user.email) {
      setErrorEmail("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorEmail("El correo electrónico no es válido");
      return;
    }
    if (email.length > 50) {
      setErrorEmail(
        "El correo electrónico no puede tener más de 50 caracteres"
      );
      return;
    }
    setLoading(true);
    const response = await updateEmailRequest(email);
    if (response) {
      await StorageAdapter.setItem("user", { ...user, email });
      setErrorEmail("");
      fetch();
    } else {
      setErrorEmail("El correo electrónico ya está en uso");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== repeatPassword) {
      setErrorContraseña("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 50) {
      setErrorContraseña("La contraseña debe tener entre 6 y 50 caracteres");
      return;
    }
    setLoading(true);
    const response = await updatePasswordRequest(password, newPassword);
    if (response) {
      await StorageAdapter.setItem("user", { ...user, password: newPassword });
      setPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setErrorContraseña("");
      fetch();
    } else {
      setErrorContraseña("La contraseña actual es incorrecta");
    }
    setLoading(false);
  };

  const handleUploadImage = async () => {
    if (!image) {
      setErrorImagen("Debe seleccionar una imagen");
      return;
    }
    setLoading(true);
    const response = await uploadImageRequest(image);
    if (response) {
      await StorageAdapter.setItem("user", { ...user, hasImage: true });
      const flag = new Date();
      setFlagUpdateImage(flag);
      setUser({ ...user, hasImage: true });
      setImage(undefined);
      setErrorImagen("");
      fetch();
    } else {
      setErrorImagen("No se pudo subir la imagen");
    }
    setLoading(false);
  };

  // Dentro del componente ProfilePage, define estos estados y handlers:
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const handleClickShowCurrent = () => setShowCurrent(!showCurrent);
  const handleClickShowNew = () => setShowNew(!showNew);
  const handleClickShowRepeat = () => setShowRepeat(!showRepeat);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid2 container spacing={2} direction="row" sx={{ pb: 4 }}>
      {/* Información de certificación */}
      <Grid2 container size={{ xs: 12 }} direction="column">
        <Grid2
          className="card-shadow"
          sx={{
            padding: 2,
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Grid2 container spacing={2} direction="row" alignItems="center">
            <Grid2>
              <ImageAvatar
                user={user}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: 48,
                }}
                onClickView
                flag={flagUpdateImage}
              />
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
              {user.role !== Role.Administrador &&
                <Grid2>
                <Chip
                  icon={
                    user.userTipoProfesionales?.some(
                      (tipo) => tipo.isCertified
                    ) ? (
                      <Verified />
                    ) : (
                      <Pending />
                    )
                  }
                  label={
                    user.userTipoProfesionales?.some((tipo) => tipo.isCertified)
                      ? `Certificado`
                      : "Sin certificar"
                  }
                  color={
                    user.userTipoProfesionales?.some((tipo) => tipo.isCertified)
                      ? "success"
                      : "warning"
                  }
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Grid2>}
            </Grid2>
          </Grid2>
          {!user?.userTipoProfesionales?.some((tipo) => tipo.isCertified) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, textAlign: "center", fontSize: 12 }}
            >
              Se habilitaran mas funciones cuando un administrador te certifique
              como profesional.
            </Typography>
          )}
        </Grid2>
      </Grid2>

      {/* Formulario de edición de datos */}
      <Grid2
        size={{ xs: 12 }}
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography color="error" sx={{ mt: 1 }}>
                {errorEmail}
              </Typography>
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
                type={showCurrent ? "text" : "password"} // <-- Toggle de visibilidad
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: { borderRadius: "8px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle current password visibility"
                        onClick={handleClickShowCurrent}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showCurrent ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nueva Contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  style: { borderRadius: "8px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={handleClickShowNew}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showNew ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Repetir Contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showRepeat ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                InputProps={{
                  style: { borderRadius: "8px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle repeat password visibility"
                        onClick={handleClickShowRepeat}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showRepeat ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography color="error" sx={{ mt: 1 }}>
                {errorContraseña}
              </Typography>
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
            getInputText={(file) => file?.name || ""}
            inputProps={{ accept: ".png, .jpeg, .jpg" }}
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
        <Typography color="error" sx={{ mt: 1 }}>
          {errorImagen}
        </Typography>
      </Grid2>
    </Grid2>
  );
};
