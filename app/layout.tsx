import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { assertShopIsValid } from '../shops/checkShop';
import { themeColors, themeCssVariables } from '../shops/theme';
import { menuItems, shopConfig } from './data/shop';
import './globals.css';

// Stops the build (and shows the problem in `npm run dev`) if the shop's config or menu has a mistake.
// The layout only runs on the server, so this check isn't sent to customers' phones.
assertShopIsValid(shopConfig, menuItems);

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// A static site has no request to read the address from, so it is fixed at build time:
// the config value if set, else the address Netlify gives the build (URL), else localhost.
const origin = shopConfig.siteUrl || process.env.URL || 'http://localhost:3000';
const title = shopConfig.pageTitle;
const description = shopConfig.pageDescription;
const image = `${origin}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title,
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: { title, description, type: 'website', url: origin, images: [{ url: image, width: 1672, height: 942, alt: `${shopConfig.name} — ${shopConfig.tagline}` }] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};

// Colours the phone's browser bar to match the header.
export const viewport: Viewport = { themeColor: shopConfig.brandColor };

// The shop's colours and the shades worked out from them (shops/theme.ts), set on <html> so every rule
// in globals.css can use them, e.g. var(--brand) or var(--brand-3).
const themeStyle = themeCssVariables(themeColors(shopConfig.brandColor, shopConfig.accentColor)) as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={shopConfig.languages[0]} style={themeStyle}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
