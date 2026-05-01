"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/workspace");
      }}
      className="inline-flex h-12 items-center rounded-full border border-ax-line bg-white px-4 text-sm font-black text-neutral-600 transition hover:border-ax-red hover:text-ax-ink"
    >
      Back
    </button>
  );
}
