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
  Grid2,
  ListItemIcon,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import AddIcon from "@mui/icons-material/Add";
import SetMealIcon from "@mui/icons-material/SetMeal";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChevronRight from "@mui/icons-material/ChevronRight";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import OpacityIcon from "@mui/icons-material/Opacity";
import { useState } from "react";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { PlanNutricional } from "../../../../../../infrastructure/interfaces/plan-nutricional";
import {
  deletePlanNutricionalRequest,
  setPlanNutricionalRequest,
  updatePlanNutricionalRequest,
} from "../../../../../../services/nutricion";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { DocumentosForm } from "../components/DocumentosForm";
import { Routine } from "../../../../../../infrastructure/interfaces/routine";

interface Props {
  selectedClient: Partial<User> | null;
  onUpdateClient: (client: Partial<User>) => void;
  documents: Partial<Documento>[];
  routines: Partial<Routine>[];
  planesNutricionales: Partial<PlanNutricional>[];
}

export const NutricionistaForm: React.FC<Props> = ({
  selectedClient,
  onUpdateClient,
  documents,
  routines,
  planesNutricionales,
}) => {
  // Estados para los campos del plan nutricional
  const [planName, setPlanName] = useState<string>("");
  const [planDescription, setPlanDescription] = useState<string>("");
  const [caloriasDiarias, setCaloriasDiarias] = useState<string>("");
  const [proteinas, setProteinas] = useState<string>("");
  const [carbohidratos, setCarbohidratos] = useState<string>("");
  const [grasas, setGrasas] = useState<string>("");
  const [objetivos, setObjetivos] = useState<string>("");
  const [notasAdicionales, setNotasAdicionales] = useState<string>("");
  // Estado para el plan que se está editando
  const [currentPlan, setCurrentPlan] = useState<PlanNutricional | null>(null);
  // Modal control
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [focusDocumentos, setFocusDocumentos] = useState(false);

  // Abrir modal en modo creación
  const handleOpenModal = () => {
    setCurrentPlan(null);
    setPlanName("");
    setPlanDescription("");
    setCaloriasDiarias("");
    setProteinas("");
    setCarbohidratos("");
    setGrasas("");
    setObjetivos("");
    setNotasAdicionales("");
    setOpenPlanModal(true);
  };

  // Abrir modal en modo edición: precargar campos con el plan existente
  const handleOpenEditModal = (plan: PlanNutricional) => {
    setCurrentPlan(plan);
    setPlanName(plan.nombre ?? "");
    setPlanDescription(plan.descripcion ?? "");
    setCaloriasDiarias((plan.caloriasDiarias ?? 0).toString());
    setProteinas(plan.macronutrientes?.proteinas?.toString() ?? "");
    setCarbohidratos(plan.macronutrientes?.carbohidratos?.toString() ?? "");
    setGrasas(plan.macronutrientes?.grasas?.toString() ?? "");
    setObjetivos(plan.objetivos ?? "");
    setNotasAdicionales(plan.notasAdicionales ?? "");
    setOpenPlanModal(true);
  };

  // Función para guardar un nuevo plan nutricional
  const handleSavePlan = async () => {
    if (!selectedClient || !selectedClient.id) return;
    // Se arma el objeto DTO para la creación. Se usa "any" para incluir propiedades que no figuran en el interface del front.
    const newPlan = {
      nombre: planName,
      descripcion: planDescription,
      pacienteId: selectedClient.id,
      objetivos,
      caloriasDiarias: parseFloat(caloriasDiarias) || 0,
      macronutrientes: {
        proteinas: parseFloat(proteinas) || 0,
        carbohidratos: parseFloat(carbohidratos) || 0,
        grasas: parseFloat(grasas) || 0,
      },
      notasAdicionales,
    };

    try {
      const data = await setPlanNutricionalRequest(newPlan);
      if (data?.id) {
        selectedClient.planesNutricionales = [
          ...(selectedClient.planesNutricionales || []),
          data,
        ];
        setOpenPlanModal(false);
      } else {
        console.error("Error al guardar el plan nutricional", data);
      }
    } catch (error) {
      console.error("Error al guardar el plan nutricional", error);
    }
  };

  const onFocus = (state: boolean) => {
    setFocusDocumentos(state);
  };

  // Función para actualizar un plan existente
  const handleUpdatePlan = async () => {
    if (!selectedClient || !selectedClient.id || !currentPlan) return;
    const updatedPlan = {
      id: currentPlan.id,
      nombre: planName,
      descripcion: planDescription,
      pacienteId: selectedClient.id,
      objetivos,
      caloriasDiarias: parseFloat(caloriasDiarias) || 0,
      macronutrientes: {
        proteinas: parseFloat(proteinas) || 0,
        carbohidratos: parseFloat(carbohidratos) || 0,
        grasas: parseFloat(grasas) || 0,
      },
      notasAdicionales,
    };

    const data = await updatePlanNutricionalRequest(updatedPlan);
    if (data?.id) {
      selectedClient.planesNutricionales = (
        selectedClient.planesNutricionales || []
      ).map((p) => (p.id === currentPlan.id ? data : p));
      // Opcional: limpiar estados y cerrar modal
      setCurrentPlan(null);
      setOpenPlanModal(false);
    } else {
      console.error("Error al actualizar el plan nutricional", data);
    }
  };
  const removePlan = async (id: number) => {
    const response = await deletePlanNutricionalRequest(id);
    if (response.data) {
      if (selectedClient?.planesNutricionales) {
        const updatedClient = {
          ...selectedClient,
          planesNutricionales: selectedClient.planesNutricionales.map((p) =>
            p.id === id
              ? { ...p, fechaBaja: p.fechaBaja ? null : new Date() }
              : p
          ),
        };
        console.log("updatedClient", updatedClient);
        onUpdateClient(updatedClient);
      }
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
                ? focusDocumentos
                  ? 4
                  : 8
                : 12,
          }}
          sx={{
            borderRight:
              documents.length > 0 ||
              routines.length > 0 ||
              planesNutricionales.length > 0
                ? "1px solid #ddd"
                : "none",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {/* Listado de Planes Nutricionales */}
          {selectedClient.planesNutricionales && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: "background.paper",
                position: "relative",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Planes Nutricionales
              </Typography>
              <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "absolute", top: 0, right: 16 }}
                onClick={handleOpenModal}
              >
                <AddIcon />
              </Fab>
              {selectedClient.planesNutricionales.map((plan) => (
                <Accordion
                  key={plan.id}
                  disableGutters
                  TransitionProps={{ unmountOnExit: true }}
                  onFocus={() => {
                    onFocus(false);
                  }}
                  sx={{
                    opacity: plan.fechaBaja ? 0.6 : 1,
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    "&:before": {
                      display: "none",
                    },
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor: "action.hover",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "& .MuiAccordionSummary-content": {
                        marginY: 1,
                      },
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: plan.fechaBaja ? "error.main" : "text.primary",
                        }}
                      >
                        {plan.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.fechaCreacion
                          ? new Date(plan.fechaCreacion).toLocaleDateString()
                          : "Fecha no definida"}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {plan.descripcion || "Sin descripción"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <RestaurantIcon sx={{ mr: 1 }} color="primary" />
                      Calorías Diarias: {plan.caloriasDiarias || 0}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Macronutrientes:</Typography>
                      <List dense>
                        <ListItem>
                          <SetMealIcon sx={{ mr: 1 }} color="primary" />
                          <ListItemText
                            primary={`Proteínas: ${
                              plan.macronutrientes?.proteinas || 0
                            }%`}
                          />
                        </ListItem>
                        <ListItem>
                          <BreakfastDiningIcon sx={{ mr: 1 }} color="primary" />
                          <ListItemText
                            primary={`Carbohidratos: ${
                              plan.macronutrientes?.carbohidratos || 0
                            }%`}
                          />
                        </ListItem>
                        <ListItem>
                          <OpacityIcon sx={{ mr: 1 }} color="primary" />
                          <ListItemText
                            primary={`Grasas: ${
                              plan.macronutrientes?.grasas || 0
                            }%`}
                          />
                        </ListItem>
                      </List>
                    </Box>
                    <Typography variant="body2">Objetivos:</Typography>
                    <List dense>
                      {plan.objetivos?.split(",").map((objetivo, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ChevronRight sx={{ color: "primary.main" }} />
                          </ListItemIcon>
                          <ListItemText primary={`${objetivo.trim()}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      Notas Adicionales: {plan.notasAdicionales || "Sin notas"}
                    </Typography>
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
                        onClick={() => handleOpenEditModal(plan)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={
                          plan.fechaBaja ? <UnarchiveIcon /> : <ArchiveIcon />
                        }
                        onClick={() => removePlan(plan.id)}
                      >
                        {plan.fechaBaja ? "Restaurar" : "Archivar"}
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
          <Grid2
            size={{ xs: focusDocumentos ? 8 : 4 }}
            sx={{ transition: "all 0.2s ease-in-out" }}
          >
            <DocumentosForm
              documents={documents}
              routines={routines}
              planesNutricionales={planesNutricionales}
              onFocus={onFocus}
            />
          </Grid2>
        )}
      </Grid2>

      {/* Modal para Crear/Editar Plan Nutricional */}
      <Dialog
        open={openPlanModal}
        onClose={() => setOpenPlanModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentPlan?.id
            ? "Editar Plan Nutricional"
            : "Crear Plan Nutricional"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nombre del Plan"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2, borderRadius: "8px" }}
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
          />
          <TextField
            label="Calorías Diarias"
            variant="outlined"
            fullWidth
            type="number"
            sx={{ my: 1, borderRadius: "8px" }}
            value={caloriasDiarias}
            onChange={(e) => setCaloriasDiarias(e.target.value)}
            InputProps={{
              startAdornment: <RestaurantIcon sx={{ mr: 1 }} color="primary" />,
            }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Macronutrientes (%)
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Proteínas"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={proteinas}
                  onChange={(e) => setProteinas(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SetMealIcon sx={{ mr: 1 }} color="primary" />
                    ),
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Carbohidratos"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={carbohidratos}
                  onChange={(e) => setCarbohidratos(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <BreakfastDiningIcon sx={{ mr: 1 }} color="primary" />
                    ),
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Grasas"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={grasas}
                  onChange={(e) => setGrasas(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <OpacityIcon sx={{ mr: 1 }} color="primary" />
                    ),
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid2>
            </Grid2>
            <Typography
              variant="caption"
              color={
                Number(proteinas) + Number(carbohidratos) + Number(grasas) !==
                100
                  ? "error.main"
                  : "text.secondary"
              }
              sx={{ mt: 1 }}
            >
              * Los porcentajes de macronutrientes deben sumar 100%.
            </Typography>
          </Box>
          <TextField
            label="Objetivos"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={objetivos}
            onChange={(e) => setObjetivos(e.target.value)}
          />
          <TextField
            label="Notas Adicionales"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            sx={{ my: 1, borderRadius: "8px" }}
            value={notasAdicionales}
            onChange={(e) => setNotasAdicionales(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPlanModal(false)} color="secondary">
            Cancelar
          </Button>
          {currentPlan?.id ? (
            <Button
              onClick={handleUpdatePlan}
              variant="contained"
              color="primary"
              disabled={
                !planName ||
                !caloriasDiarias ||
                !proteinas ||
                !carbohidratos ||
                !grasas ||
                Number(proteinas) + Number(carbohidratos) + Number(grasas) !==
                  100
              }
            >
              Actualizar Plan
            </Button>
          ) : (
            <Button
              onClick={handleSavePlan}
              variant="contained"
              color="primary"
            >
              Guardar Plan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Seleccione un cliente para ver sus planes nutricionales.
      </Typography>
    </Box>
  );
};
