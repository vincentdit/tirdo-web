import { CONTENT_REVIEW_UID, type ContentReview } from "@/lib/portal";
import { cmsAdmin } from "./_cms";

const PATH = `/content-manager/collection-types/${encodeURIComponent(CONTENT_REVIEW_UID)}`;

function asReview(row: Record<string, unknown>): ContentReview {
  return {
    documentId: String(row.documentId || row.id || ""),
    collectionSlug: String(row.collectionSlug || ""),
    entryId: String(row.entryId || ""),
    title: row.title ? String(row.title) : undefined,
    kind: row.kind === "remove" ? "remove" : "publish",
    state:
      row.state === "approved" || row.state === "applied" || row.state === "rejected" ? row.state : "pending",
    requestedBy: row.requestedBy ? String(row.requestedBy) : undefined,
    requestedById: Number(row.requestedById) || undefined,
    reviewedBy: row.reviewedBy ? String(row.reviewedBy) : undefined,
    reviewedById: Number(row.reviewedById) || undefined,
    departmentSlug: row.departmentSlug ? String(row.departmentSlug) : undefined,
    hodApprovedBy: row.hodApprovedBy ? String(row.hodApprovedBy) : undefined,
    hodApprovedById: Number(row.hodApprovedById) || undefined,
    approvalPath: row.approvalPath === "dg" ? "dg" : "hod",
  };
}

export async function listContentReviews(
  token: string,
  collectionSlug: string
): Promise<ContentReview[]> {
  const qs = new URLSearchParams({
    page: "1",
    pageSize: "200",
    sort: "updatedAt:desc",
    "filters[collectionSlug][$eq]": collectionSlug,
  });
  const res = await cmsAdmin(`${PATH}?${qs.toString()}`, token);
  const json = (await res.json().catch(() => ({}))) as { results?: Record<string, unknown>[]; data?: Record<string, unknown>[] };
  if (!res.ok) return [];
  const rows = Array.isArray(json.results) ? json.results : Array.isArray(json.data) ? json.data : [];
  return rows.map(asReview);
}

export function activeReviewFor(reviews: ContentReview[], entryId: string): ContentReview | undefined {
  const forEntry = reviews.filter((row) => row.entryId === entryId && row.state !== "rejected");
  return (
    forEntry.find((row) => row.kind === "remove" && row.state === "applied") ||
    forEntry.find((row) => row.kind === "publish" && row.state === "pending") ||
    forEntry.find((row) => row.kind === "publish" && row.state === "approved") ||
    forEntry[0]
  );
}

export async function createContentReview(
  token: string,
  data: Omit<ContentReview, "documentId">
): Promise<ContentReview | null> {
  const res = await cmsAdmin(PATH, token, {
    method: "POST",
    body: JSON.stringify({
      collectionSlug: data.collectionSlug,
      entryId: data.entryId,
      title: data.title || "",
      kind: data.kind,
      state: data.state,
      requestedBy: data.requestedBy || null,
      requestedById: data.requestedById || null,
      reviewedBy: data.reviewedBy || null,
      departmentSlug: data.departmentSlug || null,
      hodApprovedBy: data.hodApprovedBy || null,
      hodApprovedById: data.hodApprovedById || null,
      approvalPath: data.approvalPath === "dg" ? "dg" : "hod",
    }),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) return null;
  return asReview((json.data || json) as Record<string, unknown>);
}

export async function updateContentReview(
  token: string,
  documentId: string,
  data: Partial<ContentReview>
): Promise<boolean> {
  const res = await cmsAdmin(`${PATH}/${encodeURIComponent(documentId)}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.ok;
}
