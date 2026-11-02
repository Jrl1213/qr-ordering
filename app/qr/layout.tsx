import type { Metadata } from 'next';
import { shopConfig } from '../data/shop';

export const metadata: Metadata = {
  title: `Private QR Cards — ${shopConfig.name}`,
  robots: { index: false, follow: false },
};

export default function QRLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
