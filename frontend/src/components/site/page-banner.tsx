import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function PageBanner({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="container-tirdo relative py-16 sm:py-20 md:py-24">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-white/90">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-gold">
            <Home className="h-4 w-4" /> Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {c.href ? <Link href={c.href} className="hover:text-brand-gold">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="max-w-5xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-3xl text-base text-white/90 sm:text-lg md:text-xl">{subtitle}</p>}
      </div>
    </section>
  );
}
