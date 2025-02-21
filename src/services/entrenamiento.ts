// src/services/authService.ts
import {api} from '../config/apis/api';

export const getRoutineRequest = async () => {
  const {data} = await api.get(`/routines`);
  return data;
};