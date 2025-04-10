import {
  Box,
  Button,
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { User } from "../../../../infrastructure/interfaces/user";
import { ImageAvatar } from "../../../components/ImageAvatar";
import { Role } from "../../../../infrastructure/enums/roles";
import {
  setBajaOrCertificateRequest,
  downloadCertificateRequest,
} from "../../../../services/user";

export const ProfessionalsPage = () => {
  const [loading, setLoading] = useState(false);
  const [professionals, setProfessionals] = useState<Partial<User>[]>([]);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Partial<User> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    setLoading(true);
    const pros: Partial<User>[] =
      (await StorageAdapter.getItem("profesionales")) || [];
    setProfessionals(pros);
    setLoading(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectProfessional = (professional: Partial<User>) => {
    setSelectedProfessional(professional);
  };

  const filteredProfessionals = professionals.filter((pro) => {
    const term = searchTerm.toLowerCase();
    return (
      pro.firstName?.toLowerCase().includes(term) ||
      pro.lastName?.toLowerCase().includes(term) ||
      pro.email?.toLowerCase().includes(term)
    );
  });

  const handleCertify = async (professional: Partial<User>) => {
    if (!professional.id || !professional?.userTipoProfesionales?.[0]?.id) {
      console.error("Datos incompletos del profesional");
      return;
    }
    try {
      await setBajaOrCertificateRequest(
        professional.id,
        professional.userTipoProfesionales[0].id,
        true
      );
      // Comportamiento equivalente al backend:
      // - Actualiza el userTipoProfesional a "certified" (isCertified: true)
      // - Restaura al profesional (deletedAt = undefined)
      const updatedProfessionals = professionals.map((pro) => {
        if (pro.id === professional.id) {
          return {
            ...pro,
            deletedAt: undefined, // Se "restaura" al profesional
            userTipoProfesionales: pro.userTipoProfesionales?.map((tipo) =>
              tipo.id === professional.userTipoProfesionales?.[0]?.id
                ? { ...tipo, isCertified: true }
                : tipo
            ),
          };
        }
        return pro;
      });
      await StorageAdapter.setItem("profesionales", updatedProfessionals);
      setProfessionals(updatedProfessionals);
      setSelectedProfessional((prev) =>
        prev
          ? {
              ...prev,
              deletedAt: undefined,
              userTipoProfesionales: prev.userTipoProfesionales?.map((tipo) =>
                tipo.id === professional.userTipoProfesionales?.[0]?.id
                  ? { ...tipo, isCertified: true }
                  : tipo
              ),
            }
          : prev
      );
      console.log("updatedProfessionalsA", updatedProfessionals);
    } catch (error) {
      console.error("Error al certificar:", error);
    }
  };

  const handleDeactivate = async (professional: Partial<User>) => {
    if (!professional.id || !professional?.userTipoProfesionales?.[0]?.id) {
      console.error("Datos incompletos del profesional");
      return;
    }
    try {
      await setBajaOrCertificateRequest(
        professional.id,
        professional.userTipoProfesionales[0].id,
        false
      );
      // Comportamiento equivalente al backend:
      // - Actualiza el userTipoProfesional a "no certificado" (isCertified: false)
      // - Realiza un soft delete del profesional (deletedAt = new Date())
      const updatedProfessionals = professionals.map((pro) => {
        if (pro.id === professional.id) {
          return {
            ...pro,
            deletedAt: new Date(), // Marca el soft delete
            userTipoProfesionales: pro.userTipoProfesionales?.map((tipo) =>
              tipo.id === professional.userTipoProfesionales?.[0]?.id
                ? { ...tipo, isCertified: false }
                : tipo
            ),
          };
        }
        return pro;
      });
      await StorageAdapter.setItem("profesionales", updatedProfessionals);
      setProfessionals(updatedProfessionals);
      setSelectedProfessional((prev) =>
        prev
          ? {
              ...prev,
              deletedAt: new Date(),
              userTipoProfesionales: prev.userTipoProfesionales?.map((tipo) =>
                tipo.id === professional.userTipoProfesionales?.[0]?.id
                  ? { ...tipo, isCertified: false }
                  : tipo
              ),
            }
          : prev
      );
      console.log("updatedProfessionalsR", updatedProfessionals);
    } catch (error) {
      console.error("Error al dar de baja:", error);
    }
  };

  const handleDownloadCertificate = async (professional: Partial<User>) => {
    if (!professional.id || !professional?.userTipoProfesionales?.[0]?.id) {
      console.error("Datos incompletos del profesional");
      return;
    }
    try {
      await downloadCertificateRequest(
        professional.id,
        professional.userTipoProfesionales[0].id
      );
      console.log("Descargando certificado...");
    } catch (error) {
      console.error("Error al descargar certificado:", error);
    }
  };

  return (
    <Grid2
      container
      spacing={2}
      sx={{ height: "95.4%", backgroundColor: "primary.paper", pb: 4 }}
    >
      {/* Listado de profesionales */}
      <Grid2
        size={{ xs: 12, md: 4, lg: 3 }}
        className="card-shadow"
        sx={{ backgroundColor: "background.paper", p: 2 }}
      >
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
            Profesionales
          </Typography>
        </Box>
        <TextField
          label="Buscar por nombre, apellido o email"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2, borderRadius: "8px" }}
        />
        <Divider sx={{ mb: 2 }} />
        <List sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          {loading ? (
            <Typography variant="body1">Cargando...</Typography>
          ) : filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((pro) => (
              <ListItem key={pro.id} disablePadding>
                <ListItemButton onClick={() => handleSelectProfessional(pro)}>
                  <ListItemAvatar>
                    <ImageAvatar user={pro} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${pro.firstName} ${pro.lastName}`}
                    secondary={`${pro.email}`}
                    style={{
                      opacity: pro.deletedAt ? 0.5 : 1,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">
              No se encontraron profesionales.
            </Typography>
          )}
        </List>
      </Grid2>

      {/* Detalle y acciones para el profesional seleccionado */}
      <Grid2
        size={{ xs: 12, md: 8, lg: 9 }}
        className="card-shadow"
        sx={{ backgroundColor: "background.paper", p: 2 }}
      >
        {selectedProfessional ? (
          <>
            <Typography variant="h5" gutterBottom>
              Acciones para {selectedProfessional.firstName}{" "}
              {selectedProfessional.lastName}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "center",
                mb: 3,
              }}
            >
              <ImageAvatar
                user={selectedProfessional}
                sx={{
                  height: 100,
                  width: 100,
                  fontSize: "3rem",
                  bgcolor: "primary.main",
                }}
                onClickView
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h3" sx={{ ml: 2, mr: 2 }}>
                  {selectedProfessional.firstName}{" "}
                  {selectedProfessional.lastName}
                </Typography>
                <Typography variant="body1">
                  DNI: {selectedProfessional.dni}
                </Typography>
                <Typography variant="body1">
                  Rol:{" "}
                  {selectedProfessional.role === Role.Profesional
                    ? "Profesional - " +
                      (selectedProfessional.userTipoProfesionales
                        ?.map((tipo) => tipo.tipoProfesional?.profesion)
                        .filter((profesion) => profesion !== undefined)
                        .join(", ") || "N/E")
                    : (selectedProfessional.role?.charAt(0).toUpperCase() ??
                        "") +
                      (selectedProfessional.role
                        ?.slice(1)
                        .toLocaleLowerCase() ?? "")}
                </Typography>
                <Typography variant="body1">
                  Email: {selectedProfessional.email}
                </Typography>
                <Typography variant="body1">
                  Estado:
                  {selectedProfessional.deletedAt === null
                    ? " Activo"
                    : " Inactivo"}
                </Typography>
                <Typography variant="body1">
                  Certificado:{" "}
                  {selectedProfessional.userTipoProfesionales?.[0]?.isCertified
                    ? "Sí"
                    : "No"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              {(selectedProfessional.userTipoProfesionales?.length ?? 0) >
                0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleDownloadCertificate(selectedProfessional)
                  }
                >
                  Descargar certificado
                </Button>
              )}
              <Button
                variant="contained"
                color="success"
                disabled={
                  !!selectedProfessional.userTipoProfesionales?.[0]?.isCertified
                }
                onClick={() => handleCertify(selectedProfessional)}
              >
                Certificar
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={!!selectedProfessional.deletedAt}
                onClick={() => handleDeactivate(selectedProfessional)}
              >
                Baja de cuenta
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1">
            Seleccione un profesional para ver sus acciones.
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
};
