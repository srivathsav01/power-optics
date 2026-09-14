"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

/**
 * Current time rounded to the minute, or null during prerender/hydration so
 * server and client HTML match. Re-renders once a minute.
 */
export function useStoreClock(): Date | null {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  return minute === null ? null : new Date(minute * 60_000);
}
