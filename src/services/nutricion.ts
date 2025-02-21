// src/services/authService.ts
import {api} from '../config/apis/api';

export const getPlanNutricionalRequest = async () => {
  const {data} = await api.get(`/plan-nutricional`);
  return data;
};
