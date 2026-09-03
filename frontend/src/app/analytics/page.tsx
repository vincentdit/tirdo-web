import { PageBanner } from "@/components/site/page-banner";
import { ChartCard, KpiCard, StatTile, TrendArea, BarList, Donut } from "@/components/analytics/charts";
import { getDashboard } from "@/lib/matomo-api";

export const metadata = { title: "Analytics" };
// Render at request time so the runtime Matomo token is used (not build time).
export const dynamic = "force-dynamic";

const fmt = (n: number | null | undefined) => (typeof n === "number" ? n.toLocaleString("en-US") : "—");

export default async function AnalyticsPage() {
  const d = await getDashboard();
  const s = d.summary;

  return (
    <>
      <PageBanner
        title="Analytics"
        subtitle="How TIRDO's website is performing — visits, audience and content, powered by Matomo."
        crumbs={[{ label: "Analytics" }]}
      />
      <section className="py-14">
        <div className="container-tirdo space-y-8">
          {!d.configured ? (
            <div className="rounded-xl border bg-secondary/40 p-8 text-center">
              <h2 className="text-lg font-bold text-primary">Analytics dashboard</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Live visitor analytics will appear here once the site is connected to Matomo.
                The counter and reports below refresh automatically.
              </p>
            </div>
          ) : (
            <>
              {/* Headline visit statistics */}
              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-teal">Visit statistics</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatTile label="Today" value={fmt(d.today)} hint="Visits so far today" />
                  <StatTile label="This month" value={fmt(d.month)} hint="Visits this calendar month" />
                  <StatTile label="Total visits" value={fmt(d.total)} hint="All time" />
                </div>
              </div>

              {/* Secondary KPIs (last 30 days) */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Visits" value={fmt(s?.nb_visits)} hint="Last 30 days" />
                <KpiCard label="Unique visitors" value={fmt(s?.nb_uniq_visitors)} hint="Last 30 days" />
                <KpiCard label="Pageviews" value={fmt(s?.nb_actions)} hint="Last 30 days" />
                <KpiCard label="Bounce rate" value={s?.bounce_rate ?? "—"} hint="Last 30 days" />
              </div>

              {/* Trend */}
              <ChartCard title="Visits over time" subtitle="Daily visits, last 30 days">
                <TrendArea data={d.trend} />
              </ChartCard>

              {/* Breakdowns */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Top pages" subtitle="Most-viewed pages, last 30 days">
                  <BarList data={d.topPages} unit="views" />
                </ChartCard>
                <ChartCard title="Visitors by country" subtitle="Last 30 days">
                  <BarList data={d.countries} />
                </ChartCard>
                <ChartCard title="Devices" subtitle="Visits by device type, last 30 days">
                  <Donut data={d.devices} />
                </ChartCard>
                <ChartCard title="Traffic sources" subtitle="How visitors arrive, last 30 days">
                  <BarList data={d.referrers} />
                </ChartCard>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Figures refresh every few minutes. Full reports are available to staff in Matomo.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
