import { PageBanner } from "@/components/site/page-banner";
import { ButtonLink } from "@/components/ui/button";
import { EServicesPortal } from "@/components/site/eservices-portal";
import { SectionHeading } from "@/components/site/section-heading";
import { eservices } from "@/lib/content";

export const metadata = { title: "e-Services" };

export default function EServicesPage() {
  return (
    <>
      <PageBanner title="TIRDO e-Services" subtitle="Online systems for clients, the public and TIRDO staff." crumbs={[{ label: "e-Services" }]} />

      {/* Authenticated client portal (Keycloak SSO) */}
      <section className="py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Secure area" title="Client Portal" />
          <EServicesPortal />
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Public" title="Available Services" />
        </div>
        <div className="container-tirdo grid gap-6 md:grid-cols-3">
          {eservices.map((e) => (
            <div key={e.anchor} id={e.anchor} className="scroll-mt-28 rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-primary">{e.title}</h3>
              <p className="mb-5 text-sm text-muted-foreground">{e.description}</p>
              <ButtonLink href={e.href} variant="outline" className="w-full justify-center">Open</ButtonLink>
            </div>
          ))}
        </div>
        <div className="container-tirdo mt-10 rounded-xl border-l-4 border-accent bg-secondary/40 p-6 text-sm text-foreground/75">
          Single sign-on across TIRDO systems is provided by Keycloak. Staff and registered users sign in
          once to access e-Office, the client portal and the Industrial Information Centre.
        </div>
      </section>
    </>
  );
}
