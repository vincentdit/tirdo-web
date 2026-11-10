"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { iamNav } from "@/lib/iam";
import { PortalShell } from "@/components/tirdo-auth/portal-shell";

export function IamShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <PortalShell>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Administration</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-[#0A192F]">{title}</h1>
      {description && <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>}
      <nav className="mt-4 flex flex-wrap gap-2">
        {iamNav().map((item) => {
          const active = pathname === item.href || (item.href !== "/portal/iam" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                active ? "border-[#059669] bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">{children}</div>
    </PortalShell>
  );
}

export function IamNotice({ error, notice }: { error?: string; notice?: string }) {
  return (
    <>
      {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {notice && <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p>}
    </>
  );
}
