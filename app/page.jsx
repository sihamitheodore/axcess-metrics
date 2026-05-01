"use client";

import { useState } from "react";

const steps = [
  {
    title: "Create an artist profile",
    body: "Start with an artist name, then layer in optional social, streaming, and tour signals."
  },
  {
    title: "Find demand signals",
    body: "Review city demand, market fit, underserved opportunities, and recommended routing logic."
  },
  {
    title: "Build the plan",
    body: "Turn priority markets into a draft route with capacity, venue, and date recommendations."
  },
  {
    title: "Share the report",
    body: "Export the tour strategy for teams, partners, and decision makers."
  }
];

function CtaLink({ href, children, variant = "primary", onClick }) {
  const className = variant === "primary" ? "cta ctaPrimary" : "cta ctaSecondary";

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="landing">
      <div className="glow" />
      <div className="grain" />
      <div className="grid" />

      <header className="nav">
        <a className="brand" href="/">
          AXCESS
        </a>
        <nav className="navLinks" aria-label="Primary navigation">
          <a href="/dashboard">Dashboard</a>
          <a href="/market-insights">Demo Results</a>
          <CtaLink href="/dashboard">Open Demo</CtaLink>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Tour demand intelligence</p>
          <div className="wordmark">AXCESS</div>
          <h1>Plan tours where fans are already waiting.</h1>
          <p className="subtext">
            <span>Stop guessing markets.</span>
            <strong>Start selling out cities.</strong>
          </p>

          <div className="searchBar" aria-label="Search artist placeholder">
            <span className="pulse" />
            <span>Search artist (e.g. TWICE, Drake, Taylor Swift)</span>
          </div>

          <div className="actions">
            <CtaLink href="/dashboard">Try It Now</CtaLink>
            <CtaLink variant="secondary" onClick={() => setModalOpen(true)}>
              See How It Works
            </CtaLink>
          </div>
        </div>

        <aside className="signalCard" aria-label="Routing intelligence preview">
          <p>Routing signal</p>
          <strong>+27%</strong>
          <span>underserved demand lift across priority markets</span>
        </aside>
      </section>

      {modalOpen ? (
        <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="How Axcess works">
          <div className="modal">
            <div className="modalHeader">
              <div>
                <p className="eyebrow modalEyebrow">Product walkthrough</p>
                <h2>How Axcess works</h2>
              </div>
              <button className="closeButton" type="button" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>

            <div className="steps">
              {steps.map((step, index) => (
                <article className="step" key={step.title}>
                  <p>Step {index + 1}</p>
                  <h3>{step.title}</h3>
                  <span>{step.body}</span>
                </article>
              ))}
            </div>

            <div className="modalActions">
              <CtaLink href="/dashboard">Start</CtaLink>
              <CtaLink href="/dashboard" variant="secondary">
                Skip
              </CtaLink>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #0a0a0a;
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .landing {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #0a0a0a;
          color: #fff;
        }

        .glow,
        .grain,
        .grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glow {
          animation: drift 18s ease-in-out infinite alternate;
          background:
            radial-gradient(circle at 16% 34%, rgba(177, 18, 38, 0.54), transparent 25%),
            radial-gradient(circle at 82% 72%, rgba(225, 29, 72, 0.16), transparent 38%),
            linear-gradient(135deg, #0a0a0a 0%, #070707 58%, #140202 100%);
          background-size: 150% 150%, 180% 180%, 100% 100%;
        }

        .grain {
          opacity: 0.32;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
          background-size: 3px 3px, 5px 5px;
        }

        .grid {
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 92px 92px;
        }

        .nav {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px clamp(24px, 4vw, 56px);
        }

        .brand {
          color: #fff;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.28em;
          text-decoration: none;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .navLinks a {
          color: rgba(255, 255, 255, 0.62);
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: color 220ms ease;
        }

        .navLinks a:hover {
          color: #fff;
        }

        .hero {
          position: relative;
          z-index: 1;
          display: grid;
          min-height: calc(100vh - 88px);
          align-items: center;
          padding: 0 clamp(24px, 4vw, 56px) 80px;
        }

        .heroCopy {
          max-width: 1050px;
        }

        .eyebrow {
          margin: 0;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
          color: rgba(255, 205, 211, 0.8);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .wordmark {
          margin-top: 20px;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both;
          color: #f6f1f1;
          font-size: clamp(4.25rem, 12vw, 11rem);
          font-weight: 950;
          letter-spacing: 0.015em;
          line-height: 0.78;
        }

        h1 {
          max-width: 1030px;
          margin: 32px 0 0;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
          font-size: clamp(3rem, 6.3vw, 6.8rem);
          font-weight: 950;
          letter-spacing: -0.045em;
          line-height: 0.9;
        }

        .subtext {
          margin: 32px 0 0;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 320ms both;
          color: rgba(255, 255, 255, 0.64);
          font-size: clamp(1.25rem, 2vw, 1.55rem);
          font-weight: 650;
          line-height: 1.45;
        }

        .subtext span,
        .subtext strong {
          display: block;
        }

        .subtext strong {
          color: #fff;
          font-weight: 950;
        }

        .searchBar {
          display: flex;
          align-items: center;
          gap: 16px;
          width: min(100%, 680px);
          min-height: 64px;
          margin-top: 40px;
          padding: 18px 24px;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 460ms both;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.085);
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
          color: rgba(255, 255, 255, 0.72);
          font-size: 16px;
          font-weight: 850;
          backdrop-filter: blur(18px);
          transition: border-color 250ms ease, box-shadow 250ms ease;
        }

        .searchBar:hover {
          border-color: rgba(248, 113, 113, 0.72);
          box-shadow: 0 0 34px rgba(225, 29, 72, 0.22);
        }

        .pulse {
          width: 10px;
          height: 10px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #e11d48;
          box-shadow: 0 0 18px rgba(225, 29, 72, 0.82);
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 32px;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 600ms both;
        }

        .cta {
          display: inline-flex;
          min-height: 54px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 15px 34px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }

        .cta:hover {
          transform: translateY(-2px);
        }

        .ctaPrimary {
          border: 0;
          background: linear-gradient(90deg, #b11226, #e11d48);
          box-shadow: 0 0 30px rgba(225, 29, 72, 0.38);
          color: white;
        }

        .ctaPrimary:hover {
          box-shadow: 0 0 40px rgba(225, 29, 72, 0.52);
        }

        .ctaSecondary {
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(18px);
        }

        .ctaSecondary:hover {
          border-color: rgba(248, 113, 113, 0.72);
          box-shadow: 0 0 24px rgba(225, 29, 72, 0.18);
        }

        .signalCard {
          position: absolute;
          right: 7vw;
          bottom: 12vh;
          display: none;
          width: 250px;
          animation: floatSlow 8s ease-in-out infinite;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 28px 110px rgba(0, 0, 0, 0.48);
          padding: 24px;
          backdrop-filter: blur(20px);
        }

        .signalCard p {
          margin: 0;
          color: rgba(255, 255, 255, 0.45);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .signalCard strong {
          display: block;
          margin-top: 12px;
          font-size: 52px;
          font-weight: 950;
          line-height: 1;
        }

        .signalCard span {
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.55;
        }

        .modalOverlay {
          position: fixed;
          z-index: 50;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.74);
          backdrop-filter: blur(12px);
        }

        .modal {
          width: min(100%, 760px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          background: #101010;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.62);
          padding: 28px;
        }

        .modalHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .modalEyebrow {
          color: #fca5a5;
        }

        .modal h2 {
          margin: 12px 0 0;
          font-size: clamp(2rem, 4vw, 2.65rem);
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .closeButton {
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          padding: 9px 16px;
          font-size: 14px;
          font-weight: 800;
          transition: border-color 220ms ease, color 220ms ease;
        }

        .closeButton:hover {
          border-color: rgba(248, 113, 113, 0.72);
          color: white;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .step {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.055);
          padding: 20px;
        }

        .step p {
          margin: 0;
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .step h3 {
          margin: 12px 0 0;
          font-size: 20px;
          font-weight: 950;
        }

        .step span {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 14px;
          font-weight: 650;
          line-height: 1.65;
        }

        .modalActions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .modalActions .cta {
          flex: 1;
        }

        @media (min-width: 1024px) {
          .signalCard {
            display: block;
          }
        }

        @media (max-width: 760px) {
          .navLinks {
            display: none;
          }

          .hero {
            padding-bottom: 56px;
          }

          .searchBar {
            align-items: flex-start;
            border-radius: 28px;
          }

          .actions,
          .modalActions {
            flex-direction: column;
          }

          .steps {
            grid-template-columns: 1fr;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drift {
          from {
            background-position: 0% 42%, 100% 50%, 0 0;
          }
          to {
            background-position: 18% 50%, 76% 38%, 0 0;
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </main>
  );
}
