import { shopConfig, type Language, type MenuItem } from '../data/shop';
import { describeChoices, type CartLine } from '../lib/cart';
import type { Copy } from '../lib/copy';
import { formatMoney, taxPercent, type CartEntry, type Totals } from '../lib/pricing';

type Props = {
  entries: CartEntry[];
  totals: Totals;
  table: string | null;
  t: Copy;
  language: Language;
  onClose: () => void;
  onChangeQuantity: (key: string, delta: number) => void;
  onEdit: (line: CartLine, item: MenuItem) => void;
  onRemove: (key: string) => void;
  onPreview: () => void;
};

// The cart panel: lines, totals and the button to preview the WhatsApp message.
export function CartSheet({ entries, totals, table, t, language, onClose, onChangeQuantity, onEdit, onRemove, onPreview }: Props) {
  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="sheet-header">
          <div><p className="eyebrow">{table ? `${t.table} ${table}` : t.dineIn}</p><h2 id="cart-title">{t.yourOrder}</h2></div>
          <button className="close-button static" type="button" onClick={onClose} aria-label={t.close}>×</button>
        </div>
        <div className="sheet-body cart-body">
          {!entries.length ? (
            <div className="empty-cart">
              <span aria-hidden="true">{shopConfig.emptyCartEmoji}</span>
              <h3>{t.empty}</h3>
              <p>{t.emptyBody}</p>
              <button type="button" onClick={onClose}>{t.continue}</button>
            </div>
          ) : (
            <>
              <div className="cart-lines">
                {entries.map(({ line, item, picked, lineTotal }) => (
                  <article className="cart-line" key={line.key}>
                    <div className={`cart-thumb tone-${item.imageTone}`} aria-hidden="true">{item.imageEmoji}</div>
                    <div className="cart-line-copy">
                      <h3>{item.name[language]}</h3>
                      <p>{[...describeChoices(picked, language), line.note].filter(Boolean).join(' · ')}</p>
                      <div className="cart-line-actions">
                        <div className="stepper small">
                          <button type="button" onClick={() => onChangeQuantity(line.key, -1)} aria-label="Decrease quantity">−</button>
                          <strong>{line.quantity}</strong>
                          <button type="button" onClick={() => onChangeQuantity(line.key, 1)} aria-label="Increase quantity">＋</button>
                        </div>
                        <button type="button" className="text-button" onClick={() => onEdit(line, item)}>{t.edit}</button>
                        <button type="button" className="text-button danger" onClick={() => onRemove(line.key)}>{t.remove}</button>
                      </div>
                    </div>
                    <strong>{formatMoney(lineTotal)}</strong>
                  </article>
                ))}
              </div>
              <dl className="totals">
                <div><dt>{t.subtotal}</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
                {totals.taxRate !== null && <div><dt>{t.serviceTax} ({taxPercent(totals.taxRate)}%)</dt><dd>{formatMoney(totals.tax)}</dd></div>}
                <div className="grand-total"><dt>{t.total}</dt><dd>{formatMoney(totals.total)}</dd></div>
              </dl>
              {!table && <div className="cart-warning">{t.noTableBody}</div>}
              <button className="primary-button" type="button" disabled={!table} onClick={onPreview}><span>{t.preview}</span><strong>→</strong></button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
