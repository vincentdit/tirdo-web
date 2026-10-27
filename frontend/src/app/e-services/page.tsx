import { PageBanner } from "@/components/site/page-banner";
import { ButtonLink } from "@/components/ui/button";
import { EServicesPortal } from "@/components/site/eservices-portal";
import { SectionHeading } from "@/components/site/section-heading";
import { ESERVICE_CATEGORIES, eServiceCategory, eServiceOpen } from "@/lib/content";
import { getEServices } from "@/lib/strapi";

export const metadata = { title: "e-Services" };

export default async function EServicesPage() {
  const all = await getEServices();
  const publicItems = all.filter((e) => e.showOnPublic);
  const groups = ESERVICE_CATEGORIES.map((category) => ({
    category,
    items: publicItems.filter((e) => eServiceCategory(e.category) === category),
  })).filter((g) => g.items.length);

  return (
    <>
      <PageBanner title="TIRDO e-Services" subtitle="Online systems for clients, the public and TIRDO staff." crumbs={[{ label: "e-Services" }]} />

      <section id="portal" className="scroll-mt-28 py-14">
        <div className="container-tirdo">
          <SectionHeading eyebrow="Secure area" title="Client Portal" />
          <EServicesPortal />
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-8">
        <div className="container-tirdo">
          <SectionHeading className="mb-4" eyebrow="Systems" title="Available services" />
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Open a connected system, or request access if it is not live yet.
          </p>
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.category}>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-teal">{group.category}</h3>
                <ul className="divide-y overflow-hidden rounded-lg border bg-card">
                  {group.items.map((e) => {
                    const open = eServiceOpen(e);
                    const ready = open.label === "Open";
                    return (
                      <li key={e.slug} id={e.slug} className="scroll-mt-24 flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-primary">{e.title}</h3>
                            {e.acronym ? (
                              <span className="rounded bg-secondary px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-primary">
                                {e.acronym}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-sm">{e.description}</p>
                        </div>
                        <ButtonLink
                          href={open.href}
                          size="sm"
                          variant={ready ? "outline" : "ghost"}
                          className="h-8 w-auto shrink-0 self-start justify-center px-3 sm:min-w-[8.5rem]"
                          {...(open.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        >
                          {open.label}
                        </ButtonLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            System addresses are set in Content management → E-service links. Sign in once with TIRDO single sign-on.
          </p>
        </div>
      </section>
    </>
  );
}
