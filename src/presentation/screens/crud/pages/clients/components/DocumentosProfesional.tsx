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
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { downloadDocumentoRequest } from "../../../../../../services/salud";

interface Props {
  document: Partial<Documento>;
  onhandleOpenEditModal?: (documento: Documento) => void;
  onRemoveDocument?: (id: number) => void;
  isEditable?: boolean;
  onFocus?: (state: boolean) => void;
}

export const DocumentoProfesional: React.FC<Props> = ({
  document,
  onhandleOpenEditModal,
  onRemoveDocument,
  isEditable = true,
  onFocus = (state: boolean) => state,
}) => {
  const handleDownload = async () => {
    if (document.id) {
      await downloadDocumentoRequest(document.id);
    }
  };

  return (
    <Accordion
      key={document.id}
      disableGutters
      TransitionProps={{ unmountOnExit: true }}
      onFocus={() => {
        onFocus(false);
      }}
      sx={{
        opacity: document.fechaBaja ? 0.6 : 1,
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
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "action.hover",
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiAccordionSummary-content": {
            marginY: 1,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: document.fechaBaja ? "error.main" : "text.primary",
              fontWeight: 600,
            }}
          >
            {document.titulo}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{document.tipo}</strong> -{" "}
            {document.fechaSubida
              ? new Date(document.fechaSubida).toLocaleDateString()
              : "Fecha no definida"}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ whiteSpace: "pre-line" }}
        >
          {document.descripcion || "Sin descripción"}
        </Typography>

        {document.hasArchivo && (
          <Button
            variant="outlined"
            startIcon={<DownloadingIcon />}
            onClick={handleDownload}
            sx={{ mt: 2 }}
          >
            Descargar archivo adjunto
          </Button>
        )}

        {isEditable && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onhandleOpenEditModal?.(document as Documento)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={
                document.fechaBaja ? <UnarchiveIcon /> : <ArchiveIcon />
              }
              onClick={() => onRemoveDocument?.(document.id!)}
            >
              {document.fechaBaja ? "Restaurar" : "Archivar"}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
