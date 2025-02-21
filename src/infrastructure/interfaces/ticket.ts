
import { TicketMensaje } from "./ticket-mensaje";
import { User } from "./user";

export interface Ticket {
  id?: number;
  asunto?: string;
  descripcion?: string;
  fechaCreacion?: Date;
  solicitante?: User;
  receptor?: User;
  usuario?: User;
  isAutorizado?: boolean;
  isAceptado?: boolean;
  isActive?: boolean;
  mensajes?: TicketMensaje[];
}