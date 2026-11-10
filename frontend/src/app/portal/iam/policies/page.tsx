"use client";

import { FormEvent, useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamPoliciesPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch("/api/portal/iam/policies")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load policies.");
        setData(j.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load policies."));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!window.confirm("Change realm SSO session timeouts for all connected applications?")) return;
    const res = await fetch("/api/portal/iam/policies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, confirm: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not save policies.");
    setNotice("Realm session policies updated.");
  }

  function num(key: string) {
    return Number(data?.[key] || 0);
  }

  return (
    <IamShell title="Authentication and login policies" description="These Keycloak realm timeouts apply to the central SSO session. Each application still has its own local session.">
      <IamNotice error={error} notice={notice} />
      {data && (
        <form className="max-w-xl space-y-3 rounded-lg border bg-white p-5" onSubmit={save}>
          {["ssoSessionIdleTimeout", "ssoSessionMaxLifespan", "clientSessionIdleTimeout", "clientSessionMaxLifespan"].map((key) => (
            <label key={key} className="block text-sm">
              {key} (seconds)
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                type="number"
                value={num(key)}
                onChange={(e) => setData({ ...data, [key]: Number(e.target.value) })}
              />
            </label>
          ))}
          <button className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white" type="submit">Save policies</button>
        </form>
      )}
    </IamShell>
  );
}
