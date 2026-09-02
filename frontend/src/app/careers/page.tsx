import { Briefcase, ExternalLink } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <>
      <PageBanner title="Careers" subtitle="Build your career in industrial research and technology." crumbs={[{ label: "Careers" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            <p>
              TIRDO brings together researchers, engineers, technologists and support professionals working on
              real industrial challenges — from applied research and laboratory testing to energy, materials,
              ICT and corporate services.
            </p>
            <p>
              As a public institution, TIRDO advertises vacancies through the official Government recruitment
              channels. Applications are submitted through the Public Service Recruitment Secretariat&apos;s
              employment portal, and announcements are also posted here and in the national press.
            </p>
            <p>There are currently no open positions listed. New vacancies will be published here and managed through the CMS.</p>
          </div>
          <aside>
            <div className="rounded-xl border bg-secondary/40 p-6">
              <span className="mb-3 grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-6 w-6" />
              </span>
              <h3 className="mb-2 font-bold text-primary">Apply through the Government portal</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Public-service applications are handled by the Public Service Recruitment Secretariat (Ajira Portal).
              </p>
              <ButtonLink href="https://portal.ajira.go.tz" variant="accent" className="w-full justify-center">
                Ajira Portal <ExternalLink className="h-4 w-4" />
              </ButtonLink>
              <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                General enquiries: <a href="/contact" className="font-semibold text-brand-teal hover:underline">contact TIRDO</a>.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
