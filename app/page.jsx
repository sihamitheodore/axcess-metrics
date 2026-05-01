"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = [
  {
    title: "Create the profile",
    body: "Start with an artist name, then layer in streaming, social, and tour history signals."
  },
  {
    title: "Read the markets",
    body: "Compare demand, engagement, prior saturation, venue fit, and underserved opportunity by city."
  },
  {
    title: "Build the route",
    body: "Select cities, protect anchor markets, cluster nearby demand, and draft a tour plan."
  },
  {
    title: "Share the report",
    body: "Export city rankings, venue recommendations, capacity ranges, and routing notes."
  }
];

function PrimaryLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-9 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(225,29,72,.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(225,29,72,.55)] ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-9 py-4 text-sm font-black text-white shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-red-300/70 hover:shadow-[0_0_28px_rgba(225,29,72,.24)] ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-9 py-4 text-sm font-black text-white shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-red-300/70 hover:shadow-[0_0_28px_rgba(225,29,72,.24)] ${className}`}
    >
      {children}
    </Link>
  );
}

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [artistName, setArtistName] = useState("");
  const router = useRouter();
  const currentStep = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  const submitSearch = (event) => {
    event.preventDefault();
    const normalizedArtist = artistName.trim();
    if (!normalizedArtist) return;
    router.push(`/market-insights?artist=${encodeURIComponent(normalizedArtist)}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ax-black text-white">
      <div className="absolute inset-0 animate-drift bg-[radial-gradient(circle_at_15%_32%,rgba(151,0,0,.58),transparent_26%),radial-gradient(circle_at_84%_74%,rgba(225,29,72,.18),transparent_40%),linear-gradient(135deg,#0A0A0A_0%,#070707_58%,#140202_100%)] bg-[length:150%_150%,180%_180%,100%_100%]" />
      <div className="noise absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:92px_92px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-14">
        <Link href="/" className="text-sm font-black uppercase tracking-[.28em] text-white">
          AXCESS
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-white/62 md:flex">
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white">
            How It Works
          </Link>
          <Link href="/results" className="transition hover:text-white">
            Demo
          </Link>
          <PrimaryLink href="/workspace" className="min-h-10 px-5 py-2 text-xs">
            Open App
          </PrimaryLink>
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
            <span className="block font-black text-white">Start selling out cities.</span>
          </p>

          <form onSubmit={submitSearch} className="mt-10 max-w-2xl animate-fadeUp [animation-delay:460ms]">
            <div className="group flex min-h-16 items-center gap-4 rounded-full border border-white/20 bg-white/[.085] px-6 py-3 text-base font-extrabold text-white/72 shadow-[0_24px_90px_rgba(0,0,0,.42)] backdrop-blur-xl transition duration-300 hover:border-red-300/70 hover:shadow-[0_0_34px_rgba(225,29,72,.22)]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ax-hot shadow-[0_0_18px_rgba(225,29,72,.8)]" />
              <input
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/55"
                placeholder="Enter an artist to generate a tour plan (e.g. TWICE, Drake, Taylor Swift)"
                aria-label="Artist name"
              />
              <button
                type="submit"
                className="hidden rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[.14em] text-ax-ink transition hover:bg-red-50 hover:text-ax-red sm:inline-flex"
              >
                Analyze
              </button>
            </div>
          </form>

          <div className="mt-8 flex animate-fadeUp flex-col gap-4 [animation-delay:600ms] sm:flex-row">
            <PrimaryLink href="/dashboard" className="px-10">
              Try It Now
            </PrimaryLink>
            <SecondaryButton onClick={() => setModalOpen(true)} className="px-10">
              See How It Works
            </SecondaryButton>
          </div>
        </div>

        <aside className="absolute bottom-[12vh] right-[7vw] hidden animate-floatSlow rounded-[2rem] border border-white/15 bg-white/[.055] p-6 shadow-[0_28px_110px_rgba(0,0,0,.48)] backdrop-blur-xl lg:block">
          <p className="text-xs font-black uppercase tracking-[.18em] text-white/45">
            Routing signal
          </p>
          <div className="mt-3 text-5xl font-black">+27%</div>
          <p className="mt-2 max-w-48 text-sm font-bold leading-6 text-white/60">
            underserved demand lift across priority markets
          </p>
        </aside>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-5 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#101010] p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,.62)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">
                  Product walkthrough
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">How Axcess works</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 transition hover:border-red-300/70 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[.18em] text-white/45">
                Step {activeStep + 1} of {steps.length}
              </p>
              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <button
                    type="button"
                    key={step.title}
                    aria-label={`Go to ${step.title}`}
                    onClick={() => setActiveStep(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeStep
                        ? "w-9 bg-ax-hot shadow-[0_0_18px_rgba(225,29,72,.8)]"
                        : "w-2.5 bg-white/25 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 min-h-72 rounded-[1.8rem] border border-white/10 bg-white/[.055] p-7 transition-all duration-300">
              <p className="text-xs font-black uppercase tracking-[.16em] text-red-300">
                Step {activeStep + 1}
              </p>
              <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                {currentStep.title}
              </h3>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/62">
                {currentStep.body}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={isFirstStep}
                onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-9 py-4 text-sm font-black text-white shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-xl transition duration-300 hover:border-red-300/70 disabled:cursor-default disabled:opacity-40 disabled:hover:border-white/20"
              >
                Back
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <SecondaryLink href="/dashboard">
                Skip
                </SecondaryLink>
                {isLastStep ? (
                  <PrimaryLink href="/dashboard">
                    Start Demo
                  </PrimaryLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}
                    className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-9 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(225,29,72,.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(225,29,72,.55)]"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
