"use client";

import { useState } from "react";
import { mediaId, mediaPreviewUrl } from "@/lib/portal";

export function MediaField({
  label,
  value,
  onChange,
  accept = "image/*",
  clearable = false,
}: {
  label: string;
  value: unknown;
  onChange: (next: { id: number; url?: string } | null) => void;
  accept?: string;
  clearable?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const preview = mediaPreviewUrl(value);
  const id = mediaId(value);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.append("files", file);
      const res = await fetch("/api/portal/media", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not upload this file.");
      const uploaded = Array.isArray(json.data) ? json.data[0] : json.data;
      const nextId = Number(uploaded?.id);
      if (!Number.isFinite(nextId)) throw new Error("Upload did not return a file.");
      onChange({ id: nextId, url: uploaded?.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload this file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-16 w-16 rounded border bg-white object-contain" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded border bg-slate-50 text-[10px] text-slate-400">No file</div>
        )}
        <label className="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium text-[#0A192F] hover:bg-slate-50">
          {busy ? "Uploading…" : id ? "Replace file" : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
        </label>
        {id || clearable ? (
          <button type="button" className="text-sm text-red-700 hover:underline" onClick={() => onChange(null)}>
            Remove
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
