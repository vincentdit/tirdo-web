"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { pageEditTarget } from "@/lib/portal";

type Me = {
  firstname?: string;
  lastname?: string;
  email?: string;
  canManageSite?: boolean;
  collections?: { slug: string }[];
};

export function PageEditorBar() {
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setMe(j?.authenticated && j.email ? j : null))
      .catch(() => setMe(null));
  }, []);

  if (!me || pathname?.startsWith("/portal")) return null;

  const target = pageEditTarget(pathname || "/");
  const allowed = !target.collection || (me.collections ?? []).some((c) => c.slug === target.collection);
  const name = [me.firstname, me.lastname].filter(Boolean).join(" ") || me.email || "TIRDO staff";

  return (
    <div className="fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 flex-wrap items-center justify-between gap-2 rounded-full border border-white/20 bg-[#0A192F] px-4 py-2 text-xs text-white shadow-lg sm:text-sm">
      <span className="truncate text-white/80">Editing as {name}</span>
      <span className="flex flex-wrap items-center gap-2">
        {allowed ? (
          <Link href={target.href} className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-3 py-1.5 font-semibold hover:brightness-110">
            <Pencil className="h-3.5 w-3.5" /> Edit {target.label}
          </Link>
        ) : null}
        {me.canManageSite ? (
          <Link href="/portal/branding" className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20">
            Logo & photos
          </Link>
        ) : null}
        <Link href="/portal" className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20">
          Portal
        </Link>
      </span>
    </div>
  );
}
