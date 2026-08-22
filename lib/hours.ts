import type { BusinessHours, BusinessHoursDay, DayKey } from "./directory";

// Sunday-first, matching both the backend's JSON shape and how every hours
// list/editor in the app displays the week.
export const DAY_KEYS: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const DAY_LABELS: Record<DayKey, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

// Sensible starting point for a business that's never set hours before —
// the API has no default of its own, so the client makes one up.
export const DEFAULT_HOURS: BusinessHours = DAY_KEYS.reduce((acc, day) => {
  acc[day] = { closed: false, open: "09:00", close: "17:00" };
  return acc;
}, {} as BusinessHours);

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  const hour = Number(hStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${mStr} ${period}`;
}

export function formatDayRange(day: BusinessHoursDay | undefined): string {
  if (!day || day.closed || !day.open || !day.close) return "Closed";
  return `${formatTime12h(day.open)} – ${formatTime12h(day.close)}`;
}

// Client-side mirror of the backend's own rule ("don't let someone pick a close
// time earlier than open") — catches it before the request round-trip.
export function validateHours(hours: BusinessHours): Partial<Record<DayKey, string>> {
  const errors: Partial<Record<DayKey, string>> = {};
  for (const day of DAY_KEYS) {
    const d = hours[day];
    if (!d || d.closed) continue;
    if (!d.open || !d.close) {
      errors[day] = "Set both an open and a close time.";
      continue;
    }
    if (d.open >= d.close) {
      errors[day] = "Open must be earlier than close.";
    }
  }
  return errors;
}

// Zod validation-error keys for the hours object aren't guaranteed to match day
// names exactly, so match case-insensitively/by-substring rather than assuming
// one specific key shape — a leftover, unmatched key still gets surfaced by the
// caller's generic toast fallback.
export function mapFieldErrorsToDays(
  fieldErrors: Record<string, string[]>
): Partial<Record<DayKey, string>> {
  const dayErrors: Partial<Record<DayKey, string>> = {};
  for (const [key, msgs] of Object.entries(fieldErrors)) {
    const lower = key.toLowerCase();
    const day = DAY_KEYS.find((d) => lower.includes(d));
    if (day) dayErrors[day] = Array.isArray(msgs) ? msgs[0] : String(msgs);
  }
  return dayErrors;
}

// Date#getDay() returns 0 for Sunday through 6 for Saturday — same order as DAY_KEYS.
export function todayKey(now: Date = new Date()): DayKey {
  return DAY_KEYS[now.getDay()];
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Returns null when hours aren't set at all, so callers can skip the badge
// rather than implying a definite open/closed state from missing data.
export function isOpenNow(hours: BusinessHours | null, now: Date = new Date()): boolean | null {
  if (!hours) return null;
  const day = hours[todayKey(now)];
  if (!day || day.closed || !day.open || !day.close) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= toMinutes(day.open) && nowMinutes < toMinutes(day.close);
}
