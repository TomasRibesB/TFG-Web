import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SetMealIcon from "@mui/icons-material/SetMeal";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import OpacityIcon from "@mui/icons-material/Opacity";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { Routine } from "../../../../../../infrastructure/interfaces/routine";
import { PlanNutricional } from "../../../../../../infrastructure/interfaces/plan-nutricional";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { downloadDocumentoRequest } from "../../../../../../services/salud";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Props {
  documents: Partial<Documento>[];
  routines?: Partial<Routine>[];
  planesNutricionales?: Partial<PlanNutricional>[];
  onFocus?: (state: boolean) => void;
}

export const DocumentosForm: React.FC<Props> = ({
  documents,
  routines = [],
  planesNutricionales = [],
  onFocus = (state: boolean) => state,
}) => {
  const handleDownload = async (id: number) => {
    if (id) {
      await downloadDocumentoRequest(id);
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
      {documents.length > 0 && (
        <Typography variant="h6" gutterBottom>
          Documentos:
        </Typography>
      )}
      {(documents || []).map((doc) => (
        <Accordion
          key={doc.id}
          disableGutters
          TransitionProps={{ unmountOnExit: true }}
          onFocus={() => {
            onFocus(true);
          }}
          sx={{
            opacity: doc.fechaBaja ? 0.6 : 1,
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
                  color: doc.fechaBaja ? "error.main" : "text.primary",
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {doc.titulo}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                <strong>{doc.tipo}</strong> -{" "}
                {doc.fechaSubida
                  ? new Date(doc.fechaSubida).toLocaleDateString()
                  : "Fecha no definida"}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
            >
              {doc.descripcion || "Sin descripción"}
            </Typography>

            {doc.hasArchivo && (
              <Button
                variant="outlined"
                startIcon={<DownloadingIcon />}
                onClick={() => handleDownload(doc.id!)}
                sx={{ mt: 2 }}
              >
                Descargar archivo adjunto
              </Button>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {routines.length > 0 && (
        <Typography variant="h6" gutterBottom>
          Rutinas:
        </Typography>
      )}
      {routines.length > 0 &&
        (routines || []).map((routine) => (
          <Accordion
            key={routine.id}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
            onFocus={() => {
              onFocus(true);
            }}
            sx={{
              opacity: routine.fechaBaja ? 0.6 : 1,
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
                    color: routine.fechaBaja ? "error.main" : "text.primary",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
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
              <Typography
                variant="body2"
                gutterBottom
                sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
              >
                {routine.description || "Sin descripción"}
              </Typography>
              {routine.rutinaEjercicio &&
                routine.rutinaEjercicio.length > 0 && (
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="subtitle2">Ejercicios:</Typography>
                    <List dense>
                      {routine.rutinaEjercicio.map((rutEx) => (
                        <ListItem key={rutEx.id} disableGutters sx={{ pl: 2 }}>
                          {rutEx.ejercicio.demostration ||
                          rutEx.ejercicio.explication ? (
                            <IconButton
                              onClick={() =>
                                window.open(
                                  rutEx.ejercicio.demostration ||
                                    rutEx.ejercicio.explication,
                                  "_blank"
                                )
                              }
                              sx={{ ml: 2 }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          ) : (
                            <IconButton disabled sx={{ ml: 2 }}>
                              <OpenInNewIcon />
                            </IconButton>
                          )}
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
            </AccordionDetails>
          </Accordion>
        ))}

      {planesNutricionales.length > 0 && (
        <Typography variant="h6" gutterBottom>
          Planes Nutricionales:
        </Typography>
      )}
      {planesNutricionales.length > 0 &&
        (planesNutricionales || []).map((plan) => (
          <Accordion
            key={plan.id}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
            onFocus={() => {
              onFocus(true);
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
                sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
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
                      } g`}
                    />
                  </ListItem>
                  <ListItem>
                    <BreakfastDiningIcon sx={{ mr: 1 }} color="primary" />
                    <ListItemText
                      primary={`Carbohidratos: ${
                        plan.macronutrientes?.carbohidratos || 0
                      } g`}
                    />
                  </ListItem>
                  <ListItem>
                    <OpacityIcon sx={{ mr: 1 }} color="primary" />
                    <ListItemText
                      primary={`Grasas: ${plan.macronutrientes?.grasas || 0} g`}
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
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
};
