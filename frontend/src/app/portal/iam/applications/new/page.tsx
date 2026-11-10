"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { IAM_CATALOG, suggestedClientId } from "@/lib/iam";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

function Wizard() {
  const search = useSearchParams();
  const preset = search.get("code") || "";
  const found = IAM_CATALOG.find((row) => row.code === preset || row.clientId === preset);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [secretOnce, setSecretOnce] = useState("");
  const [name, setName] = useState(found?.name || "");
  const [code, setCode] = useState(found?.code || preset);
  const [description, setDescription] = useState(found?.description || "");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [category, setCategory] = useState(found?.category || "Other");
  const [technicalContact, setTechnicalContact] = useState("");
  const [owner, setOwner] = useState("");
  const [environment, setEnvironment] = useState("Production");
  const [publicClient, setPublicClient] = useState(false);
  const [pkce, setPkce] = useState(true);
  const [redirectUris, setRedirectUris] = useState("");
  const [postLogoutRedirectUris, setPostLogoutRedirectUris] = useState("+");
  const [backchannelLogoutUrl, setBackchannelLogoutUrl] = useState("");
  const [confirmRegister, setConfirmRegister] = useState(false);

  const clientId = useMemo(() => suggestedClientId(code || name), [code, name]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/portal/iam/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          clientId,
          description,
          applicationUrl,
          rootUrl: applicationUrl,
          category,
          technicalContact,
          owner,
          environment,
          publicClient,
          pkce,
          redirectUris,
          postLogoutRedirectUris,
          backchannelLogoutUrl,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not register this application.");
      setSecretOnce(String(json.secretOnce || ""));
      setNotice(json.warning || "Application registered in Keycloak.");
      setStep(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register this application.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <IamShell title="Application registration" description="Creates a Keycloak client in the existing tirdo realm. Do not duplicate tirdo-web.">
      <IamNotice error={error} notice={notice} />
      <p className="mb-4 text-sm text-slate-600">Step {Math.min(step, 5)} of 5 — Keycloak SSO sessions and each application local session are separate.</p>
      <form className="max-w-2xl space-y-4 rounded-lg border bg-white p-5" onSubmit={step === 5 ? submit : (e) => { e.preventDefault(); setStep((s) => s + 1); }}>
        {step === 1 && (
          <>
            <Field label="Application name" value={name} onChange={setName} required />
            <Field label="Application code" value={code} onChange={setCode} required />
            <Field label="Description" value={description} onChange={setDescription} />
            <Field label="Application URL" value={applicationUrl} onChange={setApplicationUrl} required />
            <Field label="Category" value={category} onChange={setCategory} />
            <Field label="Technical contact" value={technicalContact} onChange={setTechnicalContact} />
            <Field label="Application owner" value={owner} onChange={setOwner} />
            <label className="block text-sm">
              <span className="font-medium">Environment</span>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
                <option>Development</option>
                <option>Staging</option>
                <option>Production</option>
              </select>
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-slate-600">Client ID: <code>{clientId}</code>. Confidential clients for Spring Boot; public + PKCE for browser-only apps.</p>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={publicClient} onChange={(e) => setPublicClient(e.target.checked)} />
              Public client (PKCE, no secret)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pkce} onChange={(e) => setPkce(e.target.checked)} />
              Require PKCE S256
            </label>
            <label className="block text-sm">
              <span className="font-medium">Redirect URIs (one per line)</span>
              <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={4} required value={redirectUris} onChange={(e) => setRedirectUris(e.target.value)} />
            </label>
            <Field label="Post-logout redirect URIs" value={postLogoutRedirectUris} onChange={setPostLogoutRedirectUris} />
            <Field label="Back-channel logout URL (optional)" value={backchannelLogoutUrl} onChange={setBackchannelLogoutUrl} />
          </>
        )}
        {step === 3 && <p className="text-sm text-slate-600">Users do not receive access to this application until you assign realm or client roles. Default is no automatic access.</p>}
        {step === 4 && (
          <p className="text-sm text-slate-600">
            Realm SSO idle and max session times are configured under Authentication Policies. This client will use authorization code flow.
            Logging out of one application only ends other applications after OIDC logout / back-channel logout is implemented there.
          </p>
        )}
        {step === 5 && (
          <>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>{name} ({clientId})</li>
              <li>{publicClient ? "Public + PKCE" : "Confidential"}</li>
              <li>{environment} · {applicationUrl}</li>
              <li>Redirects: {redirectUris}</li>
            </ul>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={confirmRegister} onChange={(e) => setConfirmRegister(e.target.checked)} required />
              I confirm this will create or change a Keycloak client in the tirdo realm.
            </label>
          </>
        )}
        {step === 6 && (
          <div className="text-sm">
            <p>Issuer: use the Keycloak configuration page for the live discovery URL.</p>
            {secretOnce && (
              <p className="mt-3 rounded-md bg-amber-50 p-3 font-mono text-xs">
                Client secret (shown once): {secretOnce}
              </p>
            )}
          </div>
        )}
        {step < 6 && (
          <div className="flex gap-2">
            {step > 1 && (
              <button type="button" className="rounded-md border px-4 py-2 text-sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button type="submit" disabled={saving} className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {step === 5 ? (saving ? "Registering…" : "Confirm and register") : "Continue"}
            </button>
          </div>
        )}
      </form>
    </IamShell>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input className="mt-1 w-full rounded-md border px-3 py-2" value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function IamRegisterPage() {
  return (
    <Suspense fallback={<IamShell title="Application registration"><p>Loading…</p></IamShell>}>
      <Wizard />
    </Suspense>
  );
}
