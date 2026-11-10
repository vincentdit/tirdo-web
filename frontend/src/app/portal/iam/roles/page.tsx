"use client";

import { useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamRolesPage() {
  const [rows, setRows] = useState<{ name?: string; description?: string }[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/roles")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load roles.");
        setRows(j.results || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load roles."));
  }, []);
  return (
    <IamShell title="Roles & permissions" description="Realm roles from Keycloak. Application-specific authorization still belongs in each system.">
      <IamNotice error={error} />
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-2">Role</th><th className="px-4 py-2">Description</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t">
                <td className="px-4 py-2 font-mono text-xs">{r.name}</td>
                <td className="px-4 py-2">{r.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IamShell>
  );
}
