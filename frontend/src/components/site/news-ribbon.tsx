import Link from "next/link";
import type { NewsItem } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function NewsRibbon({ items }: { items: NewsItem[] }) {
  if (!items.length) return null;
  const loop = items.length > 1 ? [...items, ...items] : items;
  const duration = Math.max(18, items.length * 9);

  return (
    <div className="border-b border-red-700/20 bg-white" role="region" aria-label="Latest news">
      <div className="flex min-h-[48px] items-stretch">
        <span className="z-10 inline-flex shrink-0 items-center bg-[#c8102e] px-4 text-[0.78rem] font-black uppercase tracking-[0.14em] text-white">
          News
        </span>
        <div className="min-w-0 flex-1 overflow-hidden bg-[#fff5f5]">
          <div
            className="event-ticker-track flex w-max items-center py-2 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:animate-none"
            style={{ animationDuration: `${duration}s` }}
          >
            {loop.map((item, index) => (
              <Link
                key={`${item.slug}-${index}`}
                href={`/news/${item.slug}`}
                className="inline-flex items-center gap-3 px-8 text-sm text-brand-ink hover:text-[#c8102e]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8102e]" aria-hidden />
                <strong className="whitespace-nowrap">{item.title}</strong>
                <span className="whitespace-nowrap text-brand-muted">{formatDate(item.date)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex rounded bg-[#c8102e] px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-wide text-white shadow-sm ${className}`}
    >
      News
    </span>
  );
}
