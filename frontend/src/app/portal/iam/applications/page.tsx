"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

type AppRow = {
  id?: string;
  name?: string;
  clientId?: string;
  code?: string;
  status?: string;
  enabled?: boolean;
  registered?: boolean;
  protocol?: string;
  rootUrl?: string;
};

export default function IamApplicationsPage() {
  const [rows, setRows] = useState<AppRow[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [q, setQ] = useState("");

  function load() {
    fetch("/api/portal/iam/applications")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load applications.");
        return j;
      })
      .then((j) => setRows(j.results || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load applications."));
  }

  useEffect(load, []);

  async function patch(id: string, enabled: boolean) {
    setError("");
    const res = await fetch(`/api/portal/iam/applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not update this application.");
    setNotice(enabled ? "Application enabled." : "Application disabled.");
    load();
  }

  const filtered = (rows || []).filter((row) => {
    const blob = `${row.name} ${row.clientId} ${row.code}`.toLowerCase();
    return blob.includes(q.trim().toLowerCase());
  });

  return (
    <IamShell title="Connected applications" description="Keycloak clients in the tirdo realm. Registering a client does not mean NIIMS, LIMS, CIAP or TELT login is complete until that system implements OIDC.">
      <IamNotice error={error} notice={notice} />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <Link href="/portal/iam/applications/new" className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white">
          Register application
        </Link>
      </div>
      {rows && filtered.length === 0 && <p className="text-sm text-slate-500">No applications match this search.</p>}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Client ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">URL</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id || row.clientId} className="border-t">
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2 font-mono text-xs">{row.clientId}</td>
                <td className="px-4 py-2">{row.status || (row.enabled ? "enabled" : "disabled")}</td>
                <td className="px-4 py-2 text-xs">{row.rootUrl || "—"}</td>
                <td className="px-4 py-2">
                  {row.id ? (
                    <div className="flex flex-wrap gap-2">
                      <Link className="text-[#059669] hover:underline" href={`/portal/iam/applications/${row.id}`}>
                        View
                      </Link>
                      <button type="button" className="text-slate-700 hover:underline" onClick={() => patch(row.id!, !row.enabled)}>
                        {row.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  ) : (
                    <Link className="text-[#059669] hover:underline" href={`/portal/iam/applications/new?code=${encodeURIComponent(String(row.clientId || row.code || ""))}`}>
                      Register
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IamShell>
  );
}
