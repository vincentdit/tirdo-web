import Link from "next/link";
import { useTranslations } from "next-intl";
import { site, assets } from "@/lib/site";
import { VisitorCounter } from "@/components/site/visitor-counter";

// Footer link columns: hrefs are fixed; labels come from the "footer" message
// catalogue so they translate with the active locale.
const columns = [
  {
    heading: "exploreHeading",
    links: [
      { key: "explore.about", href: "/about" },
      { key: "explore.departments", href: "/departments" },
      { key: "explore.products", href: "/projects" },
      { key: "explore.documents", href: "/documents" },
    ],
  },
  {
    heading: "quickHeading",
    links: [
      { key: "quick.services", href: "/services" },
      { key: "quick.tHub", href: "/t-hub" },
      { key: "quick.careers", href: "/careers" },
      { key: "quick.tenders", href: "/tenders" },
    ],
  },
];

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-brand-navy text-[#d3e0e9]">
      <div className="container-tirdo grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.2fr_1.15fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" decoding="async" src={assets.logo} alt="TIRDO" className="w-[76px] bg-white p-1.5" />
          <p className="mt-4 max-w-[280px] text-sm leading-7">
            {t("blurb")}
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-wider text-brand-gold">{t(col.heading)}</h4>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className="my-2 block text-sm hover:text-brand-gold">
                {t(l.key)}
              </Link>
            ))}
          </div>
        ))}

        <div>
          <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-wider text-brand-gold">{t("contactHeading")}</h4>
          <p className="text-sm leading-7">
            Kimweri Avenue, Msasani<br />
            P.O. Box 23235<br />
            Dar es Salaam, Tanzania
          </p>
          <a href={`mailto:${site.email}`} className="my-2 block text-sm hover:text-brand-gold">{site.email}</a>
          <a href="tel:+255222666034" className="block text-sm hover:text-brand-gold">+255 22 266 6034</a>
        </div>

        <div>
          <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-wider text-brand-gold">{t("visitorsHeading")}</h4>
          <VisitorCounter />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tirdo flex flex-col justify-between gap-2 py-5 text-xs text-[#a7bdcd] sm:flex-row">
          <p>© {new Date().getFullYear()} {site.longName}</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-gold">{t("privacy")}</Link>
            <Link href="/sitemap" className="hover:text-brand-gold">{t("sitemap")}</Link>
            <Link href="/disclaimer" className="hover:text-brand-gold">{t("accessibility")}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
