import { ArrowRight, ExternalLink } from "lucide-react";
import { Icon } from "@/components/site/icon";

// A prominent "gateway" card linking the public site to one of TIRDO's
// authenticated systems (NILIMS, CIAP, TeLTP). When the portal URL isn't
// configured it falls back to the on-site e-Services hub, so the call to
// action is never a dead link.
export function PortalGateway({
  name,
  acronym,
  tagline,
  href,
  icon = "Building2",
  features = [],
}: {
  name: string;
  acronym: string;
  tagline: string;
  href: string;
  icon?: string;
  features?: string[];
}) {
  const external = /^https?:\/\//i.test(href);
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-teal/30 bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-sm">
      <div className="grid gap-6 p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white">
              <Icon name={icon} className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{acronym}</div>
              <h3 className="text-xl font-bold">{name}</h3>
            </div>
          </div>
          <p className="mb-5 max-w-xl text-sm text-white/90">{tagline}</p>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:brightness-95"
          >
            {external ? <>Open {acronym} <ExternalLink className="h-4 w-4" /></> : <>Access via e-Services <ArrowRight className="h-4 w-4" /></>}
          </a>
        </div>
        {features.length > 0 && (
          <ul className="space-y-2 rounded-xl bg-white/10 p-5 text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" /> {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
