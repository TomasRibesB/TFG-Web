import { Ejercicio } from "./ejercicio";

export interface CategoriaEjercicio {
  id: number;
  name: string;
  ejercicios: Ejercicio[];
}