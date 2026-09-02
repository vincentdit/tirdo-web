import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { NewsItem, Project } from "@/lib/content";

export function NewsCard({ item }: { item: NewsItem }) {
  const href = item.sourceUrl || `/news/${item.slug}`;
  const external = !!item.sourceUrl;
  const linkProps = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-primary/10">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary/15 to-accent/15 text-primary/40">
            <span className="text-4xl font-black">TIRDO</span>
          </div>
        )}
        <Badge variant="accent" className="absolute left-3 top-3">{item.category}</Badge>
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(item.date)}
        </div>
        <h3 className="mb-2 line-clamp-2 font-semibold leading-snug text-primary group-hover:underline">
          <Link href={href} {...linkProps}>{item.title}</Link>
        </h3>
        <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">{item.excerpt}</p>
        <Link href={href} {...linkProps} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2">
          Read more <ArrowRight className="h-4 w-4 transition-all" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function ProjectCard({ item }: { item: Project }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] bg-primary/10">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary/20 to-primary-dark/20 text-primary/40">
            <span className="text-3xl font-black">{item.department.split(" ")[0]}</span>
          </div>
        )}
        <Badge variant={item.status === "Ongoing" ? "default" : "accent"} className="absolute right-3 top-3">
          {item.status}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">{item.department}</div>
        <h3 className="mb-2 font-semibold text-primary">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.summary}</p>
      </CardContent>
    </Card>
  );
}
