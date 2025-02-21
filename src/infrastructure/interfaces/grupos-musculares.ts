import { Ejercicio } from "./ejercicio";

export interface GruposMusculares {
  id: number;
  name: string;
  ejercicios: Ejercicio[];
}