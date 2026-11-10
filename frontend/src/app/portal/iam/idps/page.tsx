"use client";

import { useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamIdpsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/idps")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load identity providers.");
        setRows(j.results || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load identity providers."));
  }, []);
  return (
    <IamShell title="Identity providers" description="External IdPs brokered by the existing tirdo realm (if any).">
      <IamNotice error={error} />
      {!rows.length && <p className="text-sm text-slate-500">No brokered identity providers are configured.</p>}
      <ul className="divide-y rounded-lg border bg-white text-sm">
        {rows.map((row) => (
          <li key={String(row.alias)} className="px-4 py-2">{String(row.displayName || row.alias)} · {String(row.providerId)} · {row.enabled === false ? "disabled" : "enabled"}</li>
        ))}
      </ul>
    </IamShell>
  );
}
