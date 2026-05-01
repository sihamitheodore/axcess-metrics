"use client";

export default function ConfirmModal({ title, body, confirmLabel = "Delete", onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-[2rem] border border-ax-line bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-ax-red">Confirm action</p>
        <h2 className="mt-2 text-3xl font-black">{title}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-neutral-500">{body}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onConfirm} className="rounded-full bg-ax-red px-5 py-3 text-sm font-black text-white">
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-ax-line bg-white px-5 py-3 text-sm font-black">
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
