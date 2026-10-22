"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { MediaField } from "@/components/tirdo-auth/media-field";
import { collectionBySlug, entryStatus, type PortalField } from "@/lib/portal";

export default function PortalEntryPage() {
  const params = useParams<{ slug: string; id: string }>();
  const router = useRouter();
  const col = collectionBySlug(params.slug);
  const isNew = params.id === "new";
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [canPublish, setCanPublish] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  const fields: PortalField[] = useMemo(() => col?.fields ?? [], [col]);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.canPublish) setCanPublish(true);
        if (j?.canDelete) setCanDelete(true);
      })
      .catch(() => undefined);
    if (!col || isNew) {
      if (col?.draftAndPublish) setStatus("Draft");
      if (col?.slug === "partners") {
        setValues({ active: true, displayOrder: 0, category: "Government Institution" });
      }
      return;
    }
    fetch(`/api/portal/content/${col.slug}/${params.id}`)
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (!r.ok) throw new Error("Could not load this entry.");
        return r.json();
      })
      .then((j) => {
        const data = (j?.data ?? {}) as Record<string, unknown>;
        if (col.slug === "partners" && data.active == null) data.active = true;
        if (col.slug === "partners" && data.displayOrder == null) data.displayOrder = 0;
        setValues(data);
        setCanPublish((prev) => Boolean(j?.canPublish) || prev);
        setCanDelete((prev) => Boolean(j?.canDelete) || prev);
        if (col.draftAndPublish) setStatus(entryStatus(data, true));
        else setStatus(entryStatus(data, false));
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this entry."));
  }, [col, isNew, params.id]);

  if (!col) {
    return (
      <PortalShell>
        <p>Unknown content type.</p>
      </PortalShell>
    );
  }

  const collection = col;
  const published = status === "Published";

  async function onSubmit(e: FormEvent, action: "save" | "publish" | "unpublish") {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const url = isNew ? `/api/portal/content/${collection.slug}` : `/api/portal/content/${collection.slug}/${params.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save.");
      const documentId = String(json.documentId || json.data?.documentId || params.id);
      if (action === "publish" && documentId) {
        const pub = await fetch(`/api/portal/content/${collection.slug}/${documentId}/publish`, { method: "POST" });
        const pubJson = await pub.json().catch(() => ({}));
        if (!pub.ok) throw new Error(pubJson.error || "Saved, but could not publish.");
        setStatus("Published");
        setNotice("Saved and published.");
      } else if (action === "unpublish" && documentId) {
        const un = await fetch(`/api/portal/content/${collection.slug}/${documentId}/unpublish`, { method: "POST" });
        const unJson = await un.json().catch(() => ({}));
        if (!un.ok) throw new Error(unJson.error || "Could not unpublish.");
        setStatus("Draft");
        setNotice("Unpublished. This entry is now a draft.");
      } else {
        setStatus(collection.draftAndPublish ? (published ? "Modified" : "Draft") : status || "Open");
        setNotice("Draft saved.");
      }
      if (isNew && documentId) {
        router.replace(`/portal/${collection.slug}/${documentId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalShell>
      <Link href={`/portal/${col.slug}`} className="text-sm text-[#059669] hover:underline">
        ← {col.label}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-bold text-[#0A192F]">
          {isNew ? (col.slug === "partners" ? "Add partner" : `New ${col.label}`) : col.slug === "partners" ? "Edit partner" : `Update ${col.label}`}
        </h1>
        {status && (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              published || status === "Handled" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {status}
          </span>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}
      {!loaded && <p className="mt-6 text-sm text-slate-500">Loading…</p>}
      {loaded && (
        <form className="mt-6 max-w-3xl space-y-4 rounded-lg border bg-white p-5" onSubmit={(e) => onSubmit(e, "save")}>
          {fields.map((field) => (
            field.type === "media" || field.type === "file" ? (
              <MediaField
                key={field.key}
                label={field.label}
                value={values[field.key]}
                accept={field.type === "file" ? "application/pdf,image/*" : "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"}
                maxBytes={field.type === "file" ? 5 * 1024 * 1024 : 2 * 1024 * 1024}
                onChange={(next) => setValues((v) => ({ ...v, [field.key]: next }))}
              />
            ) : (
            <label key={field.key} className="block text-sm">
              <span className="font-medium text-slate-700">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  rows={8}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  required={field.required}
                />
              ) : field.type === "boolean" ? (
                <span className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={Boolean(values[field.key])}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.checked }))}
                  />
                  <span className="text-slate-600">Yes</span>
                </span>
              ) : field.type === "select" ? (
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={String(values[field.key] ?? field.options?.[0] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                >
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={values[field.key] == null ? "" : String(values[field.key])}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [field.key]: e.target.value,
                    }))
                  }
                  required={field.required}
                />
              )}
            </label>
            )
          ))}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <button type="submit" disabled={saving} className="rounded-md bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Saving…" : published ? "Save changes" : "Save draft"}
            </button>
            {col.draftAndPublish && canPublish && !published && (
              <button
                type="button"
                disabled={saving}
                onClick={(e) => onSubmit(e as unknown as FormEvent, "publish")}
                className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Publishing…" : "Publish"}
              </button>
            )}
            {col.draftAndPublish && canPublish && published && (
              <button
                type="button"
                disabled={saving}
                onClick={(e) => onSubmit(e as unknown as FormEvent, "unpublish")}
                className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 disabled:opacity-60"
              >
                Unpublish
              </button>
            )}
            {!isNew && canDelete && (
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  if (!window.confirm("Delete this entry? This cannot be undone.")) return;
                  setSaving(true);
                  setError("");
                  try {
                    const res = await fetch(`/api/portal/content/${collection.slug}/${params.id}`, { method: "DELETE" });
                    const json = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(json.error || "Could not delete this entry.");
                    router.replace(`/portal/${collection.slug}`);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not delete this entry.");
                    setSaving(false);
                  }
                }}
                className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      )}
    </PortalShell>
  );
}
