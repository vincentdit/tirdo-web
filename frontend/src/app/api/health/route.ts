import { NextResponse } from "next/server";

// Readiness / deep health probe. Checks the frontend's critical dependencies
// (CMS and OpenSearch) and returns 200 only when all are reachable, else 503.
// Each check is bounded and fails soft so the probe never hangs.
export const dynamic = "force-dynamic";

const CMS = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";
const OS = process.env.OPENSEARCH_NODE || "http://opensearch:9200";

async function check(name: string, url: string, okStatuses = [200, 204]) {
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "no-store" });
    return { name, ok: okStatuses.includes(res.status), status: res.status, ms: Date.now() - started };
  } catch (e) {
    return { name, ok: false, error: (e as Error).name || "error", ms: Date.now() - started };
  }
}

export async function GET() {
  const checks = await Promise.all([
    // Strapi liveness endpoint returns 204.
    check("cms", `${CMS}/_health`, [200, 204]),
    // OpenSearch cluster health returns 200.
    check("opensearch", `${OS}/_cluster/health`, [200]),
  ]);

  const healthy = checks.every((c) => c.ok);
  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", service: "tirdo-frontend", checks, time: new Date().toISOString() },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
