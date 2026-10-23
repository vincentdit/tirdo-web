"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { UsersHeading } from "@/components/tirdo-auth/users-tabs";
import {
  displayUserName,
  emailKey,
  fetchPortalUsers,
  type PortalGrant,
  type PortalUser,
  type PortalUsersMe,
} from "@/lib/portal-users";

export default function PortalUsersPage() {
  const [me, setMe] = useState<PortalUsersMe>({});
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [grants, setGrants] = useState<PortalGrant[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function load() {
    fetchPortalUsers()
      .then((j) => {
        setMe(j.me ?? {});
        setUsers(j.users ?? []);
        setGrants(j.grants ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQDebounced(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  const grantsByEmail = useMemo(() => {
    const map = new Map<string, PortalGrant>();
    for (const grant of grants) {
      const key = emailKey(grant.staffEmail);
      if (!map.has(key)) map.set(key, grant);
    }
    return map;
  }, [grants]);

  async function setActive(user: PortalUser, isActive: boolean) {
    if (!isActive && user.id === me.id) {
      setError("You cannot deactivate your own account.");
      return;
    }
    setBusyId(user.id);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-active", userId: user.id, isActive }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not update this user.");
      setNotice(isActive ? `${user.email} is active.` : `${user.email} is deactivated and cannot sign in.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this user.");
    } finally {
      setBusyId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const needle = qDebounced.toLowerCase();
    if (!needle) return users;
    return users.filter((user) => {
      const grant = grantsByEmail.get(emailKey(user.email));
      const hay = [
        displayUserName(user),
        user.email,
        user.roles.join(" "),
        user.isActive === false ? "inactive" : "active",
        grant?.departmentTitle,
        grant?.departmentSlug,
        grant?.collections.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [users, qDebounced, grantsByEmail]);

  const total = filteredUsers.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <PortalShell>
      <UsersHeading description="Find staff, activate or deactivate accounts, then open a tab to create a user or edit access." />
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Search users</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
            autoComplete="off"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Per page
          <select
            className="rounded-md border bg-white px-2 py-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value) || 10);
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-500">
                  No CMS users yet.
                </td>
              </tr>
            )}
            {users.length > 0 && pagedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-500">
                  No matching users.
                </td>
              </tr>
            )}
            {pagedUsers.map((user) => {
              const grant = grantsByEmail.get(emailKey(user.email));
              const superAdmin = user.roles.some((r) => r.toLowerCase() === "super admin");
              const canChange = me.isSuperAdmin || !superAdmin;
              return (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#0A192F]">{displayUserName(user)}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">{user.roles.join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.isActive === false ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {user.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {grant ? (
                      <>
                        {grant.departmentTitle || grant.departmentSlug || "Assigned"}
                        <div className="text-xs text-slate-500">{grant.collections.join(", ") || "No collections"}</div>
                      </>
                    ) : (
                      <span className="text-slate-500">{superAdmin ? "Full access" : "Not assigned"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/portal/users/edit?email=${encodeURIComponent(user.email)}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-semibold text-[#0A192F] hover:bg-slate-50"
                      >
                        Edit user
                      </Link>
                      <Link
                        href={`/portal/users/access?email=${encodeURIComponent(user.email)}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-semibold text-[#0A192F] hover:bg-slate-50"
                      >
                        Edit access
                      </Link>
                      {canChange && user.id !== me.id && (
                        <button
                          type="button"
                          disabled={busyId === user.id}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${
                            user.isActive === false ? "bg-[#059669] text-white" : "border border-red-200 text-red-800 hover:bg-red-50"
                          }`}
                          onClick={() => setActive(user, user.isActive === false)}
                        >
                          {busyId === user.id ? "Working…" : user.isActive === false ? "Activate" : "Deactivate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>
          {from}–{to} of {total}
          {qDebounced ? ` for “${qDebounced}”` : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs">
            Page {safePage} of {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </PortalShell>
  );
}
