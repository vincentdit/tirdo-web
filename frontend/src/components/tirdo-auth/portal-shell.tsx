"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Images,
  Settings,
  Users,
  ExternalLink,
} from "lucide-react";

type Collection = { slug: string; label: string; group: string };
type Me = {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  isSuperAdmin?: boolean;
  canManageMedia?: boolean;
  canManageUsers?: boolean;
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
      .then(setMe)
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
          {(me?.canManageMedia || me?.isSuperAdmin) && (
            <NavItem href="/portal/gallery" active={pathname.startsWith("/portal/gallery")} icon={<Images className="h-4 w-4" />}>
              Gallery
            </NavItem>
          )}
          {me?.canManageUsers && (
            <NavItem href="/portal/users" active={pathname.startsWith("/portal/users")} icon={<Users className="h-4 w-4" />}>
              Users & access
            </NavItem>
          )}
          <NavItem href="/portal/settings" active={pathname.startsWith("/portal/settings")} icon={<Settings className="h-4 w-4" />}>
            Settings
          </NavItem>
          <a
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> Advanced Strapi
          </a>
        </nav>
        <div className="border-t border-white/10 p-3 text-xs text-white/70">
          <div className="truncate font-medium text-white">{name}</div>
          <div className="truncate">{me?.email}</div>
          {me?.departments?.[0] && <div className="mt-1 truncate text-white/55">{me.departments.map((d) => d.title).join(" · ")}</div>}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:px-6">
          <Link href="/portal" className="flex items-center gap-2 md:hidden">
            <img src="/media/brand/logo.jpg" alt="" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-[#0A192F]">TIRDO Portal</span>
          </Link>
          <div className="hidden text-sm text-slate-500 md:block">TIRDO Website Content Management</div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
        <footer className="border-t bg-white px-4 py-3 text-center text-xs text-slate-500">
          © {year} TIRDO – Tanzania Industrial Research and Development Organization
        </footer>
      </div>
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
