import { notFound } from "next/navigation";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { management, successStories, comsats, orgStructure } from "@/lib/content";

const pages: Record<string, { title: string; subtitle: string; body: string[] }> = {
  "mission-vision": {
    title: "Mission & Vision",
    subtitle: "Our purpose, aspiration and values",
    body: [
      "Vision: To be a centre of excellence in provision of innovative solutions for a competitive industrial sector.",
      "Mission: To support the development of competitive and sustainable industries through quality research and professional technical services.",
      "Core values: Integrity, Customer Focus, Quality, Innovation, Partnership, Accountability and Environmental Protection guide how TIRDO delivers its mandate.",
    ],
  },
  structure: {
    title: "Organization Structure",
    subtitle: "How TIRDO is organised",
    body: orgStructure,
  },
  board: {
    title: "Board of Directors",
    subtitle: "Governance and oversight",
    body: [
      "The Board of Directors provides strategic direction and oversight, ensuring TIRDO delivers on its statutory mandate under the TIRDO Act, 1979 and serves the national industrialization agenda.",
      "The Board sets policy and monitors performance, while day-to-day operations are led by the Director General and the management team across the technical directorates and corporate services.",
    ],
  },
  administration: {
    title: "Administration",
    subtitle: "TIRDO management and division heads",
    body: [
      "TIRDO's management team leads the organisation's research, engineering, ICT and corporate services, translating the mandate into applied research and technical services for industry.",
    ],
  },
  "success-stories": {
    title: "Success Stories",
    subtitle: "Impact from the laboratory to industry",
    body: [
      "Over four decades TIRDO has delivered technologies and services with real national impact. A selection of milestones:",
    ],
  },
  comsats: {
    title: "COMSATS Centre for Climate & Sustainability",
    subtitle: "International science & technology cooperation",
    body: comsats,
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = pages[params.slug];
  return { title: p?.title ?? "About" };
}

export default function AboutSubPage({ params }: { params: { slug: string } }) {
  const page = pages[params.slug];
  if (!page) notFound();

  return (
    <>
      <PageBanner title={page.title} subtitle={page.subtitle} crumbs={[{ label: "About Us", href: "/about" }, { label: page.title }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {page.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {params.slug === "administration" && (
          <div className="container-tirdo mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {management.map((l) => (
              <Card key={l.name}>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {l.name.replace(/^(Prof\.|Eng\.|Ms\.|Mr\.|Dr\.)\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="text-sm font-semibold text-primary">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {params.slug === "success-stories" && (
          <div className="container-tirdo mt-8 max-w-3xl space-y-4">
            {successStories.map((s) => (
              <Card key={s.title} className="border-l-4 border-l-accent">
                <CardContent className="p-5">
                  <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
