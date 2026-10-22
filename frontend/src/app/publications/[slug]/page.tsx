import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { PublicationPreview } from "@/components/site/publication-preview";
import { getPublicationBySlug, getPublications } from "@/lib/strapi";

export async function generateStaticParams() {
  const pubs = await getPublications();
  return pubs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getPublicationBySlug(params.slug);
  const title = item?.title ?? "Publication";
  const canonical = `/publications/${params.slug}`;
  return {
    title,
    description: item?.abstract ?? `${item?.type ?? "Publication"} · ${item?.year ?? ""}`.trim(),
    alternates: { canonical },
    openGraph: { title, description: item?.abstract, url: canonical, type: "article" },
  };
}

export default async function PublicationDetail({ params }: { params: { slug: string } }) {
  const item = await getPublicationBySlug(params.slug);
  if (!item) notFound();

  return (
    <>
      <PageBanner title={item.title} crumbs={[{ label: "Publications", href: "/publications" }, { label: item.type }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-5xl">
          <PublicationPreview publication={item} />
          <Link href="/publications" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to publications
          </Link>
        </div>
      </section>
    </>
  );
}
