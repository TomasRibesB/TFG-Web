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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { PlanNutricional } from "../../../../../../infrastructure/interfaces/plan-nutricional";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import OpacityIcon from "@mui/icons-material/Opacity";

interface Props {
  selectedClient: Partial<User> | null;
}

export const NutricionistaForm: React.FC<Props> = ({ selectedClient }) => {
  // Campos del plan nutricional
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [caloriasDiarias, setCaloriasDiarias] = useState("");
  // En lugar de un input JSON, usaremos campos separados para cada macronutriente
  const [proteinas, setProteinas] = useState("");
  const [carbohidratos, setCarbohidratos] = useState("");
  const [grasas, setGrasas] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [notasAdicionales, setNotasAdicionales] = useState("");

  // Lista de planes creados en sesión
  const [createdPlans, setCreatedPlans] = useState<PlanNutricional[]>([]);

  // Modal control para crear/editar plan
  const [openPlanModal, setOpenPlanModal] = useState(false);

  const handleOpenModal = () => {
    // Reiniciamos todos los campos al abrir el modal
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

  const handleSavePlan = () => {
    const newPlan: PlanNutricional = {
      id: Date.now(),
      nombre: planName,
      descripcion: planDescription,
      fechaCreacion: new Date(),
      caloriasDiarias: parseFloat(caloriasDiarias) || 0,
      macronutrientes: {
        proteinas: parseFloat(proteinas) || 0,
        carbohidratos: parseFloat(carbohidratos) || 0,
        grasas: parseFloat(grasas) || 0,
      },
      objetivos,
      notasAdicionales,
      paciente: selectedClient as User,
      nutricionista: selectedClient as User, // Ajusta según corresponda
    };
    setCreatedPlans([...createdPlans, newPlan]);
    setOpenPlanModal(false);
  };

  const removePlan = (id: number) => {
    setCreatedPlans(createdPlans.filter((plan) => plan.id !== id));
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      {/* Listado de Planes Nutricionales */}
      {(selectedClient.planesNutricionales || createdPlans.length > 0) && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Planes Nutricionales
          </Typography>
          {(selectedClient.planesNutricionales || []).map((plan) => (
            <Accordion
              key={plan.id}
              disableGutters
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">{plan.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {plan.fechaCreacion
                      ? new Date(plan.fechaCreacion).toLocaleDateString()
                      : "Fecha no definida"}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  {plan.descripcion || "Sin descripción"}
                </Typography>
                <Typography variant="body2">
                  Calorías Diarias: {plan.caloriasDiarias || 0}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Macronutrientes:</Typography>
                  <List dense>
                    <ListItem>
                      <FitnessCenterIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Proteínas: ${
                          plan.macronutrientes?.proteinas || 0
                        } g`}
                      />
                    </ListItem>
                    <ListItem>
                      <LocalDiningIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Carbohidratos: ${
                          plan.macronutrientes?.carbohidratos || 0
                        } g`}
                      />
                    </ListItem>
                    <ListItem>
                      <OpacityIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Grasas: ${
                          plan.macronutrientes?.grasas || 0
                        } g`}
                      />
                    </ListItem>
                  </List>
                </Box>
                <Typography variant="body2">
                  Objetivos: {plan.objetivos || "No especificados"}
                </Typography>
                <Typography variant="body2">
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
                  <Button variant="outlined" startIcon={<EditIcon />}>
                    Editar Plan
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => removePlan(plan.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Listado de planes creados en sesión */}
          {createdPlans.map((plan) => (
            <Accordion
              key={plan.id}
              disableGutters
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">{plan.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {plan.fechaCreacion
                      ? new Date(plan.fechaCreacion).toLocaleDateString()
                      : "Fecha no definida"}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  {plan.descripcion || "Sin descripción"}
                </Typography>
                <Typography variant="body2">
                  Calorías Diarias: {plan.caloriasDiarias || 0}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Macronutrientes:</Typography>
                  <List dense>
                    <ListItem>
                      <FitnessCenterIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Proteínas: ${
                          plan.macronutrientes?.proteinas || 0
                        } g`}
                      />
                    </ListItem>
                    <ListItem>
                      <LocalDiningIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Carbohidratos: ${
                          plan.macronutrientes?.carbohidratos || 0
                        } g`}
                      />
                    </ListItem>
                    <ListItem>
                      <OpacityIcon sx={{ mr: 1 }} color="primary" />
                      <ListItemText
                        primary={`Grasas: ${
                          plan.macronutrientes?.grasas || 0
                        } g`}
                      />
                    </ListItem>
                  </List>
                </Box>
                <Typography variant="body2">
                  Objetivos: {plan.objetivos || "No especificados"}
                </Typography>
                <Typography variant="body2">
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
                  <Button variant="outlined" startIcon={<EditIcon />}>
                    Editar Plan
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => removePlan(plan.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Modal para Crear / Editar Plan Nutricional */}
      <Dialog
        open={openPlanModal}
        onClose={() => setOpenPlanModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {planName ? "Editar Plan Nutricional" : "Crear Plan Nutricional"}
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
            sx={{ my: 1, borderRadius: "8px" }}
            value={caloriasDiarias}
            onChange={(e) => setCaloriasDiarias(e.target.value)}
            type="number"
          />
          {/* Sección para ingresar macronutrientes de forma sencilla */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Macronutrientes (g)
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={4}>
                <TextField
                  label="Proteínas"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={proteinas}
                  onChange={(e) => setProteinas(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <FitnessCenterIcon sx={{ mr: 1 }} color="primary" />
                    ),
                  }}
                />
              </Grid2>
              <Grid2 xs={12} sm={4}>
                <TextField
                  label="Carbohidratos"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={carbohidratos}
                  onChange={(e) => setCarbohidratos(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <LocalDiningIcon sx={{ mr: 1 }} color="primary" />
                    ),
                  }}
                />
              </Grid2>
              <Grid2 xs={12} sm={4}>
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
                  }}
                />
              </Grid2>
            </Grid2>
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
          <Button onClick={handleSavePlan} variant="contained" color="primary">
            Guardar Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para abrir el modal de Crear Plan */}
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
      Seleccione un cliente para ver los detalles y administrar planes
      nutricionales.
    </Typography>
  );
};
