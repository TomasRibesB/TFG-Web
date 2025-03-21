import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";

interface Props {
  documents: Partial<Documento>[];
}

export const DocumentosForm: React.FC<Props> = ({ documents }) => {
  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
      <Typography variant="h6" gutterBottom>
        Documentos
      </Typography>
      {(documents || []).map((doc) => (
        <Accordion
          key={doc.id}
          disableGutters
          TransitionProps={{ unmountOnExit: true }}
          sx={{
            opacity: doc.fechaBaja ? 0.6 : 1,
            mb: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: doc.fechaBaja ? "error.main" : "text.primary",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {doc.titulo}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
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
              sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
            >
              {doc.descripcion || "Sin descripción"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
            >
              Tipo: {doc.tipo}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            ></Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
