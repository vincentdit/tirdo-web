import { CheckCircle2 } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { iic } from "@/lib/content";

export const metadata = { title: "Industrial Information Centre" };

export default function IICPage() {
  return (
    <>
      <PageBanner
        title="Industrial Information Centre"
        subtitle="A knowledge hub supporting Tanzania's industrialization agenda."
        crumbs={[{ label: "Research & Innovation" }, { label: "Industrial Information Centre" }]}
      />

      <section className="py-14">
        <div className="container-tirdo grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            {iic.intro.map((p, i) => <p key={i}>{p}</p>)}

            <h2 className="pt-4 font-display text-2xl text-brand-ink">Objectives</h2>
            <ul className="space-y-2">
              {iic.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {o}
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <Card className="bg-secondary/40">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold text-primary">Access the Centre</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Browse TIRDO&apos;s publications and technical resources, or request research and
                  advisory support.
                </p>
                <ButtonLink href="/publications" variant="accent" className="mb-2 w-full justify-center">Browse publications</ButtonLink>
                <ButtonLink href="/contact" variant="outline" className="w-full justify-center">Request support</ButtonLink>
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="container-tirdo mt-12">
          <h2 className="mb-5 font-display text-2xl text-brand-ink">What the Centre does</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {iic.activities.map((a) => (
              <div key={a} className="flex items-start gap-2 rounded-lg border p-4 text-sm text-foreground/80">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-teal" /> {a}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
