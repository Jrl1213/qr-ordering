import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { restaurantConfig } from './data/config';
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
const origin = restaurantConfig.siteUrl || process.env.URL || 'http://localhost:3000';
const title = 'Jade Noodle House — QR Ordering Demo';
const description = 'A fictional mobile-first multilingual restaurant ordering demo with WhatsApp handoff and printable table QR cards.';
const image = `${origin}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title,
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: { title, description, type: 'website', url: origin, images: [{ url: image, width: 1672, height: 942, alt: 'Jade Noodle House — Scan. Choose. Savour.' }] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
