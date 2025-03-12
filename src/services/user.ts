// src/services/authService.ts
import { api } from "../config/apis/api";

export const getClientesRequest = async () => {
  const { data } = await api.get(`/users/clientes`);
  return data;
};

export const getRecordatoriosRequest = async () => {
  const { data } = await api.get(`/users/profesionales/recordatorios`);
  return data;
};

export const updateEmailRequest = async (email: string) => {
  const { data } = await api.patch(`/users/email`, { email });
  return data;
};

export const updatePasswordRequest = async (
  password: string,
  newPassword: string
) => {
  const { data } = await api.patch(`/users/password`, {
    oldPassword: password,
    newPassword,
  });
  return data;
};

export const uploadImageRequest = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post(`/users/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getUserImageRequest = async (id: number) => {
  const { data } = await api.get(`/users/image/${id}`);
  return data;
};

export const getProfesionalsByUserForTicketsCreationRequest = async (
  userId: number
) => {
  const { data } = await api.get(`/users/profesionales/tickets/${userId}`);
  return data;
};

export const getUserByDNIForProfesional = async (dni: string) => {
  const { data } = await api.get(`/users/profesionales/${dni}`);
  return data;
};

export const postAsignarClienteRequest = async (clienteId: number) => {
  const { data } = await api.post(`/users/profesionales/asignar-usuario`, {
    clienteId,
  });
  return data;
};
