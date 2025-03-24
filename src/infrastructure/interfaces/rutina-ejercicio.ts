import { UnidadMedida } from "../enums/unidadMedida";
import { Ejercicio } from "./ejercicio";
import { Registro } from "./registro";
import { Routine } from "./routine";

export interface RutinaEjercicio {
  id: number;
  routine: Routine;
  ejercicio: Ejercicio;
  fecha: Date;
  series: number;
  repeticiones: number;
  medicion?: string;
  unidadMedida?: UnidadMedida;
  registros?: Registro[];
}
