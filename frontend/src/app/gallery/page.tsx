import { PageBanner } from "@/components/site/page-banner";
import { galleryImages } from "@/lib/content";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <PageBanner title="Gallery" subtitle="Moments from TIRDO's research, events and partnerships." crumbs={[{ label: "Media" }, { label: "Gallery" }]} />
      <section className="py-14">
        <div className="container-tirdo grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galleryImages.map((img) => (
            <figure key={img.src} className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-square overflow-hidden bg-primary/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-brand-navy/90 to-transparent p-3 text-xs text-white transition-transform duration-300 group-hover:translate-y-0">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
