export const PORTAL_COOKIE = "tirdo_portal_token";
export const PORTAL_LOGIN_PATH = "/portal/login";
export const GRANT_UID = "api::portal-grant.portal-grant";
export const DEPARTMENT_UID = "api::department.department";
export const STRAPI_ADMIN_PATH = "/admin";

export type PortalFieldType = "text" | "textarea" | "number" | "boolean" | "email" | "select";

export type PortalField = {
  key: string;
  label: string;
  type: PortalFieldType;
  required?: boolean;
  options?: string[];
};

export type PortalCollection = {
  slug: string;
  uid: string;
  label: string;
  titleField: string;
  draftAndPublish: boolean;
  description: string;
  group: "content" | "services" | "directory" | "inbox";
  fields: PortalField[];
};

export const PORTAL_COLLECTIONS: PortalCollection[] = [
  {
    slug: "articles",
    uid: "api::article.article",
    label: "News Articles",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "News and announcements on the public website.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "category", label: "Category", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "pages",
    uid: "api::page.page",
    label: "Pages",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Editable website pages.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "publications",
    uid: "api::publication.publication",
    label: "Publications",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Reports, papers and documents.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "type", label: "Type", type: "text" },
      { key: "year", label: "Year", type: "number" },
      { key: "authors", label: "Authors", type: "text" },
      { key: "doi", label: "DOI", type: "text" },
      { key: "abstract", label: "Abstract", type: "textarea" },
    ],
  },
  {
    slug: "projects",
    uid: "api::project.project",
    label: "Research Projects",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Research and development projects.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "technologies",
    uid: "api::technology.technology",
    label: "Technologies",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Technologies available for transfer and adoption.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "sector", label: "Sector", type: "select", options: ["energy", "food-biotechnology", "materials", "environment", "textile-leather", "ict"] },
      { key: "maturity", label: "Maturity", type: "select", options: ["Concept", "Pilot", "Commercial", "Mature"] },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "vacancies",
    uid: "api::vacancy.vacancy",
    label: "Vacancies",
    titleField: "title",
    draftAndPublish: true,
    group: "services",
    description: "Careers listings.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Professional", "Technical", "Administrative", "Internship"] },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    slug: "tenders",
    uid: "api::tender.tender",
    label: "Tenders",
    titleField: "title",
    draftAndPublish: true,
    group: "services",
    description: "Procurement notices.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "reference", label: "Reference", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Goods", "Works", "Services", "Consultancy"] },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    slug: "services",
    uid: "api::service.service",
    label: "Services",
    titleField: "title",
    draftAndPublish: true,
    group: "directory",
    description: "Public services listed on the website.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "icon", label: "Icon", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "departments",
    uid: "api::department.department",
    label: "Departments",
    titleField: "title",
    draftAndPublish: true,
    group: "directory",
    description: "Organisation departments used for staff work assignment.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "group", label: "Group", type: "text" },
      { key: "blurb", label: "Short description", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    slug: "leaders",
    uid: "api::leader.leader",
    label: "Board & Management",
    titleField: "name",
    draftAndPublish: true,
    group: "directory",
    description: "Board of Directors and top management.",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true },
      { key: "group", label: "Group", type: "select", options: ["board", "management"] },
      { key: "rank", label: "Rank", type: "number" },
      { key: "quote", label: "Quote", type: "textarea" },
    ],
  },
  {
    slug: "contact-messages",
    uid: "api::contact-message.contact-message",
    label: "Contact Messages",
    titleField: "subject",
    draftAndPublish: false,
    group: "inbox",
    description: "Messages from the public contact form.",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "organization", label: "Organisation", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "handled", label: "Handled", type: "boolean" },
    ],
  },
  {
    slug: "feedback",
    uid: "api::feedback.feedback",
    label: "Service Requests",
    titleField: "subject",
    draftAndPublish: false,
    group: "inbox",
    description: "Stakeholder feedback and service ratings.",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "serviceArea", label: "Service area", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "handled", label: "Handled", type: "boolean" },
    ],
  },
];

export function collectionBySlug(slug: string): PortalCollection | undefined {
  return PORTAL_COLLECTIONS.find((c) => c.slug === slug);
}

export function collectionByUid(uid: string): PortalCollection | undefined {
  return PORTAL_COLLECTIONS.find((c) => c.uid === uid);
}

export function cmsBase(): string {
  return process.env.STRAPI_INTERNAL_URL || "http://cms:1337";
}

export function friendlyAuthError(status: number, message?: string): string {
  const raw = String(message || "").toLowerCase();
  if (status === 400 || status === 401 || raw.includes("invalid") || raw.includes("identifier")) {
    return "The email or password is not correct. Check your details and try again.";
  }
  if (status === 429) return "Too many sign-in attempts. Wait a moment and try again.";
  if (status >= 500) return "TIRDO Content Manager is temporarily unavailable. Try again shortly.";
  if (raw.includes("network") || raw.includes("fetch")) {
    return "Could not reach TIRDO Content Manager. Check your connection and try again.";
  }
  return "Sign in failed. Try again or contact your TIRDO website administrator.";
}

export function isAdminEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isSuperAdminRole(roles: string[]): boolean {
  return roles.some((r) => r.toLowerCase() === "super admin");
}

export function pickAllowedFields(col: PortalCollection, body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of col.fields) {
    if (!(field.key in body)) continue;
    const value = body[field.key];
    if (field.type === "boolean") out[field.key] = Boolean(value);
    else if (field.type === "number") {
      const n = Number(value);
      out[field.key] = Number.isFinite(n) ? n : null;
    } else if (value === "" || value == null) out[field.key] = field.type === "textarea" || field.type === "text" ? value : null;
    else out[field.key] = value;
  }
  return out;
}

export function entryTitle(row: Record<string, unknown>, field: string): string {
  const v = row[field] ?? row.title ?? row.name ?? row.subject ?? row.documentId;
  return v == null || v === "" ? "Untitled" : String(v);
}

export type EntryStatus = "Published" | "Draft" | "Modified" | "Open" | "Handled";

export function entryStatus(row: Record<string, unknown>, draftAndPublish: boolean): EntryStatus {
  if (!draftAndPublish) {
    return row.handled ? "Handled" : "Open";
  }
  const raw = String(row.status || "").toLowerCase();
  if (raw === "published") return "Published";
  if (raw === "modified") return "Modified";
  if (raw === "draft") return "Draft";
  return row.publishedAt ? "Published" : "Draft";
}

export function sanitizeSearch(q: string): string {
  return q.trim().replace(/[<>]/g, "").slice(0, 80);
}

export function cmsListQuery(page: number, pageSize: number, q: string, searchFields: string[] = ["title"]): string {
  const params = new URLSearchParams();
  params.set("page", String(Math.max(1, page)));
  params.set("pageSize", String(Math.min(50, Math.max(1, pageSize))));
  params.set("sort", "updatedAt:desc");
  const query = sanitizeSearch(q);
  if (query) {
    params.set("_q", query);
    const fields = searchFields.filter(Boolean).slice(0, 5);
    fields.forEach((field, i) => {
      params.set(`filters[$or][${i}][${field}][$containsi]`, query);
    });
  }
  return params.toString();
}

export function parseCollectionList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}
