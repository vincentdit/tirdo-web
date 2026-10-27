"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  LayoutDashboard,
  ScrollText,
  Images,
  Settings,
  UserRound,
  Users,
  Palette,
} from "lucide-react";

type Collection = { slug: string; label: string; group: string };
type Me = {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  isSuperAdmin?: boolean;
  canViewAudit?: boolean;
  canManageMedia?: boolean;
  canManageUsers?: boolean;
  canManageSite?: boolean;
  departments?: { slug: string; title: string }[];
  collections?: Collection[];
};

const GROUPS: { id: string; label: string }[] = [
  { id: "content", label: "Content management" },
  { id: "services", label: "Opportunities" },
  { id: "directory", label: "Organisation" },
  { id: "inbox", label: "Inbox" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setMe(j?.authenticated === false ? null : j))
      .catch(() => setMe(null));
  }, []);

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.replace("/portal/login");
    router.refresh();
  }

  const name = [me?.firstname, me?.lastname].filter(Boolean).join(" ") || me?.email || "TIRDO staff";
  const collections = me?.collections ?? [];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0A192F] text-white md:flex">
        <Link href="/portal" className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <img src="/media/brand/logo.jpg" alt="TIRDO" className="h-10 w-10 rounded bg-white object-contain p-0.5" />
          <div>
            <div className="text-sm font-semibold leading-tight">TIRDO CMS</div>
            <div className="text-[11px] text-white/70">Web Management Portal</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-4 overflow-y-auto p-3 text-sm">
          <NavItem href="/portal" active={pathname === "/portal"} icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavItem>
          {GROUPS.map((group) => {
            const items = collections.filter((c) => c.group === group.id);
            if (!items.length) return null;
            return (
              <div key={group.id}>
                <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">{group.label}</div>
                {items.map((c) => (
                  <NavItem key={c.slug} href={`/portal/${c.slug}`} active={pathname === `/portal/${c.slug}` || pathname.startsWith(`/portal/${c.slug}/`)}>
                    {c.label}
                  </NavItem>
                ))}
              </div>
            );
          })}
          {(me?.canManageSite || me?.canManageMedia || me?.isSuperAdmin) && (
            <>
              <NavItem href="/portal/branding" active={pathname.startsWith("/portal/branding")} icon={<Palette className="h-4 w-4" />}>
                Logo & photos
              </NavItem>
              <NavItem href="/portal/gallery" active={pathname.startsWith("/portal/gallery")} icon={<Images className="h-4 w-4" />}>
                Gallery
              </NavItem>
            </>
          )}
          {me?.canManageUsers && (
            <NavItem href="/portal/users" active={pathname.startsWith("/portal/users")} icon={<Users className="h-4 w-4" />}>
              Users & access
            </NavItem>
          )}
          {me?.canViewAudit && (
            <NavItem href="/portal/audit" active={pathname.startsWith("/portal/audit")} icon={<ScrollText className="h-4 w-4" />}>
              Audit trail
            </NavItem>
          )}
          <NavItem href="/portal/settings" active={pathname.startsWith("/portal/settings")} icon={<Settings className="h-4 w-4" />}>
            Settings
          </NavItem>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:px-6">
          <Link href="/portal" className="flex items-center gap-2 md:hidden">
            <img src="/media/brand/logo.jpg" alt="" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-[#0A192F]">TIRDO Portal</span>
          </Link>
          <div className="hidden text-sm text-slate-500 md:block">TIRDO Website Content Management</div>
          <AccountMenu me={me} name={name} onLogout={logout} />
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
        <footer className="border-t bg-white px-4 py-3 text-center text-xs text-slate-500">
          © {year} TIRDO – Tanzania Industrial Research and Development Organization
        </footer>
      </div>
    </div>
  );
}

function initials(name: string, email?: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  return (email || "T").slice(0, 2).toUpperCase();
}

function AccountMenu({ me, name, onLogout }: { me: Me | null; name: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={wrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex max-w-[16rem] items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0A192F] text-xs font-semibold text-white">
          {initials(name, me?.email)}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-medium text-[#0A192F]">{name}</span>
          <span className="block truncate text-xs text-slate-500">{me?.email || "Account"}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-lg border bg-white py-1 shadow-lg">
          <div className="border-b px-3 py-2">
            <div className="truncate text-sm font-semibold text-[#0A192F]">{name}</div>
            <div className="truncate text-xs text-slate-500">{me?.email}</div>
            {me?.roles?.[0] && <div className="mt-1 text-xs text-slate-500">{me.roles.join(" · ")}</div>}
            {me?.departments?.[0] && (
              <div className="truncate text-xs text-slate-500">{me.departments.map((d) => d.title).join(" · ")}</div>
            )}
          </div>
          <Link href="/portal/profile" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
            <UserRound className="h-4 w-4" /> Profile
          </Link>
          <Link href="/portal/profile#password" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
            <KeyRound className="h-4 w-4" /> Change password
          </Link>
          <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-800 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function NavItem({
  href,
  active,
  children,
  icon,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 ${
        active ? "bg-[#059669] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
