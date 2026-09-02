import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { site, footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary-dark text-primary-foreground">
      <div className="container-tirdo grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Identity */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-white/10 font-bold">TI</div>
            <div className="text-lg font-extrabold">{site.name}</div>
          </div>
          <p className="text-sm text-white/70">{site.longName}</p>
          <p className="mt-2 text-xs text-white/50">{site.established}</p>
          <div className="mt-4 flex gap-3">
            <a href={site.social.facebook} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground"><Facebook className="h-4 w-4" /></a>
            <a href={site.social.twitter} aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground"><Twitter className="h-4 w-4" /></a>
            <a href={site.social.instagram} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground"><Instagram className="h-4 w-4" /></a>
            <a href={site.social.linkedin} aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground"><Linkedin className="h-4 w-4" /></a>
            <a href={site.social.youtube} aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/75">
            {footerLinks.quick.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-accent">{l.title}</Link></li>
            ))}
          </ul>
        </div>

        {/* Related links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Related Links</h3>
          <ul className="space-y-2 text-sm text-white/75">
            {footerLinks.related.map((l) => (
              <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent">{l.title}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Contact Us</h3>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{site.address}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{site.phone}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{site.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tirdo flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.longName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-accent">Sitemap</Link>
            <Link href="/disclaimer" className="hover:text-accent">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
