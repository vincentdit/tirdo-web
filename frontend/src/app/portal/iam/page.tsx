"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

type Dash = {
  health?: { ok?: boolean; version?: string };
  realm?: { name?: string; displayName?: string };
  users?: { total?: number };
  applications?: { total?: number; enabled?: number; disabled?: number };
  catalog?: { code: string; name: string; status: string; clientId: string }[];
  events?: { time?: number; type?: string; clientId?: string; error?: string }[];
  failedLogins?: number;
  sessions?: { clientId?: string; active?: number }[];
};

export default function IamDashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portal/iam/dashboard")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.status === 403) throw new Error(j.error || "Only an IAM administrator can open this module.");
        if (!r.ok) throw new Error(j.error || "Could not load the SSO dashboard.");
        return j;
      })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the SSO dashboard."));
  }, []);

  return (
    <IamShell title="Identity & Access Management" description="Central Keycloak administration for TIRDO Web and connected institutional systems. Statistics come from the live Keycloak realm.">
      <IamNotice error={error} />
      {!data && !error && <p className="text-sm text-slate-500">Loading Keycloak status…</p>}
      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Keycloak" value={data.health?.ok ? "Connected" : "Unavailable"} />
            <Stat label="Realm" value={String(data.realm?.displayName || data.realm?.name || "—")} />
            <Stat label="Users" value={String(data.users?.total ?? "—")} />
            <Stat label="Clients" value={`${data.applications?.enabled ?? 0} enabled / ${data.applications?.total ?? 0}`} />
            <Stat
              label="Active SSO sessions"
              value={String((data.sessions || []).reduce((n, s) => n + Number(s.active || 0), 0))}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">Failed login events in the recent batch: {data.failedLogins ?? 0}. Version {data.health?.version || "unknown"}.</p>
          <h2 className="mt-8 font-semibold text-[#0A192F]">Institutional applications</h2>
          <div className="mt-3 overflow-hidden rounded-lg border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Application</th>
                  <th className="px-4 py-2">Client ID</th>
                  <th className="px-4 py-2">Integration</th>
                </tr>
              </thead>
              <tbody>
                {(data.catalog || []).map((row) => (
                  <tr key={row.code} className="border-t">
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{row.clientId}</td>
                    <td className="px-4 py-2">
                      {row.status === "integrated"
                        ? "TIRDO Web login is live (OIDC BFF)"
                        : row.status === "client_ready"
                          ? "Keycloak client exists — application login not verified in this repository"
                          : row.status === "disabled"
                            ? "Disabled"
                            : "Not registered"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mt-8 font-semibold text-[#0A192F]">Recent authentication events</h2>
          {!data.events?.length && <p className="mt-2 text-sm text-slate-500">No events available. Enable events in Keycloak if this stays empty.</p>}
          <ul className="mt-3 divide-y rounded-lg border bg-white text-sm">
            {(data.events || []).map((ev, i) => (
              <li key={`${ev.time}-${i}`} className="px-4 py-2">
                <span className="font-medium">{String(ev.type || "EVENT")}</span>
                <span className="text-slate-500"> · {ev.clientId || "—"} · {ev.time ? new Date(Number(ev.time)).toLocaleString() : ""}</span>
                {ev.error ? <span className="text-red-700"> · {String(ev.error)}</span> : null}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href="/portal/iam/applications/new" className="font-semibold text-[#059669] hover:underline">
              Register an application
            </Link>
          </p>
        </>
      )}
    </IamShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[#0A192F]">{value}</div>
    </div>
  );
}
