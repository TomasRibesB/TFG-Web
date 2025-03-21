import { useLocation, useNavigate } from "react-router-dom";
import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { loginRequest, registerRequest } from "../../services/auth";
import { isTokenExpired } from "../../utils/tokenUtils";
import { initialFetch } from "../../services/fetch";
import { User } from "../../infrastructure/interfaces/user";
import { Role } from "../../infrastructure/enums/roles";
import { uploadCertificateRequest } from "../../services/user";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email: string, password: string) => {
    try {
      const data = await loginRequest(email, password);
      if (data.role && data.role == Role.Usuario) {
        return "Esta aplicación es solo para profesionales de la salud";
      }
      console.log("continua");
      await StorageAdapter.setItem("user", data);
      // Redirige al loader
      navigate("/loader", { replace: true });
      return;
    } catch (err) {
      console.log(err);
      return "Usuario o contraseña incorrectos";
    }
  };

  const logout = async () => {
    try {
      await StorageAdapter.clear();
      // Redirige al flujo de autenticación
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dni: string,
    role: Role,
    tipoProfesionalIds?: number[],
    certificate?: File
  ) => {
    try {
      const data : User = await registerRequest({
        email,
        password,
        firstName,
        lastName,
        dni,
        role,
        tipoProfesionalIds,
      });
      await StorageAdapter.setItem("user", data);

      if (
        data.id &&
        certificate &&
        data.userTipoProfesionales &&
        data.userTipoProfesionales.length > 0 &&
        data.userTipoProfesionales[0].id !== undefined
      ) {
        await uploadCertificateRequest(data.userTipoProfesionales[0].id, data.id, certificate);
      }

      // Redirige al loader
      navigate("/loader", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const authRedirection = async () => {
    const user = await StorageAdapter.getItem<Partial<User>>("user");

    if (user && user.token && user.role !== Role.Usuario) {
      if (isTokenExpired(user.token)) {
        await logout();
        return;
      }
      await initialFetch();
      // Solo redirige a /main si NO está en una ruta autorizada
      if (!location.pathname.startsWith("/main")) {
        navigate("/main", { replace: true });
      }
    } else {
      if (!location.pathname.startsWith("/auth")) {
        navigate("/auth", { replace: true });
      }
    }
  };

  return { login, logout, register, authRedirection };
};
