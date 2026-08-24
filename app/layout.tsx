import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get('host') ?? '';
  const safeHost = /^[a-z0-9.-]+(?::\d+)?$/i.test(requestHost) ? requestHost : 'localhost:3000';
  const origin = `${safeHost.startsWith('localhost') ? 'http' : 'https'}://${safeHost}`;
  const title = 'Jade Noodle House — QR Ordering Demo';
  const description = 'A fictional mobile-first multilingual restaurant ordering demo with WhatsApp handoff and printable table QR cards.';
  const image = `${origin}/og.png`;
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: { title, description, type: 'website', url: origin, images: [{ url: image, width: 1672, height: 942, alt: 'Jade Noodle House — Scan. Choose. Savour.' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

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
