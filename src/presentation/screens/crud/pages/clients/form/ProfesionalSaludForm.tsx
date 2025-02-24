import {
  Typography,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { TipoDocumento } from "../../../../../../infrastructure/enums/tipoDocumentos";

interface Props {
  selectedClient: Partial<User> | null;
}

export const ProfesionalSaludForm: React.FC<Props> = ({ selectedClient }) => {
  // Estados para el documento nuevo
  const [docType, setDocType] = useState<TipoDocumento>(TipoDocumento.Informe);
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docFile, setDocFile] = useState("");
  // Lista de documentos creados en sesión
  const [createdDocuments, setCreatedDocuments] = useState<Documento[]>([]);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);

  const handleOpenModal = () => {
    // Reiniciamos todos los campos al abrir el modal
    setDocType(TipoDocumento.Informe);
    setDocTitle("");
    setDocDescription("");
    setDocFile("");
    setOpenDocumentModal(true);
  };

  const handleSaveDocument = () => {
    const newDocument: Documento = {
      id: Date.now(),
      tipo: docType,
      titulo: docTitle,
      descripcion: docDescription,
      archivo: docFile || null,
      directorio: null,
      fechaSubida: new Date(),
      nombreProfesional: selectedClient?.firstName || null,
      apellidoProfesional: selectedClient?.lastName || null,
      emailProfesional: selectedClient?.email || null,
      tipoProfesional: null, // Aquí se puede asignar el tipo específico si se requiere
      dniProfesional: null,
      profesional: selectedClient || null,
      usuario: selectedClient as User,
      visibilidad: [],
    };
    console.log("Guardando documento:", newDocument);
    setCreatedDocuments([...createdDocuments, newDocument]);
    setOpenDocumentModal(false);
  };

  const removeDocument = (id: number) => {
    setCreatedDocuments(createdDocuments.filter((doc) => doc.id !== id));
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      {/* Sección para Documentos */}
      {(selectedClient.documentos || createdDocuments.length > 0) && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Documentos / Informes
          </Typography>
          {(selectedClient.documentos || []).concat(createdDocuments).map((doc) => (
            <Accordion key={doc.id} disableGutters TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="subtitle1">{doc.titulo}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.fechaSubida ? new Date(doc.fechaSubida).toLocaleDateString() : "Fecha no definida"}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  {doc.descripcion || "Sin descripción"}
                </Typography>
                <Typography variant="body2">
                  Tipo: {doc.tipo}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button variant="outlined" startIcon={<EditIcon />}>
                    Editar Documento
                  </Button>
                  <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => removeDocument(doc.id)}>
                    Eliminar
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Modal para Crear / Editar Documento */}
      <Dialog open={openDocumentModal} onClose={() => setOpenDocumentModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {docTitle ? "Editar Documento" : "Subir Documento / Informe"}
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ my: 1, borderRadius: "8px" }}>
            <InputLabel>Tipo de Documento</InputLabel>
            <Select
              label="Tipo de Documento"
              value={docType}
              onChange={(e) => setDocType(e.target.value as TipoDocumento)}
            >
              <MenuItem value={TipoDocumento.Acta}>Acta</MenuItem>
              <MenuItem value={TipoDocumento.Certificado}>Certificado</MenuItem>
              <MenuItem value={TipoDocumento.Informe}>Informe</MenuItem>
              <MenuItem value={TipoDocumento.Recomendacion}>Recomendación</MenuItem>
              <MenuItem value={TipoDocumento.Otro}>Otro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            sx={{ my: 1, borderRadius: "8px" }}
            value={docDescription}
            onChange={(e) => setDocDescription(e.target.value)}
          />
          <TextField
            label="Ruta o Archivo"
            variant="outlined"
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            value={docFile}
            onChange={(e) => setDocFile(e.target.value)}
            helperText="Puede ser una URL o la ruta del archivo subido"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocumentModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveDocument} variant="contained" color="primary">
            Guardar Documento
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para abrir el modal de Crear Documento */}
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
      Seleccione un cliente para ver los detalles y administrar documentos.
    </Typography>
  );
};