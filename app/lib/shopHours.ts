import { WEEKDAYS, type OpeningHours, type Weekday } from '../data/shop';
import type { NextOpening } from '../../shops/openingHours';
import type { Copy } from './copy';

// Fills {name} gaps in a sentence, e.g. "until {time}" → "until 17:00".
export const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (gap, name: string) => values[name] ?? gap);

// "We open again tomorrow at 08:00." Today and tomorrow are named; later days use the weekday.
export function opensAgainText(t: Copy, next: NextOpening): string {
  const day = next.daysAhead === 0 ? t.today : next.daysAhead === 1 ? t.tomorrow : t.days[next.day];
  return fill(t.opensAt, { day, time: next.time });
}

// One row per weekday, Monday first, for the hours list: "08:00–14:00, 17:00–21:00" or "Closed".
export function hoursRows(t: Copy, hours: OpeningHours): { day: Weekday; label: string; times: string }[] {
  return WEEKDAYS.map((day) => {
    const periods = [...(hours[day] ?? [])].sort((a, b) => a.open.localeCompare(b.open));
    return { day, label: t.days[day], times: periods.length ? periods.map((period) => `${period.open}–${period.close}`).join(', ') : t.closedDay };
  });
}
