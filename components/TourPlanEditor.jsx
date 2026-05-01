"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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

function distanceMiles(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthMiles = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  return 2 * earthMiles * Math.asin(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2));
}

function candidateVenues(city) {
  const base = cityBaseName(city.city);
  const sameCity = venues.filter((venue) => venue.city.toLowerCase() === base.toLowerCase());
  const sameState = venues.filter((venue) => venue.state && city.city.includes(`, ${venue.state}`));
  return sameCity.length ? sameCity : sameState.length ? sameState : venues;
}

function buildEditorHubs({ totalStops, maxDatesPerStop, radius, includeAnchors, manualCities }) {
  const ordered = [];
  const add = (city) => {
    if (city && ordered.length < totalStops && !ordered.some((item) => item.id === city.id)) ordered.push(city);
  };
  const anchors = cities.filter((city) => city.anchor).sort((a, b) => b.opportunity - a.opportunity);
  if (includeAnchors) {
    if (totalStops === 1) add(anchors[0]);
    if (totalStops === 2) ["new-york", "los-angeles"].forEach((id) => add(cities.find((city) => city.id === id)));
    if (totalStops >= 3) anchors.forEach(add);
  }
  manualCities.forEach(add);
  [...cities].sort((a, b) => b.opportunity - a.opportunity).forEach(add);

  return ordered.map((hub) => {
    const clusterCities = cities.filter((city) => distanceMiles(hub, city) <= radius);
    const demand = clusterCities.reduce((sum, city) => sum + (city.estimatedFans || city.opportunity * 350), 0);
    const venuePool = candidateVenues(hub);
    const bestCapacity = Math.max(...venuePool.map((venue) => venue.capacity), 1);
    const dates = Math.max(1, Math.min(maxDatesPerStop, Math.ceil(demand / bestCapacity)));
    const ideal = Math.ceil(demand / dates);
    const rankedVenues = venuePool
      .map((venue) => ({
        ...venue,
        fitScore: Math.max(45, Math.min(99, Math.round(100 - Math.abs(ideal - venue.capacity) / Math.max(ideal, 1) * 60 - (venue.capacity > ideal ? 12 : 0)))),
        reason: venue.capacity <= ideal ? "At or below ideal capacity, reducing undersell risk." : "Larger than ideal capacity; verify demand."
      }))
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 5);
    const selectedVenue = rankedVenues[0];
    return {
      hubCity: hub.city,
      includedClusterCities: clusterCities.map((city) => city.city),
      totalClusterDemand: demand,
      maxDatesPerStop,
      recommendedDates: dates,
      idealCapacityPerDate: ideal,
      selectedVenue,
      venueCapacity: selectedVenue?.capacity || 0,
      estimatedServedDemand: selectedVenue ? selectedVenue.capacity * dates : 0,
      unmetDemand: selectedVenue ? Math.max(0, demand - selectedVenue.capacity * dates) : demand,
      recommendedVenues: rankedVenues
    };
  });
}

export default function TourPlanEditor({ planId }) {
  const pathname = usePathname();
  const [sessionPlans, setSessionPlans] = useState([]);
  const [planStatus, setPlanStatus] = useState("Draft");
  const [saved, setSaved] = useState(false);
  const [totalStops, setTotalStops] = useState(4);
  const [maxDatesPerStop, setMaxDatesPerStop] = useState(2);
  const [radius, setRadius] = useState(150);
  const [includeAnchors, setIncludeAnchors] = useState(true);
  const [manualIds, setManualIds] = useState([]);
  const [selectedVenueByHub, setSelectedVenueByHub] = useState({});

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem(draftPlanStorageKey) || "[]");
    setSessionPlans(stored);
    const existing = [...stored, ...plans].find((plan) => plan.id === planId);
    if (existing) {
      setPlanStatus(existing.status === "Draft" || existing.status === "Session draft" ? "Draft" : "Planned");
      setTotalStops(existing.stops || existing.hubs?.length || 4);
      setManualIds((existing.cities || []).map((cityName) => findCity(cityName)?.id).filter(Boolean));
      if (existing.hubs?.[0]?.maxDatesPerStop) setMaxDatesPerStop(existing.hubs[0].maxDatesPerStop);
    }
  }, [planId]);

  const manualCities = cities.filter((city) => manualIds.includes(city.id));
  const hubs = useMemo(() => buildEditorHubs({ totalStops, maxDatesPerStop, radius, includeAnchors, manualCities }), [totalStops, maxDatesPerStop, radius, includeAnchors, manualCities]);
  const totalDemand = hubs.reduce((sum, hub) => sum + hub.totalClusterDemand, 0);
  const servedDemand = hubs.reduce((sum, hub) => sum + ((selectedVenueByHub[hub.hubCity] || hub.selectedVenue)?.capacity || 0) * hub.recommendedDates, 0);
  const unmetDemand = Math.max(0, totalDemand - servedDemand);
  const isCreateMode = pathname === "/tour-plans/new" || !planId || planId === "new";
  const isDraftPlan = !isCreateMode && planStatus === "Draft";
  const primaryCtaLabel = isCreateMode ? "Add to Tour Planner" : isDraftPlan ? "Save Draft" : "Save Changes";
  const secondaryCtaLabel = isCreateMode || !isDraftPlan ? "Save as Draft" : "Move to Tour Planner";
  const primaryStatus = isCreateMode ? "Planned" : planStatus;
  const secondaryStatus = isCreateMode || !isDraftPlan ? "Draft" : "Planned";

  const toggleCity = (id) => setManualIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const savePlan = (status) => {
    const nextPlan = {
      id: planId || `demo-${Date.now()}`,
      name: "Edited hub route",
      artist: "Demo workspace",
      status,
      stops: hubs.length,
      capacity: hubs[0] ? `${hubs[0].idealCapacityPerDate.toLocaleString()} ideal/date` : "TBD",
      cities: hubs.map((hub) => hub.hubCity),
      hubs: hubs.map((hub) => {
        const selectedVenue = selectedVenueByHub[hub.hubCity] || hub.selectedVenue;
        return {
          ...hub,
          selectedVenue,
          venueCapacity: selectedVenue?.capacity || 0,
          estimatedServedDemand: selectedVenue ? selectedVenue.capacity * hub.recommendedDates : 0,
          unmetDemand: selectedVenue ? Math.max(0, hub.totalClusterDemand - selectedVenue.capacity * hub.recommendedDates) : hub.totalClusterDemand
        };
      })
    };
    const nextPlans = [nextPlan, ...sessionPlans.filter((plan) => plan.id !== nextPlan.id)].slice(0, 8);
    setSessionPlans(nextPlans);
    setPlanStatus(status);
    window.localStorage.setItem(draftPlanStorageKey, JSON.stringify(nextPlans));
    setSaved(true);
  };

  return (
    <Shell active="Tour Plans">
      <section className="rounded-[2rem] bg-[#101010] p-8 text-white shadow-premium">
        <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Tour plan editor</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-0.04em]">Edit hub route</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-white/62">Adjust stop count, dates, cluster radius, anchors, cities, venues, and save a session draft.</p>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Stops" value={hubs.length} detail="city/hub visits" />
        <MetricCard label="Demand" value={totalDemand.toLocaleString()} detail="cluster total" />
        <MetricCard label="Served" value={servedDemand.toLocaleString()} detail="venue cap x dates" />
        <MetricCard label="Unmet" value={unmetDemand.toLocaleString()} detail="remaining demand" />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <aside className="rounded-3xl border border-ax-line bg-white p-5 shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Edit controls</p>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Total stops</span><input type="number" min="1" max={cities.length} value={totalStops} onChange={(event) => setTotalStops(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red" /></label>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Maximum dates per stop</span><select value={maxDatesPerStop} onChange={(event) => setMaxDatesPerStop(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red">{[1,2,3,4].map((value) => <option key={value} value={value}>{value === 4 ? "4+" : value}</option>)}</select></label>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Distance radius</span><select value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red">{[50,100,150,250,500].map((value) => <option key={value} value={value}>{value} miles</option>)}</select></label>
          <label className="mt-5 flex items-center gap-3 rounded-2xl border border-ax-line bg-ax-paper p-4 text-sm font-black"><input type="checkbox" checked={includeAnchors} onChange={(event) => setIncludeAnchors(event.target.checked)} className="h-5 w-5 accent-ax-red" />Include anchor markets</label>
          <p className="mt-5 text-xs font-black uppercase tracking-[.14em] text-neutral-400">Manual city selection</p>
          <div className="mt-3 grid gap-2">{cities.map((city) => <label key={city.id} className="flex items-center justify-between rounded-2xl border border-ax-line p-3 text-sm font-bold"><span>{city.city}</span><input type="checkbox" checked={manualIds.includes(city.id)} onChange={() => toggleCity(city.id)} className="h-5 w-5 accent-ax-red" /></label>)}</div>
          <div className="mt-6 grid gap-3">
            <button type="button" onClick={() => savePlan(secondaryStatus)} className="rounded-full border border-ax-line bg-white px-6 py-3 text-sm font-black hover:border-ax-red">{secondaryCtaLabel}</button>
            <button type="button" onClick={() => savePlan(primaryStatus)} className="rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white shadow-[0_0_25px_rgba(225,29,72,.25)]">{primaryCtaLabel}</button>
          </div>
          {saved ? <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-black text-ax-red">Plan saved for this demo session.</p> : null}
        </aside>

        <div className="grid gap-4">
          {hubs.map((hub) => {
            const selectedVenue = selectedVenueByHub[hub.hubCity] || hub.selectedVenue;
            return (
              <article key={hub.hubCity} className="rounded-3xl border border-ax-line bg-white p-5 shadow-premium">
                <div className="grid gap-4 lg:grid-cols-[1fr_.45fr_.45fr_.45fr]">
                  <div><h2 className="text-2xl font-black">{hub.hubCity}</h2><p className="mt-2 text-sm font-semibold leading-6 text-neutral-500">Includes {hub.includedClusterCities.join(", ")}</p></div>
                  <MetricCard label="Demand" value={hub.totalClusterDemand.toLocaleString()} detail="estimated" />
                  <MetricCard label="Dates" value={hub.recommendedDates} detail={`max ${maxDatesPerStop}`} />
                  <MetricCard label="Unmet" value={Math.max(0, hub.totalClusterDemand - (selectedVenue?.capacity || 0) * hub.recommendedDates).toLocaleString()} detail="capacity gap" />
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {hub.recommendedVenues.map((venue) => (
                    <div key={venue.id} className="rounded-2xl border border-ax-line bg-ax-paper p-4">
                      <div className="flex items-start justify-between gap-3"><div><h3 className="font-black">{venue.venue}</h3><p className="mt-1 text-xs font-bold text-neutral-500">{venue.city}, {venue.state} · {venue.type}</p></div><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-ax-red">{venue.fitScore}</span></div>
                      <p className="mt-3 text-xs font-black uppercase tracking-[.14em] text-neutral-400">{venue.capacity.toLocaleString()} capacity</p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">{venue.reason}</p>
                      <button type="button" onClick={() => setSelectedVenueByHub((current) => ({ ...current, [hub.hubCity]: venue }))} className="mt-4 rounded-full border border-ax-line px-4 py-2 text-xs font-black hover:border-ax-red">{selectedVenue?.id === venue.id ? "Selected" : "Select venue"}</button>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
