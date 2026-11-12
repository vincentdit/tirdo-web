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

function fromSession(authenticated: boolean): AuthState {
  const session = getKeycloakSession();
  const roles = session.roles;
  return {
    ready: true,
    authenticated,
    username: session.username,
    name: session.name,
    email: session.email,
    roles,
    login: startLogin,
    register: startRegister,
    logout: startLogout,
    hasRole: (role: string) => roles.includes(role),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      initKeycloak()
        .then((authenticated) => {
          if (!cancelled) setState(fromSession(authenticated));
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
    };
    refresh();
    const onShow = () => refresh();
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
