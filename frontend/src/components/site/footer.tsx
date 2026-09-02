import Link from "next/link";
import { site, assets } from "@/lib/site";

const columns = [
  {
    heading: "Explore TIRDO",
    links: [
      { title: "About us", href: "/about" },
      { title: "Our departments", href: "/departments" },
      { title: "Research products", href: "/projects" },
      { title: "Publications", href: "/publications" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { title: "Industrial services", href: "/services" },
      { title: "T-Hub", href: "/t-hub" },
      { title: "Career opportunities", href: "/careers" },
      { title: "Tenders", href: "/tenders" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-[#d3e0e9]">
      <div className="container-tirdo grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.35fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logo} alt="TIRDO" className="w-[76px] bg-white p-1.5" />
          <p className="mt-4 max-w-[280px] text-sm leading-7">
            Building a sustainable industrial future through research, technology and innovation.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-wider text-brand-gold">{col.heading}</h4>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className="my-2 block text-sm hover:text-brand-gold">
                {l.title}
              </Link>
            ))}
          </div>
        ))}

        <div>
          <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-wider text-brand-gold">Contact us</h4>
          <p className="text-sm leading-7">
            Kimweri Avenue, Msasani<br />
            P.O. Box 23235<br />
            Dar es Salaam, Tanzania
          </p>
          <a href={`mailto:${site.email}`} className="my-2 block text-sm hover:text-brand-gold">{site.email}</a>
          <a href="tel:+255222666034" className="block text-sm hover:text-brand-gold">+255 22 266 6034</a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tirdo flex flex-col justify-between gap-2 py-5 text-xs text-[#a7bdcd] sm:flex-row">
          <p>© {new Date().getFullYear()} {site.longName}</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-gold">Privacy policy</Link>
            <Link href="/sitemap" className="hover:text-brand-gold">Sitemap</Link>
            <Link href="/disclaimer" className="hover:text-brand-gold">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
