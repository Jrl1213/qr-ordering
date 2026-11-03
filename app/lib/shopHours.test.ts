import { describe, expect, it } from 'vitest';
import { getCopy } from './copy';
import { fill, hoursRows, opensAgainText } from './shopHours';

describe('shop hours text', () => {
  it('fills gaps in a sentence', () => {
    expect(fill('until {time}', { time: '17:00' })).toBe('until 17:00');
  });

  it('names today and tomorrow, then weekdays', () => {
    const en = getCopy('en');
    expect(opensAgainText(en, { day: 'tue', daysAhead: 0, time: '17:00' })).toBe('We open again today at 17:00.');
    expect(opensAgainText(en, { day: 'wed', daysAhead: 1, time: '08:00' })).toBe('We open again tomorrow at 08:00.');
    expect(opensAgainText(en, { day: 'sat', daysAhead: 4, time: '09:00' })).toBe('We open again Saturday at 09:00.');
    expect(opensAgainText(getCopy('zh'), { day: 'sat', daysAhead: 4, time: '09:00' })).toBe('星期六 09:00 恢復營業。');
  });

  it('lists the week from Monday, with breaks and closed days', () => {
    const rows = hoursRows(getCopy('ms'), {
      mon: [], tue: [{ open: '17:00', close: '21:00' }, { open: '08:00', close: '14:00' }],
      wed: [], thu: [], fri: [], sat: [], sun: [{ open: '09:00', close: '24:00' }],
    });
    expect(rows).toHaveLength(7);
    expect(rows[0]).toEqual({ day: 'mon', label: 'Isnin', times: 'Tutup' });
    expect(rows[1].times).toBe('08:00–14:00, 17:00–21:00');
    expect(rows[6]).toEqual({ day: 'sun', label: 'Ahad', times: '09:00–24:00' });
  });
});
