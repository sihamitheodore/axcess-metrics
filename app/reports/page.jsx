"use client";

import { useState } from "react";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import ReportExportModal from "@/components/ReportExportModal";
import Shell from "@/components/Shell";
import { artists, plans } from "@/lib/mockData";

const reports = [
  { id: "r1", title: "North America Market Brief", status: "Saved PDF", summary: "Anchor markets, venue gaps, and underserved opportunities for Q3 routing." },
  { id: "r2", title: "Underserved City Watchlist", status: "Draft", summary: "Charlotte, Seattle, Austin, and Atlanta surfaced as near-term expansion candidates." },
  { id: "r3", title: "Venue Capacity Fit Summary", status: "Export ready", summary: "Arena and theater capacity ranges benchmarked against current demand signals." }
];

export default function Reports() {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <Shell active="Reports">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Reports</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">Analysis reports</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">Functional demo placeholder for saved exports, generated summaries, and report drafts.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setExportOpen(true)} className="rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white shadow-glow">Generate Report</button>
          <button type="button" onClick={() => window.print()} className="rounded-full border border-ax-line bg-white px-6 py-3 text-sm font-black">Print Page</button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Saved reports" value={reports.length} detail="demo exports" />
        <MetricCard label="Artists covered" value={artists.length} detail="mock roster" />
        <MetricCard label="Route plans" value={plans.length} detail="available summaries" />
        <MetricCard label="Last export" value="Today" detail="session preview" />
      </div>
      <section className="mt-8 grid gap-5">
        {reports.map((report) => (
          <article key={report.id} className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
            <p className="text-xs font-black uppercase tracking-[.16em] text-neutral-400">{report.status}</p>
            <h2 className="mt-2 text-3xl font-black">{report.title}</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-neutral-500">{report.summary}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/market-insights" variant="outline">Open Source Analysis</Button>
              <button type="button" onClick={() => setExportOpen(true)} className="rounded-full bg-ax-ink px-6 py-3 text-sm font-black text-white">Export Demo</button>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-10 rounded-3xl border border-ax-line bg-[#101010] p-6 text-white shadow-premium">
        <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Recent analysis summaries</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-5"><h3 className="text-xl font-black">Atlanta is rising</h3><p className="mt-2 text-sm font-semibold leading-6 text-white/62">Search and venue-fit signals increased across saved artists.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-5"><h3 className="text-xl font-black">Charlotte gap</h3><p className="mt-2 text-sm font-semibold leading-6 text-white/62">High opportunity with low recent saturation supports a test stop.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.055] p-5"><h3 className="text-xl font-black">Anchor stability</h3><p className="mt-2 text-sm font-semibold leading-6 text-white/62">LA, NYC, and Chicago remain required limited-route hubs.</p></div>
        </div>
      </section>
      {exportOpen ? <ReportExportModal onClose={() => setExportOpen(false)} /> : null}
    </Shell>
  );
}
