"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import Shell from "@/components/Shell";
import { artists } from "@/lib/mockData";

const deletedArtistsKey = "axcess_deleted_artist_ids";
const demoArtistsKey = "axcess_demo_artists";

export default function ArtistsDashboard() {
  const [deletedIds, setDeletedIds] = useState([]);
  const [demoArtists, setDemoArtists] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setDeletedIds(JSON.parse(window.localStorage.getItem(deletedArtistsKey) || "[]"));
    setDemoArtists(JSON.parse(window.localStorage.getItem(demoArtistsKey) || "[]"));
  }, []);

  const allArtists = [...demoArtists, ...artists.filter((artist) => !demoArtists.some((demo) => demo.id === artist.id))];
  const visibleArtists = allArtists.filter((artist) => !deletedIds.includes(artist.id));

  const confirmDelete = () => {
    const next = [...new Set([...deletedIds, pendingDelete.id])];
    setDeletedIds(next);
    window.localStorage.setItem(deletedArtistsKey, JSON.stringify(next));
    setPendingDelete(null);
  };

  return (
    <Shell active="Artists">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Saved artists</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">Artist roster</h1>
          <p className="mt-3 font-semibold text-neutral-500">Demo artists can be removed from this session without affecting source data.</p>
        </div>
        <Button href="/artist-profile">Create Artist Profile</Button>
      </div>
      <div className="mt-8 grid gap-5">
        {visibleArtists.map((artist) => (
          <article key={artist.id} className="grid gap-5 rounded-3xl border border-ax-line bg-white p-5 shadow-premium lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-neutral-400">{artist.genre}</p>
              <h2 className="mt-2 text-3xl font-black">{artist.name}</h2>
              <p className="mt-2 text-sm font-bold text-neutral-500">{artist.tier} · {artist.followers} followers · popularity {artist.popularity}/100</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-ax-red">Top market: {artist.topMarket}</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600">Readiness: {artist.readiness}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button href={`/market-insights?artistId=${artist.id}`} variant="outline">Open Analysis</Button>
              <button type="button" onClick={() => setPendingDelete(artist)} className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-ax-red transition hover:border-ax-red">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {pendingDelete ? (
        <ConfirmModal
          title={`Delete ${pendingDelete.name}?`}
          body="This only removes the artist from the current demo/session state."
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </Shell>
  );
}
