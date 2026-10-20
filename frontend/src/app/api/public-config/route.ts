import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Runtime Keycloak settings for the browser. NEXT_PUBLIC_* is baked in at
// image build (often localhost); this reads the container env so a LAN
// server can set KEYCLOAK_PUBLIC_URL without rebuilding the JS bundle.
export function GET() {
  return NextResponse.json({
    keycloakUrl:
      process.env.KEYCLOAK_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
      "http://localhost:8080/auth",
    realm: process.env.KEYCLOAK_REALM || process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "tirdo",
    clientId: process.env.KEYCLOAK_CLIENT_ID || process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "tirdo-web",
  });
}
