import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { managementUnits } from "@/lib/content";

export const metadata = { title: "Supporting Units" };

export default function UnitsPage() {
  return (
    <>
      <PageBanner
        title="Supporting Units"
        subtitle="Units reporting directly to the Director General — Internal Auditor, Procurement, Corporate Service & Planning and Legal."
        crumbs={[{ label: "Units" }]}
      />
      <section className="py-14">
        <div className="container-tirdo max-w-4xl space-y-5">
          <p className="text-foreground/80">
            Alongside its five departments, TIRDO&apos;s Director General is supported by
            units that provide independent assurance, procurement, corporate planning and
            legal functions across the organisation.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {managementUnits.map((u) => (
              <Card key={u.slug} id={u.slug} className="scroll-mt-28 border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold text-primary">{u.name}</h2>
                  <p className="text-sm text-muted-foreground">{u.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
