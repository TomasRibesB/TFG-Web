import { Ticket } from "./ticket";
import { User } from "./user";
import { EstadoMensaje } from "../enums/estadoMensaje";

export interface TicketMensaje {
  id?: number;
  idRef: string;
  ticket?: Ticket;
  fecha?: Date;
  emisor?: User;
  estado?: EstadoMensaje;
  mensaje?: string;
}