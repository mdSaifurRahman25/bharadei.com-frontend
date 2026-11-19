"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export type UserRole = "Customer" | "Owner" | "Admin";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

interface AuthSnapshot {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthSnapshot {
  setSession: (user: AuthUser | null, token?: string | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "bharadei_access_token";
const USER_KEY = "bharadei_user";
const AUTH_EVENT = "bharadei-auth-change";

const SERVER_SNAPSHOT: AuthSnapshot = {
  user: null,
  token: null,
  loading: true,
};

let cachedRawUser: string | null = null;
let cachedRawToken: string | null = null;
let cachedClientSnapshot: AuthSnapshot | null = null;

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function getAuthSnapshot(): AuthSnapshot {
  const rawToken = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);

  if (
    cachedClientSnapshot &&
    rawToken === cachedRawToken &&
    rawUser === cachedRawUser
  ) {
    return cachedClientSnapshot;
  }

  cachedRawToken = rawToken;
  cachedRawUser = rawUser;

  let parsedUser: AuthUser | null = null;
  if (rawToken && rawUser) {
    try {
      parsedUser = JSON.parse(rawUser) as AuthUser;
    } catch {
      parsedUser = null;
    }
  }

  cachedClientSnapshot = {
    user: parsedUser,
    token: parsedUser ? rawToken : null,
    loading: false,
  };
  return cachedClientSnapshot;
}

function getAuthServerSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const setSession = useCallback(
    (nextUser: AuthUser | null, nextToken?: string | null) => {
      if (nextUser) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }

      if (nextToken !== undefined) {
        if (nextToken) {
          window.localStorage.setItem(TOKEN_KEY, nextToken);
        } else {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      }

      window.dispatchEvent(new Event(AUTH_EVENT));
    },
    []
  );

  const refreshSession = useCallback(async () => {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const logout = useCallback(async () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...snapshot,
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
