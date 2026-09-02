import { PageBanner } from "@/components/site/page-banner";
export const metadata = { title: "Gallery" };
export default function Page() {
  return (
    <>
      <PageBanner title="Gallery" subtitle="Moments from TIRDO's research, events and partnerships." crumbs={[{ label: "Media" }, { label: "Gallery" }]} />
      <section className="py-14">
        <div className="container-tirdo grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-primary/15 to-accent/15" />
          ))}
        </div>
      </section>
    </>
  );
}
