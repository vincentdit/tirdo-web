import { IAM_CATALOG } from "@/lib/iam";
import { safeServiceHref, type EServiceItem } from "@/lib/content";

/** Realm or client roles that may open an e-service. tirdo-admin always passes. */
export const ESERVICE_ACCESS: Record<string, { clientId: string; roles: string[]; staffFallback: boolean }> = {
  "client-portal": { clientId: "tirdo-web", roles: ["public", "staff", "content-editor"], staffFallback: true },
  nilims: { clientId: "niims", roles: ["niims", "nilims"], staffFallback: true },
  niims: { clientId: "niims", roles: ["niims", "nilims"], staffFallback: true },
  lims: { clientId: "lims", roles: ["lims"], staffFallback: true },
  ciap: { clientId: "ciap", roles: ["ciap"], staffFallback: true },
  consultation: { clientId: "ciap", roles: ["ciap"], staffFallback: true },
  teltp: { clientId: "telt", roles: ["telt", "teltp"], staffFallback: true },
  telt: { clientId: "telt", roles: ["telt", "teltp"], staffFallback: true },
  eoffice: { clientId: "eoffice", roles: ["eoffice"], staffFallback: true },
};

export function oidcRolesFromPayload(payload: Record<string, unknown>): string[] {
  const realm = payload.realm_access as { roles?: unknown } | undefined;
  const realmRoles = Array.isArray(realm?.roles) ? realm.roles.map(String) : [];
  const resource = payload.resource_access as Record<string, { roles?: unknown }> | undefined;
  const clientRoles: string[] = [];
  if (resource && typeof resource === "object") {
    for (const [clientId, value] of Object.entries(resource)) {
      const roles = Array.isArray(value?.roles) ? value.roles.map(String) : [];
      clientRoles.push(...roles, ...roles.map((role) => `${clientId}:${role}`));
    }
  }
  return Array.from(new Set([...realmRoles, ...clientRoles].map((r) => r.trim()).filter(Boolean)));
}

export function hasIamAdminRole(roles: string[]) {
  return roles.includes("tirdo-admin");
}

export function canAccessEService(slug: string, roles: string[]) {
  if (hasIamAdminRole(roles)) return true;
  const policy = ESERVICE_ACCESS[slug] || ESERVICE_ACCESS[slug.toLowerCase()];
  if (!policy) return roles.includes("staff");
  if (policy.roles.some((role) => roles.includes(role) || roles.includes(`${policy.clientId}:${role}`))) return true;
  if (policy.staffFallback && roles.includes("staff")) return true;
  if (policy.roles.includes("public") && roles.includes("public")) return true;
  return false;
}

export function canOpenContentManagement(roles: string[]) {
  return hasIamAdminRole(roles) || roles.includes("content-editor");
}

export type WorkspaceService = {
  slug: string;
  title: string;
  acronym?: string;
  description: string;
  category: string;
  clientId: string;
  allowed: boolean;
  connected: boolean;
  launchPath: string;
};

export function workspaceServices(items: EServiceItem[], roles: string[]): WorkspaceService[] {
  return items
    .filter((item) => item.active !== false && item.showInPortal !== false)
    .filter((item) => item.slug !== "client-portal")
    .filter((item) => canAccessEService(item.slug, roles))
    .map((item) => {
      const policy = ESERVICE_ACCESS[item.slug] || { clientId: item.slug, roles: [], staffFallback: true };
      const catalog = IAM_CATALOG.find((row) => row.clientId === policy.clientId);
      return {
        slug: item.slug,
        title: item.title,
        acronym: item.acronym,
        description: item.description,
        category: item.category,
        clientId: policy.clientId || catalog?.clientId || item.slug,
        allowed: true,
        connected: Boolean(safeServiceHref(item.href)),
        launchPath: `/api/e-services/launch/${encodeURIComponent(item.slug)}`,
      };
    });
}

export function launchTarget(item: EServiceItem | undefined, roles: string[]) {
  if (!item) return { error: "Unknown e-service.", status: 404 as const };
  if (!canAccessEService(item.slug, roles)) {
    return { error: "You are not authorised to open this system.", status: 403 as const };
  }
  const href = safeServiceHref(item.href);
  if (!href) {
    return { error: "This system is authorised but its address is not configured yet.", status: 409 as const };
  }
  return { href, external: /^https?:\/\//i.test(href) };
}
