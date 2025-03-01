import { useLocation, useNavigate } from "react-router-dom";
import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { loginRequest, registerRequest } from "../../services/auth";
import { isTokenExpired } from "../../utils/tokenUtils";
import { initialFetch } from "../../services/fetch";
import { User } from "../../infrastructure/interfaces/user";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email: string, password: string) => {
    try {
      const data = await loginRequest(email, password);
      await StorageAdapter.setItem("user", data);
      // Redirige al loader
      navigate("/loader", { replace: true });
    } catch (err) {
      console.log(err);
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
    dni: string
  ) => {
    try {
      const data = await registerRequest({
        email,
        password,
        firstName,
        lastName,
        dni,
      });
      await StorageAdapter.setItem("user", data);
      // Redirige al loader
      navigate("/loader", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const authRedirection = async () => {
    const user = await StorageAdapter.getItem<Partial<User>>("user");

    if (user && user.token) {
      if (isTokenExpired(user.token)) {
        await StorageAdapter.clear();
        if (!location.pathname.startsWith("/auth")) {
          navigate("/auth", { replace: true });
        }
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
