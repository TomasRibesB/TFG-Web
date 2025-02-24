import {
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { Ejercicio } from "../../../../../../infrastructure/interfaces/ejercicio";
import { RutinaEjercicio } from "../../../../../../infrastructure/interfaces/rutina-ejercicio";
import { UnidadMedida } from "../../../../../../infrastructure/enums/unidadMedida";

interface Props {
  selectedClient: Partial<User> | null;
}

export const EntrenadorForm: React.FC<Props> = ({ selectedClient }) => {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [addedExercises, setAddedExercises] = useState<RutinaEjercicio[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
  // Ejercicios "disponibles" (ejemplo)
  const availableExercises: Ejercicio[] = [
    {
      id: 1,
      name: "Push Up",
      categoriaEjercicio: { id: 1, name: "Fuerza", ejercicios: [] },
      gruposMusculares: [],
      unidadMedida: UnidadMedida.Ninguna,
    },
    {
      id: 2,
      name: "Squat",
      categoriaEjercicio: { id: 1, name: "Fuerza", ejercicios: [] },
      gruposMusculares: [],
      unidadMedida: UnidadMedida.Ninguna,
    },
    {
      id: 3,
      name: "Plank",
      categoriaEjercicio: { id: 2, name: "Resistencia", ejercicios: [] },
      gruposMusculares: [],
      unidadMedida: UnidadMedida.Ninguna,
    },
  ];

  // Modal control (nuevo o edición)
  const [openRoutineModal, setOpenRoutineModal] = useState(false);
  // Si en el futuro queremos editar, podríamos tener:
  // const [currentRoutine, setCurrentRoutine] = useState<RutinaEjercicio | null>(null);

  useEffect(() => {
    if (exerciseSearch.trim() === "") {
      setFilteredExercises([]);
    } else {
      const results = availableExercises.filter((ex) =>
        ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
      );
      setFilteredExercises(results);
    }
  }, [exerciseSearch]);

  const addExerciseToRoutine = (exercise: Ejercicio) => {
    const newRutinaEjercicio: RutinaEjercicio = {
      id: Date.now(), // Para demo, id temporal
      routine: {
        id: 0,
        name: routineName,
        user: selectedClient as User,
        trainer: selectedClient as User,
      },
      ejercicio: exercise,
      fecha: new Date(),
      series: 3,
      repeticiones: 10,
      medicion: "",
    };
    setAddedExercises([...addedExercises, newRutinaEjercicio]);
    setExerciseSearch("");
    setFilteredExercises([]);
  };

  const removeExerciseFromRoutine = (id: number) => {
    setAddedExercises(addedExercises.filter((ex) => ex.id !== id));
  };

  const handleSaveRoutine = () => {
    console.log(
      "Guardando rutina:",
      routineName,
      routineDescription,
      addedExercises
    );
    // Aquí se podría enviar la rutina a un servicio y luego reiniciar el modal
    setRoutineName("");
    setRoutineDescription("");
    setAddedExercises([]);
    setOpenRoutineModal(false);
  };

  // Para abrir el modal y en modo creación reiniciar los estados
  const handleOpenModal = () => {
    setRoutineName("");
    setRoutineDescription("");
    setAddedExercises([]);
    setOpenRoutineModal(true);
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      {/* Información del Cliente */}
      <Grid2 container spacing={2} direction="row">
        <Grid2 size={9} sx={{ borderRight: "1px solid #ddd" }}>
          {/* Listado de Rutinas Existentes */}
          {selectedClient.routines && selectedClient.routines.length > 0 && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
              <Typography variant="h6" gutterBottom>
                Rutinas Actuales
              </Typography>
              {selectedClient.routines.map((routine) => (
                <Accordion
                  key={routine.id}
                  disableGutters
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="subtitle1">
                        {routine.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(routine as { createdAt?: string }).createdAt
                          ? new Date((routine as { createdAt?: string }).createdAt!).toLocaleDateString()
                          : "Fecha no definida"}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" gutterBottom>
                      {routine.description || "Sin descripción"}
                    </Typography>
                    {routine.rutinaEjercicio &&
                      routine.rutinaEjercicio.length > 0 && (
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="subtitle2">
                            Ejercicios:
                          </Typography>
                          <List dense>
                            {routine.rutinaEjercicio.map((rutEx) => (
                              <ListItem
                                key={rutEx.id}
                                disableGutters
                                sx={{ pl: 2 }}
                              >
                                <ListItemText
                                  primary={rutEx.ejercicio.name}
                                  secondary={`Series: ${rutEx.series} - Reps: ${
                                    rutEx.repeticiones
                                  }${
                                    rutEx.medicion
                                      ? " - Medición: " + rutEx.medicion
                                      : ""
                                  }`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button variant="outlined" startIcon={<EditIcon />}>
                        {/* Aquí podrías abrir el modal en modo "editar" y cargar los datos */}
                        Editar Rutina
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Grid2>
        <Grid2 size={3}>
          {/* Sección para Documentos u otra información */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Documentos
            </Typography>
            {/* Lista de documentos del cliente */}
          </Box>
        </Grid2>
      </Grid2>

      {/* Modal para Crear / Editar Rutina */}
      <Dialog
        open={openRoutineModal}
        onClose={() => setOpenRoutineModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {routineName ? "Editar Rutina" : "Crear Rutina"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nombre de la Rutina"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2, borderRadius: "8px" }}
            value={routineDescription}
            onChange={(e) => setRoutineDescription(e.target.value)}
          />
          <TextField
            label="Buscar ejercicio"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
          />
          {filteredExercises.length > 0 && (
            <Box sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: "8px" }}>
              {filteredExercises.map((ex) => (
                <Box
                  key={ex.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <Typography>{ex.name}</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addExerciseToRoutine(ex)}
                  >
                    Agregar
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ejercicios en la Rutina
            </Typography>
            {addedExercises.length === 0 ? (
              <Typography variant="body2">
                Ningún ejercicio agregado aún.
              </Typography>
            ) : (
              <List dense>
                {addedExercises.map((ex) => (
                  <ListItem key={ex.id} sx={{ pl: 2 }}>
                    <ListItemText
                      primary={ex.ejercicio.name}
                      secondary={`Series: ${ex.series} - Reps: ${
                        ex.repeticiones
                      }${ex.medicion ? " - Medición: " + ex.medicion : ""}`}
                    />
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => removeExerciseFromRoutine(ex.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoutineModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveRoutine}
            variant="contained"
            color="primary"
          >
            Guardar Rutina
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para abrir el modal de Crear Rutina */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={handleOpenModal}
      >
        <AddIcon />
      </Fab>
    </Box>
  ) : (
    <Typography variant="h6">
      Seleccione un cliente para ver los detalles y administrar rutinas.
    </Typography>
  );
};
