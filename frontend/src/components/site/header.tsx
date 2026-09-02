"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Menu, X, ChevronDown, Search, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { site, mainNav, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="hidden bg-primary-dark text-primary-foreground md:block">
        <div className="container-tirdo flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{site.phone}</span>
            <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{site.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/e-services#eoffice" className="hover:text-accent">Staff Email</Link>
            <Link href="/e-services" className="hover:text-accent">e-Services</Link>
            <span className="h-4 w-px bg-white/30" />
            <div className="flex items-center gap-2">
              <a href={site.social.facebook} aria-label="Facebook" className="hover:text-accent"><Facebook className="h-3.5 w-3.5" /></a>
              <a href={site.social.twitter} aria-label="Twitter" className="hover:text-accent"><Twitter className="h-3.5 w-3.5" /></a>
              <a href={site.social.instagram} aria-label="Instagram" className="hover:text-accent"><Instagram className="h-3.5 w-3.5" /></a>
              <a href={site.social.linkedin} aria-label="LinkedIn" className="hover:text-accent"><Linkedin className="h-3.5 w-3.5" /></a>
            </div>
            <span className="h-4 w-px bg-white/30" />
            <button className="font-semibold hover:text-accent">EN</button>
            <span className="text-white/40">|</span>
            <button className="hover:text-accent">SW</button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b bg-background/95 shadow-sm backdrop-blur">
        <div className="container-tirdo flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-primary font-bold text-primary-foreground">
              <span className="text-lg leading-none">TI</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight text-primary">{site.name}</div>
              <div className="hidden max-w-[22rem] text-[11px] text-muted-foreground sm:block">{site.longName}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpenMenu(null)}>
            {mainNav.map((item) => (
              <DesktopNavItem
                key={item.title}
                item={item}
                open={openMenu === item.title}
                onOpen={() => setOpenMenu(item.title)}
              />
            ))}
            <Link href="/search" aria-label="Search" className="ml-1 grid h-10 w-10 place-items-center rounded-md text-primary hover:bg-secondary">
              <Search className="h-5 w-5" />
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="grid h-10 w-10 place-items-center rounded-md text-primary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b bg-background lg:hidden">
          <nav className="container-tirdo flex flex-col py-3">
            {mainNav.map((item) => (
              <MobileNavItem key={item.title} item={item} onNavigate={() => setMobileOpen(false)} />
            ))}
            <Link href="/search" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-primary">
              <Search className="h-4 w-4" /> Search the site
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function DesktopNavItem({ item, open, onOpen }: { item: NavItem; open: boolean; onOpen: () => void }) {
  const hasMenu = !!(item.children || item.columns);
  return (
    <div className="relative" onMouseEnter={onOpen}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary",
          open && "text-primary"
        )}
      >
        {item.title}
        {hasMenu && <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />}
      </Link>

      {hasMenu && open && (
        <div className={cn(
          "absolute left-0 top-full z-50 animate-fade-in rounded-lg border bg-popover p-4 shadow-xl",
          item.columns ? "w-[640px]" : "w-64"
        )}>
          {item.children && (
            <ul className="space-y-1">
              {item.children.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {item.columns && (
            <div className="grid grid-cols-3 gap-4">
              {item.columns.map((col) => (
                <div key={col.heading}>
                  <div className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wide text-accent">{col.heading}</div>
                  <ul className="space-y-1">
                    {col.items.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const children = item.children ?? item.columns?.flatMap((c) => c.items);
  return (
    <div className="border-b border-border/60 last:border-0">
      <div className="flex items-center justify-between">
        <Link href={item.href} onClick={onNavigate} className="flex-1 py-3 text-sm font-semibold text-foreground/90">
          {item.title}
        </Link>
        {children && (
          <button onClick={() => setExpanded((v) => !v)} className="p-3" aria-label="Expand">
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        )}
      </div>
      {children && expanded && (
        <ul className="pb-2 pl-3">
          {children.map((c) => (
            <li key={c.href}>
              <Link href={c.href} onClick={onNavigate} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
