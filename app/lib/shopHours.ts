import { WEEKDAYS, type OpeningHours, type Weekday } from '../data/shop';
import { sortedPeriods, type NextOpening } from '../../shops/openingHours';
import type { Copy } from './copy';

// Fills {name} gaps in a sentence, e.g. "until {time}" → "until 17:00".
export const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (gap, name: string) => values[name] ?? gap);

// "24:00" reads oddly to customers, so it is shown as "midnight".
export const timeText = (t: Copy, time: string) => (time === '24:00' ? t.midnight : time);

// "We open again tomorrow at 08:00." Today and tomorrow are named, then the weekday; a week ahead
// (the same weekday as today) is "next Tuesday", so it doesn't sound like later today.
export function opensAgainText(t: Copy, next: NextOpening): string {
  const day = next.daysAhead === 0 ? t.today
    : next.daysAhead === 1 ? t.tomorrow
    : next.daysAhead === 7 ? fill(t.nextWeekday, { day: t.days[next.day] })
    : t.days[next.day];
  return fill(t.opensAt, { day, time: timeText(t, next.time) });
}

// One row per weekday, Monday first, for the hours list: "08:00–14:00, 17:00–21:00" or "Closed".
export function hoursRows(t: Copy, hours: OpeningHours): { day: Weekday; label: string; times: string }[] {
  return WEEKDAYS.map((day) => {
    const periods = sortedPeriods(hours[day]);
    return { day, label: t.days[day], times: periods.length ? periods.map((period) => `${period.open}–${period.close}`).join(', ') : t.closedDay };
  });
}
