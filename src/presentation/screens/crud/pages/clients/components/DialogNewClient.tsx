import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { getUserByDNIForProfesional } from "../../../../../../services/user";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { ImageAvatar } from "../../../../../components/ImageAvatar";

interface AssignClientModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (client: User) => void;
  existingClients: Partial<User>[]; // nueva propiedad para pasar los clientes existentes
}

export const DialogNewClient: React.FC<AssignClientModalProps> = ({
  open,
  onClose,
  onAssign,
  existingClients,
}) => {
  const [dni, setDni] = useState("");
  const [client, setClient] = useState<User | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setClient(null);
    if (!dni.trim()) {
      setError("Ingrese un DNI válido.");
      return;
    }
    try {
      const data = await getUserByDNIForProfesional(dni.trim());
      console.log(data);
      if (data && data.id) {
        // Verificar si el cliente ya existe
        if (existingClients.some((existing) => existing?.id === data.id)) {
          setError("Ya tienes asignado a este cliente.");
          return;
        }
        setClient(data);
      } else {
        setError("Cliente no encontrado.");
      }
    } catch (err) {
      setError("Error al buscar el cliente.");
      console.error(err);
    }
  };

  const handleAssign = () => {
    if (client) {
      onAssign(client);
      setDni("");
      setClient(null);
      onClose();
    }
  };

  const handleClose = () => {
    setDni("");
    setClient(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Cliente</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="DNI"
          variant="outlined"
          fullWidth
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {client && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <ImageAvatar
              user={client}
              alt={client.firstName}
              sx={{ width: 56, height: 56, mr: 2 }}
            >
              {client.firstName?.charAt(0)}
            </ImageAvatar>
            <Box>
              <Typography variant="h6">
                {client.firstName} {client.lastName}
              </Typography>
              <Typography variant="body2">DNI: {client.dni}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          color="primary"
          disabled={!client}
        >
          Asignar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
};
