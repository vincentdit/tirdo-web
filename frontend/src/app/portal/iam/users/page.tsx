"use client";

import { FormEvent, useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

type User = {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  requiredActions?: string[];
};

export default function IamUsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [requireMfa, setRequireMfa] = useState(true);
  const [credNote, setCredNote] = useState("");

  function load() {
    const qs = new URLSearchParams({ max: "50" });
    if (q.trim()) qs.set("q", q.trim());
    fetch(`/api/portal/iam/users?${qs}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load users.");
        return j;
      })
      .then((j) => {
        setRows(j.results || []);
        setTotal(Number(j.total) || 0);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }

  // Initial list only; search runs from the form submit.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/portal/iam/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, firstName, lastName, requireMfa }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not create user.");
    setNotice("User created in Keycloak. No application access is granted until roles are assigned.");
    setUsername("");
    setEmail("");
    load();
  }

  async function act(id: string, path: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/portal/iam/users/${encodeURIComponent(id)}${path}`, {
      method: path.includes("roles") ? "PUT" : path ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not update this user.");
    setNotice(json.message || "Updated.");
    load();
  }

  return (
    <IamShell title="User management" description="Keycloak is the identity authority. Passwords are not stored in TIRDO Web. OTP secrets are never shown.">
      <IamNotice error={error} notice={notice} />
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Search username or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="rounded-md border px-3 py-2 text-sm" type="submit">Search</button>
      </form>
      <p className="mb-3 text-xs text-slate-500">{total} users in the realm.</p>
      {credNote && <p className="mb-3 text-xs text-slate-600">{credNote}</p>}
      <form className="mb-6 grid gap-2 rounded-lg border bg-white p-4 sm:grid-cols-2" onSubmit={create}>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="rounded-md border px-3 py-2 text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={requireMfa} onChange={(e) => setRequireMfa(e.target.checked)} />
          Require authenticator enrollment at next login
        </label>
        <button className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white sm:col-span-2" type="submit">
          Create institutional user
        </button>
      </form>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">MFA</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">
                  <div className="font-medium">{[u.firstName, u.lastName].filter(Boolean).join(" ") || u.username}</div>
                  <div className="text-xs text-slate-500">{u.username} · {u.email} · sub {u.id}</div>
                </td>
                <td className="px-4 py-2">{u.enabled ? "Active" : "Disabled"}</td>
                <td className="px-4 py-2 text-xs">{(u.requiredActions || []).includes("CONFIGURE_TOTP") ? "Enrollment required" : "See credentials"}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button type="button" className="hover:underline" onClick={() => act(u.id, "", { enabled: !u.enabled })}>
                      {u.enabled ? "Disable" : "Enable"}
                    </button>
                    <button type="button" className="hover:underline" onClick={() => act(u.id, "/logout", {})}>Revoke sessions</button>
                    <button
                      type="button"
                      className="hover:underline"
                      onClick={() => window.confirm("Remove OTP/WebAuthn credentials, require re-enrollment, and revoke sessions?") && act(u.id, "/reset-mfa", { confirm: true })}
                    >
                      Reset MFA
                    </button>
                    <button type="button" className="hover:underline" onClick={() => act(u.id, "/roles", { role: "staff" })}>
                      Grant staff
                    </button>
                    <button
                      type="button"
                      className="hover:underline"
                      onClick={async () => {
                        const res = await fetch(`/api/portal/iam/users/${encodeURIComponent(u.id)}/credentials`);
                        const json = await res.json().catch(() => ({}));
                        const types = (json.results || []).map((c: { type?: string }) => c.type).join(", ") || "none";
                        setCredNote(`${u.username}: credential types ${types} (secrets are never returned).`);
                      }}
                    >
                      MFA status
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IamShell>
  );
}
