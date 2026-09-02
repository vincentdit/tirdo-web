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
      <div className="container-tirdo relative py-12">
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-white/70">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-accent">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? <Link href={c.href} className="hover:text-accent">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
