// src/services/authService.ts
import { api } from "../config/apis/api";
import { Routine } from "../infrastructure/interfaces/routine";

export const getPlanTrainerByUserIdRequest = async (id: number) => {
  const { data } = await api.get(`/routines/${id}`);
  return data;
};

export const setRoutineRequest = async (routine: Partial<Routine>) => {
  const response = await api.post("/routines", routine);
  return response;
};

export const updateRoutineRequest = async (routine: Partial<Routine>) => {
  const response = await api.patch(`/routines`, routine);
  return response;
};

export const getEjerciciosRequest = async (
  search: string = "",
  categoriaId: number = 0,
  grupoId: number = 0
) => {
  const params: { search?: string; categoriaId?: number; grupoId?: number } =
    {};
  if (search !== "") params.search = search;
  if (categoriaId !== 0) params.categoriaId = categoriaId;
  if (grupoId !== 0) params.grupoId = grupoId;

  const { data } = await api.get("/ejercicios", { params });
  return data;
};
