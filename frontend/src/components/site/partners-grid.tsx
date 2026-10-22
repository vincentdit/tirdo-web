import type { PartnerItem } from "@/lib/content";
import { safeWebsiteUrl } from "@/lib/content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function LogoWell({
  name,
  logo,
  compact,
}: {
  name: string;
  logo?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#eef4f6] to-white ring-1 ring-[#d5e0e3] ${
        compact ? "h-[5.25rem] w-full px-3" : "h-[5.5rem] w-[6.75rem] shrink-0 px-2"
      }`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          className={`w-auto object-contain ${compact ? "max-h-11 max-w-[8rem]" : "max-h-12 max-w-[5.75rem]"}`}
        />
      ) : (
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-teal/10 text-sm font-bold text-brand-teal">
          {initials(name)}
        </span>
      )}
    </div>
  );
}

export function PartnersGrid({
  items,
  compact = false,
}: {
  items: PartnerItem[];
  compact?: boolean;
}) {
  if (!items.length) return null;

  return (
    <div className={`grid ${compact ? "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 gap-4 sm:grid-cols-2"}`}>
      {items.map((item) => {
        const href = safeWebsiteUrl(item.website);
        const body = compact ? (
          <>
            <LogoWell name={item.name} logo={item.logo} compact />
            <p className="mt-2 text-center text-xs font-semibold leading-snug text-brand-ink">{item.name}</p>
          </>
        ) : (
          <div className="flex items-start gap-4">
            <LogoWell name={item.name} logo={item.logo} />
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-wide text-brand-teal">{item.category}</p>
              <h3 className="mt-1 font-display text-lg leading-snug text-brand-ink">{item.name}</h3>
              {item.description ? (
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
              ) : null}
              {href ? <span className="mt-2 inline-block text-xs font-semibold text-brand-teal">Visit website</span> : null}
            </div>
          </div>
        );
        const className = compact
          ? "rounded-2xl p-3 transition hover:-translate-y-0.5 hover:bg-brand-pale/60"
          : "rounded-2xl border border-[#dce5e7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal/35 hover:shadow-md";
        if (href) {
          return (
            <a
              key={item.slug}
              id={item.slug}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {body}
            </a>
          );
        }
        return (
          <div key={item.slug} id={item.slug} className={className}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
