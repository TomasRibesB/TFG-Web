import {
  Avatar,
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
import { StorageAdapter } from "../../../../../config/adapters/storage-adapter";
import { User } from "../../../../../infrastructure/interfaces/user";
import { PlanNutricional } from "../../../../../infrastructure/interfaces/plan-nutricional";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import { EntrenadorForm } from "./form/EntrenadorForm";
import { Role } from "../../../../../infrastructure/enums/roles";
import { getPlanNutricionalByUserIdRequest } from "../../../../../services/nutricion";
import { Routine } from "../../../../../infrastructure/interfaces/routine";
import { getPlanTrainerByUserIdRequest } from "../../../../../services/entrenamiento";

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
    console.log("Selected Client: ", client);
    setSelectedClient(client);

    console.log("User: ", user);
    if (user?.role === Role.Nutricionista) {
      fetchNutricionista(client);
    } else if (user?.role === Role.Profesional) {
      console.log("fetchProfesional");
    } else if (user?.role === Role.Entrenador) {
      console.log("fetchEntrenador");
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
    const routines: Routine[] = await getPlanTrainerByUserIdRequest(
      client.id!
    );
    setSelectedClient({ ...client, routines });
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
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    >
                      {client.sex ? (
                        client.sex === "M" ? (
                          <PersonOutlineOutlinedIcon />
                        ) : (
                          <Person3OutlinedIcon />
                        )
                      ) : (
                        <PersonOutlineOutlinedIcon />
                      )}
                    </Avatar>
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
        <EntrenadorForm selectedClient={selectedClient} />
        {/* {user && user.role === Role.Profesional && (
          <EntrenadorForm selectedClient={selectedClient} />
        )}
        {user && user.role === Role.Nutricionista && (
          <Typography variant="h6">Nutricionista</Typography>
        )}
        {user && user.role === Role.Profesional && (
          <Typography variant="h6">Profesional</Typography>
        )} */}
      </Grid2>
    </Grid2>
  );
};
