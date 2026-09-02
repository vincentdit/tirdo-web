import Link from "next/link";
import { ArrowRight, Target, Eye, Gem } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { site } from "@/lib/site";

export const metadata = { title: "About Us" };

const subPages = [
  { title: "Mission & Vision", href: "/about/mission-vision" },
  { title: "Organization Structure", href: "/about/structure" },
  { title: "Board of Directors", href: "/about/board" },
  { title: "Administration", href: "/about/administration" },
  { title: "Success Stories", href: "/about/success-stories" },
  { title: "COMSATS Centre", href: "/about/comsats" },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About TIRDO"
        subtitle={site.established}
        crumbs={[{ label: "About Us" }]}
      />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-foreground/80">
            <p>
              The Tanzania Industrial Research and Development Organization (TIRDO) is a multidisciplinary
              research and development institution established by an Act of Parliament No. 5 of 1979.
              TIRDO&apos;s mandate is to support the industrialization of Tanzania by carrying out applied
              research, providing technological services and facilitating the transfer of appropriate
              technologies to industry.
            </p>
            <p>
              TIRDO works across four core areas — industrial research, industrial engineering, ICT and
              technology transfer, and technology forecasting — serving manufacturers, government agencies,
              SMEs and development partners. The organization operates specialised laboratories and hosts the
              COMSATS Centre and the T-Hub innovation hub.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Target, title: "Mission", text: "Deliver industrial research and technology services that add value to national resources." },
                { icon: Eye, title: "Vision", text: "A centre of excellence driving Tanzania's sustainable industrialization." },
                { icon: Gem, title: "Values", text: "Excellence, integrity, innovation and client focus." },
              ].map((v) => (
                <Card key={v.title}>
                  <CardContent className="p-5">
                    <v.icon className="mb-2 h-7 w-7 text-accent" />
                    <h3 className="mb-1 font-semibold text-primary">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside>
            <div className="rounded-xl border bg-secondary/40 p-5">
              <h3 className="mb-3 font-bold text-primary">In this section</h3>
              <ul className="space-y-1">
                {subPages.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-card hover:text-primary">
                      {s.title} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
