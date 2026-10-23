"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { StaffSearchSelect } from "@/components/tirdo-auth/staff-search-select";
import { UsersHeading } from "@/components/tirdo-auth/users-tabs";
import { portalPasswordIssue } from "@/lib/portal";
import {
  emailKey,
  fetchPortalUsers,
  type PortalRole,
  type PortalUser,
  type PortalUsersMe,
} from "@/lib/portal-users";

function EditUserForm() {
  const search = useSearchParams();
  const emailParam = search.get("email") || "";
  const [me, setMe] = useState<PortalUsersMe>({});
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [roles, setRoles] = useState<PortalRole[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const selected = users.find((u) => emailKey(u.email) === emailKey(staffEmail));

  function fillUser(email: string) {
    const user = users.find((u) => emailKey(u.email) === emailKey(email));
    setStaffEmail(email);
    setFirstname(String(user?.firstname || ""));
    setLastname(String(user?.lastname || ""));
    setRoleId(user?.roleIds?.[0] ? String(user.roleIds[0]) : "");
    setPassword("");
    setConfirmPassword("");
  }

  useEffect(() => {
    fetchPortalUsers()
      .then((j) => {
        setMe(j.me ?? {});
        setUsers(j.users ?? []);
        setRoles(j.roles ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }, []);

  useEffect(() => {
    if (!emailParam || users.length === 0) return;
    const match = users.find((u) => emailKey(u.email) === emailKey(emailParam));
    if (match) fillUser(match.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam, users]);

  const superAdminTarget = selected?.roles.some((r) => r.toLowerCase() === "super admin");
  const canChange = Boolean(selected) && (me.isSuperAdmin || !superAdminTarget);

  async function saveUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (!selected) throw new Error("Select the staff user to edit.");
      if (!canChange) throw new Error("Only a Super Admin can change a Super Admin account.");
      if (!lastname.trim()) throw new Error("Last name is required.");
      if (!roleId) throw new Error("Choose a role for this user.");
      if (password) {
        const passwordIssue = portalPasswordIssue(password);
        if (passwordIssue) throw new Error(passwordIssue);
        if (!confirmPassword) throw new Error("Confirm the password.");
        if (password !== confirmPassword) throw new Error("Password and confirmation do not match.");
      }
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-user",
          userId: selected.id,
          firstname,
          lastname,
          roleId: Number(roleId),
          password: password || undefined,
          passwordConfirmation: password ? confirmPassword : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not update this user.");
      setNotice("User saved. Next, assign what they may manage under Edit access.");
      setPassword("");
      setConfirmPassword("");
      const j = await fetchPortalUsers();
      setUsers(j.users ?? []);
      setRoles(j.roles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}
      <form className="mt-6 max-w-xl rounded-lg border bg-white p-5" onSubmit={saveUser}>
        <h2 className="font-semibold text-[#0A192F]">Edit CMS user</h2>
        <p className="mt-1 text-xs text-slate-500">
          Change name, role or password. What they see in Content management is set on Edit access.
        </p>
        <div className="mt-3 space-y-3">
          <StaffSearchSelect users={users} value={staffEmail} onChange={fillUser} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            <select
              className="rounded-md border px-3 py-2 text-sm sm:col-span-2"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              disabled={!canChange && Boolean(selected)}
            >
              <option value="">Choose a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <input
              className="rounded-md border px-3 py-2 text-sm"
              type="password"
              autoComplete="new-password"
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving || !canChange} className="rounded-md bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save user"}
          </button>
          {selected && (
            <Link
              href={`/portal/users/access?email=${encodeURIComponent(selected.email)}`}
              className="text-sm font-semibold text-[#059669] hover:underline"
            >
              Edit access
            </Link>
          )}
        </div>
      </form>
    </>
  );
}

export default function PortalEditUserPage() {
  return (
    <PortalShell>
      <UsersHeading description="Change a person’s name, CMS role or password. Then use Edit access to choose which content they may manage." />
      <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Loading…</p>}>
        <EditUserForm />
      </Suspense>
    </PortalShell>
  );
}
