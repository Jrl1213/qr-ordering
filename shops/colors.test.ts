import { describe, expect, it } from 'vitest';
import { contrastRatio, mixColors, parseHex, withAlpha } from './colors';

describe('colours', () => {
  it('reads hex colours, short or long, and nothing else', () => {
    expect(parseHex('#123f34')).toEqual([18, 63, 52]);
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('green')).toBeNull();
    expect(parseHex(' #123f34')).toBeNull();
  });

  it('works out contrast like WCAG', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 1);
    expect(contrastRatio('#d9e9a4', '#123f34')).toBeCloseTo(contrastRatio('#123f34', '#d9e9a4')!);
    expect(contrastRatio('#123456', 'blue')).toBeNull();
  });

  it('mixes colours like CSS color-mix', () => {
    expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mixColors('#123f34', '#ffffff', 1)).toBe('#123f34');
    expect(mixColors('#123f34', '#ffffff', 0)).toBe('#ffffff');
    expect(() => mixColors('red', '#ffffff', 0.5)).toThrow(/hex colours/);
  });

  it('adds see-through as a 4th pair of hex digits', () => {
    expect(withAlpha('#123f34', 0.11)).toBe('#123f341c');
    expect(withAlpha('#000', 1)).toBe('#000000ff');
  });
});
