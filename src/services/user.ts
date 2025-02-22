// src/services/authService.ts
import { api } from "../config/apis/api";

export const getClientesRequest = async () => {
  const { data } = await api.get(`/users/clientes`);
  console.log("Clientes: ", JSON.stringify(data, null, 2));
  return data;
};

export const getRecordatoriosRequest = async () => {
  const { data } = await api.get(`/users/profesionales/recordatorios`);
  console.log(JSON.stringify(data, null, 2));
  return data;
};
