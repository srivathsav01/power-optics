"use client";

import { useStoreClock } from "@/components/store/useStoreClock";
import { inStoreTime, storeStatus } from "@/lib/time";

/** "Open now · closes 9:00 pm" — computed in India time, rendered after hydration. */
export function StoreStatus({ className = "" }: { className?: string }) {
  const clock = useStoreClock();

  if (!clock) return <p className={`h-6 ${className}`} aria-hidden />;

  const status = storeStatus(inStoreTime(clock));
  return (
    <p className={`flex items-center gap-2 text-sm font-medium ${className}`}>
      <span className="relative flex size-2.5">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/60" />}
        <span className={`relative size-2.5 rounded-full ${status.open ? "bg-whatsapp" : "bg-accent"}`} />
      </span>
      {status.text}
    </p>
  );
}
