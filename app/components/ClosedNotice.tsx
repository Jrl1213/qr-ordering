import { shopConfig, type Language } from '../data/shop';
import { shopClock, type ShopStatus } from '../../shops/openingHours';
import type { Copy } from '../lib/copy';
import { hoursRows, opensAgainText } from '../lib/shopHours';

type Props = { t: Copy; language: Language; status: Extract<ShopStatus, { open: false }>; now: Date | null };

// Shown instead of ordering while the shop is closed: why, when it opens again, and the week's hours.
export function ClosedNotice({ t, language, status, now }: Props) {
  const why = status.reason === 'switch'
    ? shopConfig.closedNotice?.[language] || t.pausedBody
    : status.next ? opensAgainText(t, status.next) : null;
  const hours = shopConfig.openingHours;
  const today = now ? shopClock(now, shopConfig.timeZone).day : null;

  return (
    <section className="closed-notice" role="status">
      <h2>{t.closedTitle}</h2>
      {why && <p>{why}</p>}
      <p>{t.browseOnly}</p>
      {hours && (
        <>
          <h3>{t.hoursTitle}</h3>
          <dl className="hours-list">
            {hoursRows(t, hours).map((row) => (
              <div key={row.day} className={row.day === today ? 'is-today' : undefined}><dt>{row.label}</dt><dd>{row.times}</dd></div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
