// src/services/authService.ts
import { api } from "../config/apis/api";
import { Documento } from "../infrastructure/interfaces/documento";
import { PermisoDocumento } from "../infrastructure/interfaces/permiso-documento";

export const getDocumentosRequest = async () => {
  const { data } = await api.get(`/documentos`);
  return data;
};

export const getProfesionalesByUserRequest = async () => {
  const { data } = await api.get(`/users/profesionales`);
  return data;
};

export const getDocumentosForProfesionalByUserRequest = async (id: number) => {
  const { data } = await api.get(`/documentos/${id}`);
  return data;
};

export const getVisibleDocumentosForProfesionalByUserRequest = async (
  id: number
) => {
  const { data } = await api.get(`/documentos/${id}/visible`);
  return data;
};

export const setDocumentoRequest = async (documento: Partial<Documento>) => {
  const { data } = await api.post(`/documentos`, documento);
  return data;
};

export const updateDocumentoRequest = async (documento: Partial<Documento>) => {
  const { data } = await api.put(`/documentos`, documento);
  return data;
};

export const uploadFileRequest = async (file: File, id: number) => {
  const formData = new FormData();
  formData.append("archivo", file);
  const { data } = await api.put(`/documentos/archivo/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getArchivoRequest = async (id: number) => {
  const response = await api.get(`/documentos/download/${id}`, {
    responseType: "arraybuffer",
  });
  return response.data;
};

export const deleteDocumentoRequest = async (id: number) => {
  const response = await api.delete(`/documentos/${id}`);
  return response;
};

export const getUserPermisoDocumentoRequest = async (
  code: string
): Promise<PermisoDocumento> => {
  const { data } = await api.get(`/documentos/permiso/${code}`);
  return data;
};

export const setByNoUserRequest = async (
  documento: Partial<Documento>,
  code: string
): Promise<Documento> => {
  const { data } = await api.post("/documentos/no-user", {
    documento,
    code,
  });
  return data;
};

export const uploadFileByNoUserRequest = async (file: File, id: number, code: string) => {
  const formData = new FormData();
  formData.append("archivo", file);
  const { data } = await api.put(`/documentos/archivo/no-user/${id}/${code}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
