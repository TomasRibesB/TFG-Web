// src/services/authService.ts
import { api } from "../config/apis/api";
import { EstadoConsentimiento } from "../infrastructure/enums/estadoConsentimiento";
import { Ticket } from "../infrastructure/interfaces/ticket";

export const getTicketsRequest = async () => {
  const { data } = await api.get(`/tickets`);
  return data;
};

export const getTicketByIdRequest = async (id: number) => {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
};

export const updateTicketConsentimientoRequest = async (
  ticketId: number,
  estadoConsentimiento: EstadoConsentimiento
) => {
  const { data } = await api.put(`/tickets`, {
    ticketId,
    estadoConsentimiento,
  });
  return data;
};

export const postTicketRequest = async (ticket: Ticket) => {
  const payload = { ticket };
  const { data } = await api.post(`/tickets`, payload);
  return data;
};
