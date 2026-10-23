"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { StaffSearchSelect } from "@/components/tirdo-auth/staff-search-select";
import { UsersHeading } from "@/components/tirdo-auth/users-tabs";
import {
  emailKey,
  fetchPortalUsers,
  type PortalDept,
  type PortalGrant,
  type PortalSitePage,
  type PortalUser,
  type PortalUserCollection,
} from "@/lib/portal-users";

const COLLECTION_GROUPS: { id: string; label: string }[] = [
  { id: "content", label: "Content management" },
  { id: "services", label: "Opportunities" },
  { id: "directory", label: "Organisation" },
  { id: "inbox", label: "Inbox" },
];

function EditAccessForm() {
  const search = useSearchParams();
  const emailParam = search.get("email") || "";
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [grants, setGrants] = useState<PortalGrant[]>([]);
  const [departments, setDepartments] = useState<PortalDept[]>([]);
  const [collections, setCollections] = useState<PortalUserCollection[]>([]);
  const [sitePages, setSitePages] = useState<PortalSitePage[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [departmentSlug, setDepartmentSlug] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [pageSlugs, setPageSlugs] = useState<string[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [canManageMedia, setCanManageMedia] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [notes, setNotes] = useState("");
  const [grantDocumentId, setGrantDocumentId] = useState("");

  const grantsByEmail = useMemo(() => {
    const map = new Map<string, PortalGrant>();
    for (const grant of grants) {
      const key = emailKey(grant.staffEmail);
      if (!map.has(key)) map.set(key, grant);
    }
    return map;
  }, [grants]);

  function fillAccess(email: string) {
    const grant = grantsByEmail.get(emailKey(email));
    setStaffEmail(email);
    setGrantDocumentId(grant?.documentId || "");
    setDepartmentSlug(String(grant?.departmentSlug || ""));
    setSelected(grant?.collections ?? []);
    setPageSlugs(grant?.pageSlugs ?? []);
    setCanPublish(Boolean(grant?.canPublish));
    setCanManageMedia(Boolean(grant?.canManageMedia));
    setCanManageUsers(Boolean(grant?.canManageUsers));
    setCanDelete(Boolean(grant?.canDelete));
    setNotes(String(grant?.notes || ""));
  }

  useEffect(() => {
    fetchPortalUsers()
      .then((j) => {
        setUsers(j.users ?? []);
        setGrants(j.grants ?? []);
        setDepartments(j.departments ?? []);
        setCollections(j.collections ?? []);
        setSitePages(j.sitePages ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users."));
  }, []);

  useEffect(() => {
    if (!emailParam || users.length === 0) return;
    const match = users.find((u) => emailKey(u.email) === emailKey(emailParam));
    if (match) fillAccess(match.email);
    // fillAccess is recreated; grantsByEmail updates after grants load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam, users, grantsByEmail]);

  const selectedDept = departments.find((d) => d.slug === departmentSlug);

  async function saveGrant(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          documentId: grantDocumentId || undefined,
          staffEmail,
          departmentSlug,
          departmentTitle: selectedDept?.title || departmentSlug,
          collections: selected,
          pageSlugs: selected.includes("pages") ? pageSlugs : [],
          canPublish,
          canManageMedia,
          canManageUsers,
          canDelete,
          notes,
          active: true,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save this assignment.");
      setNotice("Access saved. The same person is updated, not duplicated.");
      const j = await fetchPortalUsers();
      setGrants(j.grants ?? []);
      setUsers(j.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this assignment.");
    } finally {
      setSaving(false);
    }
  }

  function toggleCollection(slug: string) {
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));
  }

  return (
    <>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}
      <form className="mt-6 max-w-3xl rounded-lg border bg-white p-5" onSubmit={saveGrant}>
        <h2 className="font-semibold text-[#0A192F]">Edit access</h2>
        <p className="mt-1 text-xs text-slate-500">
          Tick only the work this person may see and manage. Example: Publications only shows Publications under Content management.
        </p>
        <div className="mt-3 space-y-3">
          <StaffSearchSelect users={users} value={staffEmail} onChange={fillAccess} />
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={departmentSlug} onChange={(e) => setDepartmentSlug(e.target.value)}>
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.slug || d.title} value={d.slug || ""}>
                {d.title}
              </option>
            ))}
          </select>
          <div className="space-y-4">
            {COLLECTION_GROUPS.map((group) => {
              const items = collections.filter((c) => (c.group || "content") === group.id);
              if (!items.length) return null;
              return (
                <div key={group.id}>
                  <p className="mb-2 text-sm font-medium text-[#0A192F]">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {items.map((c) => (
                      <label key={c.slug} className="flex items-center gap-2">
                        <input type="checkbox" checked={selected.includes(c.slug)} onChange={() => toggleCollection(c.slug)} />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
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
            <input type="checkbox" checked={canManageUsers} onChange={(e) => setCanManageUsers(e.target.checked)} /> Can manage users (including partner access)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={canDelete} onChange={(e) => setCanDelete(e.target.checked)} /> Can delete assigned records
          </label>
          <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={2} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? "Saving…" : grantDocumentId ? "Update access" : "Save assignment"}
        </button>
      </form>
    </>
  );
}

export default function PortalEditAccessPage() {
  return (
    <PortalShell>
      <UsersHeading description="Choose which content this person may see and manage. Publications-only staff only get Publications; news staff only get News Articles." />
      <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Loading…</p>}>
        <EditAccessForm />
      </Suspense>
    </PortalShell>
  );
}
