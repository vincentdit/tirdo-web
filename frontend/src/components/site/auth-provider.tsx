"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getKeycloak, initKeycloak, startLogin, startLogout, startRegister } from "@/lib/keycloak";

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
        let authed = authenticated;
        let roles: string[] = [];
        let username: string | undefined;
        let name: string | undefined;
        let email: string | undefined;
        let token: string | undefined;
        try {
          const kc = getKeycloak();
          roles = kc.tokenParsed?.realm_access?.roles ?? [];
          username = kc.tokenParsed?.preferred_username as string | undefined;
          name = kc.tokenParsed?.name as string | undefined;
          email = kc.tokenParsed?.email as string | undefined;
          token = kc.token;
        } catch {
          authed = false;
        }
        setState({
          ready: true,
          authenticated: authed,
          username,
          name,
          email,
          roles,
          token,
          login: () => {
            void startLogin();
          },
          register: () => {
            void startRegister();
          },
          logout: () => {
            void startLogout();
          },
          hasRole: (role: string) => roles.includes(role),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            ready: true,
            login: () => {
              void startLogin();
            },
            register: () => {
              void startRegister();
            },
            logout: () => {
              void startLogout();
            },
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
