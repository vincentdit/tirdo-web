"use client";

// Small reusable filter chip used by the projects, publications, vacancies and
// tenders explorers.
export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
        (active
          ? "border-brand-teal bg-brand-teal text-white"
          : "border-input bg-background text-muted-foreground hover:border-brand-teal hover:text-brand-teal")
      }
    >
      {children}
    </button>
  );
}
