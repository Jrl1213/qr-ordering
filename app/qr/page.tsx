'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import QRCode from 'qrcode';
import { restaurantConfig } from '../data/config';

// The site address never changes while the page is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

export default function QRManager() {
  const [tableCount, setTableCount] = useState(10);
  const origin = useSyncExternalStore(subscribeToNothing, () => window.location.origin, () => 'https://your-private-site.example');
  const [qrImages, setQrImages] = useState<Record<number, string>>({});

  const tables = useMemo(() => Array.from({ length: Math.min(restaurantConfig.maxTables, Math.max(1, tableCount)) }, (_, index) => index + 1), [tableCount]);

  useEffect(() => {
    let active = true;
    Promise.all(tables.map(async (table) => {
      const url = `${origin}/?table=${table}`;
      const image = await QRCode.toDataURL(url, { width: 328, margin: 0, errorCorrectionLevel: 'M', color: { dark: '#123f34', light: '#ffffff' } });
      return [table, image] as const;
    })).then((entries) => { if (active) setQrImages(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [origin, tables]);

  return (
    <main className="qr-page">
      <header className="qr-header">
        <div><span className="private-badge">PRIVATE STAFF PAGE</span><h1>Printable table QR cards</h1><p>Choose how many tables you need, then print. Each code opens the menu with the correct table number already attached.</p></div>
        {/* A plain <a> on purpose: next/link crashes under vinext 1.0.0-beta.3 (click does nothing).
            Switch to <Link> after the move to standard Next.js. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="back-link" href="/?table=1">Test Table 1 →</a>
      </header>

      <section className="qr-controls" aria-label="QR card controls">
        <label>Number of tables<input type="number" min="1" max={restaurantConfig.maxTables} value={tableCount} onChange={(event) => setTableCount(Math.min(restaurantConfig.maxTables, Math.max(1, Number(event.target.value) || 1)))} /></label>
        <button type="button" onClick={() => window.print()}>Print {tables.length} cards</button>
        <p className="qr-help">Cards are sized for clear scanning and include a readable fallback URL. Maximum: {restaurantConfig.maxTables} tables.</p>
      </section>

      <section className="qr-grid" aria-label="Printable table cards">
        {tables.map((table) => {
          const url = `${origin}/?table=${table}`;
          return <article className="qr-card" key={table}><div className="qr-card-brand"><span aria-hidden="true">玉</span>{restaurantConfig.name}</div><h2>Table {table}</h2><p>Scan to Order</p><div className="qr-code-wrap">{qrImages[table] ? /* eslint-disable-line @next/next/no-img-element -- generated data: URL, nothing for next/image to optimise */ <img src={qrImages[table]} width="164" height="164" alt={`QR code for ${restaurantConfig.name} Table ${table}`} /> : <div className="qr-loading" aria-label="Generating QR code" />}</div><div className="qr-url">{url}</div></article>;
        })}
      </section>
    </main>
  );
}
