import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ingestAuditEvent } from "@/lib/audit-ingest";
import { launchTarget, oidcRolesFromPayload } from "@/lib/e-service-access";
import { parseJwtPayload } from "@/lib/oidc";
import { getEServices } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const token = cookies().get("tirdo_oidc_at")?.value || "";
  const payload = token ? parseJwtPayload(token) : null;
  if (!payload) {
    const login = new URL("/api/auth/login", request.url);
    login.searchParams.set("returnTo", "/e-services");
    return NextResponse.redirect(login);
  }
  const roles = oidcRolesFromPayload(payload);
  const items = await getEServices();
  const item = items.find((row) => row.slug === params.slug);
  const result = launchTarget(item, roles);
  if ("error" in result && result.error) {
    const dest = new URL("/e-services", request.url);
    dest.searchParams.set("denied", params.slug.replace(/[^a-z0-9-]/gi, "").slice(0, 40));
    dest.searchParams.set("reason", String(result.status));
    return NextResponse.redirect(dest);
  }
  await ingestAuditEvent({
    action: "e_service_launch",
    eventType: "authentication",
    outcome: "success",
    identityProvider: "keycloak",
    sourceService: "frontend",
    actor: String(payload.preferred_username || payload.email || ""),
    actorId: String(payload.sub || ""),
    actorType: "user",
    targetType: "e-service",
    targetId: params.slug,
    targetDisplayName: item?.title || params.slug,
    changeSummary: `Opened ${item?.title || params.slug} through Keycloak SSO`,
  });
  return NextResponse.redirect(result.href!);
}
