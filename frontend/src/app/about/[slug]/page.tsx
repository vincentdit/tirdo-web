import { notFound } from "next/navigation";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { leaders } from "@/lib/content";

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
    body: [
      "TIRDO is governed by a Board of Directors and led by a Director General who oversees the technical directorates and corporate services.",
      "The technical work is delivered through three clusters — Industry & Research, Engineering Development, and ICT & Technology Development — each grouping several specialised departments, supported by Finance and Human Resources.",
    ],
  },
  board: {
    title: "Board of Directors",
    subtitle: "Governance and oversight",
    body: [
      "The Board of Directors provides strategic direction and oversight, ensuring TIRDO delivers on its statutory mandate and serves the national industrialization agenda.",
    ],
  },
  administration: {
    title: "Administration",
    subtitle: "TIRDO management team",
    body: [
      "TIRDO's management team leads the day-to-day operations of the organization across research, engineering, corporate services and finance.",
    ],
  },
  "success-stories": {
    title: "Success Stories",
    subtitle: "Impact from lab to industry",
    body: [
      "Over four decades TIRDO has delivered technologies and services that have created jobs, added value to local raw materials and improved industrial productivity — from essential-oils extraction and biomass briquetting to energy auditing and materials development.",
    ],
  },
  comsats: {
    title: "COMSATS Centre",
    subtitle: "International science & technology cooperation",
    body: [
      "TIRDO hosts a COMSATS Centre of Excellence, connecting Tanzanian industry and researchers to a global network of science and technology institutions in the developing world for collaborative research and capacity building.",
    ],
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
  const showLeaders = params.slug === "board" || params.slug === "administration";

  return (
    <>
      <PageBanner title={page.title} subtitle={page.subtitle} crumbs={[{ label: "About Us", href: "/about" }, { label: page.title }]} />
      <section className="py-14">
        <div className="container-tirdo max-w-3xl space-y-4 text-foreground/80">
          {page.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {showLeaders && (
          <div className="container-tirdo mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((l) => (
              <Card key={l.name}>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="font-semibold text-primary">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
