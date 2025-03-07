import { TicketMensaje } from "./ticket-mensaje";
import { User } from "./user";
import { EstadoConsentimiento } from "../enums/estadoConsentimiento";

export interface Ticket {
  id?: number;
  asunto?: string;
  descripcion?: string;
  fechaCreacion?: Date;
  solicitante?: User;
  receptor?: User;
  usuario?: User;
  consentimientoUsuario?: EstadoConsentimiento;
  consentimientoSolicitante?: EstadoConsentimiento;
  consentimientoReceptor?: EstadoConsentimiento;
  fechaBaja?: Date;
  mensajes?: TicketMensaje[];
}
