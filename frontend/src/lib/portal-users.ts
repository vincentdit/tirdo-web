export type PortalUser = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  roles: string[];
  roleIds: number[];
  isActive?: boolean;
};

export type PortalRole = { id: number; name: string };
export type PortalDept = { slug?: string; title?: string };
export type PortalSitePage = { slug: string; title: string; path: string };
export type PortalGrant = {
  documentId: string;
  staffEmail: string;
  departmentSlug?: string;
  departmentTitle?: string;
  collections: string[];
  pageSlugs: string[];
  canPublish: boolean;
  canManageMedia: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
  active: boolean;
  notes?: string;
};
export type PortalUserCollection = { slug: string; label: string; group?: string };
export type PortalUsersMe = { id?: number; email?: string; isSuperAdmin?: boolean };

export type PortalUsersPayload = {
  me: PortalUsersMe;
  users: PortalUser[];
  roles: PortalRole[];
  grants: PortalGrant[];
  departments: PortalDept[];
  collections: PortalUserCollection[];
  sitePages: PortalSitePage[];
};

export function emailKey(value: string) {
  return value.trim().toLowerCase();
}

export function displayUserName(user: { firstname?: string; lastname?: string; email: string }) {
  return [user.firstname, user.lastname].filter(Boolean).join(" ") || user.email;
}

export async function fetchPortalUsers(): Promise<PortalUsersPayload> {
  const res = await fetch("/api/portal/users");
  if (res.status === 401) {
    window.location.href = "/portal/login";
    throw new Error("Sign in required.");
  }
  if (res.status === 403) throw new Error("Only a user administrator can manage access.");
  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error || "Could not load users.");
  }
  return res.json();
}
