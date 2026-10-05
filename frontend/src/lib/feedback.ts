// Server-side fetch of aggregate feedback metrics for the Analytics page.
// Individual feedback stays private in the CMS; this returns only counts.
const INTERNAL = process.env.STRAPI_INTERNAL_URL || "http://cms:1337";

export type FeedbackSummary = {
  total: number;
  average: number | null;
  ratedCount: number;
  handled: number;
  byType: Record<string, number>;
  byRating: Record<string, number>;
};

export async function getFeedbackSummary(): Promise<FeedbackSummary | null> {
  try {
    const res = await fetch(`${INTERNAL}/api/feedback-summary`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as FeedbackSummary;
  } catch {
    return null;
  }
}
