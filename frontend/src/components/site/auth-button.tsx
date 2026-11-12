"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/site/auth-provider";
import { canOpenContentManagement, CONTENT_MANAGEMENT_LAUNCH } from "@/lib/e-service-access";
import { cn } from "@/lib/utils";

// Sign-in / account control. `onDark` styles it for the teal utility bar.
export function AuthButton({ className, onDark }: { className?: string; onDark?: boolean }) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  if (!auth.ready) {
    return <div className={cn("h-5 w-16 animate-pulse rounded bg-white/20", className)} />;
  }

  if (!auth.authenticated) {
    return (
      <button
        onClick={auth.login}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold",
          onDark ? "text-white hover:text-brand-gold" : "rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground hover:brightness-95",
          className
        )}
      >
        <LogIn className="h-3.5 w-3.5" /> Sign in
      </button>
    );
  }

  const label = auth.name || auth.username || "Account";
  const showStaff = auth.hasRole("staff") || auth.hasRole("content-editor") || auth.hasRole("tirdo-admin");
  const showCms = canOpenContentManagement(auth.roles);
  return (
    <div className={cn("relative", className)} onMouseLeave={() => setOpen(false)}>
      <div className="flex items-center">
        <Link
          href="/account"
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold",
            onDark ? "text-white hover:text-brand-gold" : "rounded-l-md border px-3 py-2 text-sm text-primary hover:bg-secondary"
          )}
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px]">
            {label.slice(0, 1).toUpperCase()}
          </span>
          <span className="max-w-[8rem] truncate">{label}</span>
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Account menu"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setOpen(true)}
          className={cn(
            "inline-flex items-center text-xs font-semibold",
            onDark ? "text-white hover:text-brand-gold" : "rounded-r-md border border-l-0 px-1.5 py-2 text-sm text-primary hover:bg-secondary"
          )}
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-full z-[60] w-56 rounded-lg border bg-popover p-2 text-left shadow-xl">
          <div className="border-b px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <User className="h-4 w-4" /> {label}
            </div>
            {auth.email && <div className="mt-0.5 truncate text-xs text-muted-foreground">{auth.email}</div>}
          </div>
          <Link href="/account" className="mt-1 block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
            My profile
          </Link>
          <Link href="/e-services" className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
            My e-Services
          </Link>
          {showStaff && (
            <Link href="/staff" className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
              Staff Portal
            </Link>
          )}
          {showCms && (
            <a href={CONTENT_MANAGEMENT_LAUNCH} className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary">
              Content management
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
