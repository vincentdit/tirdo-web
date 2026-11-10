"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [integration, setIntegration] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [secretOnce, setSecretOnce] = useState("");
  const [redirectUris, setRedirectUris] = useState("");
  const [rootUrl, setRootUrl] = useState("");

  function load() {
    fetch(`/api/portal/iam/applications/${encodeURIComponent(params.id)}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load this application.");
        return j;
      })
      .then((j) => {
        setData(j.data);
        setIntegration(j.integration || {});
        setRedirectUris((j.data?.redirectUris || []).join("\n"));
        setRootUrl(String(j.data?.rootUrl || ""));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this application."));
  }

  useEffect(load, [params.id]);

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/portal/iam/applications/${encodeURIComponent(params.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, rootUrl, redirectUris, applicationUrl: rootUrl }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not save.");
    setNotice("Configuration saved.");
    load();
  }

  async function rotate() {
    if (!window.confirm("Rotate the client secret? Existing confidential clients must be updated immediately.")) return;
    const res = await fetch(`/api/portal/iam/applications/${encodeURIComponent(params.id)}/secret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not rotate the secret.");
    setSecretOnce(String(json.secretOnce || ""));
    setNotice(json.warning || "Secret rotated.");
  }

  async function remove() {
    if (!window.confirm("Remove this Keycloak client registration? This does not delete the remote application.")) return;
    const res = await fetch(`/api/portal/iam/applications/${encodeURIComponent(params.id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not remove this application.");
    window.location.href = "/portal/iam/applications";
  }

  async function test() {
    const res = await fetch(`/api/portal/iam/applications/${encodeURIComponent(params.id)}/test`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Connection test failed.");
    setNotice(json.ok ? `Keycloak reachable. Client ${json.clientId} is enabled.` : "Keycloak is not healthy or the client is disabled.");
  }

  return (
    <IamShell title={String(data?.name || "Application")} description="Live Keycloak client configuration. Secrets are never stored in TIRDO Web.">
      <IamNotice error={error} notice={notice} />
      {!data && !error && <p className="text-sm text-slate-500">Loading…</p>}
      {data && (
        <form className="max-w-2xl space-y-3 rounded-lg border bg-white p-5" onSubmit={save}>
          <p className="text-sm text-slate-600">Client ID <code>{String(data.clientId)}</code> · {data.publicClient ? "Public" : "Confidential"} · {data.enabled ? "Enabled" : "Disabled"}</p>
          <label className="block text-sm">
            Application URL
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={rootUrl} onChange={(e) => setRootUrl(e.target.value)} />
          </label>
          <label className="block text-sm">
            Redirect URIs
            <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={4} value={redirectUris} onChange={(e) => setRedirectUris(e.target.value)} />
          </label>
          <div className="rounded-md bg-slate-50 p-3 text-xs">
            <div>Issuer: {integration.issuer}</div>
            <div>Discovery: {integration.discovery}</div>
            <div>Realm: {integration.realm}</div>
          </div>
          {secretOnce && <p className="rounded-md bg-amber-50 p-3 font-mono text-xs">New secret (once): {secretOnce}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white">Save</button>
            <button type="button" className="rounded-md border px-4 py-2 text-sm" onClick={test}>Test connection</button>
            {!data.publicClient && (
              <button type="button" className="rounded-md border px-4 py-2 text-sm" onClick={rotate}>Rotate secret</button>
            )}
            <button type="button" className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700" onClick={remove}>Remove registration</button>
          </div>
        </form>
      )}
    </IamShell>
  );
}
