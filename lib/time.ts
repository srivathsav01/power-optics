import { site } from "@/content/site";

/** Store-local time helpers. Visitors may be anywhere, but hours are in India time. */
const TZ = "Asia/Kolkata";

const partsFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  weekday: "long",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const dayFormat = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });

export type StoreDay = {
  /** "Monday" … "Sunday" */
  weekday: string;
  /** YYYY-MM-DD in store time */
  ymd: string;
  /** minutes since midnight, store time */
  minutes: number;
  date: Date;
};

export function inStoreTime(date: Date): StoreDay {
  const p = Object.fromEntries(partsFormat.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    weekday: p.weekday,
    ymd: `${p.year}-${p.month}-${p.day}`,
    minutes: Number(p.hour) * 60 + Number(p.minute),
    date,
  };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 630 → "10:30 am" */
export const formatClock = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

export const formatDayShort = (date: Date) => dayFormat.format(date);

export function hoursOn(weekday: string) {
  const h = site.hoursSchema.find((s) => (s.dayOfWeek as readonly string[]).includes(weekday));
  return h ? { opens: toMinutes(h.opens), closes: toMinutes(h.closes) } : null;
}

export const upcomingDays = (count: number, from: Date) =>
  Array.from({ length: count }, (_, i) => inStoreTime(new Date(from.getTime() + i * 86_400_000)));

/** Appointment start times for a day; today's slots start at least an hour from now. */
export function slotsFor(day: StoreDay, now: StoreDay, step = 30, lastBeforeClose = 60) {
  const h = hoursOn(day.weekday);
  if (!h) return [];
  const slots: number[] = [];
  for (let t = h.opens; t <= h.closes - lastBeforeClose; t += step) {
    if (day.ymd === now.ymd && t < now.minutes + 60) continue;
    slots.push(t);
  }
  return slots;
}

export function storeStatus(now: StoreDay): { open: boolean; text: string } {
  const today = hoursOn(now.weekday);
  if (today && now.minutes >= today.opens && now.minutes < today.closes) {
    return { open: true, text: `Open now · closes ${formatClock(today.closes)}` };
  }
  if (today && now.minutes < today.opens) {
    return { open: false, text: `Closed · opens ${formatClock(today.opens)} today` };
  }
  const next = upcomingDays(8, now.date)
    .slice(1)
    .find((d) => hoursOn(d.weekday));
  if (!next) return { open: false, text: "Closed" };
  const label = next.ymd === upcomingDays(2, now.date)[1].ymd ? "tomorrow" : next.weekday;
  return { open: false, text: `Closed · opens ${formatClock(hoursOn(next.weekday)!.opens)} ${label}` };
}
