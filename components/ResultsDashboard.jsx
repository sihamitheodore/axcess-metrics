"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MetricCard from "@/components/MetricCard";
import { artists, cities, venues } from "@/lib/mockData";

const selectedStorageKey = "axcess_selected_city_ids";
const draftPlanStorageKey = "axcess_demo_tour_plans";
const demoArtistsKey = "axcess_demo_artists";
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' rx='72' fill='%23111111'/%3E%3Ccircle cx='320' cy='260' r='96' fill='%238B0000'/%3E%3Cpath d='M156 534c24-100 92-154 164-154s140 54 164 154' fill='%23262626'/%3E%3Ctext x='320' y='584' text-anchor='middle' font-family='Arial' font-size='44' font-weight='800' fill='white'%3EAXCESS%3C/text%3E%3C/svg%3E";

const categoryStyles = {
  "Anchor Market": "bg-[#111111] text-white border-[#111111]",
  "Underserved Opportunity": "bg-red-50 text-ax-red border-red-100",
  "Expansion Market": "bg-neutral-100 text-neutral-800 border-neutral-200",
  "Emerging Market": "bg-white text-neutral-700 border-neutral-200",
  Monitor: "bg-neutral-50 text-neutral-500 border-neutral-200",
  "Planned Hub": "bg-red-50 text-ax-red border-red-100"
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cityBaseName(cityName) {
  return cityName.split(",")[0].trim();
}

function parseCapacityMax(value) {
  const matches = String(value || "").match(/\d[\d,]*/g);
  if (!matches?.length) return 10000;
  return Math.max(...matches.map((item) => Number(item.replaceAll(",", ""))));
}

function parseFollowers(value = "") {
  const text = String(value).toLowerCase().replaceAll(",", "");
  const amount = Number(text.match(/\d+(\.\d+)?/)?.[0] || 0);
  if (text.includes("m")) return amount * 1000000;
  if (text.includes("k")) return amount * 1000;
  return amount;
}

function artistTierProfile(artist) {
  const followers = parseFollowers(artist?.followers);
  const popularity = Number(artist?.popularity || 0);
  const tierText = String(artist?.tier || "").toLowerCase();
  if (followers >= 15000000 || popularity >= 84 || tierText.includes("a-tier")) return { tier: "A-tier / Major", min: 18000, max: 24000, demandMultiplier: 1.3, preferredTypes: ["Arena", "Stadium", "Amphitheater"] };
  if (followers >= 2500000 || popularity >= 68 || tierText.includes("b-tier")) return { tier: "B-tier", min: 10000, max: 12000, demandMultiplier: 0.76, preferredTypes: ["Amphitheater", "Arena", "Auditorium", "Theater"] };
  if (followers >= 500000 || popularity >= 50 || tierText.includes("c-tier")) return { tier: "C-tier / Mid-tier", min: 2000, max: 6000, demandMultiplier: 0.34, preferredTypes: ["Theater", "Ballroom", "Auditorium"] };
  return { tier: "Emerging", min: 500, max: 2000, demandMultiplier: 0.12, preferredTypes: ["Club", "Theater", "Ballroom"] };
}

function genreAffinity(artist, city) {
  const genre = String(artist?.genre || "").toLowerCase();
  const cityName = city.city.toLowerCase();
  if (genre.includes("k-pop")) {
    if (/los angeles/.test(cityName)) return 24;
    if (/new york|newark/.test(cityName)) return 22;
    if (/chicago|atlanta|dallas/.test(cityName)) return 17;
    if (/seattle|san francisco|houston|charlotte/.test(cityName)) return 12;
    return -2;
  }
  if (genre.includes("r&b") || genre.includes("pop")) {
    if (/new york|atlanta|los angeles|houston|chicago|dallas|san francisco/.test(cityName)) return 10;
    if (/phoenix|seattle|austin|charlotte/.test(cityName)) return 2;
  }
  if (genre.includes("alt")) {
    if (/chicago|austin|seattle|san francisco|new york|los angeles/.test(cityName)) return 11;
    if (/charlotte|phoenix|dallas/.test(cityName)) return 3;
  }
  return city.anchor ? 4 : 0;
}

function categoryFor(score, saturation, anchor) {
  if (anchor && score >= 82) return "Anchor Market";
  if (score >= 86 && saturation !== "High") return "Underserved Opportunity";
  if (score >= 78) return "Expansion Market";
  if (score >= 68) return "Emerging Market";
  return "Monitor";
}

function simulateArtistCities(artist) {
  const profile = artistTierProfile(artist);
  const popularity = Number(artist?.popularity || 60);
  const engagement = Number(artist?.engagement || popularity || 60);
  const artistSeed = Array.from(String(artist?.id || artist?.name || "artist")).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return cities
    .map((city, index) => {
      const simulatedSearchDemand = clamp(Math.round(city.trends + genreAffinity(artist, city) + ((artistSeed + index * 7) % 13) - 6), 35, 100);
      const saturationPenalty = city.saturation === "High" ? 9 : city.saturation === "Moderate" ? 4 : 0;
      const venueFit = city.anchor ? 92 : city.category === "Expansion Market" ? 78 : 72;
      const anchorBonus = profile.tier.includes("A-tier") && city.anchor ? 8 : 0;
      const opportunity = clamp(Math.round(0.42 * simulatedSearchDemand + 0.22 * engagement + 0.18 * popularity + 0.18 * venueFit - saturationPenalty + anchorBonus), 35, 99);
      const demand = Math.round((city.estimatedFans || 12000) * profile.demandMultiplier * (simulatedSearchDemand / 86));
      const dateCount = opportunity >= 90 && profile.tier.includes("A-tier") ? "2-3" : opportunity >= 82 ? "1-2" : "1";
      const capacity = `${profile.min.toLocaleString()}-${profile.max.toLocaleString()}`;
      const category = categoryFor(opportunity, city.saturation, city.anchor);
      return {
        ...city,
        opportunity,
        trends: simulatedSearchDemand,
        searchDemandSource: "Simulated search demand",
        estimatedFans: Math.max(Math.round(profile.min * 0.75), demand),
        capacity,
        dates: dateCount,
        category,
        why: `${city.city} is ranked for ${artist?.name || "this artist"} using a simulated demand model: ${profile.tier} capacity profile, ${artist?.genre || "genre"} affinity, engagement strength, venue fit, and prior saturation.`
      };
    })
    .sort((a, b) => b.opportunity - a.opportunity);
}

function getArtistImage(artist) {
  const images = artist?.spotifyArtistData?.images || artist?.images || [];
  const spotifyUrl = images.find((image) => image?.url?.startsWith("http"))?.url;
  return spotifyUrl || (artist?.spotifyImageUrl?.startsWith("http") ? artist.spotifyImageUrl : "") || artist?.image || placeholderImage;
}

function distanceMiles(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthMiles = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthMiles * Math.asin(Math.sqrt(x));
}

function getMapPosition(city) {
  return {
    left: `${clamp(((city.lon + 125) / 59) * 100, 4, 96)}%`,
    top: `${clamp(((50 - city.lat) / 26) * 100, 7, 93)}%`
  };
}

function buildClusterForHub(hub, radius, marketCities = cities) {
  const includedCities = marketCities
    .filter((city) => distanceMiles(hub, city) <= radius)
    .sort((a, b) => distanceMiles(hub, a) - distanceMiles(hub, b));
  const totalDemand = includedCities.reduce((sum, city) => sum + (city.estimatedFans || city.opportunity * 350), 0);
  return { hub, includedCities, totalDemand };
}

function getCandidateVenues(city) {
  const base = cityBaseName(city.city);
  const sameCity = venues.filter((venue) => venue.city.toLowerCase() === base.toLowerCase());
  const sameState = venues.filter((venue) => venue.state && city.city.includes(`, ${venue.state}`));
  return sameCity.length ? sameCity : sameState.length ? sameState : venues;
}

function recommendVenuesForHub(hub, idealCapacity, limit = 5) {
  const options = getCandidateVenues(hub);
  const smaller = options.filter((venue) => venue.capacity <= idealCapacity);
  const pool = smaller.length ? smaller : options;
  return [...pool]
    .map((venue) => {
      const diff = Math.abs(idealCapacity - venue.capacity);
      const isBelowTarget = venue.capacity <= idealCapacity;
      const fitScore = clamp(Math.round(100 - (diff / Math.max(idealCapacity, 1)) * 60 - (isBelowTarget ? 0 : 12)), 45, 99);
      return {
        ...venue,
        fitScore,
        fitLabel: isBelowTarget ? "Right-sized" : "Slightly large",
        reason: isBelowTarget
          ? "Closest venue at or below ideal per-date capacity, reducing undersell risk."
          : "Above target capacity; verify demand before committing to this room."
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore || Math.abs(idealCapacity - a.capacity) - Math.abs(idealCapacity - b.capacity))
    .slice(0, limit);
}

function buildHubPlan({ desiredStops, includeAnchors, manualIds, maxDatesPerStop, clusterRadius, marketCities = cities }) {
  const chosen = [];
  const addHub = (city) => {
    if (city && !chosen.some((item) => item.id === city.id) && chosen.length < desiredStops) chosen.push(city);
  };
  const anchors = marketCities.filter((city) => city.anchor).sort((a, b) => b.opportunity - a.opportunity);
  if (includeAnchors) {
    if (desiredStops === 1) addHub(anchors[0]);
    if (desiredStops === 2) ["new-york", "los-angeles"].forEach((id) => addHub(marketCities.find((city) => city.id === id)));
    if (desiredStops >= 3) anchors.forEach(addHub);
  }
  marketCities.filter((city) => manualIds.includes(city.id)).forEach(addHub);
  [...marketCities].sort((a, b) => b.opportunity - a.opportunity).forEach(addHub);

  return chosen.map((hub) => {
    const cluster = buildClusterForHub(hub, clusterRadius, marketCities);
    const venuePool = getCandidateVenues(hub);
    const bestAvailableVenueCapacity = Math.max(...venuePool.map((venue) => venue.capacity), 1);
    const recommendedDates = clamp(Math.ceil(cluster.totalDemand / bestAvailableVenueCapacity), 1, maxDatesPerStop);
    const idealCapacityPerDate = Math.ceil(cluster.totalDemand / recommendedDates);
    const recommendedVenues = recommendVenuesForHub(hub, idealCapacityPerDate, 5);
    const selectedVenue = recommendedVenues[0];
    const estimatedServedDemand = selectedVenue ? selectedVenue.capacity * recommendedDates : 0;
    const unmetDemand = Math.max(0, cluster.totalDemand - estimatedServedDemand);
    return {
      id: hub.id,
      city: hub.city,
      category: hub.anchor ? "Anchor Market" : "Planned Hub",
      hub,
      includedCities: cluster.includedCities,
      totalClusterDemand: cluster.totalDemand,
      maxDatesPerStop,
      recommendedDates,
      idealCapacityPerDate,
      selectedVenue,
      recommendedVenues,
      estimatedServedDemand,
      unmetDemand,
      explanation: `${hub.city} covers ${cluster.includedCities.map((city) => city.city.split(",")[0]).join(", ")} within ${clusterRadius} miles. Capacity is sized from total estimated cluster demand divided across ${recommendedDates} date${recommendedDates === 1 ? "" : "s"}.`
    };
  });
}

function CityBadge({ city }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${categoryStyles[city.category] || categoryStyles["Planned Hub"]}`}>
      {city.anchor ? "Required Anchor" : city.category}
    </span>
  );
}

function CityAction({ city, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(city.id)}
      className={`rounded-full px-4 py-2 text-sm font-black transition ${
        selected ? "bg-ax-red text-white shadow-[0_0_22px_rgba(177,18,38,.22)]" : "border border-ax-line bg-white text-ax-ink hover:border-ax-red"
      }`}
    >
      {selected ? "Added" : "Add to plan"}
    </button>
  );
}

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    if (!document.querySelector("link[data-axcess-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.axcessLeaflet = "true";
      document.head.appendChild(link);
    }
    const existing = document.querySelector("script[data-axcess-leaflet]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.dataset.axcessLeaflet = "true";
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function FallbackMap({ selectedCity, selectedIds, onSelectCity, onToggleCity, marketCities = cities }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  return (
    <div className="relative h-[500px] overflow-hidden rounded-[2rem] border border-ax-line bg-[#0d0d0d] shadow-inner">
      <div className="absolute left-6 top-5 z-20 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
        Leaflet unavailable · fallback US map
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(177,18,38,.38),transparent_25%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,.10),transparent_22%)]" />
      <svg className="absolute left-[7%] top-[13%] h-[70%] w-[88%] opacity-80" viewBox="0 0 960 600" aria-hidden="true">
        <path d="M125 252 176 205l66-22 72-28 89-9 63 21 54-12 56 17 78-2 55 35 62 14 34 48 54 26 24 53-34 48-54 21-71-7-58 25-77-15-73 28-81-7-59 20-82-22-70 18-61-27-68-6-42-51 21-61-29-60 41-46Z" fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
      </svg>
      {marketCities.map((city) => (
        <button
          key={city.id}
          type="button"
          onMouseEnter={() => setHoveredCity(city)}
          onClick={() => onSelectCity(city.id)}
          onDoubleClick={() => onToggleCity(city.id)}
          style={getMapPosition(city)}
          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition hover:scale-125 ${
            selectedIds.includes(city.id) || selectedCity.id === city.id ? "h-8 w-8 border-white bg-ax-red shadow-[0_0_30px_rgba(225,29,72,.72)]" : "h-5 w-5 border-white/80 bg-neutral-500"
          }`}
          aria-label={`Select ${city.city}`}
        />
      ))}
      {hoveredCity ? <MapTooltip city={hoveredCity} style={getMapPosition(hoveredCity)} /> : null}
    </div>
  );
}

function MapTooltip({ city, style }) {
  return (
    <div className="pointer-events-none absolute z-[500] w-64 rounded-2xl border border-white/10 bg-[#111111]/95 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur" style={style}>
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-red-300">{city.category}</p>
      <h4 className="mt-1 text-lg font-black">{city.city}</h4>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-bold text-white/60">
        <span>Score <b className="block text-base text-white">{city.opportunity}</b></span>
        <span>Demand <b className="block text-base text-white">{(city.estimatedFans || 0).toLocaleString()}</b></span>
        <span>Dates <b className="block text-base text-white">{city.dates}</b></span>
        <span>Capacity <b className="block text-base text-white">{city.capacity}</b></span>
      </div>
    </div>
  );
}

function InteractiveDemandMap({ selectedCity, selectedIds, onSelectCity, onToggleCity, hubs = [], marketCities = cities }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const clusterLayerRef = useRef([]);
  const [leafletReady, setLeafletReady] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadLeaflet()
      .then((L) => {
        if (!mounted || !mapRef.current) return;
        if (!leafletRef.current) {
          leafletRef.current = L.map(mapRef.current, {
            center: [39.5, -98.35],
            zoom: 4,
            minZoom: 3,
            maxZoom: 8,
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: true
          });
          L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 19
          }).addTo(leafletRef.current);
        }
        setLeafletReady(true);
      })
      .catch(() => {
        if (mounted) setLeafletReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leafletRef.current || !window.L) return;
    const L = window.L;
    markersRef.current.forEach((marker) => marker.remove());
    clusterLayerRef.current.forEach((layer) => layer.remove());
    clusterLayerRef.current = [];
    hubs.forEach((hub) => {
      const circle = L.circle([hub.hub.lat, hub.hub.lon], {
        radius: 150 * 1609.34,
        color: "#E11D48",
        weight: 1,
        opacity: 0.25,
        fillColor: "#E11D48",
        fillOpacity: 0.06
      }).addTo(leafletRef.current);
      clusterLayerRef.current.push(circle);
      hub.includedCities
        .filter((city) => city.id !== hub.id)
        .forEach((city) => {
          const line = L.polyline([[hub.hub.lat, hub.hub.lon], [city.lat, city.lon]], {
            color: "#E11D48",
            weight: 1,
            opacity: 0.32,
            dashArray: "5 7"
          }).addTo(leafletRef.current);
          clusterLayerRef.current.push(line);
        });
    });
    markersRef.current = marketCities.map((city) => {
      const selected = selectedIds.includes(city.id) || selectedCity.id === city.id;
      const isHub = hubs.some((hub) => hub.id === city.id);
      const marker = L.circleMarker([city.lat, city.lon], {
        radius: isHub ? 12 : selected ? 10 : city.anchor ? 8 : 7,
        color: "#fff",
        weight: selected ? 2 : 1.5,
        fillColor: selected || isHub ? "#E11D48" : "#7a7a7a",
        fillOpacity: 0.95
      });
      marker
        .bindTooltip(
          `<div style="font-family:Inter,Arial,sans-serif;min-width:190px"><div style="font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#ff8aa0">${city.category}</div><div style="margin-top:4px;font-size:15px;font-weight:900;color:white">${city.city}</div><div style="margin-top:8px;font-size:12px;font-weight:700;color:rgba(255,255,255,.72)">Score ${city.opportunity} · Demand ${(city.estimatedFans || 0).toLocaleString()}<br/>Capacity ${city.capacity} · Dates ${city.dates}</div></div>`,
          { direction: "top", opacity: 0.96, className: "axcess-map-tooltip" }
        )
        .on("click", () => onSelectCity(city.id))
        .on("dblclick", () => onToggleCity(city.id))
        .addTo(leafletRef.current);
      return marker;
    });
  }, [selectedCity, selectedIds, onSelectCity, onToggleCity, hubs, marketCities]);

  if (!leafletReady) return <FallbackMap selectedCity={selectedCity} selectedIds={selectedIds} onSelectCity={onSelectCity} onToggleCity={onToggleCity} marketCities={marketCities} />;

  return (
    <div className="relative h-[500px] overflow-hidden rounded-[2rem] border border-ax-line bg-[#0d0d0d] shadow-inner">
      <div className="absolute left-6 top-5 z-[450] rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/70 backdrop-blur">
        Leaflet map · pan, zoom, hover, click
      </div>
      <div ref={mapRef} className="h-[500px] w-full [&_.leaflet-container]:bg-[#0d0d0d] [&_.leaflet-control-zoom_a]:border-white/10 [&_.leaflet-control-zoom_a]:bg-black/70 [&_.leaflet-control-zoom_a]:text-white" />
    </div>
  );
}

function VenueCard({ venue, onSelect, selected }) {
  return (
    <article className="rounded-2xl border border-ax-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-black">{venue.venue}</h4>
          <p className="mt-1 text-xs font-bold text-neutral-500">{venue.city}, {venue.state}, US · {venue.type}</p>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-ax-red">{venue.fitScore || venue.fit}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-neutral-400">{venue.capacity.toLocaleString()} cap · {venue.fitLabel || "Context fit"}</p>
      <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">{venue.reason || "Venue context matched to the current city and target capacity."}</p>
      <button type="button" onClick={() => onSelect?.(venue)} className="mt-4 rounded-full border border-ax-line px-3 py-1 text-xs font-black hover:border-ax-red">
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
}

function TourPlanModal({ selectedIds, setSelectedIds, onClose, marketCities = cities }) {
  const [desiredStops, setDesiredStops] = useState(Math.max(3, selectedIds.length || 5));
  const [maxDatesPerStop, setMaxDatesPerStop] = useState(2);
  const [clusterRadius, setClusterRadius] = useState(150);
  const [includeAnchors, setIncludeAnchors] = useState(true);
  const [manualIds, setManualIds] = useState(selectedIds);
  const [selectedVenues, setSelectedVenues] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  const hubs = useMemo(
    () => buildHubPlan({ desiredStops, includeAnchors, manualIds, maxDatesPerStop, clusterRadius, marketCities }),
    [desiredStops, includeAnchors, manualIds, maxDatesPerStop, clusterRadius, marketCities]
  );

  const toggleManual = (id) => {
    setManualIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setDraftSaved(false);
  };

  const savePlan = (status) => {
    setSelectedIds(hubs.map((hub) => hub.id));
    const draft = {
      id: `demo-${Date.now()}`,
      name: `Hub route · ${hubs.length} stops`,
      artist: "Demo workspace",
      status,
      stops: hubs.length,
      capacity: hubs[0] ? `${hubs[0].idealCapacityPerDate.toLocaleString()} ideal/date` : "TBD",
      cities: hubs.map((hub) => hub.city),
      hubs: hubs.map((hub) => {
        const selectedVenue = selectedVenues[hub.id] || hub.selectedVenue;
        return {
          hubCity: hub.city,
          includedClusterCities: hub.includedCities.map((city) => city.city),
          totalClusterDemand: hub.totalClusterDemand,
          maxDatesPerStop,
          recommendedDates: hub.recommendedDates,
          selectedVenue,
          venueCapacity: selectedVenue?.capacity || 0,
          estimatedServedDemand: selectedVenue ? selectedVenue.capacity * hub.recommendedDates : 0,
          unmetDemand: selectedVenue ? Math.max(0, hub.totalClusterDemand - selectedVenue.capacity * hub.recommendedDates) : hub.totalClusterDemand,
          idealCapacityPerDate: hub.idealCapacityPerDate
        };
      })
    };
    const existing = JSON.parse(window.localStorage.getItem(draftPlanStorageKey) || "[]");
    window.localStorage.setItem(draftPlanStorageKey, JSON.stringify([draft, ...existing].slice(0, 8)));
    setDraftSaved(status);
  };

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/10 bg-ax-paper p-6 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <div className="flex flex-col gap-4 border-b border-ax-line pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Tour Plan Builder</p>
            <h2 className="mt-2 text-3xl font-black">Build a hub-aware demo tour plan</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-neutral-500">Total stops are city/hub visits. Maximum dates per stop controls how many performances can absorb demand in each hub.</p>
          </div>
          <button type="button" onClick={onClose} className="h-11 rounded-full border border-ax-line bg-white px-5 text-sm font-black transition hover:border-ax-red">Close</button>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
          <div className="rounded-3xl border border-ax-line bg-white p-5 shadow-premium">
            <label className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Total stops</label>
            <input type="number" min="1" max={marketCities.length} value={desiredStops} onChange={(event) => setDesiredStops(Number(event.target.value))} className="mt-3 h-14 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 text-xl font-black outline-none focus:border-ax-red" />
            <label className="mt-5 block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Maximum dates per stop</span>
              <select value={maxDatesPerStop} onChange={(event) => setMaxDatesPerStop(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 text-sm font-black outline-none focus:border-ax-red">
                {[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value === 4 ? "4+" : value}</option>)}
              </select>
            </label>
            <label className="mt-5 block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Distance radius</span>
              <select value={clusterRadius} onChange={(event) => setClusterRadius(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 text-sm font-black outline-none focus:border-ax-red">
                {[50, 100, 150, 250, 500].map((value) => <option key={value} value={value}>{value} miles</option>)}
              </select>
            </label>
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-ax-line bg-ax-paper p-4 text-sm font-black">
              <input type="checkbox" checked={includeAnchors} onChange={(event) => setIncludeAnchors(event.target.checked)} className="h-5 w-5 accent-ax-red" />
              Include mandatory anchor markets
            </label>
            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Manual city selection</p>
              <div className="mt-3 grid gap-2">
                {marketCities.map((city) => (
                  <label key={city.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-ax-line bg-white p-3 text-sm font-bold transition hover:border-red-200">
                    <span>{city.city}</span>
                    <input type="checkbox" checked={manualIds.includes(city.id)} onChange={() => toggleManual(city.id)} className="h-5 w-5 accent-ax-red" />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-ax-line bg-white p-5 shadow-premium">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Review selected hubs</p>
                <h3 className="text-2xl font-black">{hubs.length} hub route</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => savePlan("Draft")} className="rounded-full border border-ax-line bg-white px-5 py-3 text-sm font-black transition hover:border-ax-red">Save as Draft</button>
                <button type="button" onClick={() => savePlan("Planned")} className="rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white shadow-[0_0_25px_rgba(225,29,72,.25)] transition hover:-translate-y-0.5">Add to Tour Planner</button>
              </div>
            </div>
            {draftSaved ? <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-black text-ax-red">{draftSaved} saved temporarily for this demo session.</p> : null}
            <div className="mt-5 grid gap-4">
              {hubs.map((hub, index) => (
                <article key={hub.id} className="rounded-2xl border border-ax-line bg-ax-paper p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Hub {index + 1}</p>
                      <h4 className="mt-1 text-xl font-black">{hub.city}</h4>
                    </div>
                    <CityBadge city={hub.hub} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <MetricCard label="Cluster Demand" value={hub.totalClusterDemand.toLocaleString()} detail="estimated fans" />
                    <MetricCard label="Ideal / Date" value={hub.idealCapacityPerDate.toLocaleString()} detail="demand divided by dates" />
                    <MetricCard label="Dates" value={hub.recommendedDates} detail={`max ${maxDatesPerStop}`} />
                    <MetricCard label="Unmet" value={hub.unmetDemand.toLocaleString()} detail="with best match" />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-neutral-500">{hub.explanation}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hub.includedCities.map((city) => <span key={city.id} className="rounded-full border border-ax-line bg-white px-3 py-1 text-xs font-black">{city.city}</span>)}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {hub.recommendedVenues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} selected={selectedVenues[hub.id]?.id === venue.id} onSelect={() => setSelectedVenues((current) => ({ ...current, [hub.id]: venue }))} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResultsDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [artistId, setArtistId] = useState("all");
  const [demoArtists, setDemoArtists] = useState([]);
  const allArtists = useMemo(
    () => [...demoArtists, ...artists.filter((artist) => !demoArtists.some((demo) => demo.id === artist.id))],
    [demoArtists]
  );
  const selectedArtist = allArtists.find((artist) => artist.id === artistId);
  const heroArtist = selectedArtist || artists[0];
  const marketCities = useMemo(() => simulateArtistCities(heroArtist), [heroArtist]);
  const topCity = marketCities[0];
  const [view, setView] = useState("map");
  const [selectedCityId, setSelectedCityId] = useState(topCity.id);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => {
    const storedDemoArtists = JSON.parse(window.localStorage.getItem(demoArtistsKey) || "[]");
    const availableArtists = [...storedDemoArtists, ...artists.filter((artist) => !storedDemoArtists.some((demo) => demo.id === artist.id))];
    setDemoArtists(storedDemoArtists);
    const routeArtistId = new URLSearchParams(window.location.search).get("artistId");
    if (routeArtistId && availableArtists.some((artist) => artist.id === routeArtistId)) setArtistId(routeArtistId);
    const stored = window.sessionStorage.getItem(selectedStorageKey);
    if (stored) setSelectedIds(JSON.parse(stored));
    const searchTarget = JSON.parse(window.sessionStorage.getItem("axcess_search_target") || "null");
    if (searchTarget?.target === "city") setSelectedCityId(searchTarget.id);
    if (searchTarget?.target === "artist" && availableArtists.some((artist) => artist.id === searchTarget.id)) setArtistId(searchTarget.id);
    window.sessionStorage.removeItem("axcess_search_target");
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(selectedStorageKey, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const selectedCity = marketCities.find((city) => city.id === selectedCityId) || topCity;
  const selectedCities = marketCities.filter((city) => selectedIds.includes(city.id));
  const targetCapacity = parseCapacityMax(selectedCity.capacity);
  const selectedCityVenues = recommendVenuesForHub(selectedCity, targetCapacity, 5);
  const underservedMarkets = marketCities.filter((city) => city.category === "Underserved Opportunity" || city.saturation === "Low");
  const venueGaps = marketCities.filter((city) => city.opportunity >= 78 && city.saturation !== "High");
  const regionalHubs = buildHubPlan({
    desiredStops: 4,
    includeAnchors: true,
    manualIds: selectedIds,
    maxDatesPerStop: 2,
    clusterRadius: 150,
    marketCities
  });
  const topUnderserved = [...underservedMarkets].sort((a, b) => b.opportunity - a.opportunity)[0];
  const bestAnchor = [...marketCities].filter((city) => city.anchor).sort((a, b) => b.opportunity - a.opportunity)[0];
  const topExpansion = [...marketCities].filter((city) => city.category === "Expansion Market").sort((a, b) => b.opportunity - a.opportunity)[0];
  const targetCityIds = regionalHubs.map((hub) => hub.id);

  const handleArtistChange = (value) => {
    setArtistId(value);
    if (value === "all") router.push(pathname);
    else router.push(`${pathname}?artistId=${value}`);
  };

  const toggleCity = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const openReviewPlan = () => {
    const reviewCities = selectedCities.length ? selectedCities : [selectedCity];
    const hubs = reviewCities.map((city) => {
      const cluster = buildClusterForHub(city, 150, marketCities);
      const idealCapacityPerDate = parseCapacityMax(city.capacity);
      const recommendedVenues = recommendVenuesForHub(city, idealCapacityPerDate, 5);
      const selectedVenue = recommendedVenues.find((venue) => selectedVenueIds.includes(venue.id)) || recommendedVenues[0];
      return {
        hubCity: city.city,
        includedClusterCities: cluster.includedCities.map((item) => item.city),
        totalClusterDemand: cluster.totalDemand,
        maxDatesPerStop: 2,
        recommendedDates: 2,
        selectedVenue,
        venueCapacity: selectedVenue?.capacity || 0,
        estimatedServedDemand: selectedVenue ? selectedVenue.capacity * 2 : 0,
        unmetDemand: selectedVenue ? Math.max(0, cluster.totalDemand - selectedVenue.capacity * 2) : cluster.totalDemand,
        idealCapacityPerDate
      };
    });
    const draft = {
      id: "current-review",
      name: "Current selected route",
      artist: selectedArtist?.name || "Cross-artist demo",
      status: "Session review",
      stops: reviewCities.length,
      capacity: reviewCities[0]?.capacity || "TBD",
      cities: reviewCities.map((city) => city.city),
      hubs
    };
    window.localStorage.setItem(draftPlanStorageKey, JSON.stringify([draft]));
    window.location.href = "/tour-plans/current-review";
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-ax-line bg-white p-4 shadow-premium lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Market Insights</p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.03em]">{selectedArtist ? `${selectedArtist.name} analysis` : "Cross-artist workspace insights"}</h1>
          <p className="mt-2 inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-black text-ax-red">{getArtistImage(heroArtist).includes("scdn.co") ? "Spotify data connected" : "Simulated demand model"} · Simulated search demand</p>
        </div>
        <label className="block min-w-72">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400">Artist selector</span>
          <select value={artistId} onChange={(event) => handleArtistChange(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 text-sm font-black outline-none focus:border-ax-red">
            <option value="all">All saved artists</option>
            {allArtists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
          </select>
        </label>
      </div>

      {selectedArtist ? (
        <section className="overflow-hidden rounded-[2rem] bg-[#101010] text-white shadow-premium">
          <div className="relative grid gap-8 p-7 md:grid-cols-[220px_1fr] md:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.06),transparent)]" />
            <div className="relative">
              <img
                src={getArtistImage(heroArtist)}
                alt={`${heroArtist.name} artist profile`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = placeholderImage;
                }}
                className="aspect-square w-full rounded-[1.8rem] object-cover shadow-[0_24px_80px_rgba(0,0,0,.45)]"
              />
            </div>
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">AXCESS</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.04em] md:text-7xl">{heroArtist.name}</h2>
              <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-white/62">Demand, engagement, tour history, and venue context translated into routing recommendations.</p>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/48">{heroArtist.summary}</p>
              <div className="mt-7 grid gap-4 md:grid-cols-4">
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Artist tier</span><strong className="mt-2 block text-2xl">{heroArtist.tier}</strong></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Readiness</span><strong className="mt-2 block text-2xl">{heroArtist.readiness}</strong></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Top market</span><strong className="mt-2 block text-2xl">{heroArtist.topMarket}</strong></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Image source</span><strong className="mt-2 block text-2xl">{getArtistImage(heroArtist).includes("scdn.co") ? "Spotify" : "Fallback"}</strong></div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[2rem] bg-[#101010] p-8 text-white shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">AXCESS workspace intelligence</p>
          <h2 className="mt-3 text-5xl font-black tracking-[-0.04em]">Markets worth watching</h2>
          <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-white/62">A cross-artist view of opportunity cities, underserved markets, venue demand gaps, and recent routing signals.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Top opportunity</span><strong className="mt-2 block text-2xl">{topCity.city}</strong></div>
            <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Underserved</span><strong className="mt-2 block text-2xl">{underservedMarkets.length} markets</strong></div>
            <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Venue gaps</span><strong className="mt-2 block text-2xl">{venueGaps.length}</strong></div>
            <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Recent change</span><strong className="mt-2 block text-2xl">Atlanta +7%</strong></div>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Top City" value={topCity.city} detail="highest opportunity" />
        <MetricCard label="Underserved" value={underservedMarkets.length} detail="low saturation markets" />
        <MetricCard label="Engagement" value={`${heroArtist.engagement}/100`} detail={selectedArtist ? heroArtist.name : "workspace average"} />
        <MetricCard label="Selected" value={selectedIds.length} detail="cities in session plan" />
      </div>

      <section className="mt-10 rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Market recommendations</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">Recommended cities</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-ax-line bg-ax-paper p-1">
              {["map", "list"].map((mode) => (
                <button key={mode} type="button" onClick={() => setView(mode)} className={`rounded-full px-5 py-2 text-sm font-black transition ${view === mode ? "bg-[#111111] text-white" : "text-neutral-500 hover:text-ax-ink"}`}>{mode === "map" ? "Map View" : "List View"}</button>
              ))}
            </div>
            <button type="button" onClick={() => setBuilderOpen(true)} className="rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white shadow-[0_0_25px_rgba(225,29,72,.24)] transition hover:-translate-y-0.5">Build Tour Plan</button>
          </div>
        </div>

        {selectedCities.length ? (
          <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-red-100 bg-red-50 p-3">
            <span className="px-2 py-1 text-xs font-black uppercase tracking-[0.15em] text-ax-red">Selected Cities</span>
            {selectedCities.map((city) => <button key={city.id} type="button" onClick={() => toggleCity(city.id)} className="rounded-full bg-white px-3 py-1 text-xs font-black text-ax-ink shadow-sm">{city.city} x</button>)}
          </div>
        ) : null}

        {view === "map" ? (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.45fr_.8fr]">
            <InteractiveDemandMap selectedCity={selectedCity} selectedIds={selectedIds} onSelectCity={setSelectedCityId} onToggleCity={toggleCity} hubs={regionalHubs} marketCities={marketCities} />
            <aside className="max-h-[500px] overflow-y-auto rounded-[2rem] border border-ax-line bg-ax-paper p-5">
              <CityBadge city={selectedCity} />
              <h3 className="mt-4 text-3xl font-black tracking-[-0.03em]">{selectedCity.city}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MetricCard label="Opportunity" value={selectedCity.opportunity} detail="final score" />
                <MetricCard label="Demand" value={(selectedCity.estimatedFans || 0).toLocaleString()} detail="simulated fans" />
                <MetricCard label="Capacity" value={selectedCity.capacity} detail="target range" />
                <MetricCard label="Dates" value={selectedCity.dates} detail="recommended" />
              </div>
              <p className="mt-5 text-sm font-semibold leading-6 text-neutral-500">{selectedCity.why}</p>
              <div className="mt-5 flex gap-3">
                <CityAction city={selectedCity} selected={selectedIds.includes(selectedCity.id)} onToggle={toggleCity} />
                <button type="button" onClick={openReviewPlan} className="rounded-full border border-ax-line bg-white px-4 py-2 text-sm font-black transition hover:border-ax-red">Review Plan</button>
              </div>
              <div className="mt-7">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Recommended Venues</p>
                <div className="mt-3 grid gap-3">
                  {selectedCityVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} selected={selectedVenueIds.includes(venue.id)} onSelect={() => setSelectedVenueIds((current) => current.includes(venue.id) ? current : [...current, venue.id])} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {marketCities.map((city) => (
              <article key={city.id} className={`grid gap-4 rounded-2xl border p-5 lg:grid-cols-[1.1fr_.4fr_.55fr_.9fr_auto] lg:items-center ${targetCityIds.includes(city.id) ? "border-red-200 bg-red-50/60" : "border-ax-line bg-white"}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selectedIds.includes(city.id)} onChange={() => toggleCity(city.id)} className="mt-2 h-5 w-5 accent-ax-red" />
                  <div><h3 className="text-xl font-black">{city.city}</h3><div className="mt-2 flex flex-wrap gap-2"><CityBadge city={city} />{targetCityIds.includes(city.id) ? <span className="rounded-full bg-ax-red px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">Target</span> : <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-neutral-500">Available</span>}</div></div>
                </div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Score</span><strong className="block text-2xl">{city.opportunity}</strong></div>
                <div><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Capacity</span><strong className="block">{city.capacity}</strong></div>
                <p className="text-sm font-semibold leading-6 text-neutral-500">{city.why}</p>
                <CityAction city={city} selected={selectedIds.includes(city.id)} onToggle={toggleCity} />
              </article>
            ))}
          </div>
        )}
        <section className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Regional hub opportunities</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {regionalHubs.map((hub) => (
              <article key={hub.id} className="rounded-3xl border border-ax-line bg-ax-paper p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black">{hub.city}</h3>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-ax-red">{hub.hub.category}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black">{hub.recommendedDates} dates</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MetricCard label="Demand" value={hub.totalClusterDemand.toLocaleString()} detail="estimated fans" />
                  <MetricCard label="Ideal / Date" value={hub.idealCapacityPerDate.toLocaleString()} detail="target room" />
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-neutral-500">
                  Includes {hub.includedCities.map((city) => city.city.split(",")[0]).join(", ")}. Top venue: {hub.selectedVenue?.venue || "Capacity to verify"}.
                </p>
                <p className="mt-2 text-xs font-bold text-ax-red">
                  {hub.includedCities.some((city) => city.category === "Underserved Opportunity") ? "Underserved opportunity inside this cluster." : "Anchor-led cluster with efficient regional coverage."}
                </p>
              </article>
            ))}
          </div>
          <aside className="mt-5 rounded-3xl border border-ax-line bg-[#101010] p-5 text-white shadow-premium">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">Quick summary</p>
            <div className="mt-5 grid gap-4 md:grid-cols-5">
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Top underserved</span><strong className="mt-1 block text-xl">{topUnderserved?.city}</strong></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Best anchor</span><strong className="mt-1 block text-xl">{bestAnchor?.city}</strong></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">Expansion city</span><strong className="mt-1 block text-xl">{topExpansion?.city}</strong></div>
              <div><span className="text-xs font-black uppercase tracking-[.14em] text-white/40">First test date</span><strong className="mt-1 block text-xl">{topUnderserved?.city}</strong></div>
              <p className="text-sm font-semibold leading-6 text-white/58 md:col-span-1">Suggested strategy: lock LA/NYC/Chicago as anchors, then use Charlotte or Atlanta as a controlled Southeast test hub.</p>
            </div>
          </aside>
        </section>
      </section>

      {builderOpen ? <TourPlanModal selectedIds={selectedIds} setSelectedIds={setSelectedIds} onClose={() => setBuilderOpen(false)} marketCities={marketCities} /> : null}
    </>
  );
}
