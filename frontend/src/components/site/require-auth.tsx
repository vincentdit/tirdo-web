"use client";

import { useEffect, type ReactNode } from "react";
import { Loader2, ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "@/components/site/auth-provider";
import { Button } from "@/components/ui/button";

// Wrap any staff-only view. Unauthenticated visitors are redirected straight
// to the Keycloak sign-in page (returning here afterwards); authenticated
// users missing the required role get an access-denied screen.
export function RequireAuth({
  role,
  children,
  areaLabel = "this area",
}: {
  role?: string;
  children: ReactNode;
  areaLabel?: string;
}) {
  const auth = useAuth();

  // Once Keycloak has resolved and the user is not signed in, send them to login.
  useEffect(() => {
    if (auth.ready && !auth.authenticated) {
      auth.login();
    }
  }, [auth.ready, auth.authenticated, auth]);

  if (!auth.ready) {
    return <Gate icon={<Loader2 className="h-7 w-7 animate-spin" />} title="Loading…" />;
  }

  if (!auth.authenticated) {
    return <Gate icon={<Loader2 className="h-7 w-7 animate-spin" />} title="Redirecting to sign in…" subtitle="Taking you to TIRDO single sign-on." />;
  }

  if (role && !auth.hasRole(role)) {
    return (
      <Gate
        icon={<ShieldAlert className="h-7 w-7 text-destructive" />}
        title="Access denied"
        subtitle={`You are signed in as ${auth.name || auth.username}, but ${areaLabel} requires the “${role}” role. Contact the TIRDO administrator if you need access.`}
      >
        <Button variant="outline" onClick={auth.logout}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </Gate>
    );
  }

  return <>{children}</>;
}

function Gate({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid min-h-[50vh] place-items-center py-16">
      <div className="container-tirdo max-w-md text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-6 flex justify-center">{children}</div>}
      </div>
    </div>
  );
}
