import {
  Typography,
  Box,
  TextField,
  Button,
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
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { Ejercicio } from "../../../../../../infrastructure/interfaces/ejercicio";
import { RutinaEjercicio } from "../../../../../../infrastructure/interfaces/rutina-ejercicio";
import {
  getEjerciciosRequest,
  setRoutineRequest,
  updateRoutineRequest,
} from "../../../../../../services/entrenamiento";
import { Routine } from "../../../../../../infrastructure/interfaces/routine";
import { UnidadMedida } from "../../../../../../infrastructure/enums/unidadMedida";

interface Props {
  selectedClient: Partial<User> | null;
}

export const EntrenadorForm: React.FC<Props> = ({ selectedClient }) => {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [addedExercises, setAddedExercises] = useState<RutinaEjercicio[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [exerciseSearchGroup, setExerciseSearchGroup] = useState("");
  const [exerciseSearchCategory, setExerciseSearchCategory] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<Partial<Routine> | null>(
    null
  );
  const [openRoutineModal, setOpenRoutineModal] = useState(false);

  // Búsqueda de ejercicios (con debounce)
  useEffect(() => {
    if (!exerciseSearch && !exerciseSearchCategory && !exerciseSearchGroup) {
      setFilteredExercises([]);
      return;
    }
    const timer = setTimeout(async () => {
      const ejercicios = await getEjerciciosRequest(
        exerciseSearch,
        exerciseSearchCategory ? +exerciseSearchCategory : 0,
        exerciseSearchGroup ? +exerciseSearchGroup : 0
      );
      setFilteredExercises(ejercicios);
    }, 1000);
    return () => clearTimeout(timer);
  }, [exerciseSearch, exerciseSearchCategory, exerciseSearchGroup]);

  // Agregar ejercicio a la rutina con valores por defecto
  const addExerciseToRoutine = (exercise: Ejercicio) => {
    const newRutinaEjercicio: RutinaEjercicio = {
      id: Date.now(), // id temporal para demo
      routine: {
        id: currentRoutine?.id || 0,
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

  // Permitir editar campos de cada ejercicio agregado
  const handleExerciseChange = (
    id: number,
    field: keyof RutinaEjercicio,
    value: string | number | Date
  ) => {
    setAddedExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const removeExerciseFromRoutine = (id: number) => {
    setAddedExercises(addedExercises.filter((ex) => ex.id !== id));
  };

  // Al guardar, se arma el objeto DTO de actualización
  const handleUpdateRoutine = async () => {
    if (!selectedClient || !selectedClient.id || !currentRoutine) return;

    // Mapeamos los ejercicios: se envía un arreglo de objetos con al menos el id
    const ejerciciosDTO = addedExercises.map((rutEx) => ({
      id: rutEx.ejercicio.id,
      // Puedes incluir otros campos si lo requiere el backend
    }));

    // Se envía la información completa de cada registro de ejercicio
    const ejerciciosRegistrosDTO = addedExercises.map((rutEx) => ({
      // Aquí se envían todos los datos que espera el backend para cada RutinaEjercicio:
      id: rutEx.id,
      series: rutEx.series,
      repeticiones: rutEx.repeticiones,
      medicion: rutEx.medicion,
      fecha: rutEx.fecha,
      // Puedes incluir, si es necesario, más información para vincular la relación
      ejercicio: { id: rutEx.ejercicio.id },
      routine: { id: currentRoutine.id },
    }));

    const updatedRoutineDto = {
      id: currentRoutine.id, // Obligatorio
      name: routineName, // Se transformará a mayúsculas según el DTO
      description: routineDescription, // Opcional
      userId: selectedClient.id, // Obligatorio
      ejercicios: ejerciciosDTO, // Array de Ejercicio (debe existir en la BD)
      ejerciciosRegistros: ejerciciosRegistrosDTO, // Detalles de cada ejercicio agregado
    };

    const response = await updateRoutineRequest(updatedRoutineDto);
    if (response.data?.id) {
      // Actualiza la rutina en el estado del cliente
      selectedClient.routines = (selectedClient.routines || []).map((rut) =>
        rut.id === currentRoutine.id ? (response.data as Routine) : rut
      );
      // Reinicia los estados y cierra el modal
      setRoutineName("");
      setRoutineDescription("");
      setAddedExercises([]);
      setCurrentRoutine(null);
      setOpenRoutineModal(false);
    } else {
      console.log("Error al actualizar la rutina", response);
    }
  };

  // Función para guardar una nueva rutina (si se requiere pasar también el DTO correspondiente)
  const handleSaveRoutine = async () => {
    if (!selectedClient || !selectedClient.id) return;
    const newRoutineDto = {
      name: routineName,
      description: routineDescription,
      userId: selectedClient.id,
      ejercicios: addedExercises.map((rutEx) => ({ id: rutEx.ejercicio.id })),
      ejerciciosRegistros: addedExercises.map((rutEx) => ({
        id: rutEx.id,
        series: rutEx.series,
        repeticiones: rutEx.repeticiones,
        medicion: rutEx.medicion,
        fecha: rutEx.fecha,
        ejercicio: { id: rutEx.ejercicio.id },
        // En creación, routine puede estar incompleto; el backend lo asigna posteriormente
      })),
    };

    const response = await setRoutineRequest(newRoutineDto);
    if (response.data?.id) {
      selectedClient.routines = [
        ...(selectedClient.routines || []),
        response.data as Routine,
      ];
      setRoutineName("");
      setRoutineDescription("");
      setAddedExercises([]);
      setOpenRoutineModal(false);
    } else {
      console.log("Error al guardar la rutina", response);
    }
  };

  // Abrir modal en modo creación o edición precargando datos
  const handleOpenModal = (routine?: Routine) => {
    if (routine) {
      setCurrentRoutine(routine);
      setRoutineName(routine.name);
      setRoutineDescription(routine.description || "");
      setAddedExercises(routine.rutinaEjercicio || []);
    } else {
      setCurrentRoutine(null);
      setRoutineName("");
      setRoutineDescription("");
      setAddedExercises([]);
    }
    setOpenRoutineModal(true);
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={9} sx={{ borderRight: "1px solid #ddd" }}>
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
                          ? new Date(
                              (routine as { createdAt?: string }).createdAt!
                            ).toLocaleDateString()
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
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenModal(routine)}
                      >
                        Editar Rutina
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
            <Typography variant="h6" gutterBottom>
              Documentos
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Modal para Crear/Editar Rutina */}
      <Dialog
        open={openRoutineModal}
        onClose={() => setOpenRoutineModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentRoutine?.id ? "Editar Rutina" : "Crear Rutina"}
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
          {/* Buscador de Ejercicios */}
          <TextField
            label="Buscar Ejercicio"
            variant="outlined"
            fullWidth
            sx={{ my: 1 }}
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
          />
          {filteredExercises.length > 0 && (
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 1,
                borderRadius: "8px",
                height: "200px",
                overflowY: "auto",
              }}
            >
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
          {/* Lista de Ejercicios Agregados con inputs para editar series, repeticiones y medición */}
          {addedExercises.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ejercicios Agregados
              </Typography>
              <List>
                {addedExercises.map((rutEx) => (
                  <ListItem
                    key={rutEx.id}
                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <Typography variant="subtitle1">
                      {rutEx.ejercicio.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        width: "100%",
                      }}
                    >
                      <TextField
                        label="Series"
                        type="number"
                        value={rutEx.series}
                        onChange={(e) =>
                          handleExerciseChange(
                            rutEx.id,
                            "series",
                            Number(e.target.value)
                          )
                        }
                        size="small"
                      />
                      <TextField
                        label="Repeticiones"
                        type="number"
                        value={rutEx.repeticiones}
                        onChange={(e) =>
                          handleExerciseChange(
                            rutEx.id,
                            "repeticiones",
                            Number(e.target.value)
                          )
                        }
                        size="small"
                      />
                      <TextField
                        label={`Medición ${
                          rutEx.ejercicio.unidadMedida !== UnidadMedida.Ninguna
                            ? "(" + rutEx.ejercicio.unidadMedida + ")"
                            : ""
                        }`}
                        type="number"
                        value={rutEx.medicion || ""}
                        onChange={(e) =>
                          handleExerciseChange(
                            rutEx.id,
                            "medicion",
                            e.target.value
                          )
                        }
                        size="small"
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeExerciseFromRoutine(rutEx.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoutineModal(false)} color="secondary">
            Cancelar
          </Button>
          {currentRoutine?.id ? (
            <Button
              onClick={handleUpdateRoutine}
              variant="contained"
              color="primary"
              disabled={!routineName}
            >
              Actualizar Rutina
            </Button>
          ) : (
            <Button
              onClick={handleSaveRoutine}
              variant="contained"
              color="primary"
              disabled={!routineName}
            >
              Guardar Rutina
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* FAB para abrir el modal de Crear Rutina */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => handleOpenModal()}
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
