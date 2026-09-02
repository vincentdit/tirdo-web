"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { site, mainNav, portal, assets, type NavItem } from "@/lib/site";
import { AuthButton } from "@/components/site/auth-button";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header>
      {/* Utility bar */}
      <div className="bg-brand-teal text-white">
        <div className="container-tirdo flex min-h-[38px] items-center justify-between gap-3 text-[0.78rem]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a href={site.social.facebook} aria-label="Facebook" target="_blank" rel="noreferrer" className="hover:text-brand-gold"><Facebook className="h-4 w-4" /></a>
              <a href={site.social.twitter} aria-label="Twitter" target="_blank" rel="noreferrer" className="hover:text-brand-gold"><Twitter className="h-4 w-4" /></a>
              <a href={site.social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer" className="hover:text-brand-gold"><Instagram className="h-4 w-4" /></a>
              <a href={site.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer" className="hidden hover:text-brand-gold sm:inline"><Linkedin className="h-4 w-4" /></a>
              <a href={site.social.youtube} aria-label="YouTube" target="_blank" rel="noreferrer" className="hidden hover:text-brand-gold sm:inline"><Youtube className="h-4 w-4" /></a>
            </div>
            <span className="hidden h-3 w-px bg-white/40 md:inline-block" />
            <span className="hidden md:block">United Republic of Tanzania</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="mailto:help@tirdo.or.tz" className="hidden px-1 hover:text-brand-gold md:inline">help@tirdo.or.tz</a>
            <span className="hidden h-3 w-px bg-white/40 md:inline-block" />
            <a href="https://eoffice.gov.go.tz/users/login" target="_blank" rel="noreferrer" className="hidden px-1 hover:text-brand-gold sm:inline">e-Office</a>
            <span className="hidden h-3 w-px bg-white/40 sm:inline-block" />
            <a href="https://mail.tirdo.or.tz" target="_blank" rel="noreferrer" className="hidden px-1 hover:text-brand-gold sm:inline">Staff Mail</a>
            <span className="hidden h-3 w-px bg-white/40 sm:inline-block" />
            <button className="hidden px-1 hover:text-brand-gold sm:inline">Kiswahili</button>
            <span className="ml-1 rounded-sm border border-white/60 px-1 py-0.5 text-[0.7rem]">EN</span>
            <span className="mx-1 hidden h-3 w-px bg-white/40 sm:inline-block" />
            <AuthButton onDark />
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-white">
        <div className="container-tirdo flex h-[108px] items-center justify-between gap-4 md:h-[132px]">
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assets.emblem} alt="Tanzania emblem" className="h-14 w-14 object-contain md:h-[88px] md:w-[88px]" />
          </Link>
          <div className="text-center leading-tight">
            <p className="text-[0.55rem] tracking-[0.18em] text-brand-muted md:text-[0.67rem]">
              THE UNITED REPUBLIC OF TANZANIA
            </p>
            <h1 className="my-1 text-sm font-bold uppercase leading-tight tracking-wide text-brand-blue md:text-[1.7rem]">
              Tanzania Industrial Research and<br className="hidden md:block" /> Development Organization
            </h1>
            <span className="text-[0.62rem] font-semibold italic text-brand-ink md:text-sm">{site.tagline}</span>
          </div>
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assets.logo} alt="TIRDO logo" className="h-14 w-14 object-contain md:h-[78px] md:w-[78px]" />
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-brand-teal shadow-[0_4px_12px_rgba(0,43,58,0.18)]">
        <div className="container-tirdo flex h-[62px] items-center gap-2" onMouseLeave={() => setOpenMenu(null)}>
          {/* mobile brand */}
          <Link href="/" className="font-bold text-white lg:hidden">TIRDO</Link>

          {/* desktop nav */}
          <div className="hidden h-full flex-1 items-stretch lg:flex">
            {mainNav.map((item) => (
              <DesktopNavItem
                key={item.title}
                item={item}
                open={openMenu === item.title}
                onOpen={() => setOpenMenu(item.title)}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/search" aria-label="Search" className="hidden h-9 w-9 place-items-center text-white hover:text-brand-gold lg:grid">
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href={portal.href}
              className="hidden items-center gap-2 bg-brand-gold px-3 py-2.5 text-[0.84rem] font-bold text-brand-ink hover:brightness-95 sm:inline-flex"
            >
              {portal.title} <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              className="grid h-9 w-9 place-items-center text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-brand-teal lg:hidden">
            <nav className="container-tirdo flex flex-col py-2">
              {mainNav.map((item) => (
                <MobileNavItem key={item.title} item={item} onNavigate={() => setMobileOpen(false)} />
              ))}
              <Link href={portal.href} onClick={() => setMobileOpen(false)} className="mt-2 inline-flex items-center gap-2 bg-brand-gold px-3 py-2 text-sm font-bold text-brand-ink">
                {portal.title} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center gap-2 py-2 text-sm font-medium text-white">
                <Search className="h-4 w-4" /> Search
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}

function DesktopNavItem({ item, open, onOpen }: { item: NavItem; open: boolean; onOpen: () => void }) {
  const hasMenu = !!(item.children || item.columns);
  return (
    <div className="relative flex items-stretch" onMouseEnter={onOpen}>
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-1 whitespace-nowrap px-3.5 text-[0.9rem] text-white transition-colors hover:bg-brand-teal-dark",
          open && "bg-brand-teal-dark"
        )}
      >
        {item.title}
        {hasMenu && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />}
        {open && <span className="absolute inset-x-3 bottom-0 h-[3px] bg-brand-gold" />}
      </Link>

      {hasMenu && open && (
        <div className={cn(
          "absolute left-0 top-full z-50 rounded-b-lg border-t-2 border-brand-gold bg-white p-4 text-brand-ink shadow-xl",
          item.columns ? (item.columns.length >= 5 ? "w-[900px]" : item.columns.length === 4 ? "w-[780px]" : "w-[620px]") : "w-64"
        )}>
          {item.children && (
            <ul className="space-y-1">
              {item.children.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="block rounded px-3 py-2 text-sm text-brand-ink/80 hover:bg-brand-pale hover:text-brand-teal">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {item.columns && (
            <div className={cn("grid gap-4", item.columns.length >= 5 ? "grid-cols-5" : item.columns.length === 4 ? "grid-cols-4" : "grid-cols-3")}>
              {item.columns.map((col) => (
                <div key={col.heading}>
                  <div className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wide text-brand-teal">{col.heading}</div>
                  <ul className="space-y-1">
                    {col.items.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded px-2 py-1.5 text-sm text-brand-ink/80 hover:bg-brand-pale hover:text-brand-teal">
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
    <div className="border-b border-white/10 last:border-0">
      <div className="flex items-center justify-between">
        <Link href={item.href} onClick={onNavigate} className="flex-1 py-3 text-sm font-semibold text-white">
          {item.title}
        </Link>
        {children && (
          <button onClick={() => setExpanded((v) => !v)} className="p-3 text-white" aria-label="Expand">
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        )}
      </div>
      {children && expanded && (
        <ul className="pb-2 pl-3">
          {children.map((c) => (
            <li key={c.href}>
              <Link href={c.href} onClick={onNavigate} className="block py-2 text-sm text-white/80 hover:text-brand-gold">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
