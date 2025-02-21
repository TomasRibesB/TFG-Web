import { Ejercicio } from "./ejercicio";
import { Routine } from "./routine";

export interface RutinaEjercicio {
    id: number;
    routine: Routine;
    ejercicio: Ejercicio;
    fecha: Date;
    series: number;
    repeticiones: number;
    medicion?: string;
  }