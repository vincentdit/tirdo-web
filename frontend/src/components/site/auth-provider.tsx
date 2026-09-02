"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getKeycloak, initKeycloak } from "@/lib/keycloak";

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
    const kc = getKeycloak();

    initKeycloak()
      .then((authenticated) => {
        if (cancelled) return;
        const roles = kc.tokenParsed?.realm_access?.roles ?? [];
        setState({
          ready: true,
          authenticated,
          username: kc.tokenParsed?.preferred_username as string | undefined,
          name: kc.tokenParsed?.name as string | undefined,
          email: kc.tokenParsed?.email as string | undefined,
          roles,
          token: kc.token,
          login: () => kc.login({ redirectUri: window.location.href }),
          register: () => kc.register({ redirectUri: window.location.href }),
          logout: () => kc.logout({ redirectUri: window.location.origin }),
          hasRole: (role: string) => roles.includes(role),
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, ready: true }));
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
