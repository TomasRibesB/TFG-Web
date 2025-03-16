import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import AddIcon from "@mui/icons-material/Add";
import { MuiFileInput } from "mui-file-input";
import { User } from "../../../../../../infrastructure/interfaces/user";
import { Documento } from "../../../../../../infrastructure/interfaces/documento";
import { TipoDocumento } from "../../../../../../infrastructure/enums/tipoDocumentos";
import {
  deleteDocumentoRequest,
  setDocumentoRequest,
  updateDocumentoRequest,
  uploadFileRequest,
  //getArchivoRequest,
} from "../../../../../../services/salud";

interface DocumentoRequest {
  id?: number;
  tipo: TipoDocumento;
  titulo: string;
  descripcion: string;
  usuarioId?: number;
}

interface Props {
  selectedClient: Partial<User> | null;
  onUpdateClient: (client: Partial<User>) => void;
}

export const ProfesionalSaludForm: React.FC<Props> = ({
  selectedClient,
  onUpdateClient,
}) => {
  const [docType, setDocType] = useState<TipoDocumento>(TipoDocumento.Informe);
  const [docTitle, setDocTitle] = useState<string>("");
  const [docDescription, setDocDescription] = useState<string>("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [createdDocuments, setCreatedDocuments] = useState<Documento[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Documento | null>(
    null
  );
  const [openDocumentModal, setOpenDocumentModal] = useState(false);

  const handleOpenModal = () => {
    setCurrentDocument(null);
    setDocType(TipoDocumento.Informe);
    setDocTitle("");
    setDocDescription("");
    setDocFile(null);
    setOpenDocumentModal(true);
  };

  const handleOpenEditModal = (documento: Documento) => {
    setCurrentDocument(documento);
    setDocType(documento.tipo);
    setDocTitle(documento.titulo ?? "");
    setDocDescription(documento.descripcion ?? "");
    setDocFile(null);
    setOpenDocumentModal(true);
  };

  // Función para guardar un nuevo documento
  const handleSaveDocument = async () => {
    if (!selectedClient) return;
    const newDocument: DocumentoRequest = {
      tipo: docType,
      titulo: docTitle,
      descripcion: docDescription,
      usuarioId: selectedClient.id,
    };
    try {
      const data = await setDocumentoRequest(newDocument);
      if (data?.id && docFile) {
        // Subir archivo
        const { response } = await uploadFileRequest(docFile, data.id);
        console.log(response);
      }
      setCreatedDocuments([...createdDocuments, data]);
      setOpenDocumentModal(false);
      setDocFile(null);
    } catch (error) {
      console.error("Error al guardar el documento", error);
    }
  };

  const handleUpdateDocument = async () => {
    if (!selectedClient || !currentDocument) return;
    const updatedDocument: DocumentoRequest = {
      id: currentDocument.id,
      tipo: docType,
      titulo: docTitle,
      descripcion: docDescription,
      usuarioId: selectedClient.id,
    };
    try {
      const data = await updateDocumentoRequest(updatedDocument);
      if (data?.id) {
        // Actualizamos selectedClient.documentos si existe
        if (docFile) {
          // Subir archivo
          const { response } = await uploadFileRequest(
            docFile,
            currentDocument.id
          );
          console.log(response);
        }
        if (selectedClient.documentos) {
          selectedClient.documentos = selectedClient.documentos.map((doc) =>
            doc.id === currentDocument.id ? data : doc
          );
        }
        setCreatedDocuments(
          createdDocuments.map((doc) =>
            doc.id === currentDocument.id ? data : doc
          )
        );
        setOpenDocumentModal(false);
        setCurrentDocument(null);
        setDocFile(null);
      }
    } catch (error) {
      console.error("Error al actualizar el documento", error);
    }
  };

  const removeDocument = async (id: number) => {
    const response = await deleteDocumentoRequest(id);
    if (response.data) {
      const updatedClient = {
        ...selectedClient,
        documentos: (selectedClient?.documentos || []).map((doc) =>
          doc.id === id
            ? { ...doc, fechaBaja: doc.fechaBaja ? null : new Date() }
            : doc
        ),
      };
      onUpdateClient(updatedClient);
    }
    setCreatedDocuments(
      createdDocuments.map((doc) =>
        doc.id === id ? { ...doc, fechaBaja: new Date() } : doc
      )
    );
    console.log(response);
  };

  return selectedClient ? (
    <Box sx={{ position: "relative", p: 2 }}>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={handleOpenModal}
      >
        <AddIcon />
      </Fab>
      {/* Listado de Documentos */}
      {(selectedClient.documentos || createdDocuments.length > 0) && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Documentos
          </Typography>
          {(selectedClient.documentos || [])
            .concat(createdDocuments)
            .map((doc) => (
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
                      }}
                    >
                      {doc.titulo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.fechaSubida
                        ? new Date(doc.fechaSubida).toLocaleDateString()
                        : "Fecha no definida"}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" gutterBottom>
                    {doc.descripcion || "Sin descripción"}
                  </Typography>
                  <Typography variant="body2">Tipo: {doc.tipo}</Typography>
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
                      onClick={() => handleOpenEditModal(doc)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={
                        doc.fechaBaja ? <UnarchiveIcon /> : <ArchiveIcon />
                      }
                      onClick={() => removeDocument(doc.id)}
                    >
                      {doc.fechaBaja ? "Restaurar" : "Archivar"}
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      )}

      {/* Modal para Crear/Editar Documento */}
      <Dialog
        open={openDocumentModal}
        onClose={() => setOpenDocumentModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentDocument ? "Editar Documento" : "Subir Documento / Informe"}
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
              <MenuItem value={TipoDocumento.Recomendacion}>
                Recomendación
              </MenuItem>
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
          <MuiFileInput
            label="Subir Archivo (png, jpg, pdf, etc)"
            value={docFile}
            onChange={(file) => setDocFile(file)}
            fullWidth
            sx={{ my: 1, borderRadius: "8px" }}
            inputProps={{ accept: ".png,.jpeg,.jpg,.pdf" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDocumentModal(false)} color="secondary">
            Cancelar
          </Button>
          {currentDocument ? (
            <Button
              onClick={handleUpdateDocument}
              variant="contained"
              color="primary"
            >
              Actualizar Documento
            </Button>
          ) : (
            <Button
              onClick={handleSaveDocument}
              variant="contained"
              color="primary"
            >
              Guardar Documento
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
      Seleccione un cliente para ver sus documentos.
    </Typography>
  );
};
