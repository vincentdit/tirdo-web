import { NextResponse } from "next/server";
import { keycloakHealth } from "@/lib/iam-keycloak";
import { oidcClientId, oidcRealm } from "@/lib/oidc";
import { resolveKeycloakPublicUrl } from "@/lib/public-url";
import { iamFail, requireIam } from "../_iam";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireIam();
  if (gate instanceof NextResponse) return gate;
  try {
    const health = await keycloakHealth();
    return NextResponse.json({
      ok: health.ok,
      version: health.version,
      realm: oidcRealm(),
      issuer: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}`,
      discovery: `${resolveKeycloakPublicUrl()}/realms/${oidcRealm()}/.well-known/openid-configuration`,
      siteClientId: oidcClientId(),
    });
  } catch (err) {
    return iamFail(err);
  }
}
