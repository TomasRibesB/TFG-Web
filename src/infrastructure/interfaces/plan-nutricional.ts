import {User} from './user';
export interface PlanNutricional {
  caloriasDiarias?: number;
  descripcion?: string;
  fechaCreacion?: Date;
  id: number;
  macronutrientes?: {
    [key: string]: number;
  }
  nombre: string;
  notasAdicionales?: string;
  objetivos?: string;
  paciente?: User;
  nutricionista?: User;
  fechaBaja?: Date | null;
  visibilidad: User[];
}
