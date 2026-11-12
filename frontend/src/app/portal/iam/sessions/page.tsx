"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";
import { catalogByClientId } from "@/lib/iam";
import { formatDuration } from "@/lib/session-policy";

type SessionRow = { clientId?: string; active?: number; offline?: number };
type Timeouts = { idleSeconds?: number; maxSeconds?: number };

export default function IamSessionsPage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [timeouts, setTimeouts] = useState<Timeouts>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    fetch("/api/portal/iam/sessions")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load sessions.");
        setRows(j.results || []);
        setTimeouts(j.timeouts || {});
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load sessions."));
  }

  useEffect(() => {
    load();
  }, []);

  async function revokeAll() {
    if (!window.confirm("Sign out every user from the website, LIMS, and all other SSO systems now?")) return;
    const res = await fetch("/api/portal/iam/sessions/revoke-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not revoke sessions.");
    setNotice("Every SSO session was ended. People must sign in again.");
    load();
  }

  return (
    <IamShell
      title="Session management"
      description="When someone signs out of TIRDO Web, every SSO session for that person is ended in all connected systems. Use this page to see live counts or to sign everyone out at once."
    >
      <IamNotice error={error} notice={notice} />
      <p className="mb-4 text-sm text-slate-600">
        Current idle limit: <strong>{formatDuration(Number(timeouts.idleSeconds || 0))}</strong>. Maximum signed-in time:{" "}
        <strong>{formatDuration(Number(timeouts.maxSeconds || 0))}</strong>.{" "}
        <Link className="font-semibold text-emerald-800 hover:underline" href="/portal/iam/policies">
          Change time limits
        </Link>
      </p>
      <button type="button" className="mb-4 rounded-md border border-red-200 px-4 py-2 text-sm text-red-700" onClick={revokeAll}>
        Sign out everyone
      </button>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">System</th>
              <th className="px-4 py-2">Client ID</th>
              <th className="px-4 py-2">Active sessions</th>
              <th className="px-4 py-2">Offline sessions</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={4}>
                  No active application sessions right now.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row.clientId)} className="border-t">
                <td className="px-4 py-2">{catalogByClientId(String(row.clientId || ""))?.name || row.clientId || "Unknown"}</td>
                <td className="px-4 py-2 font-mono text-xs">{String(row.clientId || "—")}</td>
                <td className="px-4 py-2">{Number(row.active || 0)}</td>
                <td className="px-4 py-2">{Number(row.offline || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IamShell>
  );
}
