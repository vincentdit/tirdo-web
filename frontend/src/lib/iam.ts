export const IAM_CATALOG = [
  { code: "tirdo-web", name: "TIRDO Web", clientId: "tirdo-web", category: "Website", description: "Public website and staff SSO entry point." },
  { code: "niims", name: "NIIMS", clientId: "niims", category: "Industrial information", description: "National / industrial information management system." },
  { code: "lims", name: "LIMS", clientId: "lims", category: "Laboratory", description: "Laboratory information management system." },
  { code: "ciap", name: "CIAP", clientId: "ciap", category: "Consultancy", description: "Consultancy and Industrial Advisory Portal." },
  { code: "telt", name: "TELT", clientId: "telt", category: "Learning", description: "TIRDO e-learning and training." },
] as const;

export type IamAppCode = (typeof IAM_CATALOG)[number]["code"];

const SECRET_KEYS = /secret|password|credential|private.?key|refresh.?token|serviceAccount/i;

export function catalogByClientId(clientId: string) {
  const id = clientId.trim().toLowerCase();
  return IAM_CATALOG.find((row) => row.clientId === id || row.code === id);
}

export function suggestedClientId(code: string) {
  return String(code || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function isDuplicateClient(existingIds: string[], clientId: string) {
  const want = clientId.trim().toLowerCase();
  return existingIds.some((id) => id.trim().toLowerCase() === want);
}

export function stripSecrets<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => stripSecrets(item)) as T;
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_KEYS.test(key)) continue;
    out[key] = stripSecrets(item);
  }
  return out as T;
}

export function publicClientView(client: Record<string, unknown>) {
  const attrs = (client.attributes && typeof client.attributes === "object" ? client.attributes : {}) as Record<string, string>;
  const clientId = String(client.clientId || "");
  const catalog = catalogByClientId(clientId);
  return {
    id: String(client.id || ""),
    clientId,
    name: String(client.name || catalog?.name || clientId),
    description: String(client.description || catalog?.description || ""),
    code: String(attrs["tirdo.appCode"] || catalog?.code || clientId),
    category: String(attrs["tirdo.category"] || catalog?.category || "Other"),
    owner: String(attrs["tirdo.owner"] || ""),
    technicalContact: String(attrs["tirdo.contact"] || ""),
    environment: String(attrs["tirdo.environment"] || "Production"),
    rootUrl: String(client.rootUrl || ""),
    baseUrl: String(client.baseUrl || ""),
    redirectUris: Array.isArray(client.redirectUris) ? client.redirectUris.map(String) : [],
    postLogoutRedirectUris: String(attrs["post.logout.redirect.uris"] || ""),
    webOrigins: Array.isArray(client.webOrigins) ? client.webOrigins.map(String) : [],
    protocol: String(client.protocol || "openid-connect"),
    publicClient: client.publicClient !== false,
    standardFlowEnabled: client.standardFlowEnabled !== false,
    directAccessGrantsEnabled: Boolean(client.directAccessGrantsEnabled),
    serviceAccountsEnabled: Boolean(client.serviceAccountsEnabled),
    frontchannelLogout: Boolean(client.frontchannelLogout),
    enabled: client.enabled !== false,
    pkce: String(attrs["pkce.code.challenge.method"] || ""),
    backchannelLogoutUrl: String(attrs["backchannel.logout.url"] || ""),
    registered: true,
    secretConfigured: client.publicClient === false,
  };
}

export function validateRedirectUris(uris: string[]) {
  if (!uris.length) return "At least one redirect URI is required.";
  for (const uri of uris) {
    const value = uri.trim();
    if (!value) return "Redirect URIs cannot be blank.";
    if (value === "*") return "Wildcard-only redirect URIs are not allowed.";
    if (/javascript:/i.test(value)) return "Unsafe redirect URI.";
  }
  return null;
}

export function validateAccessTokenClaims(
  payload: Record<string, unknown>,
  opts: { issuer: string; audience: string; now?: number }
) {
  const now = opts.now ?? Date.now();
  if (String(payload.iss || "") !== opts.issuer) return "invalid_issuer";
  const aud = payload.aud;
  const audiences = Array.isArray(aud) ? aud.map(String) : [String(aud || "")];
  if (!audiences.includes(opts.audience)) return "invalid_audience";
  const exp = Number(payload.exp);
  if (!Number.isFinite(exp) || exp * 1000 <= now) return "expired";
  return null;
}

export function integrationStatus(clientId: string, registered: boolean, enabled: boolean) {
  if (clientId === "tirdo-web" && registered) return enabled ? "integrated" : "disabled";
  if (!registered) return "not_registered";
  if (!enabled) return "disabled";
  return "client_ready";
}

export function iamAdminAllowed(isSuperAdmin: boolean, canManageUsers: boolean) {
  return Boolean(isSuperAdmin || canManageUsers);
}

/** Production identity: Keycloak username is the institutional email. */
export function emailAsUsername(email: string): string {
  return String(email || "").trim().toLowerCase();
}

export function iamNav() {
  return [
    { href: "/portal/iam", label: "SSO Dashboard" },
    { href: "/portal/iam/applications", label: "Connected Applications" },
    { href: "/portal/iam/applications/new", label: "Application Registration" },
    { href: "/portal/iam/users", label: "User Management" },
    { href: "/portal/iam/groups", label: "Groups Management" },
    { href: "/portal/iam/roles", label: "Roles & Permissions" },
    { href: "/portal/iam/policies", label: "Authentication Policies" },
    { href: "/portal/iam/sessions", label: "Session Management" },
    { href: "/portal/iam/idps", label: "Identity Providers" },
    { href: "/portal/iam/audit", label: "Audit Logs" },
    { href: "/portal/iam/mfa", label: "Multi-Factor Authentication" },
    { href: "/portal/iam/config", label: "Keycloak Configuration" },
  ];
}
