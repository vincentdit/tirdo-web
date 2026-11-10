"use client";

import { useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamSessionsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/sessions")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load sessions.");
        setRows(j.results || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load sessions."));
  }, []);

  async function revokeAll() {
    if (!window.confirm("Revoke every SSO session in this realm? Users will need to sign in again.")) return;
    const res = await fetch("/api/portal/iam/sessions/revoke-all", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: true }) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not revoke sessions.");
    setNotice("All realm SSO sessions were revoked.");
  }

  return (
    <IamShell title="Session management" description="Client session statistics from Keycloak. Logging out of TIRDO Web uses RP-initiated OIDC logout with id_token_hint.">
      <IamNotice error={error} notice={notice} />
      <button type="button" className="mb-4 rounded-md border border-red-200 px-4 py-2 text-sm text-red-700" onClick={revokeAll}>
        Revoke all SSO sessions
      </button>
      {!rows.length && <p className="text-sm text-slate-500">No client session stats returned.</p>}
      <ul className="divide-y rounded-lg border bg-white text-sm">
        {rows.map((row, i) => (
          <li key={i} className="px-4 py-2">{JSON.stringify(row)}</li>
        ))}
      </ul>
    </IamShell>
  );
}
