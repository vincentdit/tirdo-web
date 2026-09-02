"use client";

import { Lock, LogIn, ShieldCheck, FileText, Inbox, ExternalLink } from "lucide-react";
import { useAuth } from "@/components/site/auth-provider";
import { Button } from "@/components/ui/button";

// The gated Client Portal on the e-Services page. Signed-out visitors see a
// sign-in prompt; signed-in users see their portal, role-aware.
export function EServicesPortal() {
  const auth = useAuth();
  const cmsUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + "/admin";

  if (!auth.ready) {
    return <div className="h-40 animate-pulse rounded-xl border bg-secondary/40" />;
  }

  if (!auth.authenticated) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </span>
        <h3 className="text-lg font-bold text-primary">Sign in to the TIRDO Client Portal</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Access your service requests, submitted documents and internal systems. Authentication is
          provided by TIRDO single sign-on (Keycloak).
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="accent" onClick={auth.login}>
            <LogIn className="h-4 w-4" /> Sign in
          </Button>
          <Button variant="outline" onClick={auth.register}>
            Create account
          </Button>
        </div>
      </div>
    );
  }

  const isEditor = auth.hasRole("content-editor") || auth.hasRole("tirdo-admin");
  const isStaff = auth.hasRole("staff") || isEditor;

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
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <ShieldCheck className="h-3.5 w-3.5" /> Signed in via SSO
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PortalTile icon={FileText} title="My Service Requests" desc="Track research, testing and consultancy requests." href="/contact" />
        <PortalTile icon={Inbox} title="Messages & Documents" desc="Correspondence and shared documents." href="#" />
        {isStaff && (
          <PortalTile icon={ExternalLink} title="Staff Portal" desc="Internal tools and systems for TIRDO staff." href="/staff" />
        )}
        {isEditor && (
          <PortalTile
            icon={ExternalLink}
            title="Content Management (Strapi)"
            desc="Manage news, publications and projects."
            href={cmsUrl}
            external
            badge="Editor"
          />
        )}
      </div>
    </div>
  );
}

function PortalTile({
  icon: Icon,
  title,
  desc,
  href,
  external,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  badge?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-accent hover:bg-secondary/40"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="flex items-center gap-2 font-semibold text-primary">
          {title}
          {badge && <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{badge}</span>}
        </div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </a>
  );
}
