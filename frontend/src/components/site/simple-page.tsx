import { PageBanner } from "@/components/site/page-banner";

export function SimplePage({
  title,
  subtitle,
  crumbLabel,
  paragraphs,
}: {
  title: string;
  subtitle?: string;
  crumbLabel?: string;
  paragraphs: string[];
}) {
  return (
    <>
      <PageBanner title={title} subtitle={subtitle} crumbs={[{ label: crumbLabel ?? title }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
    </>
  );
}
