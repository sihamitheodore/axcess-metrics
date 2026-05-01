"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import Shell from "@/components/Shell";
import { cities, plans, venues } from "@/lib/mockData";

const draftPlanStorageKey = "axcess_demo_tour_plans";

function cityBaseName(cityName) {
  return cityName.split(",")[0].trim();
}

function findCity(cityName) {
  const base = cityBaseName(cityName);
  return cities.find((city) => cityBaseName(city.city).toLowerCase() === base.toLowerCase());
}

function parseCapacityMax(value) {
  const matches = String(value || "").match(/\d[\d,]*/g);
  if (!matches?.length) return 10000;
  return Math.max(...matches.map((item) => Number(item.replaceAll(",", ""))));
}

function fallbackVenuesFor(cityName, targetCapacity = 12000) {
  const base = cityBaseName(cityName);
  const city = findCity(cityName);
  const sameCity = venues.filter((venue) => venue.city.toLowerCase() === base.toLowerCase());
  const sameState = city ? venues.filter((venue) => venue.state && city.city.includes(`, ${venue.state}`)) : [];
  const pool = sameCity.length ? sameCity : sameState.length ? sameState : venues;
  const smaller = pool.filter((venue) => venue.capacity <= targetCapacity);
  return (smaller.length ? smaller : pool)
    .map((venue) => ({
      ...venue,
      fitScore: Math.max(45, Math.min(99, Math.round(100 - (Math.abs(targetCapacity - venue.capacity) / Math.max(targetCapacity, 1)) * 60 - (venue.capacity > targetCapacity ? 12 : 0)))),
      reason: venue.capacity <= targetCapacity
        ? "At or below target capacity, reducing undersell risk."
        : "Larger than target; verify demand before confirming."
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);
}

function makeFallbackHub(cityName) {
  const city = findCity(cityName) || { city: cityName, estimatedFans: 15000, capacity: "5,000-8,000" };
  const targetCapacity = parseCapacityMax(city.capacity);
  const recommendedVenues = fallbackVenuesFor(city.city, targetCapacity);
  const selectedVenue = recommendedVenues[0];
  return {
    hubCity: city.city,
    includedClusterCities: [city.city],
    totalClusterDemand: city.estimatedFans || targetCapacity,
    maxDatesPerStop: 2,
    recommendedDates: selectedVenue ? Math.max(1, Math.min(2, Math.ceil((city.estimatedFans || targetCapacity) / selectedVenue.capacity))) : 1,
    selectedVenue,
    venueCapacity: selectedVenue?.capacity || 0,
    estimatedServedDemand: selectedVenue ? selectedVenue.capacity * 2 : 0,
    unmetDemand: selectedVenue ? Math.max(0, (city.estimatedFans || targetCapacity) - selectedVenue.capacity * 2) : 0,
    idealCapacityPerDate: targetCapacity,
    recommendedVenues
  };
}

export default function TourPlanReview({ planId }) {
  const [sessionPlans, setSessionPlans] = useState([]);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);

  useEffect(() => {
    setSessionPlans(JSON.parse(window.localStorage.getItem(draftPlanStorageKey) || "[]"));
  }, []);

  const plan = useMemo(
    () => [...sessionPlans, ...plans].find((item) => item.id === planId) || sessionPlans[0] || plans[0],
    [planId, sessionPlans]
  );

  const hubs = plan.hubs?.length ? plan.hubs : plan.cities.map(makeFallbackHub);
  const totalDemand = hubs.reduce((sum, hub) => sum + (hub.totalClusterDemand || 0), 0);
  const totalServed = hubs.reduce((sum, hub) => sum + (hub.estimatedServedDemand || 0), 0);
  const totalUnmet = hubs.reduce((sum, hub) => sum + (hub.unmetDemand || 0), 0);
  const topHub = hubs[0];

  return (
    <Shell active="Tour Plans">
      <div className="mb-6 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-900">
        Demo mode — review data is temporary for this session.
      </div>
      <section className="rounded-[2rem] bg-[#101010] p-8 text-white shadow-premium">
        <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Tour plan review</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-0.04em]">{plan.name}</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-white/62">
          {plan.artist} route summary with hub clusters, capacity guidance, selected venues, and unmet demand checks.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Stops</span><strong className="mt-2 block text-2xl">{hubs.length}</strong></div>
          <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Top hub</span><strong className="mt-2 block text-2xl">{topHub.hubCity}</strong></div>
          <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Demand</span><strong className="mt-2 block text-2xl">{totalDemand.toLocaleString()}</strong></div>
          <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Status</span><strong className="mt-2 block text-2xl">{plan.status}</strong></div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Selected hubs" value={hubs.length} detail="city/hub stops" />
        <MetricCard label="Served demand" value={totalServed.toLocaleString()} detail="venue cap x dates" />
        <MetricCard label="Unmet demand" value={totalUnmet.toLocaleString()} detail="capacity gap" />
        <MetricCard label="Venue options" value={hubs.reduce((count, hub) => count + (hub.recommendedVenues?.length || 0), 0)} detail="top matches" />
      </div>

      <section className="mt-10 rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Route summary</p>
            <h2 className="mt-2 text-3xl font-black">Selected hubs and venues</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={`/tour-plans/${planId}/edit`} variant="outline">Edit Plan</Button>
            <button type="button" onClick={() => window.print()} className="rounded-full border border-ax-line bg-white px-6 py-3 text-sm font-black">Print Report</button>
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          {hubs.map((hub, index) => (
            <article key={`${hub.hubCity}-${index}`} className="rounded-3xl border border-ax-line bg-ax-paper p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_.45fr_.45fr_.45fr] lg:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Hub {index + 1}</p>
                  <h3 className="mt-1 text-2xl font-black">{hub.hubCity}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-neutral-500">
                    Covers {hub.includedClusterCities.join(", ")}. Ideal per-date capacity is based on total cluster demand divided by selected dates.
                  </p>
                </div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Demand</span><strong className="block text-2xl">{hub.totalClusterDemand.toLocaleString()}</strong></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Dates</span><strong className="block text-2xl">{hub.recommendedDates}</strong><p className="text-xs font-bold text-neutral-500">max {hub.maxDatesPerStop}</p></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Unmet</span><strong className="block text-2xl">{hub.unmetDemand.toLocaleString()}</strong></div>
              </div>
              {hub.selectedVenue ? (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[.16em] text-ax-red">Selected venue</p>
                  <h4 className="mt-1 text-xl font-black">{hub.selectedVenue.venue}</h4>
                  <p className="mt-1 text-sm font-bold text-neutral-600">
                    {hub.selectedVenue.city}, {hub.selectedVenue.state} · {hub.selectedVenue.capacity.toLocaleString()} cap · served demand {hub.estimatedServedDemand.toLocaleString()}
                  </p>
                </div>
              ) : null}
              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[.16em] text-neutral-400">Top 5 recommended venues</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {(hub.recommendedVenues || fallbackVenuesFor(hub.hubCity, hub.idealCapacityPerDate)).map((venue) => (
                    <div key={venue.id} className="rounded-2xl border border-ax-line bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-black">{venue.venue}</h4>
                          <p className="mt-1 text-xs font-bold text-neutral-500">{venue.city}, {venue.state}, US · {venue.type}</p>
                        </div>
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-ax-red">{venue.fitScore || venue.fit}</span>
                      </div>
                      <p className="mt-3 text-xs font-black uppercase tracking-[.14em] text-neutral-400">{venue.capacity.toLocaleString()} capacity</p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">{venue.reason || "Closest available venue option for this hub capacity target."}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedVenueIds((current) => current.includes(venue.id) ? current : [...current, venue.id])}
                        className="mt-4 rounded-full border border-ax-line px-4 py-2 text-xs font-black transition hover:border-ax-red"
                      >
                        {selectedVenueIds.includes(venue.id) ? "Selected" : "Select venue"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
