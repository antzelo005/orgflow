import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { api } from "../../api/client";
import { User } from "../../api/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: "admin" | "viewer";
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    void refreshUser().finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const response = await api.get<User>("/auth/me/");
      setUser(response.data);
      localStorage.setItem("auth_user", JSON.stringify(response.data));
    } catch {
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("auth_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    toast.success("Welcome back.");
  };

  const register = async (payload: RegisterPayload) => {
    await api.post("/auth/register/", payload);
    toast.success("Account created. You can now sign in.");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    toast.success("Signed out.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
