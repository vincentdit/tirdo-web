import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Icon } from "@/components/site/icon";
import { ButtonLink } from "@/components/ui/button";
import { services } from "@/lib/content";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  return { title: s?.title ?? "Service" };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = services.find((s) => s.slug === params.slug);
  if (!svc) notFound();

  return (
    <>
      <PageBanner title={svc.title} crumbs={[{ label: "Services", href: "/services" }, { label: svc.title }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-accent/15 text-accent">
              <Icon name={svc.icon} className="h-7 w-7" />
            </span>
            <p className="text-lg">{svc.description}</p>
            {(svc.body ?? [
              "TIRDO delivers this service through experienced professionals and well-equipped laboratories, tailored to the needs of manufacturers, SMEs, government institutions and development partners.",
            ]).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h3 className="pt-2 font-semibold text-primary">What you get</h3>
            <ul className="space-y-2">
              {["Qualified, multidisciplinary expert team", "Accredited laboratory and testing capability", "Actionable technical reports and recommendations", "Confidential, client-focused engagement"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <div className="rounded-xl border bg-secondary/40 p-6">
              <h3 className="mb-2 font-bold text-primary">Request this service</h3>
              <p className="mb-4 text-sm text-muted-foreground">Tell us about your requirement and our team will get back to you.</p>
              <ButtonLink href="/contact" variant="accent" className="w-full justify-center">Contact TIRDO</ButtonLink>
              <div className="mt-6 border-t pt-4">
                <h4 className="mb-2 text-sm font-semibold text-primary">Other services</h4>
                <ul className="space-y-1 text-sm">
                  {services.filter((s) => s.slug !== svc.slug).slice(0, 5).map((s) => (
                    <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-foreground/75 hover:text-accent">{s.title}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
