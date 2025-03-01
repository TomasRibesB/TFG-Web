// src/services/authService.ts
import {api} from '../config/apis/api';

export const getTicketsRequest = async () => {
  const {data} = await api.get(`/tickets`);
  return data;
};

export const getTicketByIdRequest = async (id: number) => {
  const {data} = await api.get(`/tickets/${id}`);
  return data;
};
