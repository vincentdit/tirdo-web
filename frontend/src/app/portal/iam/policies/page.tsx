"use client";

import { FormEvent, useEffect, useState } from "react";
import { IamNotice, IamShell } from "@/components/tirdo-auth/iam-shell";
import {
  formatDuration,
  hoursMinutesToSeconds,
  normalizeSessionPolicy,
  secondsToHoursMinutes,
  SESSION_TIMEOUT_PRESETS,
} from "@/lib/session-policy";

type Policy = ReturnType<typeof normalizeSessionPolicy>;

function DurationField({
  label,
  help,
  seconds,
  onChange,
}: {
  label: string;
  help: string;
  seconds: number;
  onChange: (next: number) => void;
}) {
  const { hours, minutes } = secondsToHoursMinutes(seconds);
  return (
    <fieldset className="rounded-md border border-slate-200 p-3">
      <legend className="px-1 text-sm font-semibold text-[#0A192F]">{label}</legend>
      <p className="mb-2 text-xs text-slate-500">{help}</p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          Hours
          <input
            className="mt-1 block w-24 rounded-md border px-3 py-2"
            type="number"
            min={0}
            max={720}
            value={hours}
            onChange={(e) => onChange(hoursMinutesToSeconds(Number(e.target.value), minutes))}
          />
        </label>
        <label className="text-sm">
          Minutes
          <input
            className="mt-1 block w-24 rounded-md border px-3 py-2"
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => onChange(hoursMinutesToSeconds(hours, Number(e.target.value)))}
          />
        </label>
        <p className="pb-2 text-xs text-slate-500">{formatDuration(seconds)}</p>
      </div>
    </fieldset>
  );
}

export default function IamPoliciesPage() {
  const [data, setData] = useState<Policy | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/portal/iam/policies")
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Could not load policies.");
        setData(normalizeSessionPolicy(j.data || {}));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load policies."));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    if (!window.confirm("Apply these sign-in time limits to the website, LIMS, and every other connected system?")) return;
    const payload = normalizeSessionPolicy(data);
    const res = await fetch("/api/portal/iam/policies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, confirm: true }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json.error || "Could not save policies.");
    setData(normalizeSessionPolicy(json.data || payload));
    setNotice("Session time limits were saved for all SSO applications.");
  }

  function applyPreset(idleSeconds: number, maxSeconds: number) {
    if (!data) return;
    setData(
      normalizeSessionPolicy({
        ...data,
        ssoSessionIdleTimeout: idleSeconds,
        ssoSessionMaxLifespan: maxSeconds,
        clientSessionIdleTimeout: idleSeconds,
        clientSessionMaxLifespan: maxSeconds,
        ssoSessionIdleTimeoutRememberMe: idleSeconds,
        ssoSessionMaxLifespanRememberMe: maxSeconds,
      })
    );
  }

  return (
    <IamShell
      title="Sign-in time limits"
      description="Set how long people stay signed in after they leave, and the longest a session may last. These limits apply to TIRDO Web, LIMS, and every other system that uses this SSO."
    >
      <IamNotice error={error} notice={notice} />
      {data && (
        <form className="max-w-2xl space-y-4 rounded-lg border bg-white p-5" onSubmit={save}>
          <div>
            <p className="text-sm font-semibold text-[#0A192F]">Quick choices</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SESSION_TIMEOUT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => applyPreset(preset.idleSeconds, preset.maxSeconds)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <DurationField
            label="Sign out after inactivity"
            help="If nobody uses any TIRDO system for this long, they must sign in again."
            seconds={data.ssoSessionIdleTimeout}
            onChange={(ssoSessionIdleTimeout) => setData(normalizeSessionPolicy({ ...data, ssoSessionIdleTimeout }))}
          />
          <DurationField
            label="Maximum time signed in"
            help="Even if they keep using the system, they must sign in again after this time."
            seconds={data.ssoSessionMaxLifespan}
            onChange={(ssoSessionMaxLifespan) => setData(normalizeSessionPolicy({ ...data, ssoSessionMaxLifespan }))}
          />
          <DurationField
            label="Each application idle time"
            help="How long one application (for example LIMS) may sit unused before that app session ends."
            seconds={data.clientSessionIdleTimeout}
            onChange={(clientSessionIdleTimeout) => setData(normalizeSessionPolicy({ ...data, clientSessionIdleTimeout }))}
          />
          <DurationField
            label="Each application maximum time"
            help="Longest one application session may last."
            seconds={data.clientSessionMaxLifespan}
            onChange={(clientSessionMaxLifespan) => setData(normalizeSessionPolicy({ ...data, clientSessionMaxLifespan }))}
          />
          <DurationField
            label="Access token lifetime"
            help="How often applications refresh a signed-in user. Shorter is safer; five to thirty minutes is typical."
            seconds={data.accessTokenLifespan}
            onChange={(accessTokenLifespan) => setData(normalizeSessionPolicy({ ...data, accessTokenLifespan }))}
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              className="mt-1"
              type="checkbox"
              checked={data.rememberMe}
              onChange={(e) => setData({ ...data, rememberMe: e.target.checked })}
            />
            <span>
              Allow “Remember me” on the sign-in screen
              <span className="block text-xs text-slate-500">Uses the longer remember-me times below when the user ticks that box.</span>
            </span>
          </label>
          {data.rememberMe && (
            <>
              <DurationField
                label="Remember-me idle time"
                help="Inactivity limit when the user asked to stay signed in on this computer."
                seconds={data.ssoSessionIdleTimeoutRememberMe}
                onChange={(ssoSessionIdleTimeoutRememberMe) =>
                  setData(normalizeSessionPolicy({ ...data, ssoSessionIdleTimeoutRememberMe }))
                }
              />
              <DurationField
                label="Remember-me maximum time"
                help="Longest remember-me session."
                seconds={data.ssoSessionMaxLifespanRememberMe}
                onChange={(ssoSessionMaxLifespanRememberMe) =>
                  setData(normalizeSessionPolicy({ ...data, ssoSessionMaxLifespanRememberMe }))
                }
              />
            </>
          )}
          <button className="rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white" type="submit">
            Save time limits
          </button>
        </form>
      )}
    </IamShell>
  );
}
