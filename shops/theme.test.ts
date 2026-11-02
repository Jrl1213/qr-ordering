import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PAGE_COLORS, themeColors, themeCssVariables } from './theme';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const theme = themeColors('#123f34', '#d9e9a4');

describe('theme', () => {
  it('only gives plain hex colours, which every browser understands', () => {
    for (const color of Object.values(theme)) expect(color).toMatch(/^#([0-9a-f]{6}|[0-9a-f]{8})$/);
  });

  it('keeps the demo close to its old fixed colours', () => {
    expect(theme['brand-3']).toBe('#e3e8e7'); // was #e4eee8; the same as color-mix gave in Edge
    expect(theme.overlay).toBe('#071915ab'); // was #071a15aa
  });

  it('turns the theme into CSS variables', () => {
    expect(themeCssVariables(theme)).toMatchObject({ '--brand': '#123f34', '--accent': '#d9e9a4', '--brand-2': theme['brand-2'] });
  });

  it('matches the neutral colours written in globals.css', () => {
    const cssName = { cream: 'cream', paper: 'paper', ink: 'ink', qrPage: 'qr-page' } as const;
    for (const [name, color] of Object.entries(PAGE_COLORS)) {
      expect(css).toContain(`--${cssName[name as keyof typeof cssName]}: ${color};`);
    }
  });

  it('gives every brand variable globals.css uses', () => {
    const defined = new Set([...css.matchAll(/(--[a-z0-9-]+):/g)].map((match) => match[1]));
    const used = new Set([...css.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((match) => match[1]));
    const missing = [...used].filter((name) => !defined.has(name) && !(name.slice(2) in theme));
    expect(missing).toEqual([]);
  });
});
