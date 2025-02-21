import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    // Convertir exp (en segundos) a milisegundos y compararlo con Date.now()
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};