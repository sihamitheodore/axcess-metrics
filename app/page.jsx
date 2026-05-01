"use client";

import { useState } from "react";
import Button from "@/components/Button";

const walkthroughSteps = [
  {
    title: "Create an artist profile",
    body: "Enter an artist name and optional social, streaming, and tour signals to start a temporary demo analysis."
  },
  {
    title: "Read market demand",
    body: "Axcess scores cities using demand, engagement, venue fit, and simulated routing context."
  },
  {
    title: "Build a route",
    body: "Select stops, include anchor markets, group nearby demand into hubs, and draft a tour plan."
  },
  {
    title: "Export the plan",
    body: "Review recommended cities, venues, dates, and capacity ranges before sharing the report."
  }
];

export default function Landing() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ax-black text-white">
      <div className="absolute inset-0 animate-drift bg-[radial-gradient(circle_at_16%_34%,rgba(151,0,0,.52),transparent_25%),radial-gradient(circle_at_82%_72%,rgba(225,29,72,.16),transparent_38%),linear-gradient(135deg,#0A0A0A_0%,#070707_58%,#140202_100%)] bg-[length:150%_150%,180%_180%,100%_100%]" />
      <div className="noise absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:92px_92px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-14">
        <a href="/" className="text-sm font-black uppercase tracking-[.28em] text-white">
          AXCESS
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-white/62 md:flex">
          <a className="transition hover:text-white" href="/market-insights">
            Demo Results
          </a>
          <a className="transition hover:text-white" href="/reports">
            Reports
          </a>
          <Button href="/dashboard" className="min-h-10 px-5 py-2 text-xs">
            Open Demo
          </Button>
        </nav>
      </header>

      <section className="relative z-10 grid min-h-[calc(100vh-88px)] items-center px-6 pb-20 lg:px-14">
        <div className="max-w-5xl">
          <p className="animate-fadeUp text-xs font-black uppercase tracking-[.28em] text-red-200/80">
            Tour demand intelligence
          </p>
          <div className="mt-5 animate-fadeUp text-[clamp(4.25rem,12vw,11rem)] font-black leading-[.78] tracking-[.015em] text-[#f6f1f1] [animation-delay:80ms]">
            AXCESS
          </div>
          <h1 className="mt-8 max-w-5xl animate-fadeUp text-[clamp(3rem,6.3vw,6.8rem)] font-black leading-[.9] tracking-tight [animation-delay:180ms]">
            Plan tours where fans are already waiting.
          </h1>
          <p className="mt-8 animate-fadeUp text-xl font-semibold leading-8 text-white/64 [animation-delay:320ms] md:text-2xl">
            <span className="block">Stop guessing markets.</span>
            <em className="block font-black not-italic text-white">Start selling out cities.</em>
          </p>

          <div className="mt-10 max-w-2xl animate-fadeUp [animation-delay:460ms]">
            <div className="group flex h-16 items-center gap-4 rounded-full border border-white/20 bg-white/[.085] px-6 text-base font-extrabold text-white/72 shadow-[0_24px_90px_rgba(0,0,0,.42)] backdrop-blur-xl transition duration-300 hover:border-red-300/70 hover:shadow-[0_0_34px_rgba(225,29,72,.22)]">
              <span className="h-2.5 w-2.5 rounded-full bg-ax-hot shadow-[0_0_18px_rgba(225,29,72,.8)]" />
              <span>Search artist (e.g. TWICE, Drake, Taylor Swift)</span>
            </div>
          </div>

          <div className="mt-8 flex animate-fadeUp flex-col gap-4 [animation-delay:600ms] sm:flex-row">
            <Button href="/dashboard" className="px-10">
              Try It Now
            </Button>
            <Button onClick={() => setWalkthroughOpen(true)} variant="secondary" className="px-10">
              See How It Works
            </Button>
          </div>
        </div>

        <div className="absolute bottom-[12vh] right-[7vw] hidden animate-floatSlow rounded-[2rem] border border-white/14 bg-white/[.055] p-6 shadow-[0_28px_110px_rgba(0,0,0,.48)] backdrop-blur-xl lg:block">
          <p className="text-xs font-black uppercase tracking-[.18em] text-white/45">
            Routing signal
          </p>
          <div className="mt-3 text-5xl font-black">+27%</div>
          <p className="mt-2 max-w-48 text-sm font-bold leading-6 text-white/60">
            underserved demand lift across priority markets
          </p>
        </div>
      </section>

      {walkthroughOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/74 px-5 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#101010] p-7 shadow-[0_40px_120px_rgba(0,0,0,.62)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">
                  Product walkthrough
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">How Axcess works</h2>
              </div>
              <button
                type="button"
                onClick={() => setWalkthroughOpen(false)}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 transition hover:border-red-300/70 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {walkthroughSteps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[.055] p-5">
                  <div className="text-xs font-black uppercase tracking-[.16em] text-white/40">
                    Step {index + 1}
                  </div>
                  <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/62">{step.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/dashboard" className="flex-1">
                Start Now
              </Button>
              <Button href="/dashboard" variant="secondary" className="flex-1">
                Skip
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
