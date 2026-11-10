"use client";

import { useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamAuditPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/events")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load events.");
        setRows(j.results || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load events."));
  }, []);
  return (
    <IamShell title="IAM audit logs" description="Keycloak login and admin events. Portal CMS audit remains under Audit trail.">
      <IamNotice error={error} />
      {!rows.length && <p className="text-sm text-slate-500">No Keycloak events. Enable User events and Admin events in the realm if this is empty.</p>}
      <ul className="divide-y rounded-lg border bg-white text-sm">
        {rows.map((ev, i) => (
          <li key={i} className="px-4 py-2">
            <span className="font-medium">{String(ev.type)}</span>
            <span className="text-slate-500"> · {String(ev.clientId || "")} · {ev.time ? new Date(Number(ev.time)).toLocaleString() : ""}</span>
          </li>
        ))}
      </ul>
    </IamShell>
  );
}
