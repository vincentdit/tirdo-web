"use client";

import { FormEvent, useEffect, useState } from "react";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";

type Me = {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  isSuperAdmin?: boolean;
  departments?: { title: string }[];
};

export default function PortalProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/portal/me")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((j) => {
        if (!j) return;
        setMe(j);
        setFirstname(j.firstname || "");
        setLastname(j.lastname || "");
      })
      .catch(() => setError("Could not load your profile."));
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/portal/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save your profile.");
      setNotice("Profile saved.");
      setMe((cur) => ({ ...cur, firstname, lastname }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/portal/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, password, confirmPassword }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not change your password.");
      setNotice("Password changed.");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <PortalShell>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Profile</h1>
      <p className="mt-1 text-sm text-slate-600">Update your personal details or change the password used to sign in to this portal.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 text-sm text-emerald-800">{notice}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="rounded-lg border bg-white p-5" onSubmit={saveProfile}>
          <h2 className="font-semibold text-[#0A192F]">Personal details</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">First name</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Last name</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <input className="mt-1 w-full rounded-md border bg-slate-50 px-3 py-2" value={me?.email || ""} readOnly />
            </label>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Role: </span>
              {me?.roles?.join(", ") || "—"}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Department: </span>
              {me?.departments?.map((d) => d.title).join(", ") || (me?.isSuperAdmin ? "All departments" : "Not assigned")}
            </p>
          </div>
          <button type="submit" disabled={savingProfile} className="mt-4 rounded-md bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </form>

        <form id="password" className="rounded-lg border bg-white p-5" onSubmit={savePassword}>
          <h2 className="font-semibold text-[#0A192F]">Change password</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Current password</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">New password</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Confirm new password</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
            </label>
          </div>
          <button type="submit" disabled={savingPassword} className="mt-4 rounded-md bg-[#059669] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {savingPassword ? "Saving…" : "Change password"}
          </button>
        </form>
      </div>
    </PortalShell>
  );
}
