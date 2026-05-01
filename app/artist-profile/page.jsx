"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";

const demoArtistsKey = "axcess_demo_artists";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArtistProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    artistName: "",
    spotifyUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    websiteUrl: "",
    trendsKeyword: ""
  });
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const analyzeArtist = (event) => {
    event.preventDefault();
    const name = form.artistName.trim();
    if (!name) {
      setError("Artist name is required before analysis.");
      return;
    }
    const id = `${slugify(name) || "artist"}-${Date.now()}`;
    const newArtist = {
      id,
      name,
      tier: "B-tier / Mid-to-high",
      readiness: "Ready",
      topMarket: "Los Angeles, CA",
      genre: "Demo profile",
      followers: "Simulated",
      popularity: 74,
      engagement: 78,
      spotifyImageUrl: "",
      spotifyArtistData: { images: [] },
      image: "",
      summary: `${name} profile generated from demo intake. Routing recommendations use current mock market, venue, and demand signals until live backend analysis is connected.`,
      sources: {
        spotifyUrl: form.spotifyUrl,
        youtubeUrl: form.youtubeUrl,
        instagramUrl: form.instagramUrl,
        tiktokUrl: form.tiktokUrl,
        websiteUrl: form.websiteUrl,
        trendsKeyword: form.trendsKeyword,
        priorTourCsv: fileName
      }
    };
    const existing = JSON.parse(window.localStorage.getItem(demoArtistsKey) || "[]");
    const nextArtists = [newArtist, ...existing.filter((artist) => artist.id !== id)].slice(0, 12);
    window.localStorage.setItem(demoArtistsKey, JSON.stringify(nextArtists));
    window.sessionStorage.setItem("axcess_search_target", JSON.stringify({ target: "artist", id }));
    router.push(`/market-insights?artistId=${id}`);
  };

  const fields = [
    ["artistName", "Artist name", "TWICE"],
    ["spotifyUrl", "Spotify URL", "Optional"],
    ["youtubeUrl", "YouTube URL", "Optional"],
    ["instagramUrl", "Instagram URL", "Optional"],
    ["tiktokUrl", "TikTok URL", "Optional"],
    ["websiteUrl", "Official website URL", "Optional"],
    ["trendsKeyword", "Google Trends keyword", "Optional"]
  ];

  return (
    <main className="min-h-screen bg-ax-paper px-5 py-8 text-ax-ink lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <a href="/" className="text-sm font-black tracking-[.2em] text-ax-red">
            AXCESS
          </a>
          <Button href="/dashboard" variant="outline">
            Dashboard
          </Button>
        </div>

        <form onSubmit={analyzeArtist} className="rounded-[2rem] border border-ax-line bg-white p-7 shadow-premium lg:p-10">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">
            Demo artist profile builder
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">Build an artist profile</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">
            Frontend-only intake modeled after the Streamlit data flow. Submitting stores a temporary demo artist and opens artist-specific analysis.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {fields.map(([field, label, placeholder]) => (
              <label key={field} className={field === "trendsKeyword" ? "block lg:col-span-2" : "block"}>
                <span className="text-xs font-black uppercase tracking-[.14em] text-neutral-500">
                  {label}
                </span>
                <input
                  value={form[field]}
                  onChange={(event) => update(field, event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-bold outline-none focus:border-ax-red"
                  placeholder={placeholder}
                  required={field === "artistName"}
                />
              </label>
            ))}

            <label className="block lg:col-span-2">
              <span className="text-xs font-black uppercase tracking-[.14em] text-neutral-500">
                Prior tour CSV
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
                className="mt-2 block w-full cursor-pointer rounded-2xl border border-dashed border-ax-line bg-ax-paper px-4 py-5 text-sm font-bold text-neutral-600 file:mr-5 file:cursor-pointer file:rounded-full file:border-0 file:bg-ax-ink file:px-5 file:py-3 file:text-sm file:font-black file:text-white hover:border-ax-red"
              />
              <p className="mt-2 text-sm font-semibold text-neutral-500">
                Optional: upload prior tour, concert, or festival data. Mock frontend only for now.
              </p>
            </label>
          </div>

          {error ? <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-black text-ax-red">{error}</p> : null}

          <div className="mt-8 flex gap-3">
            <Button type="submit">Analyze Artist</Button>
            <Button href="/dashboard" variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </form>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Estimated artist tier" value="B-tier" detail="simulated preview" />
          <MetricCard label="Audience strength" value="Modeled" detail="Spotify + social proxy" />
          <MetricCard label="Touring readiness" value="Ready" detail="mock scoring" />
        </div>
      </div>
    </main>
  );
}
