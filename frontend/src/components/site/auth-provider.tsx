"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getKeycloakSession, initKeycloak, startLogin, startLogout, startRegister } from "@/lib/keycloak";

export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
  token?: string;
  login: () => void;
  register: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const noop = () => {};
const defaultState: AuthState = {
  ready: false,
  authenticated: false,
  roles: [],
  login: noop,
  register: noop,
  logout: noop,
  hasRole: () => false,
};

const AuthContext = createContext<AuthState>(defaultState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    let cancelled = false;
    initKeycloak()
      .then((authenticated) => {
        if (cancelled) return;
        const session = getKeycloakSession();
        const roles = session.roles;
        setState({
          ready: true,
          authenticated,
          username: session.username,
          name: session.name,
          email: session.email,
          roles,
          token: session.token,
          login: startLogin,
          register: startRegister,
          logout: startLogout,
          hasRole: (role: string) => roles.includes(role),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            ready: true,
            login: startLogin,
            register: startRegister,
            logout: startLogout,
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
