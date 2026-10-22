"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = { slug: string; label: string; description: string; group: string; total: number; ok: boolean };
type Access = {
  isSuperAdmin?: boolean;
  canManageMedia?: boolean;
  canManageUsers?: boolean;
  canManageSite?: boolean;
  departments?: { slug: string; title: string }[];
  grantReady?: boolean;
};

export default function PortalDashboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [access, setAccess] = useState<Access | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portal/content")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        return r.json();
      })
      .then((j) => {
        setRows(j?.collections ?? []);
        setAccess(j?.access ?? null);
      })
      .catch(() => setError("Could not load dashboard data."));
  }, []);

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Content overview</h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage website content, gallery, settings and staff access.
      </p>
      {access?.departments?.length ? (
        <p className="mt-3 text-sm text-slate-700">
          Assigned work: <span className="font-medium">{access.departments.map((d) => d.title).join(", ")}</span>
        </p>
      ) : null}
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {rows && rows.length === 0 && (
        <div className="mt-6 rounded-lg border bg-white p-6 text-sm text-slate-600">
          No content types are assigned to your account yet. Ask a user administrator to grant department work in Users &amp; access.
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!rows &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg border bg-white" />
          ))}
        {rows?.map((c) => (
          <Link key={c.slug} href={`/portal/${c.slug}`}>
            <Card className="h-full transition hover:border-[#059669] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A192F]">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-[#059669]">{c.ok ? c.total : "—"}</div>
                <p className="mt-1 text-xs text-slate-500">{c.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(access?.canManageSite || access?.canManageMedia || access?.isSuperAdmin) && (
          <Link href="/portal/branding">
            <Card className="h-full transition hover:border-[#059669] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A192F]">Logo & photos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Change the emblem, logo and homepage photos.</p>
              </CardContent>
            </Card>
          </Link>
        )}
        {(access?.canManageSite || access?.canManageMedia || access?.isSuperAdmin) && (
          <Link href="/portal/gallery">
            <Card className="h-full transition hover:border-[#059669] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A192F]">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Upload and review website media.</p>
              </CardContent>
            </Card>
          </Link>
        )}
        <Link href="/portal/settings">
          <Card className="h-full transition hover:border-[#059669] hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#0A192F]">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Account details and access rules.</p>
            </CardContent>
          </Card>
        </Link>
        {access?.canManageUsers && (
          <Link href="/portal/users">
            <Card className="h-full transition hover:border-[#059669] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A192F]">Users & access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Assign department work and publishing rights.</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </PortalShell>
  );
}
