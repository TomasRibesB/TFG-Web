// src/services/authService.ts
import { api } from "../config/apis/api";
import { StorageAdapter } from "../config/adapters/storage-adapter";
import { Role } from "../infrastructure/enums/roles";

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login-profesional", { email, password });
  return data;
};

export const registerRequest = async (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dni: string;
  role: Role;
  tipoProfesionalIds?: number[];
}) => {
  const { data } = await api.post("/auth/register-profesional", body);
  await StorageAdapter.setItem("user", data);
  return data;
};