"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiFetch } from "./api";

export type AccountType = "user" | "business" | "admin";

export interface AuthUser {
  user_id: string;
  email: string;
  accountType: AccountType;
  access_token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "clf_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // Corrupt storage — ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await apiFetch<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(async () => {
    const token = user?.access_token;
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (token) {
      await apiFetch("/auth/logout", {
        method: "POST",
        token,
      }).catch(() => {
        // Session already gone server-side — safe to ignore
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// Convenience: returns just the token string (or undefined) for passing to apiFetch
export function useToken(): string | undefined {
  return useAuth().user?.access_token;
}

// Single source of truth for "where does this account type's dashboard live"
export function accountHomeFor(accountType: AccountType): string {
  if (accountType === "business") return "/dashboard";
  if (accountType === "admin") return "/admin";
  return "/account";
}
