// src/services/authService.ts
import {api} from '../config/apis/api';

export const getPlanNutricionalByUserIdRequest = async (id: number) => {
  const {data} = await api.get(`/plan-nutricional/${id}`);
  return data;
};
