import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import {
  uploadFileByNoUserRequest,
  getUserPermisoDocumentoRequest,
  setByNoUserRequest,
} from "../../../../services/salud";
import { useParams, useNavigate } from "react-router-dom";
import { PermisoDocumento } from "../../../../infrastructure/interfaces/permiso-documento";
import { getTipoProfesionalRequest } from "../../../../services/user";
import { TipoProfesional } from "../../../../infrastructure/interfaces/tipo-profesional";
import { TipoDocumento } from "../../../../infrastructure/enums/tipoDocumentos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const UploadDocumentScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [permiso, setPermiso] = useState<PermisoDocumento | null>(null);

  // Estados adicionales para profesionales "no usuario"
  const [professionalName, setProfessionalName] = useState("");
  const [professionalLastName, setProfessionalLastName] = useState("");
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [professionalDNI, setProfessionalDNI] = useState("");
  const [professionalTypes, setProfessionalTypes] = useState<TipoProfesional[]>(
    []
  );
  const [professionalType, setProfessionalType] =
    useState<TipoProfesional | null>(null);
  const [documType, setDocumType] = useState<TipoDocumento | null>(null);
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (code) {
      getUserPermisoDocumentoRequest(code)
        .then((permiso) => {
          if (permiso) {
            setPermiso(permiso);
            getTipoProfesionalRequest().then((tipos) => {
              if (tipos) {
                setProfessionalTypes(tipos);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [code]);

  const handleSave = async () => {
    if (!file || !title || !documType) {
      setErrorMsg("El título, tipo de documento y el archivo son obligatorios");
      setTimeout(() => {
        setErrorMsg("");
      }, 10000);
      return;
    }

    const newDocument = {
      titulo: title.trim(),
      descripcion: description.trim(),
      tipo: documType!,
      usuarioId: Number(permiso?.usuario.id),
      nombreProfesional: professionalName.trim() || undefined,
      apellidoProfesional: professionalLastName.trim() || undefined,
      emailProfesional: professionalEmail.trim() || undefined,
      dniProfesional: professionalDNI.trim() || undefined,
      tipoProfesionalId: professionalType?.id || undefined,
    };

    try {
      setLoading(true);
      const createdDocument = await setByNoUserRequest(newDocument, code!);
      if (createdDocument?.id && file) {
        await uploadFileByNoUserRequest(file, createdDocument.id, code!);
      }
      setSuccessMsg("Documento subido correctamente");
      setDisableButton(true);
      // Limpiar mensajes y redirigir luego de 5s
      setTimeout(() => {
        setSuccessMsg("");
        setDisableButton(false)
        navigate("/auth/upload");
      }, 5000);
      setTitle("");
      setDescription("");
      setFile(null);
      setProfessionalName("");
      setProfessionalLastName("");
      setProfessionalEmail("");
      setProfessionalDNI("");
      setProfessionalType(null);
      setPermiso(null);
      setDocumType(null);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al subir el documento");
      setTimeout(() => {
        setErrorMsg("");
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "success.light",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 60, color: "success.main" }}
          />
          <Typography variant="h4" gutterBottom>
            {successMsg}
          </Typography>
          <Typography variant="body1">Serás redirigido en breve...</Typography>
        </Box>
      </Container>
    );
  }

  if (code && !permiso?.id) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Código de Acceso Inválido
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/auth/upload")}
          >
            Volver a Ingresar el Código
          </Button>
        </Box>
      </Container>
    );
  }

  // Si no existe el código, mostramos un formulario para ingresar uno y redirigir
  if (!code) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Ingresa el código del usuario para poder continuar.
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
          }}
        >
          <TextField
            label="Código de Acceso"
            variant="outlined"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (accessCode.trim() !== "") {
                navigate(`/auth/upload/${accessCode.trim()}`);
                setAccessCode("");
              }
            }}
          >
            Enviar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Subir Documento para {permiso?.usuario.firstName}{" "}
        {permiso?.usuario.lastName}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Título"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrorMsg("");
          }}
          fullWidth
        />
        <TextField
          label="Descripción (opcional)"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        {/* Campos adicionales para profesionales */}
        <TextField
          label="Nombre Profesional"
          variant="outlined"
          value={professionalName}
          onChange={(e) => setProfessionalName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Apellido Profesional"
          variant="outlined"
          value={professionalLastName}
          onChange={(e) => setProfessionalLastName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email Profesional"
          variant="outlined"
          value={professionalEmail}
          onChange={(e) => setProfessionalEmail(e.target.value)}
          type="email"
          fullWidth
        />
        <TextField
          label="DNI Profesional"
          variant="outlined"
          value={professionalDNI}
          onChange={(e) => setProfessionalDNI(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Tipo de profesional</InputLabel>
          <Select
            value={professionalType?.id || ""}
            onChange={(e) => {
              const selected =
                professionalTypes.find((tipo) => tipo.id === e.target.value) ||
                null;
              setProfessionalType(selected);
            }}
            label="Tipo de profesional"
            style={{ borderRadius: "8px" }}
          >
            {professionalTypes.map((tipo) => {
              const displayText = tipo.profesion
                ? tipo.profesion.charAt(0).toUpperCase() +
                  tipo.profesion.slice(1)
                : "";
              return (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {displayText}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Tipo de Documento</InputLabel>
          <Select
            value={documType || null}
            onChange={(e) => setDocumType(e.target.value as TipoDocumento)}
            label="Tipo de Documento"
          >
            <MenuItem value={TipoDocumento.Acta}>Acta</MenuItem>
            <MenuItem value={TipoDocumento.Certificado}>Certificado</MenuItem>
            <MenuItem value={TipoDocumento.Informe}>Informe</MenuItem>
            <MenuItem value={TipoDocumento.Recomendacion}>
              Recomendación
            </MenuItem>
            <MenuItem value={TipoDocumento.Otro}>Otro</MenuItem>
          </Select>
        </FormControl>
        <MuiFileInput
          label="Selecciona el archivo"
          value={file}
          onChange={(newFile) => {
            setFile(newFile);
            setErrorMsg("");
          }}
          fullWidth
          inputProps={{ accept: ".png,.jpeg,.jpg,.pdf" }}
        />
        {errorMsg && (
          <Typography color="error" variant="body2">
            {errorMsg}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading || disableButton}
        >
          {loading ? "Subiendo..." : "Subir Documento"}
        </Button>
      </Box>
    </Container>
  );
};

export default UploadDocumentScreen;
