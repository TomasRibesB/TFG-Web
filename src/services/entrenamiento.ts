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
  categoriaId: number[] = [],
  grupoId: number[] = []
) => {
  const params: { search?: string; categoria?: string; grupoMuscular?: string } =
    {};
  if (search !== "") params.search = search;
  if (categoriaId.length > 0) params.categoria = categoriaId.join(",");
  if (grupoId.length > 0) params.grupoMuscular = grupoId.join(",");


  const { data } = await api.get("/ejercicios", { params });
  return data;
};

export const getRelacionesEjericiosRequest = async () => {
  const { data } = await api.get("/ejercicios/relations");
  return data;
}