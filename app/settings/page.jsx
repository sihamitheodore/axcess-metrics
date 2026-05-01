"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import Shell from "@/components/Shell";

const settingsKey = "axcess_demo_settings";

export default function Settings() {
  const [settings, setSettings] = useState({
    demoMode: true,
    maxDates: 2,
    radius: 150,
    exportFormat: "PDF",
    appearance: "Axcess editorial"
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem(settingsKey) || "null");
    if (stored) setSettings(stored);
  }, []);

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    window.localStorage.setItem(settingsKey, JSON.stringify(settings));
    setSaved(true);
  };

  return (
    <Shell active="Settings">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Settings</p>
        <h1 className="mt-2 text-5xl font-black tracking-tight">Dashboard settings</h1>
        <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">Functional placeholder settings saved locally for demo mode.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Mode" value="Demo" detail="local only" />
        <MetricCard label="Max dates" value={settings.maxDates} detail="default" />
        <MetricCard label="Radius" value={`${settings.radius} mi`} detail="cluster default" />
        <MetricCard label="Export" value={settings.exportFormat} detail="preferred" />
      </div>
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Account / workspace</p>
          <p className="mt-3 text-sm font-semibold text-neutral-500">Account and workspace management placeholder. No login required in demo mode.</p>
          <label className="mt-5 flex items-center justify-between rounded-2xl border border-ax-line bg-ax-paper p-4 text-sm font-black">
            Demo mode settings
            <input type="checkbox" checked={settings.demoMode} onChange={(event) => update("demoMode", event.target.checked)} className="h-5 w-5 accent-ax-red" />
          </label>
        </div>
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Tour planning defaults</p>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Default max dates per stop</span><select value={settings.maxDates} onChange={(event) => update("maxDates", Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red">{[1,2,3,4].map((value) => <option key={value} value={value}>{value === 4 ? "4+" : value}</option>)}</select></label>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Default clustering radius</span><select value={settings.radius} onChange={(event) => update("radius", Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red">{[50,100,150,250,500].map((value) => <option key={value} value={value}>{value} miles</option>)}</select></label>
        </div>
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Export preferences</p>
          <label className="mt-5 block"><span className="text-xs font-black uppercase tracking-[.14em] text-neutral-400">Default export format</span><select value={settings.exportFormat} onChange={(event) => update("exportFormat", event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red"><option>PDF</option><option>CSV</option><option>Excel</option></select></label>
        </div>
        <div className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Appearance</p>
          <p className="mt-3 text-sm font-semibold text-neutral-500">Placeholder for future theme controls. Current style: black/white/red Axcess editorial.</p>
          <input value={settings.appearance} onChange={(event) => update("appearance", event.target.value)} className="mt-5 h-12 w-full rounded-2xl border border-ax-line bg-ax-paper px-4 font-black outline-none focus:border-ax-red" />
        </div>
      </section>
      <button type="button" onClick={save} className="mt-8 rounded-full bg-gradient-to-r from-[#B11226] to-[#E11D48] px-6 py-3 text-sm font-black text-white shadow-glow">Save Settings</button>
      {saved ? <p className="mt-4 inline-flex rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-ax-red">Settings saved locally.</p> : null}
    </Shell>
  );
}
