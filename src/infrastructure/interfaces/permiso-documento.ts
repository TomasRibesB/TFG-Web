import { User } from "./user";

export interface PermisoDocumento {
  id?: number;
  code: string;
  usuario: User;
  fechaAlta: Date;
  fechaBaja?: Date | null;
}