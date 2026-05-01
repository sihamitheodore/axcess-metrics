import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import Shell from "@/components/Shell";
import { artists, plans } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <Shell active="Dashboard">
      <div className="mb-6 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-900">
        Demo mode — your work won’t be saved after this session.
      </div>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Dashboard</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">Command center</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">
            Professional music analytics workspace for artist demand, routing, venue fit, and reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/artist-profile">Create Artist Profile</Button>
          <Button href="/market-insights" variant="outline">Start New Tour Plan</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Saved artists" value="12" detail="mock workspace" />
        <MetricCard label="Tour plans" value="7" detail="3 recently edited" />
        <MetricCard label="Priority markets" value="16" detail="high opportunity" />
        <MetricCard label="Venue matches" value="2.3K" detail="built-in database" />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-black">Recently viewed artists</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {artists.map((artist) => (
            <article key={artist.id} className="rounded-3xl border border-ax-line bg-white p-5 shadow-premium">
              <p className="text-xs font-black uppercase tracking-[.16em] text-neutral-400">{artist.genre}</p>
              <h3 className="mt-2 text-2xl font-black">{artist.name}</h3>
              <p className="mt-2 text-sm font-bold text-neutral-500">
                {artist.tier} · Top market: {artist.topMarket}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Saved artists</h2>
            <Button href="/artists" variant="outline">View all</Button>
          </div>
          <div className="mt-5 divide-y divide-ax-line">
            {artists.map((artist) => (
              <div key={artist.id} className="grid gap-3 py-4 md:grid-cols-4">
                <b>{artist.name}</b>
                <span className="font-bold text-neutral-500">{artist.tier}</span>
                <span className="font-bold text-neutral-500">{artist.topMarket}</span>
                <span className="text-right font-black text-ax-red">{artist.readiness}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <h2 className="text-2xl font-black">Recent tour plans</h2>
          <div className="mt-5 space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-ax-line p-4">
                <p className="font-black">{plan.name}</p>
                <p className="mt-1 text-sm font-bold text-neutral-500">
                  {plan.artist} · {plan.stops} stops · {plan.capacity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
