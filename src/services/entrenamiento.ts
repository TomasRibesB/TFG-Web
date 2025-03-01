// src/services/authService.ts
import {api} from '../config/apis/api';

export const getPlanTrainerByUserIdRequest = async (id: number) => {
  const {data} = await api.get(`/routines/${id}`);
  return data;
};