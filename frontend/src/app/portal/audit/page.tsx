"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import type { AuditEvent } from "@/lib/audit";

type Stats = {
  total: number;
  success: number;
  failure: number;
  denied: number;
  high: number;
  recent: AuditEvent[];
};

type Integrity = { intact?: boolean; count?: number; head?: string | null; reason?: string; brokenAt?: number };

export default function AuditTrailPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<AuditEvent[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [canExport, setCanExport] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [integrity, setIntegrity] = useState<Integrity | null>(null);
  const [filters, setFilters] = useState({
    q: "",
    eventType: "",
    outcome: "",
    action: "",
    from: "",
    to: "",
  });

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), pageSize: "20" });
    Object.entries(filters).forEach(([k, v]) => {
      if (!v) return;
      if (k === "from" || k === "to") {
        const iso = new Date(v).toISOString();
        if (!Number.isNaN(Date.parse(iso))) qs.set(k, iso);
        return;
      }
      qs.set(k, v);
    });
    Promise.all([
      fetch(`/api/portal/audit?${qs}`).then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (r.status === 403) throw new Error("You are not assigned to view the audit trail.");
        if (!r.ok) throw new Error("Could not load the audit trail.");
        return r.json();
      }),
      fetch("/api/portal/audit/stats").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([list, summary]) => {
        if (!list) return;
        setRows(list.results || []);
        setTotal(Number(list.pagination?.total) || 0);
        setPageCount(Number(list.pagination?.pageCount) || 1);
        setCanExport(Boolean(list.access?.canExportAudit));
        if (summary) setStats(summary);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the audit trail."))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  function onFilter(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function verify() {
    setError("");
    const res = await fetch("/api/portal/audit/verify");
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Could not verify integrity.");
      return;
    }
    setIntegrity(json);
  }

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Audit trail</h1>
      <p className="mt-1 text-sm text-slate-600">
        Persisted security, sign-in and content-management events. Records cannot be edited or deleted in this portal.
      </p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Recorded events" value={stats?.total} />
        <Stat label="Successful" value={stats?.success} />
        <Stat label="Failed" value={stats?.failure} />
        <Stat label="Denied" value={stats?.denied} />
        <Stat label="High / critical" value={stats?.high} />
      </div>

      <form onSubmit={onFilter} className="mt-5 flex flex-wrap gap-2 rounded-lg border bg-white p-3 text-sm">
        <input
          className="rounded-md border px-3 py-2"
          placeholder="Search actor, action, target"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <select className="rounded-md border px-2 py-2" value={filters.eventType} onChange={(e) => setFilters((f) => ({ ...f, eventType: e.target.value }))}>
          <option value="">All types</option>
          <option value="content">Content</option>
          <option value="authentication">Authentication</option>
          <option value="authorization">Authorization</option>
          <option value="administration">Administration</option>
        </select>
        <select className="rounded-md border px-2 py-2" value={filters.outcome} onChange={(e) => setFilters((f) => ({ ...f, outcome: e.target.value }))}>
          <option value="">All outcomes</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="denied">Denied</option>
        </select>
        <input type="datetime-local" className="rounded-md border px-2 py-2" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} />
        <input type="datetime-local" className="rounded-md border px-2 py-2" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} />
        <button type="submit" className="rounded-md bg-[#0A192F] px-3 py-2 font-semibold text-white">
          Filter
        </button>
        {canExport && (
          <>
            <a href={`/api/portal/audit/export?format=csv`} className="rounded-md border px-3 py-2 font-semibold">
              Export CSV
            </a>
            <a href={`/api/portal/audit/export?format=json`} className="rounded-md border px-3 py-2 font-semibold">
              Export JSON
            </a>
            <button type="button" onClick={verify} className="rounded-md border px-3 py-2 font-semibold">
              Verify chain
            </button>
          </>
        )}
      </form>
      {integrity && (
        <p className={`mt-3 text-sm ${integrity.intact ? "text-emerald-800" : "text-red-700"}`}>
          {integrity.intact
            ? `Chain intact. ${integrity.count} events checked.`
            : `Chain broken at seq ${integrity.brokenAt}: ${integrity.reason}`}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">When (UTC)</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Outcome</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Target</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  No audit events match these filters.
                </td>
              </tr>
            )}
            {rows?.map((row) => (
              <tr key={`${row.seq}-${row.occurredAt}`} className="cursor-pointer border-t hover:bg-slate-50" onClick={() => setSelected(row)}>
                <td className="whitespace-nowrap px-3 py-2 text-xs">{row.occurredAt?.replace("T", " ").replace("Z", " UTC")}</td>
                <td className="px-3 py-2">{row.eventType}</td>
                <td className="px-3 py-2 font-medium">{row.action}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${outcomeClass(row.outcome)}`}>{row.outcome}</span>
                </td>
                <td className="px-3 py-2">{row.actorDisplayName}</td>
                <td className="px-3 py-2 text-xs">{row.targetDisplayName || row.targetType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>
          {total} events · page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </button>
          <button type="button" disabled={page >= pageCount} className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>

      {selected && (
        <aside className="mt-4 rounded-lg border bg-white p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-[#0A192F]">Event {selected.seq}</h2>
            <button type="button" className="text-xs text-slate-500" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <Detail label="Occurred" value={selected.occurredAt} />
            <Detail label="Recorded" value={selected.recordedAt} />
            <Detail label="Type" value={selected.eventType} />
            <Detail label="Action" value={selected.action} />
            <Detail label="Outcome" value={selected.outcome} />
            <Detail label="Severity" value={selected.severity} />
            <Detail label="Actor" value={`${selected.actorDisplayName || ""} (${selected.actorId || "—"})`} />
            <Detail label="Identity" value={selected.identityProvider} />
            <Detail label="Source" value={selected.sourceService} />
            <Detail label="Target" value={`${selected.targetType || ""} ${selected.targetId || ""}`} />
            <Detail label="Request" value={selected.requestId} />
            <Detail label="Summary" value={selected.changeSummary || selected.reason} />
          </dl>
          {selected.summary && Object.keys(selected.summary).length > 0 && (
            <pre className="mt-3 overflow-auto rounded bg-slate-50 p-3 text-xs">{JSON.stringify(selected.summary, null, 2)}</pre>
          )}
        </aside>
      )}
    </PortalShell>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[#059669]">{value ?? "—"}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="break-all">{value || "—"}</dd>
    </div>
  );
}

function outcomeClass(outcome?: string) {
  if (outcome === "success") return "bg-emerald-100 text-emerald-800";
  if (outcome === "denied") return "bg-amber-100 text-amber-900";
  if (outcome === "failure") return "bg-red-100 text-red-800";
  return "bg-slate-100 text-slate-700";
}
