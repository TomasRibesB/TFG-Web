import { Documento } from "./documento";
import { UserTipoProfesional } from "./user-tipo-profesional";

export interface TipoProfesional {
    id?: number;
    profesion?: string;
    userTipoProfesionales?: UserTipoProfesional[];
    documentos?: Documento[];
}
