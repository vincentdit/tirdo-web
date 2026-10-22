"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/portal/users", label: "Users & access", exact: true },
  { href: "/portal/users/new", label: "Create CMS user" },
  { href: "/portal/users/access", label: "Edit access" },
];

export function UsersTabs() {
  const pathname = usePathname();
  return (
    <nav className="mt-4 flex flex-wrap gap-1 border-b border-slate-200" aria-label="User management">
      {TABS.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              active ? "border-[#059669] text-[#0A192F]" : "border-transparent text-slate-500 hover:text-[#0A192F]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function UsersHeading({ description }: { description: string }) {
  return (
    <>
      <h1 className="font-serif text-2xl font-bold text-[#0A192F]">Users & access</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <UsersTabs />
    </>
  );
}
