import { User } from "lucide-react";
import type { ManagementUnit } from "@/lib/content";

// Portrait grid for the supporting units — head photo when available,
// person placeholder otherwise; unit name + description below.
export function UnitsGrid({ units }: { units: ManagementUnit[] }) {
  return (
    <div className="grid justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {units.map((u) => (
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
          <div className={u.head ? "text-[11px] font-semibold uppercase tracking-wide text-brand-teal" : "mt-3 text-sm font-bold text-primary"}>
            {u.name}
          </div>
          <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">{u.desc}</p>
        </div>
      ))}
    </div>
  );
}
