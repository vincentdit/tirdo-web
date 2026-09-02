import Link from "next/link";
import { PageBanner } from "@/components/site/page-banner";
import { Icon } from "@/components/site/icon";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/content";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageBanner title="Our Services" subtitle="Research, engineering and advisory services for industry, government and development partners." crumbs={[{ label: "Services" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              <Card className="group h-full transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mb-1 font-semibold text-primary">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
