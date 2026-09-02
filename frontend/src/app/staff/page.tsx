"use client";

import { FileText, Inbox, Settings, BarChart3, FolderKanban, ExternalLink } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { RequireAuth } from "@/components/site/require-auth";
import { useAuth } from "@/components/site/auth-provider";

export default function StaffPage() {
  return (
    <>
      <PageBanner title="Staff Portal" subtitle="Internal tools and systems for TIRDO staff." crumbs={[{ label: "Staff" }]} />
      <section className="py-14">
        <div className="container-tirdo">
          <RequireAuth role="staff" areaLabel="the Staff Portal">
            <StaffDashboard />
          </RequireAuth>
        </div>
      </section>
    </>
  );
}

function StaffDashboard() {
  const auth = useAuth();
  const cmsUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + "/admin";
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL || "http://localhost:8095/";
  const isEditor = auth.hasRole("content-editor") || auth.hasRole("tirdo-admin");
  const isAdmin = auth.hasRole("tirdo-admin");

  const tiles = [
    { icon: FileText, title: "Service Requests", desc: "Review and action incoming client requests.", href: "#", show: true },
    { icon: Inbox, title: "Contact Messages", desc: "Messages submitted via the website.", href: `${cmsUrl}/content-manager/collection-types/api::contact-message.contact-message`, external: true, show: isEditor },
    { icon: FolderKanban, title: "Content Management", desc: "Manage news, publications, projects and pages.", href: cmsUrl, external: true, show: isEditor, badge: "Editor" },
    { icon: BarChart3, title: "Web Analytics", desc: "Matomo traffic and engagement reports.", href: matomoUrl, external: true, show: true },
    { icon: Settings, title: "Identity & Access", desc: "Manage users and roles (Keycloak).", href: (process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/auth") + "/admin", external: true, show: isAdmin, badge: "Admin" },
  ].filter((t) => t.show);

  return (
    <div>
      <div className="mb-6 rounded-xl border bg-secondary/40 p-5">
        <div className="text-sm text-muted-foreground">Signed in as</div>
        <div className="font-semibold text-primary">{auth.name || auth.username} · <span className="font-normal text-muted-foreground">{auth.email}</span></div>
        <div className="mt-2 flex flex-wrap gap-1">
          {auth.roles
            .filter((r) => !r.startsWith("default-") && !["offline_access", "uma_authorization"].includes(r))
            .map((r) => (
              <span key={r} className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r}</span>
            ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <a
            key={t.title}
            href={t.href}
            target={t.external ? "_blank" : undefined}
            rel={t.external ? "noreferrer" : undefined}
            className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <t.icon className="h-6 w-6" />
            </span>
            <div className="flex items-center gap-2 font-semibold text-primary">
              {t.title}
              {t.badge && <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{t.badge}</span>}
              {t.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
