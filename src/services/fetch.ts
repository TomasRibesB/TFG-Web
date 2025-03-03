import { StorageAdapter } from "../config/adapters/storage-adapter";
import { getTicketsRequest } from "./tickets";
import { getClientesRequest, getRecordatoriosRequest } from "./user";
import { getTurnosRequest } from "./turnos";
import { Role } from "../infrastructure/enums/roles";
import { getEjerciciosRequest } from "./entrenamiento";

interface User {
  role: Role;
  // add other properties if needed
}

export const initialFetch = async () => {
  const user: User | null = (await StorageAdapter.getItem("user")) ?? null;
  const clientes = await getClientesRequest();
  const tickets = await getTicketsRequest();
  const turnos = await getTurnosRequest();
  const recordatorios = await getRecordatoriosRequest();

  await StorageAdapter.setItem("clientes", clientes);
  await StorageAdapter.setItem("tickets", tickets);
  await StorageAdapter.setItem("turnos", turnos);
  await StorageAdapter.setItem("recordatorios", recordatorios);

  switch (user?.role) {
    case Role.Entrenador: {
      const ejercicios = await getEjerciciosRequest();
      await StorageAdapter.setItem("ejercicios", ejercicios);
      console.log("ejercicios", ejercicios);
      break;
    }
    case Role.Nutricionista:
      break;
    case Role.Profesional:
      break;
    default:
      break;
  }
};
