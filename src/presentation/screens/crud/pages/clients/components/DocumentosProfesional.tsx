import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

interface Props {
  document: Partial<Documento>;
  onhandleOpenEditModal?: (documento: Documento) => void;
  onRemoveDocument?: (id: number) => void;
  isEditable?: boolean;
}

export const DocumentoProfesional: React.FC<Props> = ({
  document,
  onhandleOpenEditModal,
  onRemoveDocument,
  isEditable = true,
}) => {
  console.log(document, isEditable);
  return (
    <Accordion
      key={document.id}
      disableGutters
      TransitionProps={{ unmountOnExit: true }}
      sx={{
        opacity: document.fechaBaja ? 0.6 : 1,
        mb: 1,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: document.fechaBaja ? "error.main" : "text.primary",
            }}
          >
            {document.titulo}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {document.fechaSubida
              ? new Date(document.fechaSubida).toLocaleDateString()
              : "Fecha no definida"}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" gutterBottom>
          {document.descripcion || "Sin descripción"}
        </Typography>
        <Typography variant="body2">Tipo: {document.tipo}</Typography>
        {isEditable && (
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
              onClick={() => onhandleOpenEditModal!(document as Documento)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              startIcon={
                document.fechaBaja ? <UnarchiveIcon /> : <ArchiveIcon />
              }
              onClick={() => onRemoveDocument!(document.id!)}
            >
              {document.fechaBaja ? "Restaurar" : "Archivar"}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
