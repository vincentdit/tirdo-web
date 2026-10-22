"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";

type Me = {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  isSuperAdmin?: boolean;
  canPublish?: boolean;
  canManageMedia?: boolean;
  canManageUsers?: boolean;
  canManageSite?: boolean;
  isFullAccess?: boolean;
  departments?: { title: string }[];
  collections?: { slug: string; label: string }[];
};

export default function PortalSettingsPage() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        Account and access for the TIRDO website content management portal.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold text-[#0A192F]">Your account</h2>
          <p className="mt-1 text-sm text-slate-600">
            <Link href="/portal/profile" className="font-medium text-[#059669] hover:underline">
              Open profile
            </Link>{" "}
            to edit your name or change password.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd>{[me?.firstname, me?.lastname].filter(Boolean).join(" ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>{me?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">CMS roles</dt>
              <dd>{me?.roles?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Department assignment</dt>
              <dd>{me?.departments?.map((d) => d.title).join(", ") || (me?.isSuperAdmin ? "All departments" : "Not assigned")}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold text-[#0A192F]">Rights on this portal</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Site-wide editing: {me?.isFullAccess ? "Admin / Super Admin" : "Assigned collections only"}</li>
            <li>Publish: {me?.canPublish ? "Allowed" : "Not assigned"}</li>
            <li>Logo, photos and gallery: {me?.canManageSite ? "Allowed" : "Not assigned"}</li>
            <li>User administration: {me?.canManageUsers ? "Allowed" : "Not assigned"}</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">Assigned content:</p>
          <p className="text-sm">{me?.collections?.map((c) => c.label).join(", ") || "None"}</p>
        </section>
        {(me?.canManageSite || me?.canManageUsers) && (
          <section className="rounded-lg border bg-white p-5 lg:col-span-2">
            <h2 className="font-semibold text-[#0A192F]">Shortcuts</h2>
            <p className="mt-2 text-sm text-slate-600">Stay in this portal to manage branding and staff access.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {me?.canManageSite && (
                <Link href="/portal/branding" className="rounded-md border px-4 py-2 text-sm font-semibold text-[#0A192F]">
                  Logo & photos
                </Link>
              )}
              {me?.canManageUsers && (
                <Link href="/portal/users" className="rounded-md border px-4 py-2 text-sm font-semibold text-[#0A192F]">
                  Users & access
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </PortalShell>
  );
}
