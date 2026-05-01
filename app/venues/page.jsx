"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import Shell from "@/components/Shell";
import { venues } from "@/lib/mockData";

export default function Venues() {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState([]);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return venues;
    return venues.filter((venue) => `${venue.venue} ${venue.city} ${venue.state} ${venue.type}`.toLowerCase().includes(value));
  }, [query]);

  return (
    <Shell active="Venues">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Venues</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">Venue fit workspace</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">Searchable demo venue inventory with capacity, location, fit score, and plan actions.</p>
        </div>
        <Button href="/market-insights" variant="outline">Back to Market Insights</Button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Venues" value={venues.length} detail="demo database" />
        <MetricCard label="Arena avg" value="18.4K" detail="capacity context" />
        <MetricCard label="Best fit" value="MSG" detail="96/100" />
        <MetricCard label="Added" value={added.length} detail="session actions" />
      </div>
      <section className="mt-8 rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-full border border-ax-line bg-ax-paper px-5 text-sm font-bold outline-none focus:border-ax-red" placeholder="Search venues by name, city, state, or type..." />
        <div className="mt-5 grid gap-4">
          {filtered.map((venue) => (
            <article key={venue.id} className="grid gap-4 rounded-2xl border border-ax-line p-5 lg:grid-cols-[1.2fr_.5fr_.45fr_.45fr_auto] lg:items-center">
              <div><h2 className="text-xl font-black">{venue.venue}</h2><p className="mt-1 text-sm font-bold text-neutral-500">{venue.city}, {venue.state} · {venue.type}</p></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Capacity</span><strong className="block text-xl">{venue.capacity.toLocaleString()}</strong></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Fit</span><strong className="block text-xl">{venue.fit}</strong></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Status</span><strong className="block text-sm">{added.includes(venue.id) ? "Added" : "Available"}</strong></div>
              <button type="button" onClick={() => setAdded((current) => current.includes(venue.id) ? current : [...current, venue.id])} className="rounded-full border border-ax-line bg-white px-4 py-2 text-sm font-black transition hover:border-ax-red">Add to tour plan</button>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
