export default function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-ax-line bg-white p-5 shadow-premium">
      <div className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-neutral-500">{label}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-ax-ink">{value}</div>
      {detail ? <p className="mt-2 text-sm font-semibold text-neutral-500">{detail}</p> : null}
    </div>
  );
}
