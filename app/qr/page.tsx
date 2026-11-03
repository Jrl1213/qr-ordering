'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { shopConfig } from '../data/shop';
import { copy } from '../lib/copy';
import { CARDS_PER_PAGE_OPTIONS, type CardsPerPage, splitIntoSheets, tableNumbers, tableUrl } from '../lib/qrCards';

// The site address never changes while the page is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

// Printed cards are read by customers, so they show the words in every language the shop offers.
const tableLabel = shopConfig.languages.map((language) => copy[language].table).join(' · ');
const scanLines = shopConfig.languages.map((language) => copy[language].scanToOrder);

const layoutHelp: Record<CardsPerPage, string> = {
  4: 'A6 cards (105 × 148 mm), fits A6 table stands',
  8: 'Small cards (105 × 74 mm), for stickers',
};

export default function QRManager() {
  const [tableCount, setTableCount] = useState(10);
  const [perPage, setPerPage] = useState<CardsPerPage>(4);
  const origin = useSyncExternalStore(subscribeToNothing, () => window.location.origin, () => 'https://your-private-site.example');
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  // The set of codes that failed to draw (origin + table count), so a new table count tries again.
  const [failedDraw, setFailedDraw] = useState<string | null>(null);

  const tables = useMemo(() => tableNumbers(tableCount, shopConfig.maxTables), [tableCount]);
  const sheets = splitIntoSheets(tables, perPage);
  // Printing before every code is drawn would print the striped placeholders instead.
  const codesReady = tables.every((table) => qrImages[tableUrl(origin, table)]);
  const drawKey = `${origin}|${tables.length}`;
  const codesFailed = !codesReady && failedDraw === drawKey;

  useEffect(() => {
    let active = true;
    // SVG, so the code stays sharp at any printed size.
    Promise.all(tables.map(async (table) => {
      const url = tableUrl(origin, table);
      const svg = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: shopConfig.brandColor, light: '#ffffff' } });
      return [url, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`] as const;
    }))
      .then((entries) => { if (active) setQrImages(Object.fromEntries(entries)); })
      // Without this the Print button would stay on "Drawing codes…" forever with no reason shown.
      .catch((error: unknown) => { console.error('Could not draw the QR codes', error); if (active) setFailedDraw(drawKey); });
    return () => { active = false; };
  }, [origin, tables, drawKey]);

  return (
    <main className="qr-page">
      {/* No page margin, so each A4 sheet fills one sheet of paper. Rendered here (not in globals.css) so it only applies
          while this page is open; printing the menu keeps the browser's normal margins. */}
      <style>{'@page { size: A4 portrait; margin: 0; }'}</style>
      <header className="qr-header">
        <div><span className="private-badge">PRIVATE STAFF PAGE</span><h1>Printable table QR cards</h1><p>Choose how many tables you need and the card size, then print on A4. Each code opens the menu with the correct table number already attached.</p></div>
        <Link className="back-link" href="/?table=1">Test Table 1 →</Link>
      </header>

      <section className="qr-controls" aria-label="QR card controls">
        <label>Number of tables<input type="number" min="1" max={shopConfig.maxTables} value={tableCount} onChange={(event) => setTableCount(tableNumbers(Number(event.target.value), shopConfig.maxTables).length)} /></label>
        <fieldset className="qr-layout-picker">
          <legend>Cards per A4 page</legend>
          {CARDS_PER_PAGE_OPTIONS.map((option) => (
            <label key={option} className={option === perPage ? 'is-selected' : undefined}>
              <input type="radio" name="cards-per-page" value={option} checked={option === perPage} onChange={() => setPerPage(option)} />
              <strong>{option} per page</strong><span>{layoutHelp[option]}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" disabled={!codesReady} onClick={() => window.print()}>{codesReady ? '' : codesFailed ? 'Codes not ready · ' : 'Drawing codes… '}Print {tables.length} {tables.length === 1 ? 'card' : 'cards'} ({sheets.length} {sheets.length === 1 ? 'page' : 'pages'})</button>
        {codesFailed && <p className="qr-error" role="alert">The QR codes could not be drawn, so there is nothing to print yet. Reload the page and try again. If it keeps happening, ask whoever set up this site.</p>}
        <p className="qr-help">In the print window choose paper size <b>A4</b>, scale <b>100%</b> (not &ldquo;fit to page&rdquo;) and margins <b>Default</b>. Cut along the dashed lines. Scan one printed card with a phone before printing them all. Maximum: {shopConfig.maxTables} tables.</p>
      </section>

      <section className={`qr-sheets per-${perPage}`} aria-label="Printable table cards">
        {sheets.map((sheet, index) => (
          <div className="qr-sheet-wrap" key={index}>
            <p className="qr-sheet-label">Page {index + 1} of {sheets.length}</p>
            <div className="qr-sheet">
              {sheet.map((table) => {
                const url = tableUrl(origin, table);
                return (
                  <article className="qr-card" key={table}>
                    <div className="qr-code-wrap">{qrImages[url] ? /* eslint-disable-line @next/next/no-img-element -- generated data: URL, nothing for next/image to optimise */ <img src={qrImages[url]} alt={`QR code for ${shopConfig.name} Table ${table}`} /> : <div className="qr-loading" aria-label="Generating QR code" />}</div>
                    <div className="qr-card-text">
                      <div className="qr-card-brand"><span className="qr-card-logo" aria-hidden="true">{shopConfig.logoMark}</span><span className="qr-card-name">{shopConfig.name}</span></div>
                      <p className="qr-card-table-label">{tableLabel}</p>
                      <h2>{table}</h2>
                      <p className="qr-card-scan">{scanLines.map((line) => <span key={line}>{line}</span>)}</p>
                      <div className="qr-url">{url}</div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
