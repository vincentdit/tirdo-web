import { NextRequest, NextResponse } from "next/server";
import {
  canApproveDg,
  canApproveHod,
  collectionBySlug,
  contentDepartmentSlug,
  entryTitle,
  publishPathForRequester,
  reviewPublishPath,
} from "@/lib/portal";
import { canUseCollection, canUsePage, forbidden, loadAccess } from "../../../../_access";
import { cmsAdmin, portalToken, unauthorized } from "../../../../_cms";
import { createContentReview, listContentReviews, updateContentReview } from "../../../../_reviews";

export async function POST(_request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const token = portalToken();
  if (!token) return unauthorized();
  const access = await loadAccess(token);
  if (!access) return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });

  const col = collectionBySlug(params.slug);
  if (!col) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  if (!canUseCollection(access, col.slug)) return forbidden();

  const current = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(col.uid)}/${encodeURIComponent(params.id)}`,
    token
  );
  const currentJson = (await current.json().catch(() => ({}))) as Record<string, unknown>;
  const currentData = (currentJson.data || currentJson) as Record<string, unknown>;
  if (col.slug === "pages" && !canUsePage(access, String(currentData.slug || ""))) {
    return forbidden("You are not assigned to this page.");
  }

  const reviews = await listContentReviews(token, col.slug);
  const removed = reviews.find((row) => row.entryId === params.id && row.kind === "remove" && row.state === "applied");
  if (removed) {
    return NextResponse.json(
      { error: "Restore this entry before requesting publish. It was removed from the website but is still in the database." },
      { status: 409 }
    );
  }

  const departmentSlug = contentDepartmentSlug(
    currentData,
    access.departments.find((d) => d.slug && d.slug !== "*")?.slug
  );
  const needsDepartment = col.fields.some((field) => field.key === "departmentSlug") && !access.isPr;
  if (needsDepartment && !departmentSlug) {
    return NextResponse.json(
      { error: "Choose the owning department so the Head of Department can publish this information." },
      { status: 400 }
    );
  }

  const pending = reviews.find(
    (row) => row.entryId === params.id && row.kind === "publish" && (row.state === "pending" || row.state === "approved")
  );

  if (!pending) {
    const approvalPath = publishPathForRequester(access.isPr);
    const created = await createContentReview(token, {
      collectionSlug: col.slug,
      entryId: params.id,
      title: entryTitle(currentData, col.titleField),
      kind: "publish",
      state: "pending",
      requestedBy: access.email,
      requestedById: access.id,
      departmentSlug,
      approvalPath,
    });
    if (!created) {
      return NextResponse.json({ error: "Could not send this publish request." }, { status: 502 });
    }
    return NextResponse.json({
      pending: true,
      stage: approvalPath,
      requestedBy: access.email,
      departmentSlug,
      message:
        approvalPath === "dg"
          ? "Sent to the Director General to approve and publish."
          : "Sent to the Head of Department to approve and publish.",
    });
  }

  const path = reviewPublishPath(pending);

  if (path === "hod") {
    if (
      !canApproveHod({
        email: access.email,
        isHod: access.isHod,
        isSectionHead: access.isSectionHead,
        departments: access.departments,
        departmentSlug: pending.departmentSlug || departmentSlug,
        requestedBy: pending.requestedBy,
      })
    ) {
      return NextResponse.json(
        {
          pending: true,
          stage: "hod",
          requestedBy: pending.requestedBy,
          error: "Waiting for the Head of Department to approve and publish this information.",
        },
        { status: 409 }
      );
    }
    return publishNow(token, col.uid, params.id, pending.documentId, access.email, access.id, "hod");
  }

  if (
    !canApproveDg({
      email: access.email,
      isDg: access.isDg,
      isSuperAdmin: access.isSuperAdmin,
      requestedBy: pending.requestedBy,
      hodApprovedBy: pending.hodApprovedBy,
    })
  ) {
    return NextResponse.json(
      {
        pending: true,
        stage: "dg",
        requestedBy: pending.requestedBy,
        error: "Waiting for the Director General to approve and publish this information.",
      },
      { status: 409 }
    );
  }
  return publishNow(token, col.uid, params.id, pending.documentId, access.email, access.id, "dg");
}

async function publishNow(
  token: string,
  uid: string,
  id: string,
  reviewId: string,
  email: string,
  userId: number,
  stage: "hod" | "dg"
) {
  const res = await cmsAdmin(
    `/content-manager/collection-types/${encodeURIComponent(uid)}/${encodeURIComponent(id)}/actions/publish`,
    token,
    { method: "POST" }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Could not publish this entry." }, { status: res.status });
  }
  await updateContentReview(token, reviewId, {
    state: "applied",
    reviewedBy: email,
    reviewedById: userId,
    hodApprovedBy: stage === "hod" ? email : undefined,
    hodApprovedById: stage === "hod" ? userId : undefined,
  });
  return NextResponse.json({ data: json.data || json, approvedBy: email, stage: "applied" });
}
