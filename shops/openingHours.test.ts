import { describe, expect, it } from 'vitest';
import { shopConfig } from '../app/data/shop';
import { checkOpeningDay, isTimeZone, shopClock, shopStatus, toMinutes } from './openingHours';
import type { OpeningHours, ShopConfig } from './types';

// A time in Malaysia (UTC+8). 3 Nov 2026 is a Tuesday.
const kl = (local: string) => new Date(`${local}:00+08:00`);

const hours: OpeningHours = {
  mon: [],
  tue: [{ open: '08:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
  wed: [{ open: '08:00', close: '14:00' }],
  thu: [], fri: [], sat: [], sun: [],
};
const shop = (changes: Partial<ShopConfig> = {}): ShopConfig =>
  ({ ...shopConfig, openingHours: hours, timeZone: 'Asia/Kuala_Lumpur', temporarilyClosed: false, ...changes });

describe('toMinutes', () => {
  it('reads 24-hour times, with 24:00 as midnight', () => {
    expect(toMinutes('08:30')).toBe(510);
    expect(toMinutes('24:00')).toBe(1440);
  });
  it('refuses badly written times', () => {
    for (const bad of ['8:30', '08:60', '25:00', '24:30', '8am', '']) expect(toMinutes(bad)).toBeNull();
  });
});

describe('shopClock', () => {
  it("uses the shop's time zone, not the phone's", () => {
    // 00:30 in London is 08:30 in Kuala Lumpur, the same moment.
    expect(shopClock(new Date('2026-11-03T00:30:00Z'), 'Asia/Kuala_Lumpur')).toEqual({ day: 'tue', minutes: 510 });
    expect(shopClock(kl('2026-11-03T00:05'), 'Asia/Kuala_Lumpur')).toEqual({ day: 'tue', minutes: 5 });
  });
});

describe('shopStatus', () => {
  it('is open inside a period and says when it closes', () => {
    expect(shopStatus(shop(), kl('2026-11-03T08:00'))).toEqual({ open: true, closesAt: '14:00' });
    expect(shopStatus(shop(), kl('2026-11-03T20:59'))).toEqual({ open: true, closesAt: '21:00' });
  });

  it('is closed at closing time and during a break, and opens again later today', () => {
    expect(shopStatus(shop(), kl('2026-11-03T14:00'))).toEqual({ open: false, reason: 'hours', next: { day: 'tue', daysAhead: 0, time: '17:00' } });
  });

  it('finds the next open day, skipping closed days', () => {
    expect(shopStatus(shop(), kl('2026-11-03T21:00'))).toMatchObject({ next: { day: 'wed', daysAhead: 1, time: '08:00' } });
    // Wednesday afternoon: next is Tuesday, 6 days later (Thu–Mon are closed).
    expect(shopStatus(shop(), kl('2026-11-04T15:00'))).toMatchObject({ next: { day: 'tue', daysAhead: 6 } });
  });

  it('finds next week when the only open day has passed', () => {
    const once: OpeningHours = { ...hours, tue: [{ open: '08:00', close: '09:00' }], wed: [] };
    expect(shopStatus(shop({ openingHours: once }), kl('2026-11-03T10:00'))).toMatchObject({ next: { day: 'tue', daysAhead: 7 } });
  });

  it('has no next time when no day has hours', () => {
    const never: OpeningHours = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
    expect(shopStatus(shop({ openingHours: never }), kl('2026-11-03T10:00'))).toEqual({ open: false, reason: 'hours', next: null });
  });

  it('the switch closes the shop even inside opening hours, and without knowing the time', () => {
    expect(shopStatus(shop({ temporarilyClosed: true }), kl('2026-11-03T09:00'))).toEqual({ open: false, reason: 'switch' });
    expect(shopStatus(shop({ temporarilyClosed: true }), null)).toEqual({ open: false, reason: 'switch' });
  });

  it('a shop without hours is always open; with hours it waits for the clock', () => {
    expect(shopStatus(shop({ openingHours: null }), null)).toEqual({ open: true, closesAt: null });
    expect(shopStatus(shop(), null)).toBeNull();
  });
});

describe('checkOpeningDay and isTimeZone', () => {
  it('explains bad periods', () => {
    expect(checkOpeningDay('mon', [{ open: '8:00', close: '17:00' }])[0]).toMatch(/opening time must be 24-hour/);
    expect(checkOpeningDay('mon', [{ open: '08:00', close: '5pm' }])[0]).toMatch(/closing time must be 24-hour/);
    expect(checkOpeningDay('fri', [{ open: '18:00', close: '02:00' }])[0]).toMatch(/after the opening time.*split them/);
    expect(checkOpeningDay('sat', [{ open: '12:00', close: '20:00' }, { open: '08:00', close: '13:00' }])[0]).toMatch(/"12:00"–"20:00" overlaps "08:00"–"13:00"/);
    expect(checkOpeningDay('sun', undefined)[0]).toMatch(/use \[\] for a day the shop is closed/);
    expect(checkOpeningDay('tue', hours.tue)).toEqual([]);
  });
  it('knows real time zones only', () => {
    expect(isTimeZone('Asia/Kuala_Lumpur')).toBe(true);
    expect(isTimeZone('Asia/Kuala Lumpur')).toBe(false);
    expect(isTimeZone('')).toBe(false);
  });
});
