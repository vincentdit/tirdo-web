"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { UsersHeading } from "@/components/tirdo-auth/users-tabs";
import { emailKey, fetchPortalUsers, type PortalRole, type PortalUser } from "@/lib/portal-users";

export default function PortalCreateUserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [roles, setRoles] = useState<PortalRole[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");

  useEffect(() => {
    fetchPortalUsers()
      .then((j) => {
        setUsers(j.users ?? []);
        setRoles(j.roles ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }, []);

  async function saveUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const duplicate = users.some((u) => emailKey(u.email) === emailKey(newEmail));
      if (duplicate) throw new Error("A user with this email already exists. Edit that account from Users & access.");
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-user",
          email: newEmail,
          firstname: newFirst,
          lastname: newLast,
          password: newPassword,
          roleId: newRoleId ? Number(newRoleId) : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not create this user.");
      router.push(`/portal/users/access?email=${encodeURIComponent(newEmail.trim().toLowerCase())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalShell>
      <UsersHeading description="Create each person once. After saving, you can assign department work on Edit access." />
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}
      <form className="mt-6 max-w-xl rounded-lg border bg-white p-5" onSubmit={saveUser}>
        <h2 className="font-semibold text-[#0A192F]">Create CMS user</h2>
        <p className="mt-1 text-xs text-slate-500">Each email can be created only once.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="First name" value={newFirst} onChange={(e) => setNewFirst(e.target.value)} required />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Last name" value={newLast} onChange={(e) => setNewLast(e.target.value)} />
          <input
            className="rounded-md border px-3 py-2 text-sm sm:col-span-2"
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            type="password"
            placeholder="Temporary password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <select className="rounded-md border px-3 py-2 text-sm" value={newRoleId} onChange={(e) => setNewRoleId(e.target.value)}>
            <option value="">Default role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-md bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? "Saving…" : "Create user"}
        </button>
      </form>
    </PortalShell>
  );
}
