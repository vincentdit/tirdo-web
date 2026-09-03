// -----------------------------------------------------------------------
// Server-side Matomo Reporting API client.
//
// Runs only on the server (route handlers / server components). The auth
// token never reaches the browser. Matomo is reached over the internal
// Docker network; the Host header is pinned to a trusted host so Matomo's
// trusted-host check passes behind the reverse proxy.
//
// Configure via runtime env on the frontend container:
//   MATOMO_API_URL    (default http://nginx:8081 — an internal-only Nginx
//                      upstream that forwards to Matomo with the Host header
//                      pinned to a trusted host; "Host" is a forbidden fetch
//                      header, so we can't set it here directly)
//   MATOMO_API_TOKEN  (a Matomo auth token with at least "view" on the site)
//   MATOMO_SITE_ID    (default 1)
//
// Do NOT import this from a client component — the token must stay server-side.
// -----------------------------------------------------------------------

const MATOMO_URL = process.env.MATOMO_API_URL || "http://nginx:8081";
const TOKEN = process.env.MATOMO_API_TOKEN || "";
const SITE_ID = process.env.MATOMO_SITE_ID || "1";

export const analyticsConfigured = () => TOKEN.length > 0;

type Params = Record<string, string>;

async function call<T>(params: Params, revalidate = 300): Promise<T | null> {
  if (!TOKEN) return null;
  const body = new URLSearchParams({
    module: "API",
    format: "json",
    idSite: SITE_ID,
    token_auth: TOKEN,
    ...params,
  });
  try {
    const res = await fetch(`${MATOMO_URL}/index.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    if (json && typeof json === "object" && (json as { result?: string }).result === "error") {
      return null;
    }
    return json as T;
  } catch {
    return null;
  }
}

// A row from a Matomo report list method.
export type Row = { label?: string; nb_visits?: number; nb_hits?: number; nb_actions?: number; [k: string]: unknown };

export type Summary = {
  nb_visits?: number;
  nb_uniq_visitors?: number;
  nb_actions?: number;
  bounce_rate?: string;
  avg_time_on_site?: number;
  nb_actions_per_visit?: number;
};

export type Dashboard = {
  configured: boolean;
  totalVisits: number | null;
  summary: Summary | null;
  trend: { date: string; visits: number }[];
  topPages: { label: string; value: number }[];
  countries: { label: string; value: number }[];
  devices: { label: string; value: number }[];
  referrers: { label: string; value: number }[];
};

// All-time total visits (headline number for the footer).
export async function getTotalVisits(revalidate = 900): Promise<number | null> {
  const data = await call<Summary>(
    { method: "VisitsSummary.get", period: "range", date: "2015-01-01,today" },
    revalidate,
  );
  return typeof data?.nb_visits === "number" ? data.nb_visits : null;
}

function toSeries(rows: Row[] | null, metric: "nb_visits" | "nb_hits" = "nb_visits"): { label: string; value: number }[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => ({ label: String(r.label ?? "Unknown"), value: Number(r[metric] ?? r.nb_visits ?? 0) }))
    .filter((r) => r.value > 0);
}

// Everything the dashboard needs, fetched in parallel.
export async function getDashboard(): Promise<Dashboard> {
  if (!TOKEN) {
    return { configured: false, totalVisits: null, summary: null, trend: [], topPages: [], countries: [], devices: [], referrers: [] };
  }
  const period = { period: "range", date: "last30" } as const;

  const [totalVisits, summary, visitsByDay, pages, countries, devices, referrers] = await Promise.all([
    getTotalVisits(),
    call<Summary>({ method: "VisitsSummary.get", ...period }),
    call<Record<string, number>>({ method: "VisitsSummary.getVisits", period: "day", date: "last30" }),
    call<Row[]>({ method: "Actions.getPageTitles", flat: "1", filter_limit: "8", filter_sort_column: "nb_hits", ...period }),
    call<Row[]>({ method: "UserCountry.getCountry", filter_limit: "8", ...period }),
    call<Row[]>({ method: "DevicesDetection.getType", ...period }),
    call<Row[]>({ method: "Referrers.getReferrerType", ...period }),
  ]);

  const trend = visitsByDay
    ? Object.entries(visitsByDay).map(([date, visits]) => ({ date, visits: Number(visits) || 0 }))
    : [];

  return {
    configured: true,
    totalVisits,
    summary: summary ?? null,
    trend,
    topPages: toSeries(pages, "nb_hits"),
    countries: toSeries(countries),
    devices: toSeries(devices),
    referrers: toSeries(referrers),
  };
}
