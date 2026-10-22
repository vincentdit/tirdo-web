"use client";

import { FormEvent, useEffect, useState } from "react";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";

type User = { id: number; email: string; firstname?: string; lastname?: string; roles: string[]; isActive?: boolean };
type Role = { id: number; name: string };
type Dept = { slug?: string; title?: string };
type SitePage = { slug: string; title: string; path: string };
type Grant = {
  documentId: string;
  staffEmail: string;
  departmentSlug?: string;
  departmentTitle?: string;
  collections: string[];
  pageSlugs: string[];
  canPublish: boolean;
  canManageMedia: boolean;
  canManageUsers: boolean;
  active: boolean;
  notes?: string;
};
type Collection = { slug: string; label: string };

export default function PortalUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sitePages, setSitePages] = useState<SitePage[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [staffEmail, setStaffEmail] = useState("");
  const [departmentSlug, setDepartmentSlug] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [pageSlugs, setPageSlugs] = useState<string[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [canManageMedia, setCanManageMedia] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [notes, setNotes] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");

  function load() {
    fetch("/api/portal/users")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (r.status === 403) throw new Error("Only a user administrator can manage access.");
        if (!r.ok) throw new Error("Could not load users.");
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        setUsers(j.users ?? []);
        setRoles(j.roles ?? []);
        setGrants(j.grants ?? []);
        setDepartments(j.departments ?? []);
        setCollections(j.collections ?? []);
        setSitePages(j.sitePages ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }

  useEffect(() => {
    load();
  }, []);

  const selectedDept = departments.find((d) => d.slug === departmentSlug);

  async function saveGrant(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          staffEmail,
          departmentSlug,
          departmentTitle: selectedDept?.title || departmentSlug,
          collections: selected,
          pageSlugs: selected.includes("pages") ? pageSlugs : [],
          canPublish,
          canManageMedia,
          canManageUsers,
          notes,
          active: true,
        }),
      });
      if (!res.ok) throw new Error("Could not save this assignment.");
      setNotes("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this assignment.");
    } finally {
      setSaving(false);
    }
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
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
      if (!res.ok) throw new Error("Could not create this user.");
      setNewEmail("");
      setNewFirst("");
      setNewLast("");
      setNewPassword("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create this user.");
    } finally {
      setSaving(false);
    }
  }

  function toggleCollection(slug: string) {
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));
  }

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Users & access</h1>
      <p className="mt-1 text-sm text-slate-600">
        Super Admin and Admin can edit all pages, logos and photos. Other staff only see the collections you assign here.
      </p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <form className="rounded-lg border bg-white p-5" onSubmit={createUser}>
          <h2 className="font-semibold text-[#0A192F]">Create CMS user</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input className="rounded-md border px-3 py-2 text-sm" placeholder="First name" value={newFirst} onChange={(e) => setNewFirst(e.target.value)} required />
            <input className="rounded-md border px-3 py-2 text-sm" placeholder="Last name" value={newLast} onChange={(e) => setNewLast(e.target.value)} />
            <input className="rounded-md border px-3 py-2 text-sm sm:col-span-2" type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            <input className="rounded-md border px-3 py-2 text-sm" type="password" placeholder="Temporary password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
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
            Create user
          </button>
        </form>

        <form className="rounded-lg border bg-white p-5" onSubmit={saveGrant}>
          <h2 className="font-semibold text-[#0A192F]">Assign department work</h2>
          <div className="mt-3 space-y-3">
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required>
              <option value="">Select staff user</option>
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.firstname} {u.lastname} ({u.email})
                </option>
              ))}
            </select>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={departmentSlug} onChange={(e) => setDepartmentSlug(e.target.value)}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.slug || d.title} value={d.slug || ""}>
                  {d.title}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {collections.map((c) => (
                <label key={c.slug} className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.includes(c.slug)} onChange={() => toggleCollection(c.slug)} />
                  {c.label}
                </label>
              ))}
            </div>
            {selected.includes("pages") && (
              <div className="rounded-md border bg-slate-50 p-3">
                <p className="mb-2 text-sm font-medium text-[#0A192F]">Website pages they may edit</p>
                <p className="mb-2 text-xs text-slate-600">Leave all unticked to allow every page. Tick only the pages this person should update.</p>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {sitePages.map((p) => (
                    <label key={p.slug} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={pageSlugs.includes(p.slug)}
                        onChange={() =>
                          setPageSlugs((cur) => (cur.includes(p.slug) ? cur.filter((s) => s !== p.slug) : [...cur, p.slug]))
                        }
                      />
                      <span>
                        {p.title}
                        <span className="block text-xs text-slate-500">{p.path}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={canPublish} onChange={(e) => setCanPublish(e.target.checked)} /> Can publish
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={canManageMedia} onChange={(e) => setCanManageMedia(e.target.checked)} /> Can manage gallery, logo and site photos
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={canManageUsers} onChange={(e) => setCanManageUsers(e.target.checked)} /> Can manage users
            </label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={2} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="mt-4 rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            Save assignment
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Work</th>
              <th className="px-4 py-3">Rights</th>
            </tr>
          </thead>
          <tbody>
            {grants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  No department assignments yet. Super Admins still have full access.
                </td>
              </tr>
            )}
            {grants.map((g) => (
              <tr key={g.documentId} className="border-t">
                <td className="px-4 py-3">{g.staffEmail}</td>
                <td className="px-4 py-3">{g.departmentTitle || g.departmentSlug || "—"}</td>
                <td className="px-4 py-3">
                  {g.collections.join(", ") || "—"}
                  {g.pageSlugs?.length ? (
                    <div className="text-xs text-slate-500">Pages: {g.pageSlugs.join(", ")}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {[g.canPublish && "Publish", g.canManageMedia && "Gallery", g.canManageUsers && "Users"].filter(Boolean).join(", ") || "View assigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
