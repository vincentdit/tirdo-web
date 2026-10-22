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
