"use client";

import { FormEvent, useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamGroupsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    fetch("/api/portal/iam/groups")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load groups.");
        setRows(j.results || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load groups."));
  }
  useEffect(load, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/portal/iam/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not create group.");
    setNotice("Group created.");
    setName("");
    load();
  }

  return (
    <IamShell title="Groups" description="Keycloak groups for institutional access. Assign users in Keycloak or through user role actions.">
      <IamNotice error={error} notice={notice} />
      <form className="mb-4 flex gap-2" onSubmit={create}>
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white" type="submit">Create group</button>
      </form>
      {!rows.length && <p className="text-sm text-slate-500">No groups yet.</p>}
      <ul className="divide-y rounded-lg border bg-white text-sm">
        {rows.map((g) => (
          <li key={String(g.id)} className="px-4 py-2">{String(g.name || g.path)}</li>
        ))}
      </ul>
    </IamShell>
  );
}
