import React, { useState, useEffect } from "react";
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
  Autocomplete,
  Grid2,
  MenuItem,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { Ejercicio } from "../../../../../../infrastructure/interfaces/ejercicio";
import { RutinaEjercicio } from "../../../../../../infrastructure/interfaces/rutina-ejercicio";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getEjerciciosRequest,
  setRoutineRequest,
  updateRoutineRequest,
  deleteRoutineRequest,
} from "../../../../../../services/entrenamiento";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { Routine } from "../../../../../../infrastructure/interfaces/routine";
import { UnidadMedida } from "../../../../../../infrastructure/enums/unidadMedida";
import { GruposMusculares } from "../../../../../../infrastructure/interfaces/grupos-musculares";
import { CategoriaEjercicio } from "../../../../../../infrastructure/interfaces/categoria-ejercicio";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { DocumentosForm } from "../components/DocumentosForm";
import { PlanNutricional } from "../../../../../../infrastructure/interfaces/plan-nutricional";

interface Props {
  selectedClient: Partial<User> | null;
  gruposMusculares: GruposMusculares[];
  categoriasEjercicio: CategoriaEjercicio[];
  onUpdateClient: (client: Partial<User>) => void;
  documents: Partial<Documento>[];
  routines: Partial<Routine>[];
  planesNutricionales: Partial<PlanNutricional>[];
}

export const EntrenadorForm: React.FC<Props> = ({
  selectedClient,
  gruposMusculares,
  categoriasEjercicio,
  onUpdateClient,
  documents,
  routines,
  planesNutricionales,
}) => {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [addedExercises, setAddedExercises] = useState<RutinaEjercicio[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [exerciseSearchMuscularGroup, setExerciseSearchMuscularGroup] =
    useState<GruposMusculares[]>([]);
  const [exerciseSearchCategory, setExerciseSearchCategory] = useState<
    CategoriaEjercicio[]
  >([]);
  const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<Partial<Routine> | null>(
    null
  );
  const [openRoutineModal, setOpenRoutineModal] = useState(false);

  // Búsqueda de ejercicios con debounce y filtros (search, categoría y grupo muscular)
  useEffect(() => {
    if (
      !exerciseSearch &&
      exerciseSearchCategory.length === 0 &&
      exerciseSearchMuscularGroup.length === 0
    ) {
      setFilteredExercises([]);
      return;
    }
    const timer = setTimeout(async () => {
      const ejercicios = await getEjerciciosRequest(
        exerciseSearch,
        exerciseSearchCategory.length
          ? exerciseSearchCategory.map((c) => c.id)
          : [],
        exerciseSearchMuscularGroup.length
          ? exerciseSearchMuscularGroup.map((g) => g.id)
          : []
      );
      setFilteredExercises(ejercicios);
    }, 1000);
    return () => clearTimeout(timer);
  }, [exerciseSearch, exerciseSearchCategory, exerciseSearchMuscularGroup]);

  // Función para agregar ejercicio a la rutina con valores por defecto
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
      unidadMedida: UnidadMedida.Ninguna,
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

  const removeExerciseFromRoutine = async (id: number) => {
    // Actualizamos selectedClient con response, obteniendo las rutinas, identificando el documento eliminado y le pongo la fechaBaja
    if (!selectedClient || !selectedClient.id) return;
    selectedClient!.routines = (selectedClient!.routines || []).map((rut) =>
      rut.id === id ? { ...rut, fechaBaja: new Date() } : rut
    );
    setAddedExercises(addedExercises.filter((ex) => ex.id !== id));
  };

  // Función para actualizar la rutina (usar handleUpdateRoutine o handleSaveRoutine según corresponda)
  const handleUpdateRoutine = async () => {
    if (!selectedClient || !selectedClient.id || !currentRoutine) return;

    // Mapeamos los ejercicios para el DTO
    const ejerciciosDTO = addedExercises.map((rutEx) => ({
      id: rutEx.ejercicio.id,
    }));

    // Se envía la información completa de cada registro de ejercicio
    const ejerciciosRegistrosDTO = addedExercises.map((rutEx) => ({
      id: rutEx.id,
      series: rutEx.series,
      repeticiones: rutEx.repeticiones,
      medicion: rutEx.medicion,
      fecha: rutEx.fecha,
      ejercicio: { id: rutEx.ejercicio.id },
      routine: { id: currentRoutine.id },
      unidadMedida: rutEx.unidadMedida || UnidadMedida.Ninguna,
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
      selectedClient.routines = (selectedClient.routines || []).map((rut) =>
        rut.id === currentRoutine.id ? (response.data as Routine) : rut
      );
      // Reiniciar estados y cerrar modal
      setRoutineName("");
      setRoutineDescription("");
      setAddedExercises([]);
      setCurrentRoutine(null);
      setOpenRoutineModal(false);
    } else {
      console.log("Error al actualizar la rutina", response);
    }
  };

  const handleSaveRoutine = async () => {
    if (!selectedClient || !selectedClient.id) return;
    const newRoutineDto = {
      name: routineName,
      description: routineDescription,
      userId: selectedClient.id,
      ejerciciosRegistros: addedExercises.map((rutEx) => ({
        series: rutEx.series,
        repeticiones: rutEx.repeticiones,
        medicion: rutEx.medicion,
        fecha: rutEx.fecha,
        ejercicio: { id: rutEx.ejercicio.id },
        unidadMedida: rutEx.unidadMedida || UnidadMedida.Ninguna,
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

  // Función para abrir el modal (modo creación o edición)
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

  const removeRoutine = async (id: number) => {
    if (!selectedClient) return;
    const response = await deleteRoutineRequest(id);
    if (response.data) {
      const updatedClient = {
        ...selectedClient,
        routines: (selectedClient.routines || []).map((rut) =>
          rut.id === id
            ? { ...rut, fechaBaja: rut.fechaBaja ? null : new Date() }
            : rut
        ),
      };
      onUpdateClient(updatedClient);
    }
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            xs:
              documents.length > 0 ||
              routines.length > 0 ||
              planesNutricionales.length > 0
                ? 9
                : 12,
          }}
          sx={{
            borderRight:
              documents.length > 0 ||
              routines.length > 0 ||
              planesNutricionales.length > 0
                ? "1px solid #ddd"
                : "none",
          }}
        >
          {selectedClient.routines && selectedClient.routines.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: "background.paper",
                position: "relative",
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "absolute", top: 0, right: 16 }}
                onClick={() => handleOpenModal()}
              >
                <AddIcon />
              </Fab>
              <Typography variant="h6" gutterBottom>
                Rutinas
              </Typography>
              {selectedClient.routines.map((routine) => (
                <Accordion
                  key={routine.id}
                  disableGutters
                  TransitionProps={{ unmountOnExit: true }}
                  sx={{
                    opacity: routine.fechaBaja ? 0.6 : 1,
                    mb: 1,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: routine.fechaBaja
                            ? "error.main"
                            : "text.primary",
                        }}
                      >
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
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={
                          routine.fechaBaja ? (
                            <UnarchiveIcon />
                          ) : (
                            <ArchiveIcon />
                          )
                        }
                        onClick={() => removeRoutine(routine.id)}
                      >
                        {routine.fechaBaja ? "Restaurar" : "Archivar"}
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Grid2>
        {(documents.length > 0 ||
          routines.length > 0 ||
          planesNutricionales.length > 0) && (
          <Grid2 size={{ xs: 3 }}>
            <DocumentosForm
              documents={documents}
              routines={routines}
              planesNutricionales={planesNutricionales}
            />
          </Grid2>
        )}
      </Grid2>

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

          {/* Campo de búsqueda */}
          <TextField
            label="Buscar Ejercicio"
            variant="outlined"
            fullWidth
            sx={{ my: 1 }}
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
          />

          {/* Filtro por Categoría */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={categoriasEjercicio}
                getOptionLabel={(option) => option.name}
                value={exerciseSearchCategory}
                onChange={(_, newValue) => setExerciseSearchCategory(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Categoría" variant="outlined" />
                )}
                sx={{ my: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              {/* Filtro por Grupo Muscular */}
              <Autocomplete
                multiple
                options={gruposMusculares}
                getOptionLabel={(option) => option.name}
                value={exerciseSearchMuscularGroup}
                onChange={(_, newValue) =>
                  setExerciseSearchMuscularGroup(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Grupo Muscular"
                    variant="outlined"
                  />
                )}
                sx={{ my: 1 }}
              />
            </Grid2>
          </Grid2>

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

          {/* Lista de Ejercicios Agregados */}
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
                        label="Medición"
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
                      <TextField
                        select
                        sx={{ width: "170px" }}
                        label="Unidad de Medida"
                        value={rutEx.unidadMedida}
                        onChange={(e) =>
                          handleExerciseChange(
                            rutEx.id,
                            "unidadMedida",
                            e.target.value
                          )
                        }
                        size="small"
                      >
                        {Object.values(UnidadMedida)
                          .filter((unit) => unit !== UnidadMedida.Ninguna)
                          .map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                      </TextField>
                      <IconButton
                        color="error"
                        onClick={() => removeExerciseFromRoutine(rutEx.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
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
    </Box>
  ) : (
    <Typography
      variant="body1"
      sx={{ m: "auto", textAlign: "center", justifyContent: "center" }}
    >
      Seleccione un cliente para ver sus rutinas.
    </Typography>
  );
};
