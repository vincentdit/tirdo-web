import { Rocket, Users, Lightbulb, TrendingUp } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "T-Hub Innovation" };

const pillars = [
  { icon: Lightbulb, title: "Incubation", text: "Nurturing early-stage industrial and technology startups." },
  { icon: Users, title: "Mentorship", text: "Access to TIRDO researchers, engineers and industry experts." },
  { icon: TrendingUp, title: "Commercialization", text: "Turning research and prototypes into market-ready products." },
  { icon: Rocket, title: "Acceleration", text: "Support to scale proven technologies and reach industry buyers." },
];

export default function THubPage() {
  return (
    <>
      <PageBanner title="T-Hub Innovation Centre" subtitle="TIRDO's innovation hub for incubating startups and commercializing home-grown technologies." crumbs={[{ label: "Research & Innovation" }, { label: "T-Hub" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Card key={p.title}>
              <CardContent className="p-6">
                <p.icon className="mb-3 h-8 w-8 text-accent" />
                <h3 className="mb-1 font-semibold text-primary">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="container-tirdo mt-12 rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold">Have an industrial technology idea?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">Join the T-Hub community and turn your innovation into a viable business with TIRDO&apos;s technical and mentorship support.</p>
          <ButtonLink href="/contact" variant="accent" size="lg" className="mt-6">Apply to T-Hub</ButtonLink>
        </div>
      </section>
    </>
  );
}
