"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdminEmail } from "@/lib/portal";
import { isSafePortalNext } from "@/lib/security-http";

export function TirdoLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const requestedNext = search.get("next") || "/portal";
  const next = isSafePortalNext(requestedNext) ? requestedNext : "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!isAdminEmail(email)) {
      setError("Use the email address of your TIRDO administrator account.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.requiresSecondFactor) {
        setNotice(json.message || "Additional verification is required.");
        return;
      }
      if (!res.ok) {
        setError(json.error || "Sign in failed. Try again.");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach TIRDO Content Manager. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <p
          id="portal-login-error"
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {notice}
        </p>
      )}

      <div>
        <label htmlFor="portal-email" className="mb-1 block text-sm font-semibold text-[#0A192F]">
          Email address
        </label>
        <input
          id="portal-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@tirdo.or.tz"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "portal-login-error" : undefined}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-[#0A192F] outline-none ring-offset-2 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#D97706]"
        />
      </div>

      <div>
        <label htmlFor="portal-password" className="mb-1 block text-sm font-semibold text-[#0A192F]">
          Password
        </label>
        <div className="relative">
          <input
            id="portal-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-11 text-[#0A192F] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#D97706]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-[#0A192F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#059669] focus-visible:ring-[#D97706]"
        />
        Remember me
      </label>

      <Button
        type="submit"
        disabled={busy}
        className="h-11 w-full bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
