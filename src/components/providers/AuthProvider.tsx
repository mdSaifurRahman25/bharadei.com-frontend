"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export type UserRole = "Customer" | "Owner" | "Admin";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setSession: (user: AuthUser | null, token?: string | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "bharadei_access_token";
const USER_KEY = "bharadei_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: betterSession, isPending: betterPending } =
    authClient.useSession();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const syncingEmailRef = useRef<string | null>(null);

  const setSession = useCallback(
    (nextUser: AuthUser | null, nextToken?: string | null) => {
      setUser(nextUser);
      if (nextUser) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }

      if (nextToken !== undefined) {
        setToken(nextToken);
        if (nextToken) {
          window.localStorage.setItem(TOKEN_KEY, nextToken);
        } else {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      }
    },
    []
  );

  const refreshSession = useCallback(async () => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedUserRaw = window.localStorage.getItem(USER_KEY);

    if (storedToken && storedUserRaw) {
      try {
        const parsed = JSON.parse(storedUserRaw) as AuthUser;
        setUser(parsed);
        setToken(storedToken);

        // Refresh latest user role/profile from backend silently
        const me = await apiFetch<{ success: boolean; user: AuthUser }>(
          "/api/auth/me",
          { token: storedToken }
        ).catch(() => null);

        if (me?.user) {
          setSession(me.user, storedToken);
        }
      } catch {
        setSession(null, null);
      }
    }
    setHydrated(true);
  }, [setSession]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshSession();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshSession]);

  // Synchronize BetterAuth social/session login with Express JWT
  useEffect(() => {
    if (betterPending) return;
    const sessionUser = betterSession?.user;
    if (!sessionUser?.email) return;

    const currentToken = window.localStorage.getItem(TOKEN_KEY);
    const currentUserRaw = window.localStorage.getItem(USER_KEY);
    if (currentToken && currentUserRaw) {
      try {
        const parsed = JSON.parse(currentUserRaw) as AuthUser;
        if (parsed.email === sessionUser.email.toLowerCase()) {
          return;
        }
      } catch {
        // continue to sync
      }
    }

    if (syncingEmailRef.current === sessionUser.email) return;
    syncingEmailRef.current = sessionUser.email;

    apiFetch<{ success: boolean; user: AuthUser; token: string }>(
      "/api/auth/oauth-sync",
      {
        method: "POST",
        body: JSON.stringify({
          name: sessionUser.name,
          email: sessionUser.email,
          image: sessionUser.image || "",
          provider: "google",
        }),
      }
    )
      .then((res) => {
        if (res.user && res.token) {
          setSession(res.user, res.token);
        }
      })
      .catch(() => {
        // Fallback so BetterAuth session still hydrates UI if backend is offline
        setSession(
          {
            id: sessionUser.id,
            name: sessionUser.name || "Member",
            email: sessionUser.email,
            image: sessionUser.image || "",
            role: "Customer",
          },
          null
        );
      })
      .finally(() => {
        syncingEmailRef.current = null;
        setHydrated(true);
      });
  }, [betterPending, betterSession, setSession]);

  const logout = useCallback(async () => {
    setSession(null, null);
    await authClient.signOut().catch(() => {});
  }, [setSession]);

  const loading = !hydrated || (betterPending && !user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setSession,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
