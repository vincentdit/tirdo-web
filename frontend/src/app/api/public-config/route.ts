import { NextResponse } from "next/server";
import { resolveKeycloakPublicUrl } from "@/lib/public-url";

export const dynamic = "force-dynamic";

// Runtime Keycloak settings for the browser. NEXT_PUBLIC_* is baked in at
// image build (often localhost); this reads PUBLIC_URL / KEYCLOAK_PUBLIC_URL
// from the container so a test server works without a Dockerfile change.
export function GET() {
  return NextResponse.json({
    keycloakUrl: resolveKeycloakPublicUrl(),
    realm: process.env.KEYCLOAK_REALM || process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo",
    clientId: process.env.KEYCLOAK_CLIENT_ID || process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web",
  });
}
