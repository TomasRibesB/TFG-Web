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
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { StorageAdapter } from "../../../../../config/adapters/storage-adapter";
import { User } from "../../../../../infrastructure/interfaces/user";
import { PlanNutricional } from "../../../../../infrastructure/interfaces/plan-nutricional";
import { EntrenadorForm } from "./form/EntrenadorForm";
import { NutricionistaForm } from "./form/NutricionistaForm";
import { ProfesionalSaludForm } from "./form/ProfesionalSaludForm";
import { Role } from "../../../../../infrastructure/enums/roles";
import { getPlanNutricionalByUserIdRequest } from "../../../../../services/nutricion";
import { Routine } from "../../../../../infrastructure/interfaces/routine";
import { getPlanTrainerByUserIdRequest } from "../../../../../services/entrenamiento";
import { Documento } from "../../../../../infrastructure/interfaces/documento";
import { getDocumentosForProfesionalByUserRequest } from "../../../../../services/salud";
import { ImageAvatar } from "../../../../components/ImageAvatar";

export const ClientsPage = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Partial<User>[]>([]);
  const [selectedClient, setSelectedClient] = useState<Partial<User> | null>(
    null
  );
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  };

  const handeSelectClient = (client: Partial<User>) => {
    if (!client || typeof client.id !== "number") return;
    setSelectedClient(client);

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
      direction="row"
      sx={{ height: "95.4%", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        className="card-shadow"
        size={3}
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Listado de Clientes
        </Typography>
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
      <Grid2
        className="card-shadow"
        size={9}
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        {selectedClient && (
          <>
            <Typography variant="h5" gutterBottom>
              Acciones para {selectedClient.firstName} {selectedClient.lastName}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
              <ImageAvatar
                user={selectedClient}
                sx={{ height: 100, width: 100 , fontSize: "3rem", bgcolor: "primary.main" }}
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
          <EntrenadorForm selectedClient={selectedClient} />
        )}
        {user && user.role === Role.Nutricionista && (
          <NutricionistaForm selectedClient={selectedClient} />
        )}
        {user && user.role === Role.Profesional && (
          <ProfesionalSaludForm selectedClient={selectedClient} />
        )}
      </Grid2>
    </Grid2>
  );
};
