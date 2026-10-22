import { Download, FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Publication } from "@/lib/content";

export function fileKind(url?: string): "pdf" | "image" | "file" | null {
  if (!url) return null;
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(path)) return "image";
  return "file";
}

export function PublicationPreview({
  publication: p,
  compact = false,
}: {
  publication: Publication;
  compact?: boolean;
}) {
  const kind = fileKind(p.fileUrl);
  const message =
    p.abstract ||
    `This is a TIRDO ${p.type.toLowerCase()} (${p.year}). Review the document below, then download a copy if you need one.`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{p.type}</Badge>
        <span className="text-sm text-muted-foreground">{p.year}</span>
        {p.doi ? (
          <a href={`https://doi.org/${p.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")}`} className="text-sm text-brand-teal hover:underline" target="_blank" rel="noopener noreferrer">
            DOI: {p.doi}
          </a>
        ) : null}
      </div>
      {p.authors ? <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">Authors. </span>{p.authors}</p> : null}
      {p.keywords?.length ? (
        <p className="flex flex-wrap gap-1.5">
          {p.keywords.map((k) => (
            <span key={k} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{k}</span>
          ))}
        </p>
      ) : null}
      <p className="text-sm leading-relaxed text-foreground/80">{message}</p>
      {p.citation ? <p className="rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">{p.citation}</p> : null}

      {kind === "pdf" && p.fileUrl ? (
        <div className="overflow-hidden rounded-xl border bg-white">
          <iframe
            title={`Preview of ${p.title}`}
            src={`${p.fileUrl}#toolbar=0`}
            className="w-full border-0"
            style={{ height: compact ? 420 : 720 }}
          />
        </div>
      ) : null}

      {kind === "image" && p.fileUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.fileUrl} alt={p.title} className="max-h-[70vh] w-full rounded-xl border object-contain bg-white" />
      ) : null}

      {!kind ? (
        <div className="rounded-xl border border-dashed bg-secondary/40 p-6 text-sm text-muted-foreground">
          <FileText className="mb-2 h-6 w-6 text-brand-teal" />
          <p>A downloadable file has not been attached yet. Contact the Industrial Information Centre for a copy.</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {p.fileUrl ? (
          <a href={p.fileUrl} download className={cn(buttonVariants())}>
            <Download className="h-4 w-4" /> Download
          </a>
        ) : (
          <ButtonLink href="/contact" variant="outline">
            <Mail className="h-4 w-4" /> Request a copy
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
