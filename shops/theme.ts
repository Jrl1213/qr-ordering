import { mixColors, withAlpha } from './colors';

// The page's colours. A shop picks only brandColor and accentColor; every other brand shade is worked out
// here, at build time, as a plain hex colour. app/layout.tsx sets them on <html> as CSS variables
// (e.g. --brand-2), and app/globals.css uses them. Plain hex works in every browser, and the config
// checker can test the exact colours customers see.

// Neutral colours that suit any brand. They are written in app/globals.css (:root);
// a test (theme.test.ts) makes sure the two stay the same.
export const PAGE_COLORS = {
  cream: '#f6f1e7', // page background
  paper: '#fffdf8', // cards and pop-ups
  ink: '#18211e', // main text
  qrPage: '#ede8dd', // staff QR page background
} as const;

export type Theme = Record<string, string>;

// CSS variable name (without --) → colour. brand and accent must already be valid hex colours.
export function themeColors(brand: string, accent: string): Theme {
  const tint = (amount: number) => mixColors(brand, '#ffffff', amount);
  return {
    brand,
    accent,
    'brand-2': tint(0.82), // a little lighter: small headings, selected-choice border
    'brand-3': tint(0.12), // very light: selected-choice background
    'on-brand': tint(0.14), // soft white text on the brand colour
    'brand-line': tint(0.3), // message preview border
    'brand-wash': tint(0.07), // message preview background
    'brand-ink': mixColors(brand, PAGE_COLORS.ink, 0.5), // message preview text
    'brand-a04': withAlpha(brand, 0.04), // soft shadows
    'brand-a11': withAlpha(brand, 0.11), // pop-up shadow
    'brand-a12': withAlpha(brand, 0.12), // sheen on dish pictures
    'brand-a27': withAlpha(brand, 0.27), // cart bar and emoji shadows
    'brand-a85': withAlpha(brand, 0.85), // close button on a dish picture
    overlay: withAlpha(mixColors(brand, '#000000', 0.4), 0.67), // dimmed page behind pop-ups
  };
}

// The theme as CSS variables for a style attribute: { '--brand': '#123f34', ... }.
export const themeCssVariables = (theme: Theme) =>
  Object.fromEntries(Object.entries(theme).map(([name, color]) => [`--${name}`, color]));

// Every place text in a brand shade sits on a background (or white text on the brand colour).
// The checker tests each pair, so a shop can't pick a brand colour that makes some text hard to read.
export function brandTextPairs(theme: Theme) {
  return [
    { text: '#ffffff', background: theme.brand, where: 'white text on it (header, buttons) and the printed QR codes' },
    { text: theme['on-brand'], background: theme.brand, where: 'the soft white hero text on it' },
    { text: theme.brand, background: PAGE_COLORS.cream, where: 'links and prices in it on the cream page' },
    { text: theme.brand, background: PAGE_COLORS.qrPage, where: 'the staff QR page links in it' },
    { text: theme.brand, background: theme['brand-3'], where: 'prices in it on a selected choice' },
    { text: theme['brand-2'], background: PAGE_COLORS.cream, where: 'the small headings (a lighter shade of it) on the cream page' },
    { text: theme['brand-ink'], background: theme['brand-wash'], where: 'the order message preview' },
  ];
}
