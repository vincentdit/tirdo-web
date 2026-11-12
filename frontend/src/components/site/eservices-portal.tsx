"use client";

import { useEffect, useState } from "react";
import { Lock, LogIn, ShieldCheck, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/components/site/auth-provider";
import { Button } from "@/components/ui/button";

type WorkspaceService = {
  slug: string;
  title: string;
  acronym?: string;
  description: string;
  category: string;
  connected: boolean;
  launchPath: string;
};

type Workspace = {
  services: WorkspaceService[];
  contentManagement?: boolean;
  staffPortal?: boolean;
};

export function EServicesPortal() {
  const auth = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.authenticated) {
      setWorkspace(null);
      return;
    }
    fetch("/api/e-services/workspace")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error("Could not load your systems. Try again shortly.");
        return j as Workspace;
      })
      .then(setWorkspace)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load your systems."));
  }, [auth.authenticated]);

  if (!auth.ready) {
    return <div className="h-40 animate-pulse rounded-xl border bg-secondary/40" />;
  }

  if (!auth.authenticated) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </span>
        <h3 className="text-lg font-bold text-primary">Sign in with TIRDO SSO</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Use your Keycloak account once. You will then see only the systems your role allows — NIIMS, LIMS, CIAP, TELT, e-Office and Content management — and open them without signing in again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="accent" onClick={auth.login}>
            <LogIn className="h-4 w-4" /> Sign in
          </Button>
        </div>
      </div>
    );
  }

  const tiles = [
    ...(workspace?.services || []).map((item) => ({
      key: item.slug,
      title: item.acronym ? `${item.title} (${item.acronym})` : item.title,
      desc: item.connected
        ? item.description
        : `${item.description} System URL is not configured yet — ask an IAM administrator.`,
      href: item.connected ? item.launchPath : "",
      badge: item.connected ? "SSO" : "Not connected",
    })),
    ...(workspace?.staffPortal
      ? [{ key: "staff", title: "Staff directory", desc: "Internal people and organisation pages on TIRDO Web.", href: "/staff", badge: "TIRDO Web" }]
      : []),
    ...(workspace?.contentManagement
      ? [{ key: "cms", title: "Content management", desc: "Manage news, publications, e-service links and projects.", href: "/api/portal/from-sso", badge: "Editor" }]
      : []),
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {(auth.name || auth.username || "U").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="font-semibold text-primary">Welcome, {auth.name || auth.username}</div>
            <div className="text-xs text-muted-foreground">{auth.email}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Signed in via Keycloak
          </span>
          <Button variant="outline" size="sm" onClick={auth.logout}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {!workspace && !error && <p className="mt-4 text-sm text-muted-foreground">Loading the systems you can access…</p>}
      {workspace && tiles.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No institutional systems are assigned to this account yet. An IAM administrator can grant NIIMS, LIMS, CIAP or TELT access in Identity &amp; Access.
        </p>
      )}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tiles.map((item) =>
          item.href ? (
            <a
              key={item.key}
              href={item.href}
              className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-accent hover:bg-secondary/40"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 font-semibold text-primary">
                  {item.title}
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{item.badge}</span>
                </div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            </a>
          ) : (
            <div key={item.key} className="flex items-start gap-3 rounded-lg border border-dashed p-4 opacity-80">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 font-semibold text-primary">
                  {item.title}
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{item.badge}</span>
                </div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
