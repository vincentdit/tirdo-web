"use client";

import { FormEvent, useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamMfaPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [policy, setPolicy] = useState<Record<string, unknown>>({});
  const [mandatory, setMandatory] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/mfa")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load MFA status.");
        setData(j);
        setPolicy(j.policy || {});
        setMandatory(Boolean(j.policy?.configureTotpDefault));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load MFA status."));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/portal/iam/mfa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mandatory, bruteForceProtected: true, configureTotpEnabled: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not update MFA policy.");
    setNotice(json.message || "MFA policy updated.");
  }

  return (
    <IamShell
      title="Multi-factor authentication"
      description="TOTP (Google Authenticator, Microsoft Authenticator, FreeOTP) is enforced by Keycloak 26, not by each application. Email OTP is not native in this Keycloak version; WebAuthn can be enabled as a required action in the Keycloak admin console."
    >
      <IamNotice error={error} notice={notice} />
      {data && (
        <form className="max-w-xl space-y-4 rounded-lg border bg-white p-5" onSubmit={save}>
          <p className="text-sm">Users in realm: {String((data.users as { total?: number } | undefined)?.total ?? "—")}</p>
          <p className="text-sm">OTP policy: {String(policy.otpType || "totp")} · {String(policy.digits || 6)} digits · {String(policy.period || 30)}s</p>
          <p className="text-sm text-slate-600">{String(data.note || "")}</p>
          {data.accountConsole ? (
            <p className="text-sm">
              User self-service:{" "}
              <a className="text-[#059669] underline" href={String(data.accountConsole)} target="_blank" rel="noreferrer">
                Keycloak Account Console
              </a>
            </p>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={mandatory} onChange={(e) => setMandatory(e.target.checked)} />
            Make Configure OTP a default required action for new logins
          </label>
          <button className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white" type="submit">
            Save MFA policy
          </button>
        </form>
      )}
    </IamShell>
  );
}
