import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  center,
  className,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", center && "text-center", className)}>
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
      <div className={cn("mt-3 h-1 w-16 rounded bg-accent", center && "mx-auto")} />
    </div>
  );
}
