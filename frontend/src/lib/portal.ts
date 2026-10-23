import { publicFileUrl } from "@/lib/utils";

export const PORTAL_COOKIE = "tirdo_portal_token";
export const PORTAL_LOGIN_PATH = "/portal/login";
export const GRANT_UID = "api::portal-grant.portal-grant";
export const DEPARTMENT_UID = "api::department.department";
export const SITE_BRAND_UID = "api::site-brand.site-brand";

export type PortalFieldType = "text" | "textarea" | "number" | "boolean" | "email" | "select" | "media" | "file" | "date" | "url";

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
      { key: "cover", label: "Photo", type: "media" },
    ],
  },
  {
    slug: "pages",
    uid: "api::page.page",
    label: "Pages",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Website pages staff can be assigned to edit, such as About and Privacy.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "path", label: "Website path", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cover", label: "Photo", type: "media" },
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
      { key: "file", label: "Document file", type: "file" },
    ],
  },
  {
    slug: "events",
    uid: "api::event.event",
    label: "Events",
    titleField: "title",
    draftAndPublish: true,
    group: "content",
    description: "Trainings, workshops and public events. Turn on website notification for the scrolling bar; add as many events as you need.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Training", "Workshop", "Exhibition", "Conference", "Seminar", "Other"] },
      { key: "date", label: "Start date", type: "date", required: true },
      { key: "endDate", label: "End date", type: "date" },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "body", label: "Details", type: "textarea" },
      { key: "notifyOnSite", label: "Website notification (scrolling bar). Turn off to hide this event on the public site.", type: "boolean" },
      { key: "pinned", label: "Pin (blinking icon). Only shows when website notification is on.", type: "boolean" },
      { key: "registerUrl", label: "Registration link (optional)", type: "text" },
      { key: "logo", label: "Event logo", type: "media" },
      { key: "cover", label: "Photo", type: "media" },
      { key: "document", label: "Attached document", type: "file" },
    ],
  },
  {
    slug: "partners",
    uid: "api::partner.partner",
    label: "Our Partners",
    titleField: "name",
    draftAndPublish: true,
    group: "content",
    description: "Partner organisations on the public website. Add, edit and publish as many as needed.",
    fields: [
      { key: "name", label: "Partner organisation name", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "category", label: "Partner category", type: "select", options: ["Government Institution", "Development Partner", "NGO", "Private Sector", "Academic / Research", "Other"] },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "website", label: "Official website URL", type: "url" },
      { key: "email", label: "Contact email", type: "email" },
      { key: "phone", label: "Contact phone", type: "text" },
      { key: "address", label: "Physical address", type: "textarea" },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "active", label: "Active (shown on the website when published)", type: "boolean" },
      { key: "startDate", label: "Partnership start date", type: "date" },
      { key: "endDate", label: "Partnership end date", type: "date" },
      { key: "logo", label: "Partner logo", type: "media" },
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
      { key: "cover", label: "Photo", type: "media" },
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
      { key: "cover", label: "Photo", type: "media" },
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
      { key: "photo", label: "Photo", type: "media" },
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

export const SITE_PAGES: { slug: string; title: string; path: string }[] = [
  { slug: "about", title: "About TIRDO", path: "/about" },
  { slug: "mission-vision", title: "Mission & Vision", path: "/about/mission-vision" },
  { slug: "board", title: "Board of Directors", path: "/about/board" },
  { slug: "administration", title: "Administration", path: "/about/administration" },
  { slug: "success-stories", title: "Success Stories", path: "/about/success-stories" },
  { slug: "comsats", title: "COMSATS Centre", path: "/about/comsats" },
  { slug: "partners", title: "Our Partners", path: "/about/partners" },
  { slug: "privacy", title: "Privacy Policy", path: "/privacy" },
  { slug: "disclaimer", title: "Disclaimer", path: "/disclaimer" },
  { slug: "contact", title: "Contact Us", path: "/contact" },
];

export function allowedPageSlugsFromGrants(rows: { collections?: unknown; pageSlugs?: unknown }[]): string[] | null {
  let allPages = false;
  const slugs = new Set<string>();
  for (const row of rows) {
    const collections = parseCollectionList(row.collections);
    if (!collections.includes("pages")) continue;
    const pages = parseCollectionList(row.pageSlugs);
    if (pages.length === 0) allPages = true;
    else pages.forEach((slug) => slugs.add(slug));
  }
  if (allPages) return null;
  return Array.from(slugs);
}

export function canAccessPageSlug(pageSlugs: string[] | null | undefined, slug?: string): boolean {
  if (pageSlugs == null) return true;
  if (!slug) return false;
  return pageSlugs.includes(slug);
}

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

export function isAdminRole(roles: string[]): boolean {
  return roles.some((r) => {
    const n = r.trim().toLowerCase();
    return n === "admin" || n === "administrator";
  });
}

export function isFullPortalRole(roles: string[]): boolean {
  return isSuperAdminRole(roles) || isAdminRole(roles);
}

export function portalPasswordIssue(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Password must include an uppercase letter, a lowercase letter and a number.";
  }
  return null;
}

export function pickDefaultPortalRoleId(
  roles: { id: number; name: string }[],
  requestedId?: number
): number | undefined {
  if (requestedId && roles.some((r) => r.id === requestedId)) return requestedId;
  const preferred = roles.find((r) => !isSuperAdminRole([r.name]) && /author|editor/i.test(r.name));
  const any = roles.find((r) => !isSuperAdminRole([r.name]));
  return preferred?.id || any?.id;
}

export function cmsAdminErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const err = (json as { error?: unknown }).error;
  const raw =
    typeof err === "string"
      ? err
      : err && typeof err === "object"
        ? [
            ...(Array.isArray((err as { details?: { errors?: { message?: string }[] } }).details?.errors)
              ? (err as { details: { errors: { message?: string }[] } }).details.errors.map((e) => e.message)
              : []),
            (err as { message?: string }).message,
          ]
            .filter(Boolean)
            .join(" ")
        : "";
  const text = String(raw || "").toLowerCase();
  if (/passwordconfirmation|password confirmation/.test(text)) {
    return "Password and confirmation do not match.";
  }
  if (/min\.?\s*8|at least 8|uppercase|lowercase|number|too short/.test(text)) {
    return "Password must be at least 8 characters and include uppercase, lowercase and a number.";
  }
  if (/password/.test(text)) {
    return fallback;
  }
  if (/last.?name/.test(text)) return "Last name is required.";
  if (/first.?name/.test(text)) return "First name is required.";
  if (/roles/.test(text)) return "Choose a role for this user.";
  if (/email/.test(text)) return "Enter a valid email address.";
  return fallback;
}

export type PageEditTarget = { href: string; label: string; collection?: string };

export function pageEditTarget(pathname: string): PageEditTarget {
  const path = (pathname.replace(/\/$/, "") || "/") as string;
  if (path === "/") return { href: "/portal/branding", label: "Home photos and branding" };
  if (path.startsWith("/news")) return { href: "/portal/articles", label: "News articles", collection: "articles" };
  if (path.startsWith("/events") || path.startsWith("/training")) {
    return { href: "/portal/events", label: "Events", collection: "events" };
  }
  if (path.startsWith("/about/partners") || path === "/partners") {
    return { href: "/portal/partners", label: "Partners", collection: "partners" };
  }
  if (path.startsWith("/publications") || path.startsWith("/documents")) {
    return { href: "/portal/publications", label: "Publications", collection: "publications" };
  }
  if (path.startsWith("/projects")) return { href: "/portal/projects", label: "Projects", collection: "projects" };
  if (path.startsWith("/technology")) return { href: "/portal/technologies", label: "Technologies", collection: "technologies" };
  if (path.startsWith("/careers")) return { href: "/portal/vacancies", label: "Vacancies", collection: "vacancies" };
  if (path.startsWith("/tenders")) return { href: "/portal/tenders", label: "Tenders", collection: "tenders" };
  if (path.startsWith("/departments")) return { href: "/portal/departments", label: "Departments", collection: "departments" };
  if (path.startsWith("/services") || path.startsWith("/laboratory") || path.startsWith("/consultancy")) {
    return { href: "/portal/services", label: "Services", collection: "services" };
  }
  if (path.startsWith("/staff") || path.startsWith("/about/administration") || path.startsWith("/about/board")) {
    return { href: "/portal/leaders", label: "Board and management", collection: "leaders" };
  }
  if (path.startsWith("/gallery")) return { href: "/portal/gallery", label: "Gallery" };
  if (path.startsWith("/contact")) return { href: "/portal/contact-messages", label: "Contact messages", collection: "contact-messages" };
  if (path.startsWith("/feedback")) return { href: "/portal/feedback", label: "Service requests", collection: "feedback" };
  if (path.startsWith("/privacy") || path.startsWith("/disclaimer") || path.startsWith("/about")) {
    return { href: "/portal/pages", label: "Pages", collection: "pages" };
  }
  return { href: "/portal/pages", label: "Pages", collection: "pages" };
}

export function mediaId(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  if (typeof value === "object" && value && "id" in value) {
    const id = Number((value as { id: unknown }).id);
    return Number.isFinite(id) ? id : null;
  }
  return null;
}

export function mediaPreviewUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return publicFileUrl(value);
  if (typeof value !== "object") return undefined;
  const nested = value as { url?: string; data?: { url?: string } | { url?: string }[] };
  const url = nested.url || (Array.isArray(nested.data) ? nested.data[0]?.url : nested.data?.url);
  return publicFileUrl(url);
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
    } else if (field.type === "media" || field.type === "file") {
      out[field.key] = mediaId(value);
    } else if (value === "" || value == null) out[field.key] = field.type === "textarea" || field.type === "text" ? value : null;
    else out[field.key] = value;
  }
  return out;
}

export function entryTitle(row: Record<string, unknown>, field: string): string {
  const v = row[field] ?? row.title ?? row.name ?? row.subject ?? row.documentId;
  return v == null || v === "" ? "Untitled" : String(v);
}

export type EntryStatus = "Published" | "Draft" | "Modified" | "Open" | "Handled" | "Inactive";

export function entryStatus(row: Record<string, unknown>, draftAndPublish: boolean): EntryStatus {
  if (row.active === false && draftAndPublish) return "Inactive";
  if (!draftAndPublish) {
    return row.handled ? "Handled" : "Open";
  }
  const raw = String(row.status || "").toLowerCase();
  if (raw === "published") return "Published";
  if (raw === "modified") return "Modified";
  if (raw === "draft") return "Draft";
  return row.publishedAt ? "Published" : "Draft";
}

export function validateCollectionPayload(col: PortalCollection, payload: Record<string, unknown>): string | null {
  for (const field of col.fields) {
    if (!field.required) continue;
    const value = payload[field.key];
    if (value == null || value === "") return `${field.label} is required.`;
  }
  if (col.slug !== "partners") return null;
  const email = String(payload.email || "").trim();
  if (email && !isAdminEmail(email)) return "Enter a valid contact email, or leave it blank.";
  const website = String(payload.website || "").trim();
  if (website && !/^https?:\/\/.+/i.test(website)) return "Website URL must start with http:// or https://.";
  const start = String(payload.startDate || "");
  const end = String(payload.endDate || "");
  if (start && end && start > end) return "Partnership end date must be on or after the start date.";
  const order = payload.displayOrder;
  if (order != null && order !== "" && (!Number.isFinite(Number(order)) || Number(order) < 0)) {
    return "Display order must be a number of zero or more.";
  }
  return null;
}

export function sanitizeSearch(q: string): string {
  return q.trim().replace(/[<>]/g, "").slice(0, 80);
}

export function cmsListQuery(
  page: number,
  pageSize: number,
  q: string,
  searchFields: string[] = ["title"],
  sort = "updatedAt:desc"
): string {
  const params = new URLSearchParams();
  params.set("page", String(Math.max(1, page)));
  params.set("pageSize", String(Math.min(50, Math.max(1, pageSize))));
  params.set("sort", sort);
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
