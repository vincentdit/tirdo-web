import { FileText, Download } from "lucide-react";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { getPublications } from "@/lib/strapi";

export const metadata = { title: "Publications & Downloads" };

export default async function PublicationsPage() {
  const pubs = await getPublications();
  return (
    <>
      <PageBanner title="Publications & Downloads" subtitle="Reports, journals, policy briefs and guidelines from TIRDO's research." crumbs={[{ label: "Publications" }]} />
      <section className="py-14">
        <div className="container-tirdo">
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-primary">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Year</th>
                  <th className="px-5 py-3 text-right font-semibold">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pubs.map((p) => (
                  <tr key={p.slug} className="hover:bg-secondary/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-medium text-primary">
                        <FileText className="h-4 w-4 text-accent" /> {p.title}
                      </div>
                    </td>
                    <td className="px-5 py-4"><Badge variant="secondary">{p.type}</Badge></td>
                    <td className="px-5 py-4 text-muted-foreground">{p.year}</td>
                    <td className="px-5 py-4 text-right">
                      <a href={p.fileUrl ?? "#"} className="inline-flex items-center gap-1 text-accent hover:underline">
                        <Download className="h-4 w-4" /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
