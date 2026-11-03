import { WEEKDAYS, type OpeningPeriod, type ShopConfig, type Weekday } from './types';

// Works out whether the shop is open. Used by the page, by sendOrder and by the config checker.

const MIDNIGHT = 24 * 60;

// "08:30" → 510 (minutes after midnight). "24:00" → 1440, allowed as a closing time. null if badly written.
export function toMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time ?? '');
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > 24 || (hours === 24 && minutes > 0)) return null;
  return hours * 60 + minutes;
}

// True if the browser knows this time zone (e.g. 'Asia/Kuala_Lumpur').
export function isTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return Boolean(timeZone);
  } catch {
    return false;
  }
}

// The day and time at the shop, whatever time zone the customer's phone is set to.
export function shopClock(date: Date, timeZone: string): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((each) => each.type === type)?.value ?? '';
  const day = part('weekday').toLowerCase().slice(0, 3) as Weekday;
  // % 24: some older browsers write midnight as "24".
  return { day, minutes: (Number(part('hour')) % 24) * 60 + Number(part('minute')) };
}

// A day's periods with their times in minutes, earliest first. Badly written ones are skipped (the checker reports them).
// Used for both open/closed and the hours list, so the two always agree.
export function sortedPeriods(periods: OpeningPeriod[] | undefined) {
  return (periods ?? [])
    .map((period) => ({ ...period, from: toMinutes(period.open), to: toMinutes(period.close) }))
    .filter((period): period is OpeningPeriod & { from: number; to: number } => period.from !== null && period.to !== null && period.from < MIDNIGHT)
    .sort((a, b) => a.from - b.from);
}

// When the shop opens next: daysAhead 0 is today, 1 tomorrow, and so on.
export type NextOpening = { day: Weekday; daysAhead: number; time: string };

export type ShopStatus =
  | { open: true; closesAt: string | null }
  // The temporarilyClosed switch is on.
  | { open: false; reason: 'switch' }
  // Outside opening hours. next is null if the hours have no open time at all.
  | { open: false; reason: 'hours'; next: NextOpening | null };

// Is the shop open at this moment? null = can't tell yet (the page is built before anyone opens it, so
// the time is only known on the phone). The switch and "no hours" don't need the time, so they answer at once.
export function shopStatus(config: ShopConfig, date: Date | null): ShopStatus | null {
  if (config.temporarilyClosed) return { open: false, reason: 'switch' };
  if (!config.openingHours) return { open: true, closesAt: null };
  if (!date) return null;

  const { day, minutes } = shopClock(date, config.timeZone);
  const today = WEEKDAYS.indexOf(day);
  // Up to 7 days ahead, so a shop open one day a week still finds next week's time.
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const weekday = WEEKDAYS[(today + daysAhead) % 7];
    for (const period of sortedPeriods(config.openingHours[weekday])) {
      if (daysAhead === 0 && period.from <= minutes && minutes < period.to) return { open: true, closesAt: closingTime(config, today, period) };
      if (daysAhead > 0 || period.from > minutes) return { open: false, reason: 'hours', next: { day: weekday, daysAhead, time: period.open } };
    }
  }
  return { open: false, reason: 'hours', next: null };
}

// When a period runs to "24:00" and the next day starts at "00:00" (hours past midnight, split over two days),
// the shop really closes at the end of the next day's period. null if it never closes (open 24/7).
function closingTime(config: ShopConfig, dayIndex: number, period: { close: string; to: number }): string | null {
  let current = period;
  for (let daysAhead = 1; daysAhead <= 7 && current.to === MIDNIGHT; daysAhead++) {
    const first = sortedPeriods(config.openingHours?.[WEEKDAYS[(dayIndex + daysAhead) % 7]])[0];
    if (!first || first.from !== 0) return current.close;
    current = first;
  }
  return current.to === MIDNIGHT ? null : current.close;
}

// The periods of one day, checked for the config checker: each problem is one sentence.
export function checkOpeningDay(day: Weekday, periods: OpeningPeriod[] | undefined): string[] {
  if (!Array.isArray(periods)) return [`openingHours.${day} is missing: use [] for a day the shop is closed.`];
  const problems: string[] = [];
  const good: { from: number; to: number; where: string }[] = [];
  for (const period of periods) {
    const where = `openingHours.${day} "${period.open}"–"${period.close}"`;
    const from = toMinutes(period.open);
    const to = toMinutes(period.close);
    if (from === null || from === MIDNIGHT) problems.push(`${where}: the opening time must be 24-hour "HH:MM", e.g. "08:00".`);
    else if (to === null) problems.push(`${where}: the closing time must be 24-hour "HH:MM", e.g. "17:00" ("24:00" for midnight).`);
    else if (to <= from) problems.push(`${where}: the closing time must be after the opening time. For hours past midnight, split them: "18:00"–"24:00" on this day and "00:00"–"02:00" on the next.`);
    else good.push({ from, to, where });
  }
  good.sort((a, b) => a.from - b.from);
  for (let index = 1; index < good.length; index++) {
    if (good[index].from < good[index - 1].to) problems.push(`${good[index].where} overlaps ${good[index - 1].where.replace(`openingHours.${day} `, '')}.`);
  }
  return problems;
}
