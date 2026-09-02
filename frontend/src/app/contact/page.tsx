import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { ContactForm } from "@/components/site/contact-form";
import { site } from "@/lib/site";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" subtitle="Get in touch with TIRDO for research, testing, consultancy and partnerships." crumbs={[{ label: "Contact" }]} />
      <section className="py-14">
        <div className="container-tirdo grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-xl font-bold text-primary">Reach us</h2>
            <ul className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: site.address },
                { icon: Phone, label: "Phone", value: site.phone },
                { icon: Mail, label: "Email", value: site.email },
                { icon: Clock, label: "Working Hours", value: "Mon – Fri, 08:00 – 16:30 (EAT)" },
              ].map((c) => (
                <li key={c.label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-primary">{c.label}</div>
                    <div className="text-sm text-muted-foreground">{c.value}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl border">
              <iframe
                title="TIRDO location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=TIRDO+Dar+es+Salaam&output=embed"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-primary">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
