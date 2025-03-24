import {
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { StorageAdapter } from "../../../../../config/adapters/storage-adapter";
import { User } from "../../../../../infrastructure/interfaces/user";
import { PlanNutricional } from "../../../../../infrastructure/interfaces/plan-nutricional";
import { EntrenadorForm } from "./form/EntrenadorForm";
import { NutricionistaForm } from "./form/NutricionistaForm";
import { ProfesionalSaludForm } from "./form/ProfesionalSaludForm";
import { Role } from "../../../../../infrastructure/enums/roles";
import {
  getPlanNutricionalByUserIdRequest,
  getVisiblePlanNutricionalForProfesionalByUserRequest,
} from "../../../../../services/nutricion";
import { Routine } from "../../../../../infrastructure/interfaces/routine";
import {
  getPlanTrainerByUserIdRequest,
  getRelacionesEjericiosRequest,
  getVisibleRoutineForProfesionalByUserRequest,
} from "../../../../../services/entrenamiento";
import { Documento } from "../../../../../infrastructure/interfaces/documento";
import {
  getDocumentosForProfesionalByUserRequest,
  getVisibleDocumentosForProfesionalByUserRequest,
} from "../../../../../services/salud";
import { ImageAvatar } from "../../../../components/ImageAvatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { GruposMusculares } from "../../../../../infrastructure/interfaces/grupos-musculares";
import { CategoriaEjercicio } from "../../../../../infrastructure/interfaces/categoria-ejercicio";
import { DialogNewClient } from "./components/DialogNewClient";
import { postAsignarClienteRequest } from "../../../../../services/user";

export const ClientsPage = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Partial<User>[]>([]);
  const [selectedClient, setSelectedClient] = useState<Partial<User> | null>(
    null
  );
  const [gruposMusculares, setGruposMusculares] = useState<GruposMusculares[]>(
    []
  );
  const [categorias, setCategorias] = useState<CategoriaEjercicio[]>([]);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [documents, setDocuments] = useState<Partial<Documento>[]>([]);
  const [planesNutricionales, setPlanesNutricionales] = useState<
    PlanNutricional[]
  >([]);
  const [routines, setRoutines] = useState<Partial<Routine>[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch();
  }, []);

  const fetch = async () => {
    const clients: Partial<User>[] =
      (await StorageAdapter.getItem("clientes")) || [];
    const user: Partial<User> | null = await StorageAdapter.getItem("user");
    setUser(user);
    setClients(clients);
    setLoading(false);

    if (user?.role === Role.Nutricionista) {
      console.log("Nutricionista");
    } else if (user?.role === Role.Profesional) {
      console.log("Profesional");
    } else if (user?.role === Role.Entrenador) {
      const relaciones = await getRelacionesEjericiosRequest();
      setGruposMusculares(relaciones.gruposMusculares);
      setCategorias(relaciones.categorias);
      console.log(relaciones);
    }
  };

  const handeSelectClient = async (client: Partial<User>) => {
    if (!client || typeof client.id !== "number") return;
    setSelectedClient(client);
    const documentos: Partial<Documento>[] =
      await getVisibleDocumentosForProfesionalByUserRequest(client.id!);
    setDocuments(documentos);
    const planesNutricionales: PlanNutricional[] =
      await getVisiblePlanNutricionalForProfesionalByUserRequest(client.id!);
    setPlanesNutricionales(planesNutricionales);
    const routines: Routine[] =
      await getVisibleRoutineForProfesionalByUserRequest(client.id!);
    setRoutines(routines);

    if (user?.role === Role.Nutricionista) {
      fetchNutricionista(client);
    } else if (user?.role === Role.Profesional) {
      fetchProfesional(client);
    } else if (user?.role === Role.Entrenador) {
      fetchEntreanador(client);
    }
  };

  const fetchNutricionista = async (client: Partial<User>) => {
    if (!client || typeof client.id !== "number") return;
    const planesNutricionales: PlanNutricional[] =
      await getPlanNutricionalByUserIdRequest(client.id!);
    setSelectedClient({ ...client, planesNutricionales });
  };

  const fetchEntreanador = async (client: Partial<User>) => {
    if (!client || typeof client.id !== "number") return;
    const routines: Routine[] = await getPlanTrainerByUserIdRequest(client.id!);
    setSelectedClient({ ...client, routines });
  };

  const fetchProfesional = async (client: Partial<User>) => {
    if (!client || typeof client.id !== "number") return;
    const documentos: Documento[] =
      await getDocumentosForProfesionalByUserRequest(client.id!);
    setSelectedClient({ ...client, documentos });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setSearchTerm("");
  };

  const handleUpdateClient = (client: Partial<User>) => {
    setSelectedClient(client);
  };

  const handleAssign = async (client: User) => {
    const user = await postAsignarClienteRequest(client.id!);
    setClients([...clients, user]);
    setSelectedClient(user);

    handleClose();
  };

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.firstName?.toLowerCase().includes(term) ||
      client.lastName?.toLowerCase().includes(term) ||
      client.dni?.toLowerCase().includes(term)
    );
  });

  return (
    <Grid2
      container
      spacing={2}
      sx={{ height: "95.4%", backgroundColor: "primary.paper", pb: 4 }}
    >
      {/* Listado de clientes */}
      <Grid2
        size={{ xs: 12, md: 4, lg: 3 }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
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
            Clientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            sx={{ mt: { xs: 2, md: 0 } }}
            onClick={() => setIsOpenModal(true)}
          >
            Agregar
          </Button>
        </Box>
        <TextField
          label="Buscar por nombre, apellido o DNI"
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
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ListItem key={client.id} disablePadding>
                <ListItemButton onClick={() => handeSelectClient(client)}>
                  <ListItemAvatar>
                    <ImageAvatar user={client} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${client.firstName} ${client.lastName}`}
                    secondary={`DNI: ${client.dni}`}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">No se encontraron clientes.</Typography>
          )}
        </List>
      </Grid2>

      {/* Detalle y acciones para el cliente seleccionado */}
      <Grid2
        size={{
          xs: 12,
          md: 8,
          lg: 9,
        }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
      >
        {selectedClient && (
          <>
            <Typography variant="h5" gutterBottom>
              Acciones para {selectedClient.firstName} {selectedClient.lastName}
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
                user={selectedClient}
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
                  {selectedClient.firstName} {selectedClient.lastName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    ml: 2,
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  {selectedClient.birthdate && (
                    <Typography variant="h6">
                      Edad:{" "}
                      <span style={{ fontSize: "1.5rem" }}>
                        {new Date().getFullYear() -
                          new Date(selectedClient.birthdate).getFullYear()}
                      </span>
                    </Typography>
                  )}
                  {selectedClient.sex && (
                    <Typography variant="h6">
                      Sexo:{" "}
                      <span style={{ fontSize: "1.5rem" }}>
                        {selectedClient.sex}
                      </span>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </>
        )}
        {user && user.role === Role.Entrenador && (
          <EntrenadorForm
            selectedClient={selectedClient}
            gruposMusculares={gruposMusculares}
            categoriasEjercicio={categorias}
            onUpdateClient={handleUpdateClient}
            documents={documents}
            routines={routines}
            planesNutricionales={planesNutricionales}
          />
        )}
        {user && user.role === Role.Nutricionista && (
          <NutricionistaForm
            selectedClient={selectedClient}
            onUpdateClient={handleUpdateClient}
            documents={documents}
            routines={routines}
            planesNutricionales={planesNutricionales}
          />
        )}
        {user && user.role === Role.Profesional && (
          <ProfesionalSaludForm
            selectedClient={selectedClient}
            onUpdateClient={handleUpdateClient}
            documents={documents}
            routines={routines}
            planesNutricionales={planesNutricionales}
          />
        )}
      </Grid2>
      <DialogNewClient
        open={isOpenModal}
        onClose={handleClose}
        onAssign={handleAssign}
        existingClients={clients}
      />
    </Grid2>
  );
};
