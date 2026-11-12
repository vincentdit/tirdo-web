export function PassportIcon({
  name,
  src,
  size = "md",
}: {
  name?: string;
  src?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-10 w-10" : "h-14 w-14";
  const initial = String(name || "T").trim().slice(0, 1).toUpperCase();
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name || ""} className={`${dim} shrink-0 rounded-full border object-cover`} />
    );
  }
  return (
    <span className={`grid ${dim} shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary`}>
      {initial}
    </span>
  );
}
