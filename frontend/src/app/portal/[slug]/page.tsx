"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { collectionBySlug } from "@/lib/portal";
import { formatDate } from "@/lib/utils";

type Row = {
  documentId: string;
  title: string;
  slug?: string;
  path?: string;
  status: string;
  updatedAt?: string;
  email?: string;
  name?: string;
};

function statusClass(status: string) {
  if (status === "Published" || status === "Handled") return "bg-emerald-100 text-emerald-800";
  if (status === "Draft" || status === "Modified") return "bg-amber-100 text-amber-800";
  return "bg-sky-100 text-sky-800";
}

export default function PortalCollectionPage() {
  const params = useParams<{ slug: string }>();
  const col = collectionBySlug(params.slug);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [canPublish, setCanPublish] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQDebounced(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setQ("");
    setQDebounced("");
    setPage(1);
  }, [params.slug]);

  const load = useCallback(() => {
    if (!col) return;
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (qDebounced) qs.set("q", qDebounced);
    fetch(`/api/portal/content/${col.slug}?${qs.toString()}`)
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (r.status === 403) throw new Error("You are not assigned to this content.");
        if (!r.ok) throw new Error("load");
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        setRows(j?.results ?? []);
        const pagination = j?.pagination || {};
        setTotal(Number(pagination.total) || j?.results?.length || 0);
        setPageCount(Number(pagination.pageCount) || 1);
        setCanPublish(Boolean(j?.canPublish));
        setCanCreate(j?.canCreate !== false);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this list."))
      .finally(() => setLoading(false));
  }, [col, page, pageSize, qDebounced]);

  useEffect(() => {
    load();
  }, [load]);

  if (!col) {
    return (
      <PortalShell>
        <p>Unknown content type.</p>
      </PortalShell>
    );
  }

  const collection = col;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  async function runAction(id: string, action: "publish" | "unpublish" | "handle") {
    setBusyId(id);
    setError("");
    try {
      if (action === "handle") {
        const res = await fetch(`/api/portal/content/${collection.slug}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handled: true }),
        });
        if (!res.ok) throw new Error("Could not update this entry.");
      } else {
        const res = await fetch(`/api/portal/content/${collection.slug}/${id}/${action}`, { method: "POST" });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || `Could not ${action} this entry.`);
      }
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update this entry.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <PortalShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0A192F]">{col.label}</h1>
          <p className="mt-1 text-sm text-slate-600">{col.description}</p>
          {col.slug === "pages" && !canCreate && (
            <p className="mt-2 text-sm text-slate-600">You can update only the website pages assigned to you.</p>
          )}
        </div>
        {canCreate && (
          <Link
            href={`/portal/${collection.slug}/new`}
            className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white hover:bg-[#047857]"
          >
            New entry
          </Link>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Search {col.label}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${col.label.toLowerCase()}…`}
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
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  {qDebounced ? "No matching entries." : "No entries yet."}
                </td>
              </tr>
            )}
            {rows?.map((row) => (
              <tr key={row.documentId} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0A192F]">{row.title}</div>
                  {row.path && (
                    <a href={row.path} className="text-xs text-[#059669] hover:underline" target="_blank" rel="noreferrer">
                      {row.path}
                    </a>
                  )}
                  {(row.name || row.email) && (
                    <div className="text-xs text-slate-500">
                      {row.name} {row.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{row.updatedAt ? formatDate(String(row.updatedAt)) : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/portal/${collection.slug}/${row.documentId}`}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-[#0A192F] hover:bg-slate-50"
                    >
                      Update
                    </Link>
                    {collection.draftAndPublish && canPublish && row.status !== "Published" && (
                      <button
                        type="button"
                        disabled={busyId === row.documentId}
                        onClick={() => runAction(row.documentId, "publish")}
                        className="rounded-md bg-[#059669] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {busyId === row.documentId ? "Working…" : "Publish"}
                      </button>
                    )}
                    {collection.draftAndPublish && canPublish && row.status === "Published" && (
                      <button
                        type="button"
                        disabled={busyId === row.documentId}
                        onClick={() => runAction(row.documentId, "unpublish")}
                        className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 disabled:opacity-60"
                      >
                        {busyId === row.documentId ? "Working…" : "Unpublish"}
                      </button>
                    )}
                    {!collection.draftAndPublish && row.status === "Open" && (
                      <button
                        type="button"
                        disabled={busyId === row.documentId}
                        onClick={() => runAction(row.documentId, "handle")}
                        className="rounded-md bg-[#059669] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {busyId === row.documentId ? "Working…" : "Mark handled"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>
            {loading ? "Updating…" : `${from}–${to} of ${total}`}
            {qDebounced ? ` for “${qDebounced}”` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
