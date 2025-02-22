// src/services/authService.ts
import {api} from '../config/apis/api';

export const getPlanTrainerByUserIdRequest = async (id: number) => {
  const {data} = await api.get(`/routines/${id}`);
  console.log('Plan Trainer: ', JSON.stringify(data, null, 2));
  return data;
};