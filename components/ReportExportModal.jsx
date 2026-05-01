"use client";

import { useState } from "react";
import { artists, cities, plans, venues } from "@/lib/mockData";

const reportTypes = [
  "Market insights report",
  "Tour plan report",
  "Venue recommendations report",
  "City ranking report",
  "Full workspace report"
];

const tourPlanStorageKey = "axcess_demo_tour_plans";
const selectedCitiesKey = "axcess_selected_city_ids";
const demoArtistsKey = "axcess_demo_artists";

function parseCapacityMax(capacity = "") {
  const matches = String(capacity).match(/\d[\d,]*/g);
  if (!matches) return 0;
  return Math.max(...matches.map((item) => Number(item.replaceAll(",", ""))));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
  if (followers >= 15000000 || popularity >= 84 || tierText.includes("a-tier")) return { tier: "A-tier / Major", min: 18000, max: 24000, demandMultiplier: 1.3 };
  if (followers >= 2500000 || popularity >= 68 || tierText.includes("b-tier")) return { tier: "B-tier", min: 10000, max: 12000, demandMultiplier: 0.76 };
  if (followers >= 500000 || popularity >= 50 || tierText.includes("c-tier")) return { tier: "C-tier / Mid-tier", min: 2000, max: 6000, demandMultiplier: 0.34 };
  return { tier: "Emerging", min: 500, max: 2000, demandMultiplier: 0.12 };
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
  if (genre.includes("r&b") || genre.includes("pop")) return /new york|atlanta|los angeles|houston|chicago|dallas|san francisco/.test(cityName) ? 10 : 2;
  if (genre.includes("alt")) return /chicago|austin|seattle|san francisco|new york|los angeles/.test(cityName) ? 11 : 3;
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
  return cities.map((city, index) => {
    const searchDemand = clamp(Math.round(city.trends + genreAffinity(artist, city) + ((artistSeed + index * 7) % 13) - 6), 35, 100);
    const saturationPenalty = city.saturation === "High" ? 9 : city.saturation === "Moderate" ? 4 : 0;
    const venueFit = city.anchor ? 92 : city.category === "Expansion Market" ? 78 : 72;
    const anchorBonus = profile.tier.includes("A-tier") && city.anchor ? 8 : 0;
    const opportunity = clamp(Math.round(0.42 * searchDemand + 0.22 * engagement + 0.18 * popularity + 0.18 * venueFit - saturationPenalty + anchorBonus), 35, 99);
    return {
      ...city,
      opportunity,
      trends: searchDemand,
      searchDemandSource: "Simulated search demand",
      estimatedFans: Math.max(Math.round(profile.min * 0.75), Math.round((city.estimatedFans || 12000) * profile.demandMultiplier * (searchDemand / 86))),
      capacity: `${profile.min.toLocaleString()}-${profile.max.toLocaleString()}`,
      dates: opportunity >= 90 && profile.tier.includes("A-tier") ? "2-3" : opportunity >= 82 ? "1-2" : "1",
      category: categoryFor(opportunity, city.saturation, city.anchor),
      why: `${city.city} is ranked using simulated ${profile.tier} demand, ${artist?.genre || "genre"} affinity, engagement, venue fit, and prior saturation.`
    };
  }).sort((a, b) => b.opportunity - a.opportunity);
}

function cityBaseName(cityName = "") {
  return cityName.split(",")[0].trim();
}

function cityState(cityName = "") {
  return cityName.split(",")[1]?.trim() || "";
}

function findCity(cityName = "", marketCities = cities) {
  const base = cityBaseName(cityName).toLowerCase();
  return marketCities.find((city) => cityBaseName(city.city).toLowerCase() === base);
}

function venueRowsForCity(city) {
  const base = cityBaseName(city.city).toLowerCase();
  const state = cityState(city.city);
  const targetCapacity = parseCapacityMax(city.capacity);
  const candidates = venues.filter((venue) => venue.city.toLowerCase() === base || venue.state === state);
  const pool = candidates.length ? candidates : venues;
  return pool
    .map((venue) => {
      const diff = Math.abs(targetCapacity - venue.capacity);
      const fitScore = Math.max(45, Math.min(99, Math.round(100 - (diff / Math.max(targetCapacity, 1)) * 60 - (venue.capacity > targetCapacity ? 8 : 0))));
      return {
        report_type: "Venue recommendations",
        city: city.city,
        venue_name: venue.venue,
        venue_city: venue.city,
        venue_state: venue.state,
        capacity: venue.capacity,
        venue_type: venue.type,
        target_capacity: targetCapacity,
        fit_score: fitScore,
        reason: venue.capacity <= targetCapacity ? "At or below target capacity; reduces undersell risk." : "Above target capacity; verify demand before booking."
      };
    })
    .sort((a, b) => b.fit_score - a.fit_score)
    .slice(0, 5);
}

function readStoredPlans() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(tourPlanStorageKey) || "[]");
  } catch {
    return [];
  }
}

function readSelectedCities() {
  if (typeof window === "undefined") return [];
  try {
    const ids = JSON.parse(window.sessionStorage.getItem(selectedCitiesKey) || "[]");
    return cities.filter((city) => ids.includes(city.id));
  } catch {
    return [];
  }
}

function getSelectedArtist() {
  if (typeof window === "undefined") return artists[0];
  const demoArtists = JSON.parse(window.localStorage.getItem(demoArtistsKey) || "[]");
  const allArtists = [...demoArtists, ...artists.filter((artist) => !demoArtists.some((demo) => demo.id === artist.id))];
  const artistId = new URLSearchParams(window.location.search).get("artistId");
  return allArtists.find((artist) => artist.id === artistId) || allArtists[0] || artists[0];
}

function normalizePlans() {
  const stored = readStoredPlans();
  const seen = new Set();
  return [...stored, ...plans].filter((plan) => {
    if (seen.has(plan.id)) return false;
    seen.add(plan.id);
    return true;
  });
}

function buildReportData(selectedTypes) {
  const artist = getSelectedArtist();
  const marketCities = simulateArtistCities(artist);
  const allPlans = normalizePlans();
  const selectedPlan = allPlans[0];
  const selectedCityData = readSelectedCities();
  const selectedCityIds = new Set(selectedCityData.map((city) => city.id));
  const recommendedCities = selectedCityIds.size ? marketCities.filter((city) => selectedCityIds.has(city.id)) : marketCities;
  const cityRows = marketCities.map((city, index) => ({
    report_type: "City ranking",
    rank: index + 1,
    city: city.city,
    category: city.category,
    opportunity_score: city.opportunity,
    search_demand_score: city.trends,
    search_demand_source: city.searchDemandSource || "Simulated search demand",
    estimated_fans: city.estimatedFans,
    recommended_capacity: city.capacity,
    recommended_dates: city.dates,
    saturation: city.saturation,
    selected_for_plan: recommendedCities.some((item) => item.id === city.id) ? "Yes" : "No",
    explanation: city.why
  }));
  const venueRows = recommendedCities.flatMap(venueRowsForCity);
  const planRows = (selectedPlan?.hubs?.length ? selectedPlan.hubs : (selectedPlan?.cities || recommendedCities.map((city) => city.city)).map((cityName) => {
    const city = findCity(cityName, marketCities) || marketCities[0];
    const selectedVenue = venueRowsForCity(city)[0];
    return {
      hubCity: city.city,
      includedClusterCities: [city.city],
      totalClusterDemand: city.estimatedFans,
      maxDatesPerStop: 2,
      recommendedDates: Number(String(city.dates).match(/\d+/)?.[0] || 1),
      selectedVenue,
      venueCapacity: selectedVenue?.capacity || 0,
      estimatedServedDemand: (selectedVenue?.capacity || 0) * Number(String(city.dates).match(/\d+/)?.[0] || 1),
      unmetDemand: Math.max(0, city.estimatedFans - (selectedVenue?.capacity || 0)),
      idealCapacityPerDate: parseCapacityMax(city.capacity)
    };
  })).map((hub, index) => ({
    report_type: "Tour plan",
    stop_number: index + 1,
    hub_city: hub.hubCity,
    included_cluster_cities: Array.isArray(hub.includedClusterCities) ? hub.includedClusterCities.join("; ") : hub.includedClusterCities,
    total_demand: hub.totalClusterDemand,
    max_dates_per_stop: hub.maxDatesPerStop,
    recommended_dates: hub.recommendedDates,
    ideal_capacity_per_date: hub.idealCapacityPerDate,
    selected_venue: hub.selectedVenue?.venue || hub.selectedVenue?.venue_name || "Venue to verify",
    venue_capacity: hub.venueCapacity || hub.selectedVenue?.capacity || 0,
    served_demand: hub.estimatedServedDemand,
    unmet_demand: hub.unmetDemand
  }));
  const clusterRows = planRows.map((row) => ({
    report_type: "Cluster summary",
    hub_city: row.hub_city,
    included_cities: row.included_cluster_cities,
    total_cluster_demand: row.total_demand,
    dates: row.recommended_dates,
    served_demand: row.served_demand,
    unmet_demand: row.unmet_demand
  }));
  const artistRows = [{
    report_type: "Artist summary",
    artist: artist.name,
    tier: artist.tier,
    readiness: artist.readiness,
    genre: artist.genre,
    followers: artist.followers,
    popularity: artist.popularity,
    engagement: artist.engagement,
    top_market: artist.topMarket,
    summary: artist.summary
  }];
  const marketRows = [{
    report_type: "Market insights",
    top_city: cities[0]?.city,
    top_opportunity_score: cities[0]?.opportunity,
    underserved_markets: cities.filter((city) => city.category === "Underserved Opportunity" || city.saturation === "Low").map((city) => city.city).join("; "),
    demand_source: "Simulated demand model; Google Trends is not live in this frontend demo.",
    best_anchor_city: marketCities.filter((city) => city.anchor).sort((a, b) => b.opportunity - a.opportunity)[0]?.city,
    expansion_city: marketCities.filter((city) => city.category === "Expansion Market").sort((a, b) => b.opportunity - a.opportunity)[0]?.city,
    route_summary: `Use ${marketCities.slice(0, 3).map((city) => city.city).join(", ")} as highest-confidence stops, then test ${marketCities.find((city) => city.category === "Underserved Opportunity")?.city || marketCities[3]?.city}.`
  }];

  const includeAll = selectedTypes.includes("Full workspace report");
  return {
    title: "Axcess Tour Demand Report",
    generatedAt: new Date().toLocaleString(),
    artist,
    selectedPlan,
    sheets: {
      "Artist Summary": artistRows,
      "Market Insights": marketRows,
      "City Rankings": includeAll || selectedTypes.includes("City ranking report") || selectedTypes.includes("Market insights report") ? cityRows : [],
      "Recommended Venues": includeAll || selectedTypes.includes("Venue recommendations report") ? venueRows : [],
      "Tour Plan": includeAll || selectedTypes.includes("Tour plan report") ? planRows : [],
      "Cluster Summary": includeAll || selectedTypes.includes("Tour plan report") ? clusterRows : []
    }
  };
}

function hasReportData(reportData) {
  return Object.values(reportData.sheets).some((rows) => rows.length);
}

function csvEscape(value) {
  const stringValue = value == null ? "" : String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

function rowsToCsv(rows) {
  if (!rows.length) return "";
  const headers = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
}

function buildCsv(reportData) {
  return Object.entries(reportData.sheets)
    .filter(([, rows]) => rows.length)
    .map(([sheet, rows]) => `# ${sheet}\n${rowsToCsv(rows)}`)
    .join("\n\n");
}

function htmlEscape(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function buildExcelWorkbook(reportData) {
  const worksheets = Object.entries(reportData.sheets)
    .filter(([, rows]) => rows.length)
    .map(([sheet, rows]) => {
      const headers = Array.from(rows.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set()));
      return `<Worksheet ss:Name="${htmlEscape(sheet).slice(0, 31)}"><Table><Row>${headers.map((header) => `<Cell><Data ss:Type="String">${htmlEscape(header)}</Data></Cell>`).join("")}</Row>${rows.map((row) => `<Row>${headers.map((header) => {
        const value = row[header];
        const isNumber = typeof value === "number" && Number.isFinite(value);
        return `<Cell><Data ss:Type="${isNumber ? "Number" : "String"}">${htmlEscape(value)}</Data></Cell>`;
      }).join("")}</Row>`).join("")}</Table></Worksheet>`;
    })
    .join("");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${htmlEscape(reportData.title)}</Title>
  <Author>Axcess Demo</Author>
 </DocumentProperties>
 ${worksheets}
</Workbook>`;
}

function pdfEscape(value) {
  return String(value ?? "").replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function buildPdf(reportData) {
  const lines = [
    reportData.title,
    `Generated: ${reportData.generatedAt}`,
    `Artist/workspace: ${reportData.artist.name}`,
    `Tier: ${reportData.artist.tier} | Readiness: ${reportData.artist.readiness}`,
    "",
    "Summary metrics",
    `Followers: ${reportData.artist.followers} | Popularity: ${reportData.artist.popularity} | Engagement: ${reportData.artist.engagement}`,
    `Top market: ${reportData.artist.topMarket}`,
    "",
    "Recommended cities",
    ...reportData.sheets["City Rankings"].slice(0, 8).map((row) => `${row.rank}. ${row.city} | Score ${row.opportunity_score} | ${row.category} | ${row.recommended_capacity} | ${row.recommended_dates} dates`),
    "",
    "Selected tour plan",
    ...(reportData.sheets["Tour Plan"].length ? reportData.sheets["Tour Plan"].map((row) => `${row.stop_number}. ${row.hub_city} | Demand ${row.total_demand} | Venue ${row.selected_venue} | Dates ${row.recommended_dates} | Unmet ${row.unmet_demand}`) : ["No saved tour plan; using recommended city route."]),
    "",
    "Recommended venues",
    ...reportData.sheets["Recommended Venues"].slice(0, 12).map((row) => `${row.city}: ${row.venue_name} (${row.capacity}) | Fit ${row.fit_score}`),
    "",
    "Notes",
    "Demand note: Google Trends is not live in this frontend demo. Search interest is simulated and labeled accordingly."
  ].flatMap((line) => {
    const text = String(line);
    if (text.length <= 92) return [text];
    const chunks = [];
    for (let i = 0; i < text.length; i += 92) chunks.push(text.slice(i, i + 92));
    return chunks;
  }).slice(0, 58);
  const content = `BT /F1 12 Tf 48 760 Td 16 TL ${lines.map((line, index) => `${index ? "T*" : ""} (${pdfEscape(line)}) Tj`).join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function downloadFile({ content, filename, type }) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportExportModal({ onClose }) {
  const [selected, setSelected] = useState(reportTypes.slice(0, 1));
  const [format, setFormat] = useState("PDF");
  const [exported, setExported] = useState(false);
  const [message, setMessage] = useState("");

  const toggleType = (type) => {
    setSelected((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
    setExported(false);
    setMessage("");
  };

  const exportDemo = () => {
    const reportData = buildReportData(selected);
    if (!selected.length || !hasReportData(reportData)) {
      setMessage("No report data available yet. Generate an analysis or tour plan first.");
      setExported(false);
      return;
    }
    if (format === "CSV") {
      downloadFile({ content: buildCsv(reportData), filename: "axcess-report.csv", type: "text/csv;charset=utf-8" });
    } else if (format === "Excel") {
      downloadFile({ content: buildExcelWorkbook(reportData), filename: "axcess-report.xls", type: "application/vnd.ms-excel;charset=utf-8" });
    } else {
      downloadFile({ content: buildPdf(reportData), filename: "axcess-report.pdf", type: "application/pdf" });
    }
    setMessage(`${format} report generated with selected artist/tour plan report data.`);
    setExported(true);
  };

  return (
    <div className="print-hide fixed inset-0 z-[10000] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <section className="w-full max-w-2xl rounded-[2rem] border border-ax-line bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Export flow</p>
            <h2 className="mt-2 text-3xl font-black">Generate report</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-neutral-500">Exports use the current demo/session artist, market, venue, and tour plan data.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-ax-line px-4 py-2 text-sm font-black">Close</button>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              setSelected(selected.length === reportTypes.length ? [] : reportTypes);
              setMessage("");
              setExported(false);
            }}
            className="rounded-full border border-ax-line px-4 py-2 text-sm font-black hover:border-ax-red"
          >
            Select all
          </button>
          <div className="mt-4 grid gap-2">
            {reportTypes.map((type) => (
              <label key={type} className="flex items-center justify-between rounded-2xl border border-ax-line bg-ax-paper p-4 text-sm font-black">
                <span>{type}</span>
                <input type="checkbox" checked={selected.includes(type)} onChange={() => toggleType(type)} className="h-5 w-5 accent-ax-red" />
              </label>
            ))}
          </div>
        </div>
        <label className="mt-5 block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Export format</span>
          <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red">
            <option>PDF</option>
            <option>CSV</option>
            <option>Excel</option>
          </select>
        </label>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" data-testid="report-export-button" onClick={exportDemo} className="rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white">Export Demo</button>
          <button type="button" onClick={() => window.print()} className="rounded-full border border-ax-line px-6 py-3 text-sm font-black">Print Page</button>
        </div>
        {message ? <p className={`mt-4 rounded-2xl border p-3 text-sm font-black ${exported ? "border-red-100 bg-red-50 text-ax-red" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{message}</p> : null}
      </section>
    </div>
  );
}
