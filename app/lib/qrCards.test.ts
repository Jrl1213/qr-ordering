import { describe, expect, it } from 'vitest';
import { splitIntoSheets, tableNumbers, tableUrl } from './qrCards';

describe('tableNumbers', () => {
  it('counts from table 1', () => {
    expect(tableNumbers(3, 20)).toEqual([1, 2, 3]);
  });

  it('never goes past the shop maximum or below 1', () => {
    expect(tableNumbers(50, 12)).toHaveLength(12);
    expect(tableNumbers(0, 12)).toEqual([1]);
    expect(tableNumbers(-4, 12)).toEqual([1]);
  });

  it('treats junk and decimals safely', () => {
    expect(tableNumbers(Number.NaN, 12)).toEqual([1]);
    expect(tableNumbers(2.7, 12)).toEqual([1, 2]);
  });
});

describe('splitIntoSheets', () => {
  it('fills each sheet before starting the next', () => {
    expect(splitIntoSheets(tableNumbers(10, 20), 4)).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]);
    expect(splitIntoSheets(tableNumbers(8, 20), 8)).toEqual([[1, 2, 3, 4, 5, 6, 7, 8]]);
  });
});

describe('tableUrl', () => {
  it('opens the menu with the table attached', () => {
    expect(tableUrl('https://shop.example', 7)).toBe('https://shop.example/?table=7');
  });
});
