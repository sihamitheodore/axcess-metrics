"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import Shell from "@/components/Shell";
import { cities, plans } from "@/lib/mockData";

const draftPlanStorageKey = "axcess_demo_tour_plans";
const deletedPlansKey = "axcess_deleted_plan_ids";

export default function TourPlansDashboard() {
  const [sessionPlans, setSessionPlans] = useState([]);
  const [deletedPlanIds, setDeletedPlanIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setSessionPlans(JSON.parse(window.localStorage.getItem(draftPlanStorageKey) || "[]"));
    setDeletedPlanIds(JSON.parse(window.localStorage.getItem(deletedPlansKey) || "[]"));
  }, []);

  const mergedPlans = [...sessionPlans, ...plans].reduce((uniquePlans, plan) => {
    if (uniquePlans.some((item) => item.id === plan.id)) return uniquePlans;
    return [...uniquePlans, plan];
  }, []);

  const allPlans = mergedPlans
    .map((plan) => ({ ...plan, status: plan.status === "Draft" ? "Draft" : plan.status === "Session draft" ? "Draft" : "Planned" }))
    .filter((plan) => !deletedPlanIds.includes(plan.id));
  const draftPlans = allPlans.filter((plan) => plan.status === "Draft");
  const plannedPlans = allPlans.filter((plan) => plan.status === "Planned");

  const confirmDelete = () => {
    const nextDeleted = [...new Set([...deletedPlanIds, pendingDelete.id])];
    const nextSessionPlans = sessionPlans.filter((plan) => plan.id !== pendingDelete.id);
    setDeletedPlanIds(nextDeleted);
    setSessionPlans(nextSessionPlans);
    window.localStorage.setItem(deletedPlansKey, JSON.stringify(nextDeleted));
    window.localStorage.setItem(draftPlanStorageKey, JSON.stringify(nextSessionPlans));
    setPendingDelete(null);
  };

  const moveToPlanned = (plan) => {
    const nextSessionPlans = [{ ...plan, status: "Planned" }, ...sessionPlans.filter((item) => item.id !== plan.id)].slice(0, 8);
    setSessionPlans(nextSessionPlans);
    window.localStorage.setItem(draftPlanStorageKey, JSON.stringify(nextSessionPlans));
  };

  return (
    <Shell active="Tour Plans">
      <div className="mb-6 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-900">
        Demo mode — your work won’t be saved after this session.
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">Tour plans</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">Saved and planned stops</h1>
          <p className="mt-3 max-w-2xl font-semibold leading-7 text-neutral-500">
            Session draft routes, selected markets, capacity ranges, and hub strategy.
          </p>
        </div>
        <Button href="/market-insights">Build Tour Plan</Button>
      </div>
      {[
        ["Draft plans", draftPlans],
        ["Active / planned tour plans", plannedPlans]
      ].map(([title, group]) => (
      <section key={title} className="mt-8 grid gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-ax-red">{title}</p>
        </div>
        {group.map((plan) => (
          <article key={`${title}-${plan.id}`} className="rounded-3xl border border-ax-line bg-white p-6 shadow-premium">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-neutral-400">{plan.status}</p>
                <h2 className="mt-2 text-3xl font-black">{plan.name}</h2>
                <p className="mt-2 text-sm font-bold text-neutral-500">{plan.artist} · {plan.stops} stops · {plan.capacity}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button href={`/tour-plans/${plan.id}`} variant="outline">Review Plan</Button>
                <Button href={`/tour-plans/${plan.id}/edit`} variant="dark">Edit Plan</Button>
                {plan.status === "Draft" ? (
                  <button type="button" onClick={() => moveToPlanned(plan)} className="rounded-full border border-ax-line bg-white px-5 py-3 text-sm font-black transition hover:border-ax-red">
                    Move to Planned
                  </button>
                ) : null}
                <button type="button" onClick={() => setPendingDelete(plan)} className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-ax-red transition hover:border-ax-red">
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {plan.cities.map((city, cityIndex) => <span key={`${plan.id}-${city}-${cityIndex}`} className="rounded-full border border-ax-line bg-ax-paper px-3 py-1 text-sm font-black">{city}</span>)}
            </div>
          </article>
        ))}
      </section>
      ))}
      <section className="mt-10 rounded-3xl border border-ax-line bg-[#101010] p-6 text-white shadow-premium">
        <p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Suggested next route</p>
        <h2 className="mt-2 text-3xl font-black">Hub plan preview</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {cities.slice(0, 2).map((city) => (
            <div key={city.city} className="rounded-2xl border border-white/10 bg-white/[.055] p-5">
              <h3 className="text-xl font-black">{city.city}</h3>
              <p className="mt-2 text-sm font-bold text-white/58">{city.category} · {city.capacity} · {city.dates} dates</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/62">{city.why}</p>
            </div>
          ))}
        </div>
      </section>
      {pendingDelete ? (
        <ConfirmModal
          title={`Delete ${pendingDelete.name}?`}
          body="This only removes the tour plan from the current demo/session state."
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </Shell>
  );
}
