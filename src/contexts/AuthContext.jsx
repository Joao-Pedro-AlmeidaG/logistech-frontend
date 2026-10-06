import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../services/apollo";
import { api, TOKEN_KEY } from "../services/api";

const AuthContext = createContext(null);
const USER_KEY = "logistech:usuario";

const lerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuario);

  const login = useCallback(async (email, senha) => {
    const res = await api("/auth/login", { method: "POST", body: { email, senha } });
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
    setUsuario(res.usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    client.clearStore();
    setUsuario(null);
  }, []);

  // Token expirado (401 vindo do REST) derruba a sessão.
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const value = useMemo(
    () => ({ usuario, login, logout, isGestor: usuario?.perfil === "GESTOR" }),
    [usuario, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
