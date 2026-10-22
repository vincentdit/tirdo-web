import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(start?: string, end?: string): string {
  const from = start ? formatDate(start) : "";
  const to = end && end !== start ? formatDate(end) : "";
  if (from && to) return `${from} – ${to}`;
  return from;
}

/** Serve MinIO objects through the public site so logos work on LAN, not only localhost:9100. */
export function publicFileUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("/cms-media/") || trimmed.startsWith("/media/")) return trimmed;
  try {
    const parsed = new URL(trimmed, "http://localhost");
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments[0] === "tirdo-media" && segments.length > 1) {
      return `/cms-media/${segments.slice(1).join("/")}`;
    }
  } catch {
    /* keep original */
  }
  return trimmed;
}
