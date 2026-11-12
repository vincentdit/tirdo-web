"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/site/auth-provider";
import { loginHref } from "@/lib/keycloak";
import { cn } from "@/lib/utils";

export function AuthButton({ className, onDark }: { className?: string; onDark?: boolean }) {
  const auth = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!auth.ready) {
    return <div className={cn("h-5 w-16 animate-pulse rounded bg-white/20", className)} />;
  }

  if (!auth.authenticated) {
    return (
      <a
        href={loginHref(pathname || "/")}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold",
          onDark ? "text-white hover:text-brand-gold" : "rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground hover:brightness-95",
          className
        )}
      >
        <LogIn className="h-3.5 w-3.5" /> Sign in
      </a>
    );
  }

  const label = auth.name || auth.username || "Account";
  const showStaff = auth.hasRole("staff") || auth.hasRole("content-editor") || auth.hasRole("tirdo-admin");
  return (
    <div className={cn("relative", className)} ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold",
          onDark ? "text-white hover:text-brand-gold" : "rounded-md border px-3 py-2 text-sm text-primary hover:bg-secondary"
        )}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px]">
          {label.slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[8rem] truncate">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[80] mt-1 w-56 rounded-lg border bg-popover p-2 text-left shadow-xl"
        >
          <div className="border-b px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <User className="h-4 w-4" /> {label}
            </div>
            {auth.email && <div className="mt-0.5 truncate text-xs text-muted-foreground">{auth.email}</div>}
          </div>
          <a href="/account" className="mt-1 block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
            My profile
          </a>
          <a href="/e-services" className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
            My e-Services
          </a>
          {showStaff && (
            <a href="/staff" className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
              Staff portal
            </a>
          )}
          <button
            type="button"
            onClick={auth.logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
