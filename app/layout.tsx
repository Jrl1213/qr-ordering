import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { shopConfig } from './data/shop';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={shopConfig.languages[0]}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
