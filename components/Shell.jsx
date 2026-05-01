"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { artists, cities, plans, venues } from "@/lib/mockData";

function Icon({ name }) {
  const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
    artists: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    route: <><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M6 16v-1a6 6 0 0 1 6-6 6 6 0 0 0 6-6V2" /></>,
    insights: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" /></>,
    venues: <><path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
    reports: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.03.03a2 2 0 1 1-2.83 2.83l-.03-.03A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.03.03a2 2 0 1 1-2.83-2.83l.03-.03A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.03-.03a2 2 0 1 1 2.83-2.83l.03.03A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.03-.03a2 2 0 1 1 2.83 2.83l-.03.03A1.7 1.7 0 0 0 19.4 9c.14.34.5 1 1.55 1H21a2 2 0 1 1 0 4h-.05a1.7 1.7 0 0 0-1.55 1Z" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" {...iconProps}>{icons[name]}</svg>;
}

const nav = [
  ["Dashboard", "/dashboard", "dashboard"],
  ["Artists", "/artists", "artists"],
  ["Tour Plans", "/tour-plans", "route"],
  ["Market Insights", "/market-insights", "insights"],
  ["Venues", "/venues", "venues"],
  ["Reports", "/reports", "reports"],
  ["Settings", "/settings", "settings"]
];

const demoArtistsKey = "axcess_demo_artists";

export default function Shell({ active = "Dashboard", children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [demoArtists, setDemoArtists] = useState([]);
  const router = useRouter();
  const activeLabel = active === "Workspace" ? "Dashboard" : active;

  useEffect(() => {
    setDemoArtists(JSON.parse(window.localStorage.getItem(demoArtistsKey) || "[]"));
  }, []);

  const allArtists = [...demoArtists, ...artists.filter((artist) => !demoArtists.some((demo) => demo.id === artist.id))];

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? [
        ...allArtists.map((artist) => ({
          type: "Artist",
          target: "artist",
          id: artist.id,
          label: artist.name,
          detail: `${artist.tier} · ${artist.topMarket}`,
          href: "/market-insights"
        })),
        ...cities.map((city) => ({
          type: "City",
          target: "city",
          id: city.id,
          label: city.city,
          detail: `${city.category} · ${city.opportunity}/100`,
          href: "/market-insights"
        })),
        ...venues.map((venue) => ({
          type: "Venue",
          target: "venue",
          id: venue.id,
          label: venue.venue,
          detail: `${venue.city}, ${venue.state} · ${venue.capacity.toLocaleString()} cap`,
          href: "/venues"
        })),
        ...plans.map((plan) => ({
          type: "Tour Plan",
          target: "plan",
          id: plan.id,
          label: plan.name,
          detail: `${plan.artist} · ${plan.stops} stops`,
          href: "/tour-plans"
        }))
      ]
        .filter((item) => `${item.label} ${item.detail} ${item.type}`.toLowerCase().includes(normalizedQuery))
        .slice(0, 7)
    : [];

  return (
    <div className="min-h-screen bg-ax-paper text-ax-ink">
      <aside
        className={`app-sidebar print-hide fixed left-0 top-0 z-30 hidden h-screen border-r border-white/10 bg-[#090909] p-4 text-white transition-all duration-300 ease-out lg:block ${
          collapsed ? "w-24" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className={`overflow-hidden whitespace-nowrap text-2xl font-black tracking-[0.18em] transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            AXCESS
          </Link>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-lg font-black text-white transition hover:border-red-300/70 hover:shadow-[0_0_24px_rgba(225,29,72,.22)]"
          >
            ☰
          </button>
        </div>
        {!collapsed ? (
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
            Tour Intelligence
          </p>
        ) : null}
        <nav className="mt-10 space-y-1">
          {nav.map(([label, href, icon]) => (
            <Link
              key={label}
              href={href}
              title={label}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition ${
                activeLabel === label
                  ? "bg-white text-black"
                  : "text-white/62 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-current">
                <Icon name={icon} />
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed ? "w-0 opacity-0" : "w-40 opacity-100"
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em]">
            {collapsed ? "Demo" : "Demo mode"}
          </p>
          {!collapsed ? (
            <p className="mt-1 text-sm font-semibold text-white/50">Temporary workspace</p>
          ) : null}
        </div>
      </aside>
      <main className={`transition-all duration-300 ease-out ${collapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="app-topbar print-hide mb-8 flex flex-col gap-4 rounded-3xl border border-ax-line bg-white/80 p-4 shadow-premium md:flex-row md:items-center">
            <BackButton />
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setCollapsed((value) => !value)}
              className="grid h-12 w-12 place-items-center rounded-full border border-ax-line bg-white font-black text-ax-ink transition hover:border-ax-red lg:hidden"
            >
              ☰
            </button>
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-full border border-ax-line bg-ax-paper px-5 text-sm font-bold outline-none transition focus:border-ax-red focus:shadow-[0_0_22px_rgba(177,18,38,.12)]"
                placeholder="Search artists, cities, venues..."
              />
              {searchResults.length ? (
                <div className="absolute left-0 right-0 top-14 z-40 overflow-hidden rounded-3xl border border-ax-line bg-white shadow-[0_24px_70px_rgba(0,0,0,.16)]">
                  {searchResults.map((result) => (
                    <button
                      type="button"
                      key={`${result.type}-${result.label}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        window.sessionStorage.setItem("axcess_search_target", JSON.stringify({ target: result.target, id: result.id }));
                        setQuery("");
                        router.push(result.href);
                      }}
                      className="grid w-full gap-1 border-b border-ax-line px-5 py-4 text-left transition last:border-b-0 hover:bg-red-50"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-ax-red">
                        {result.type}
                      </span>
                      <span className="text-sm font-black text-ax-ink">{result.label}</span>
                      <span className="text-xs font-bold text-neutral-500">{result.detail}</span>
                    </button>
                  ))}
                </div>
              ) : normalizedQuery ? (
                <div className="absolute left-0 right-0 top-14 z-40 rounded-3xl border border-ax-line bg-white px-5 py-4 text-sm font-bold text-neutral-500 shadow-[0_24px_70px_rgba(0,0,0,.16)]">
                  No demo matches found.
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/artist-profile" variant="dark">
                Create Artist Profile
              </Button>
              <Button href="/tour-plans" variant="outline">
                Start New Tour Plan
              </Button>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
