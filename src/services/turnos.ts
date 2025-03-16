import { api } from "../config/apis/api";
import { Turno } from "../infrastructure/interfaces/turno";

export const getTurnosRequest = async (): Promise<Turno[]> => {
  const { data } = await api.get(`/turnos`);
  return data;
};

export const createTurnoRequest = async (
  turno: Partial<Turno>
): Promise<Turno> => {
  const { data } = await api.post(`/turnos`, turno);
  return data;
};

export const updateTurnoRequest = async (
  turno: Partial<Turno>
): Promise<Turno> => {
  const { data } = await api.patch(`/turnos`, turno);
  return data;
};

export const asignarTurnoRequest = async (
  turnoId: number,
  idCliente: number
): Promise<Partial<Turno>> => {
  const { data } = await api.patch(`/turnos/asignar/${turnoId}`, { idCliente });
  return data;
};

export const removeTurnoRequest = async (
  turnoId: number
): Promise<Partial<Turno[]>> => {
  const { data } = await api.delete(`/turnos/${turnoId}`);
  return data;
};
