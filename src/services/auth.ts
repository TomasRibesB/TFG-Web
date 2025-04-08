// src/services/authService.ts
import { api } from "../config/apis/api";
import { StorageAdapter } from "../config/adapters/storage-adapter";
import { Role } from "../infrastructure/enums/roles";

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login-profesional", {
    email,
    password,
  });
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

export const verifyEmailRequest = async (token: string) => {
  const { data } = await api.put(`/auth/verifyEmail/${token}`);
  return data;
};

export const sendPasswordResetEmailRequest = async (email: string) => {
  const { data } = await api.put(`/auth/sendPasswordResetEmail`, { email });
  return data;
};

export const verifyPasswordResetTokenRequest = async (token: string) => {
  const { data } = await api.get(`/auth/verifyPasswordResetToken/${token}`);
  return data;
};

export const resetPasswordRequest = async (
  token: string,
  newPassword: string
) => {
  const { data } = await api.put(`/auth/resetPassword`, { token, newPassword });
  return data;
};

export const denyPasswordResetRequest = async (token: string) => {
  const { data } = await api.put(`/auth/denyPasswordReset`, { token });
  return data;
};