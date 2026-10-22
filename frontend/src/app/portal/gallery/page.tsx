"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";

type FileRow = {
  id: number;
  name?: string;
  url?: string;
  mime?: string;
  ext?: string;
  updatedAt?: string;
};

export default function PortalGalleryPage() {
  const [files, setFiles] = useState<FileRow[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQDebounced(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (qDebounced) qs.set("q", qDebounced);
    fetch(`/api/portal/media?${qs.toString()}`)
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (!r.ok) throw new Error("Could not load the gallery.");
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        setFiles(j?.results ?? []);
        setTotal(Number(j?.pagination?.total) || j?.results?.length || 0);
        setPageCount(Number(j?.pagination?.pageCount) || 1);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the gallery."));
  }, [page, qDebounced]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/media", { method: "POST", body: data });
      if (!res.ok) throw new Error("Could not upload this file.");
      form.reset();
      setPage(1);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload this file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Gallery</h1>
      <p className="mt-1 text-sm text-slate-600">Media used on the TIRDO website. Files are stored in the existing CMS library.</p>
      <form className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4" onSubmit={onUpload}>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Upload file</span>
          <input name="files" type="file" required className="mt-1 block text-sm" />
        </label>
        <button type="submit" disabled={uploading} className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
      <label className="mt-4 block">
        <span className="sr-only">Search gallery</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search files…"
          className="w-full max-w-md rounded-md border bg-white px-3 py-2 text-sm"
          autoComplete="off"
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!files && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-lg border bg-white" />)}
        {files?.length === 0 && <p className="text-sm text-slate-500">{qDebounced ? "No matching files." : "No files yet."}</p>}
        {files?.map((file) => (
          <div key={file.id} className="overflow-hidden rounded-lg border bg-white">
            {String(file.mime || "").startsWith("image/") && file.url ? (
              <img src={file.url} alt={file.name || ""} className="h-36 w-full object-cover" />
            ) : (
              <div className="flex h-36 items-center justify-center bg-slate-50 text-xs text-slate-500">{file.ext || "file"}</div>
            )}
            <div className="truncate px-3 py-2 text-xs text-slate-700">{file.name}</div>
          </div>
        ))}
      </div>
      {files && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>
            {total} file{total === 1 ? "" : "s"}
            {qDebounced ? ` for “${qDebounced}”` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
              Previous
            </button>
            <span className="text-xs">
              Page {page} of {pageCount}
            </span>
            <button type="button" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
