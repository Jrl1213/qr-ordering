// Small colour helpers for hex colours like "#123f34" (or the short "#000").
// Used at build time by the theme (shops/theme.ts) and the config checker.

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

// [red, green, blue] from 0 to 255, or null if it isn't #rgb or #rrggbb. No spaces allowed:
// the page and the QR codes use the colour exactly as written.
export function parseHex(color: string): [number, number, number] | null {
  const match = HEX_COLOR.exec(color ?? '');
  if (!match) return null;
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
  return [0, 2, 4].map((start) => parseInt(hex.slice(start, start + 2), 16)) as [number, number, number];
}

const toHex = (channels: number[]) => `#${channels.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;

// Mixes two colours like CSS color-mix(in srgb, a amountOfA, b). mixColors(brand, '#ffffff', 0.12) = a very light brand tint.
export function mixColors(a: string, b: string, amountOfA: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) throw new Error(`mixColors needs two hex colours, got "${a}" and "${b}".`);
  return toHex(ca.map((value, index) => value * amountOfA + cb[index] * (1 - amountOfA)));
}

// The colour see-through: withAlpha('#123f34', 0.11) = '#123f341c' (11% visible), for shadows and the dimmed backdrop.
export function withAlpha(color: string, opacity: number): string {
  const channels = parseHex(color);
  if (!channels) throw new Error(`withAlpha needs a hex colour, got "${color}".`);
  return toHex([...channels, opacity * 255]);
}

// WCAG relative luminance: 0 = black, 1 = white. Null if it isn't a hex colour.
export function luminance(color: string): number | null {
  const channels = parseHex(color);
  if (!channels) return null;
  const [r, g, b] = channels.map((value) => {
    const v = value / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG contrast ratio between two hex colours (1 = same, 21 = black on white), or null if either isn't a hex colour.
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
