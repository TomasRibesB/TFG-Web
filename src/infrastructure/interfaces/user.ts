import { Role } from "../enums/roles";
import { Documento } from "./documento";
import { PlanNutricional } from "./plan-nutricional";
import { Routine } from "./routine";
import { Ticket } from "./ticket";
import { TicketMensaje } from "./ticket-mensaje";
import { Turno } from "./turno";
import { UserTipoProfesional } from "./user-tipo-profesional";

export interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    dni?: string;
    password?: string;
    email?: string;
    role?: Role;
    deletedAt?: Date;
    routines?: Routine[];
    turnosPaciente?: Turno[];
    turnosProfesional?: Turno[];
    tickets?: Ticket[];
    mensajesEnviados?: TicketMensaje[];
    planesNutricionales?: PlanNutricional[];
    documentos?: Documento[];
    userTipoProfesionales?: UserTipoProfesional[];
    token?: string;
    }