// src/services/authService.ts
import {api} from '../config/apis/api';

export const getDocumentosRequest = async () => {
  const {data} = await api.get(`/documentos`);
  return data;
};

export const getProfesionalesByUserRequest = async () => {
  const {data} = await api.get(`/users/profesionales`);
  return data;
}

export const getDocumentosForProfesionalByUserRequest = async (id: number) => {
  const {data} = await api.get(`/documentos/${id}`);
  return data;
}

export const getVisibleDocumentosForProfesionalByUserRequest = async (id: number) => {
  const {data} = await api.get(`/documentos/${id}/visible`);
  return data;
}