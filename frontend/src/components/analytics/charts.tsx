// Server-rendered SVG charts for the analytics dashboard. Brand palette,
// single-hue where possible; native <title> tooltips; direct labels.
import type { ReactNode } from "react";

const TEAL = "#007e93";
const NAVY = "#17488e";
const GOLD = "#f2c500";
const SLATE = "#64748b";
// Fixed categorical order (identity, never cycled).
const CATEGORICAL = [TEAL, NAVY, GOLD, SLATE, "#0ea5b7", "#9333ea"];

const fmt = (n: number) => n.toLocaleString("en-US");

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-bold text-primary">{title}</h3>
      {subtitle && <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

// Highlighted headline stat (teal), for the Today / This month / Total group.
export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-brand-teal to-[#0a5f70] p-5 text-white shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/85">{label}</div>
      <div className="mt-2 text-[2.1rem] font-bold leading-none tabular-nums">{value}</div>
      {hint && <div className="mt-2 text-xs text-white/75">{hint}</div>}
    </div>
  );
}

export function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

// Area + line chart of visits over time.
export function TrendArea({ data }: { data: { date: string; visits: number }[] }) {
  if (data.length === 0) return <Empty />;
  const W = 720, H = 220, padL = 8, padR = 8, padT = 16, padB = 26;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = Math.max(1, ...data.map((d) => d.visits));
  const n = data.length;
  const x = (i: number) => padL + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => padT + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.visits).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${padT + ih} L${x(0).toFixed(1)},${padT + ih} Z`;
  const short = (s: string) => { const [, m, d] = s.split("-"); return `${d}/${m}`; };
  const ticks = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" role="img" aria-label="Visits over the last 30 days">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={padL} x2={W - padR} y1={padT + ih - g * ih} y2={padT + ih - g * ih} stroke="#e5eef1" strokeWidth={1} />
      ))}
      <defs>
        <linearGradient id="trendfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.28" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trendfill)" />
      <path d={line} fill="none" stroke={TEAL} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.visits)} r={2.5} fill={TEAL} />
          {/* wide invisible hit target for a native tooltip */}
          <rect x={x(i) - iw / n / 2} y={padT} width={Math.max(6, iw / n)} height={ih} fill="transparent">
            <title>{`${short(d.date)} · ${fmt(d.visits)} visits`}</title>
          </rect>
        </g>
      ))}
      <text x={padL} y={12} fontSize="10" fill={SLATE}>{fmt(max)}</text>
      {ticks.map((i) => (
        <text key={i} x={x(i)} y={H - 8} fontSize="10" fill={SLATE} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
          {short(data[i].date)}
        </text>
      ))}
    </svg>
  );
}

// Horizontal bar list (magnitude, single hue).
export function BarList({ data, unit = "visits" }: { data: { label: string; value: number }[]; unit?: string }) {
  if (data.length === 0) return <Empty />;
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-2.5">
      {data.map((d) => (
        <li key={d.label} title={`${d.label} · ${fmt(d.value)} ${unit}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="truncate text-sm text-brand-ink">{d.label}</span>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{fmt(d.value)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-brand-pale">
            <div className="h-full rounded" style={{ width: `${Math.max(3, (d.value / max) * 100)}%`, background: TEAL }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Donut for a small set of categories (identity, fixed hue order).
export function Donut({ data }: { data: { label: string; value: number }[] }) {
  if (data.length === 0) return <Empty />;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 60, C = 2 * Math.PI * R;
  let offset = 0;
  const segs = data.slice(0, 6).map((d, i) => {
    const frac = d.value / total;
    const seg = { color: CATEGORICAL[i], dash: frac * C, offset, ...d, pct: Math.round(frac * 100) };
    offset += frac * C;
    return seg;
  });
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0">
        <g transform="translate(80,80) rotate(-90)">
          <circle r={R} fill="none" stroke="#eef4f6" strokeWidth={20} />
          {segs.map((s) => (
            <circle key={s.label} r={R} fill="none" stroke={s.color} strokeWidth={20}
              strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={-s.offset}>
              <title>{`${s.label} · ${fmt(s.value)} (${s.pct}%)`}</title>
            </circle>
          ))}
        </g>
        <text x="80" y="76" textAnchor="middle" fontSize="20" fontWeight="700" fill={NAVY}>{fmt(total)}</text>
        <text x="80" y="94" textAnchor="middle" fontSize="9" fill={SLATE}>visits</text>
      </svg>
      <ul className="space-y-2 text-sm">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span className="text-brand-ink">{s.label}</span>
            <span className="text-xs text-muted-foreground">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty() {
  return <div className="grid h-40 place-items-center text-sm text-muted-foreground">No data yet</div>;
}
