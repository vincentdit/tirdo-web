"use client";

import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { RequireAuth } from "@/components/site/require-auth";
import { useAuth } from "@/components/site/auth-provider";
import { Button } from "@/components/ui/button";
import { canOpenContentManagement, CONTENT_MANAGEMENT_LAUNCH } from "@/lib/e-service-access";

export default function AccountPage() {
  return (
    <>
      <PageBanner title="My profile" subtitle="Your TIRDO sign-in on this website." crumbs={[{ label: "My profile" }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-2xl">
          <RequireAuth areaLabel="your profile">
            <AccountCard />
          </RequireAuth>
        </div>
      </section>
    </>
  );
}

function AccountCard() {
  const auth = useAuth();
  const roles = auth.roles.filter((r) => !r.startsWith("default-") && !["offline_access", "uma_authorization"].includes(r));
  const staff = auth.hasRole("staff") || auth.hasRole("tirdo-admin");
  const cms = canOpenContentManagement(auth.roles);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div>
          <div className="font-serif text-xl font-bold text-primary">{auth.name || auth.username}</div>
          {auth.email && <div className="mt-1 text-sm text-muted-foreground">{auth.email}</div>}
          {auth.username && auth.username !== auth.email && (
            <div className="mt-0.5 text-xs text-muted-foreground">Username: {auth.username}</div>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <ShieldCheck className="h-3.5 w-3.5" /> Signed in
        </span>
      </div>

      {roles.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Access</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {roles.map((role) => (
              <span key={role} className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link href="/e-services" className="rounded-lg border px-4 py-3 text-sm font-semibold text-primary hover:bg-secondary/40">
          My e-Services
        </Link>
        {staff && (
          <Link href="/staff" className="rounded-lg border px-4 py-3 text-sm font-semibold text-primary hover:bg-secondary/40">
            Staff portal
          </Link>
        )}
        {cms && (
          <a href={CONTENT_MANAGEMENT_LAUNCH} className="rounded-lg border px-4 py-3 text-sm font-semibold text-primary hover:bg-secondary/40">
            Content management
          </a>
        )}
      </div>

      <Button variant="outline" className="mt-6" onClick={auth.logout}>
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}
