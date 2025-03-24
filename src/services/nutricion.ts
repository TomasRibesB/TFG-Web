// src/services/authService.ts
import { api } from "../config/apis/api";
import { PlanNutricional } from "../infrastructure/interfaces/plan-nutricional";

export const getPlanNutricionalByUserIdRequest = async (id: number) => {
  const { data } = await api.get(`/plan-nutricional/${id}`);
  return data;
};

export const setPlanNutricionalRequest = async (
  planNutricional: Partial<PlanNutricional>
) => {
  const { data } = await api.post("/plan-nutricional", planNutricional);
  return data;
};

export const updatePlanNutricionalRequest = async (
  planNutricional: Partial<PlanNutricional>
) => {
  const { data } = await api.put(
    `/plan-nutricional`,
    planNutricional
  );
  return data;
};

export const deletePlanNutricionalRequest = async (id: number) => {
  const response = await api.delete(`/plan-nutricional/${id}`);
  return response;
}

export const getVisiblePlanNutricionalForProfesionalByUserRequest = async (
  id: number
) => {
  const { data } = await api.get(`/plan-nutricional/${id}/visible`);
  return data;
};