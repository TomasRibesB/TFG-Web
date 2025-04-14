import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
} from "@mui/material";
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
import { DocumentoProfesional } from "../components/DocumentosProfesional";
import { PlanNutricional } from "../../../../../../infrastructure/interfaces/plan-nutricional";
import { Routine } from "../../../../../../infrastructure/interfaces/routine";
import { DocumentosForm } from "../components/DocumentosForm";

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
  documents: Partial<Documento>[];
  routines: Partial<Routine>[];
  planesNutricionales: Partial<PlanNutricional>[];
}

export const ProfesionalSaludForm: React.FC<Props> = ({
  selectedClient,
  onUpdateClient,
  documents,
  routines,
  planesNutricionales,
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
  const [profesionalDocuments, setProfesionalDocuments] = useState<Documento[]>(
    []
  );

  useEffect(() => {
    const clientDocs = selectedClient?.documentos || [];
    setProfesionalDocuments([...clientDocs, ...createdDocuments]);
  }, [selectedClient, createdDocuments]);

  useEffect(() => {
    setCreatedDocuments([]);
  }, [selectedClient]);

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
        await uploadFileRequest(docFile, data.id);
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
          await uploadFileRequest(docFile, currentDocument.id);
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
          {selectedClient.documentos && (
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
                onClick={handleOpenModal}
              >
                <AddIcon />
              </Fab>
              <Typography variant="h6" gutterBottom>
                Documentos
              </Typography>
              {(profesionalDocuments || []).map((doc) => (
                <DocumentoProfesional
                  key={doc.id}
                  document={doc}
                  onhandleOpenEditModal={handleOpenEditModal}
                  onRemoveDocument={removeDocument}
                  isEditable={false}
                />
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
              {currentDocument
                ? "Editar Documento"
                : "Subir Documento / Informe"}
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
                  <MenuItem value={TipoDocumento.Certificado}>
                    Certificado
                  </MenuItem>
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
              <Button
                onClick={() => setOpenDocumentModal(false)}
                color="secondary"
              >
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
        Seleccione un cliente para ver sus documentos.
      </Typography>
    </Box>
  );
};
