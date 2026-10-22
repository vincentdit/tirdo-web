import { Suspense } from "react";
import Link from "next/link";
import { TirdoLoginForm } from "@/components/tirdo-auth/login-form";

export const metadata = {
  title: "Sign in | TIRDO Web Management Portal",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  const year = new Date().getFullYear();
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="h-1.5 bg-gradient-to-r from-[#0A192F] via-[#059669] to-[#D97706]" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <img
              src="/media/brand/logo.jpg"
              alt="TIRDO"
              className="mx-auto h-20 w-auto object-contain"
            />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[#17488e]">
              Tanzania Industrial Research and Development Organization
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#0A192F]">
              TIRDO Web Management &amp; Client Portal
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with your TIRDO administrator account to manage and publish website content.
            </p>
          </div>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-slate-100" />}>
            <TirdoLoginForm />
          </Suspense>
          <p className="mt-4 text-center text-sm">
            <Link href="/portal/forgot-password" className="font-medium text-[#059669] hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
      <footer className="border-t bg-white px-4 py-4 text-center text-xs text-slate-500">
        © {year} TIRDO – Tanzania Industrial Research and Development Organization ·{" "}
        <a href="mailto:info@tirdo.or.tz" className="text-[#059669] hover:underline">
          Support
        </a>
      </footer>
    </div>
  );
}
