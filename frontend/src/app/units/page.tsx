import { User } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
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

          <div className="mt-12 grid justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {managementUnits.map((u) => (
              <div key={u.slug} id={u.slug} className="scroll-mt-28 flex flex-col items-center text-center">
                <div className="h-44 w-40 overflow-hidden rounded-lg border border-black/5 shadow-sm">
                  {u.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.photo} alt={u.head ?? u.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-b from-brand-pale to-secondary/70 text-brand-teal/40">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {u.head && <div className="mt-3 text-sm font-bold leading-snug text-brand-ink">{u.head}</div>}
                <div className={`${u.head ? "text-[11px] font-semibold uppercase tracking-wide text-brand-teal" : "mt-3 text-sm font-bold text-primary"}`}>
                  {u.name}
                </div>
                <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
