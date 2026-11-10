"use client";

import { useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";

export default function IamConfigPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      fetch("/api/portal/iam").then((r) => r.json()),
      fetch("/api/portal/iam/config").then((r) => r.json()),
    ])
      .then(([st, cfg]) => {
        if (st.error) throw new Error(st.error);
        if (cfg.error) throw new Error(cfg.error);
        setStatus(st);
        setData(cfg.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load configuration."));
  }, []);
  return (
    <IamShell title="Keycloak configuration" description="Read-only connection details for the existing Keycloak 26 installation. Administrator passwords stay in server environment variables.">
      <IamNotice error={error} />
      <dl className="max-w-2xl space-y-2 rounded-lg border bg-white p-5 text-sm">
        <Row label="Connected" value={status?.ok ? "Yes" : "No"} />
        <Row label="Version" value={String(status?.version || "—")} />
        <Row label="Realm" value={String(status?.realm || data?.realm || "—")} />
        <Row label="Issuer" value={String(status?.issuer || "—")} />
        <Row label="Discovery" value={String(status?.discovery || "—")} />
        <Row label="TIRDO Web client" value={String(status?.siteClientId || "tirdo-web")} />
        <Row label="SSL required" value={String(data?.sslRequired || "—")} />
        <Row label="Brute-force protection" value={String(data?.bruteForceProtected)} />
      </dl>
    </IamShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="break-all">{value}</dd>
    </div>
  );
}
