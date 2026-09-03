import { PageBanner } from "@/components/site/page-banner";
import { UnitsGrid } from "@/components/site/units-grid";
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
        <div className="container-tirdo">
          <p className="mx-auto max-w-3xl text-center text-foreground/80">
            Alongside its five departments, TIRDO&apos;s Director General is supported by
            units that provide independent assurance, procurement, corporate planning and
            legal functions across the organisation.
          </p>
          <div className="mt-12">
            <UnitsGrid units={managementUnits} />
          </div>
        </div>
      </section>
    </>
  );
}
