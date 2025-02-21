import { EstadoTurno } from "../enums/estadosTurnos";
import { User } from "./user";

export interface Turno {
    id: number;
    fechaHora: Date;
    estado: EstadoTurno;
    notificado: Date | null;
    paciente: User;
    profesional: User;
  }