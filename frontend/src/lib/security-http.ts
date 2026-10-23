export function isSameOriginRequest(headers: { get(name: string): string | null }): boolean {
  const host = headers.get("host") || "";
  if (!host) return false;
  const origin = headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const referer = headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

export function isSafePortalNext(path: string): boolean {
  if (!path.startsWith("/portal")) return false;
  if (path.startsWith("//") || path.includes("\\") || path.includes("://")) return false;
  if (path.includes("..")) return false;
  return true;
}
