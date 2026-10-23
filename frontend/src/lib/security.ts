import { timingSafeEqual } from "crypto";

export { isSameOriginRequest, isSafePortalNext } from "./security-http";

export function secretsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(String(provided || ""), "utf8");
  const b = Buffer.from(String(expected || ""), "utf8");
  const len = Math.max(a.length, b.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  a.copy(pa);
  b.copy(pb);
  return timingSafeEqual(pa, pb) && a.length === b.length && b.length > 0;
}

export function headerAdminToken(req: Request, header = "x-reindex-token"): string {
  return req.headers.get(header) || "";
}

/** Fail closed: missing configured token is unauthorized. Header only (never query string). */
export function adminTokenAuthorized(req: Request, expected = process.env.SEARCH_ADMIN_TOKEN, header = "x-reindex-token"): boolean {
  if (!expected) return false;
  return secretsEqual(headerAdminToken(req, header), expected);
}

export function sanitizeSearchHighlight(html: string): string {
  const escaped = String(html || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/&lt;mark&gt;/gi, "<mark>").replace(/&lt;\/mark&gt;/gi, "</mark>");
}

export function clampSearchQuery(q: string, max = 200): string {
  return q.trim().slice(0, max);
}

export function clampSearchFrom(from: number, max = 1000): number {
  if (!Number.isFinite(from) || from < 0) return 0;
  return Math.min(Math.floor(from), max);
}

