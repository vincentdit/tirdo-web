/** User-facing copy only. Never surface HTTP codes, stack traces, or IdP internals. */

export function publicSignInError(): string {
  return "We could not complete your TIRDO sign-in. Try again. If this continues, contact ICT support.";
}

export function publicLaunchError(reason?: string | null, system?: string | null): string {
  const status = String(reason || "").trim();
  const name = friendlySystemName(system);
  if (status === "409") {
    return name
      ? `${name} is not available yet. Please contact ICT support.`
      : "This system is not available yet. Please contact ICT support.";
  }
  if (status === "404") {
    return "That system could not be found. Return to e-Services and try another option.";
  }
  if (status === "403" || system) {
    return name
      ? `You do not have access to ${name}. Contact ICT support if you need access.`
      : "You do not have access to this system. Contact ICT support if you need access.";
  }
  return publicSignInError();
}

export function publicAuthNotice(query: {
  loginError?: string | null;
  denied?: string | null;
  reason?: string | null;
}): string | null {
  if (query.loginError && query.loginError !== "0") return publicSignInError();
  if (query.denied || query.reason) return publicLaunchError(query.reason, query.denied);
  return null;
}

function friendlySystemName(slug?: string | null): string {
  const key = String(slug || "").trim().toLowerCase();
  if (!key || /[^a-z0-9-]/.test(key)) return "";
  const names: Record<string, string> = {
    lims: "LIMS",
    niims: "NIIMS",
    nilims: "NIIMS",
    ciap: "CIAP",
    consultation: "CIAP",
    telt: "TELT",
    teltp: "TELT",
    eoffice: "e-Office",
  };
  return names[key] || "";
}
