import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { mockUsers } from "../utils/mockData.js";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("stoon_user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);

  const persistSession = (sessionUser, token = "mock-stoon-token") => {
    localStorage.setItem("stoon_token", token);
    localStorage.setItem("stoon_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      persistSession(response.data.user, response.data.token);
      return { success: true };
    } catch {
      const localUser = users.find((item) => item.email === email && item.password === password);
      if (!localUser) {
        return { success: false, message: "Email ou mot de passe incorrect." };
      }
      const { password: _password, ...safeUser } = localUser;
      persistSession(safeUser);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      persistSession(response.data.user, response.data.token);
      return { success: true };
    } catch {
      const exists = users.some((item) => item.email === payload.email);
      if (exists) {
        return { success: false, message: "Un compte existe déjà avec cet email." };
      }
      const newUser = {
        id: users.length + 1,
        role: "user",
        reputation: 4.5,
        photo: "",
        ...payload
      };
      setUsers((current) => [...current, newUser]);
      const { password: _password, ...safeUser } = newUser;
      persistSession(safeUser);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("stoon_token");
    localStorage.removeItem("stoon_user");
    setUser(null);
  };

  const updateUser = async (updates) => {
    let nextUser = { ...user, ...updates };
    try {
      const response = await api.put("/users/profile", updates);
      nextUser = response.data.user;
    } catch (error) {
      if (error.response) throw error;
    }
    localStorage.setItem("stoon_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const value = useMemo(
    () => ({
      user,
      users,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser
    }),
    [user, users, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
