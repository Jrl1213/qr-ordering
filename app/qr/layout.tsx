import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private QR Cards — Jade Noodle House',
  robots: { index: false, follow: false },
};

export default function QRLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
