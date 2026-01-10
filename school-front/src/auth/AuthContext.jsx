import React, { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/http";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const setSession = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

   const refreshMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await api.get("/api/auth/me");
    const me = res.data;
    setSession({ token, user: me });
    return me;
  };

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user } = res.data;
    setSession({ token, user });
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    if (user && !localStorage.getItem("token")) {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [user]);

  const value = useMemo(() => ({ user, login, logout, setSession }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
