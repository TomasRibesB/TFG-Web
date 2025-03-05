import { RutinaEjercicio } from "./rutina-ejercicio";
import { User } from "./user";

export interface Routine {
    id: number;
    name: string;
    description?: string;
    rutinaEjercicio?: RutinaEjercicio[];
    user: User;
    trainer: User;
    fechaBaja?: Date | null;
  }