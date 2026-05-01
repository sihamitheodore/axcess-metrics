"use client";

import Link from "next/link";
import { useState } from "react";

const slides = [
  {
    label: "Input",
    title: "Select an artist and define tour constraints",
    detail: "Start with an artist, then set the practical shape of the route: target stops, max dates per city, anchors, and market priorities."
  },
  {
    label: "Analysis",
    title: "Analyze streaming data, engagement, and demand",
    detail: "Axcess turns streaming reach, engagement strength, venue context, and simulated demand signals into market intelligence."
  },
  {
    label: "Optimization",
    title: "Identify high-opportunity cities and efficient routing",
    detail: "The system separates individual high-demand cities from regional hubs that cover nearby fan demand with less routing waste."
  },
  {
    label: "Output",
    title: "Generate a data-backed tour plan with venue recommendations",
    detail: "Export a tour plan with selected stops, capacity ranges, recommended dates, venues, and the reasoning behind each market."
  }
];

export default function HowItWorksPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === slides.length - 1;

  return (
    <main className="relative min-h-screen overflow-hidden bg-ax-black text-white">
      <div className="absolute inset-0 animate-drift bg-[radial-gradient(circle_at_18%_32%,rgba(177,18,38,.38),transparent_25%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,.10),transparent_22%)]" />
      <div className="noise absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:92px_92px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-14">
        <Link href="/" className="text-sm font-black uppercase tracking-[.28em]">
          AXCESS
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-white/62 md:flex">
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/how-it-works" className="text-white">
            How It Works
          </Link>
          <Link href="/results" className="transition hover:text-white">
            Demo
          </Link>
          <Link
            href="/workspace"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-5 py-2 text-xs font-black text-white shadow-[0_0_30px_rgba(225,29,72,.38)] transition hover:-translate-y-0.5"
          >
            Open App
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-8 px-6 pb-16 lg:grid-cols-[.75fr_1.25fr] lg:px-14">
        <div>
          <p className="text-xs font-black uppercase tracking-[.28em] text-red-200/80">
            How it works
          </p>
          <h1 className="mt-5 text-[clamp(3rem,7vw,7rem)] font-black leading-[.9] tracking-tight">
            From artist signal to tour route.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/62">
            A four-step walkthrough of how Axcess turns demand, engagement, routing, and venue data into a clearer tour plan.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[.065] p-6 shadow-[0_40px_120px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">
              Step {activeIndex + 1} / {slides.length}
            </p>
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.label}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to ${slide.label}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-9 bg-ax-hot shadow-[0_0_18px_rgba(225,29,72,.8)]" : "w-2.5 bg-white/25 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 min-h-72 rounded-[1.8rem] border border-white/10 bg-[#111111]/95 p-7 transition-all duration-300">
            <p className="text-sm font-black uppercase tracking-[.18em] text-white/40">
              {activeSlide.label}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              {activeSlide.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/62">
              {activeSlide.detail}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-black text-white transition hover:border-red-300/70 disabled:cursor-default disabled:opacity-40 disabled:hover:border-white/20"
            >
              Back
            </button>
            {isLast ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-7 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(225,29,72,.38)] transition hover:-translate-y-0.5"
              >
                Open Dashboard
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setActiveIndex((index) => Math.min(slides.length - 1, index + 1))}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-7 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(225,29,72,.38)] transition hover:-translate-y-0.5"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
