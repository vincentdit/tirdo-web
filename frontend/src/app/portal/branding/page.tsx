"use client";

import { FormEvent, useEffect, useState } from "react";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";
import { MediaField } from "@/components/tirdo-auth/media-field";

type BrandValues = Record<string, unknown>;

export default function PortalBrandingPage() {
  const [values, setValues] = useState<BrandValues>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/portal/branding")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        if (r.status === 403) throw new Error("You are not assigned to site photos and branding.");
        if (!r.ok) throw new Error("Could not load branding.");
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        setValues((j.data ?? {}) as BrandValues);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load branding."));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/portal/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save branding.");
      setValues((json.data ?? values) as BrandValues);
      setNotice("Saved. The public website will show the new logo, photos and text after a short refresh.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save branding.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Site photos and branding</h1>
      <p className="mt-1 text-sm text-slate-600">
        Change the emblem, logo, homepage banner and director photo. Super Admin, Admin, and staff granted gallery access can edit this. You can hide or remove the large TIRDO photo on the home page.
      </p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}
      {!loaded && !error && <p className="mt-6 text-sm text-slate-500">Loading…</p>}
      {loaded && (
        <form className="mt-6 max-w-3xl space-y-5 rounded-lg border bg-white p-5" onSubmit={onSubmit}>
          <MediaField label="Coat of arms / emblem" value={values.emblem} onChange={(next) => setValues((v) => ({ ...v, emblem: next }))} />
          <MediaField label="TIRDO logo" value={values.logo} onChange={(next) => setValues((v) => ({ ...v, logo: next }))} />
          <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={values.showHero !== false}
              onChange={(e) => setValues((v) => ({ ...v, showHero: e.target.checked }))}
            />
            <span>
              <span className="font-medium text-slate-700">Show homepage banner</span>
              <span className="mt-1 block text-slate-600">
                Uncheck to hide the large TIRDO photo and headlines at the top of the home page. Save to apply.
              </span>
            </span>
          </label>
          <MediaField
            label="Homepage banner photo"
            clearable={values.hideHeroImage !== true}
            value={values.hideHeroImage ? null : values.heroImage}
            onChange={(next) =>
              setValues((v) => ({
                ...v,
                heroImage: next,
                hideHeroImage: next == null,
              }))
            }
          />
          <p className="-mt-3 text-xs text-slate-500">
            Remove the photo to keep the headlines on a plain TIRDO background, or upload a replacement.
          </p>
          <MediaField label="Director photo" value={values.directorPhoto} onChange={(next) => setValues((v) => ({ ...v, directorPhoto: next }))} />
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Tagline</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={String(values.tagline ?? "")}
              onChange={(e) => setValues((v) => ({ ...v, tagline: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Homepage heading</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={String(values.welcomeTitle ?? "")}
              onChange={(e) => setValues((v) => ({ ...v, welcomeTitle: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Homepage introduction</span>
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={5}
              value={String(values.welcomeBody ?? "")}
              onChange={(e) => setValues((v) => ({ ...v, welcomeBody: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Footer text</span>
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
              value={String(values.footerBlurb ?? "")}
              onChange={(e) => setValues((v) => ({ ...v, footerBlurb: e.target.value }))}
            />
          </label>
          <button type="submit" disabled={saving} className="rounded-md bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save and publish"}
          </button>
        </form>
      )}
    </PortalShell>
  );
}
