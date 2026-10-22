"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isAdminEmail } from "@/lib/portal";

export default function PortalForgotPasswordPage() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isAdminEmail(email)) {
      setError("Enter the email address of your TIRDO administrator account.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/portal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Could not send the reset email.");
        return;
      }
      setMessage(json.message);
    } catch {
      setError("Could not reach TIRDO Content Manager. Try again shortly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="h-1.5 bg-gradient-to-r from-[#0A192F] via-[#059669] to-[#D97706]" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <img src="/media/brand/logo.jpg" alt="TIRDO" className="mx-auto h-16 w-auto object-contain" />
          <h1 className="mt-4 text-center font-serif text-2xl font-bold text-[#0A192F]">Reset your password</h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            We will send a reset link if this email belongs to a TIRDO administrator account.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
            {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
            <div>
              <label htmlFor="reset-email" className="mb-1 block text-sm font-semibold">Email address</label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
              />
            </div>
            <Button type="submit" disabled={busy} className="h-11 w-full bg-[#059669] text-white hover:bg-[#047857]">
              {busy ? "Sending…" : "Send reset email"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link href="/portal/login" className="font-medium text-[#059669] hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
      <footer className="border-t bg-white px-4 py-4 text-center text-xs text-slate-500">
        © {year} TIRDO – Tanzania Industrial Research and Development Organization
      </footer>
    </div>
  );
}
