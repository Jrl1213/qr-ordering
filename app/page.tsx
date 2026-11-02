'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import type { MenuItem } from './data/menu';
import type { Language } from './data/config';
import { cartStore, changeLineQuantity, parseTable, removeLine, saveLine, type CartLine } from './lib/cart';
import { copy } from './lib/copy';
import { calculateTotals, formatMoney, priceCart } from './lib/pricing';
import { buildOrderMessage, whatsappLink } from './lib/orderMessage';
import { SiteHeader } from './components/SiteHeader';
import { MenuBrowser } from './components/MenuBrowser';
import { ItemSheet, type ItemChoice } from './components/ItemSheet';
import { CartSheet } from './components/CartSheet';
import { MessageSheet } from './components/MessageSheet';

// The address bar never changes while the menu is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

// The dish panel that is open: a new dish, or a cart line being edited.
type OpenItem = { item: MenuItem; editing: CartLine | null };

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [openItem, setOpenItem] = useState<OpenItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const t = copy[language];

  // null while rendering on the server, so the "no table" warning only appears once we know.
  const locationSearch = useSyncExternalStore(subscribeToNothing, () => window.location.search, () => null);
  const tableChecked = locationSearch !== null;
  const table = locationSearch === null ? null : parseTable(locationSearch);

  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const entries = useMemo(() => priceCart(cart), [cart]);
  const totals = useMemo(() => calculateTotals(entries), [entries]);
  const orderMessage = useMemo(() => buildOrderMessage(entries, totals, language, table), [entries, totals, language, table]);

  const saveChoice = (choice: ItemChoice) => {
    if (!openItem) return;
    const { item, editing } = openItem;
    cartStore.update((current) => saveLine(current, { key: editing?.key ?? `${item.id}-${Date.now()}`, itemId: item.id, ...choice }));
    setOpenItem(null);
  };
  const editLine = (line: CartLine, item: MenuItem) => { setOpenItem({ item, editing: line }); setCartOpen(false); };

  return (
    <main className="site-shell">
      <SiteHeader t={t} table={table} language={language} onLanguageChange={setLanguage} />

      {tableChecked && !table && <section className="table-warning" role="alert"><span aria-hidden="true">!</span><div><strong>{t.noTableTitle}</strong><p>{t.noTableBody}</p></div></section>}

      <section className="hero" id="menu">
        <p className="eyebrow">{table ? `${t.table.toLocaleUpperCase()} ${table} · ` : ''}{t.dineIn.toLocaleUpperCase()}</p>
        <h1>{t.hero}</h1>
        <p>{t.intro}</p>
        <div className="service-row"><span className="open-dot" /> {t.open} <span>·</span> {t.time}</div>
      </section>

      <MenuBrowser t={t} language={language} onAdd={(item) => setOpenItem({ item, editing: null })} />

      <footer><p>{t.privacy}</p><a href="/qr" rel="nofollow">{t.qrManager} →</a></footer>

      <button className="cart-bar" type="button" onClick={() => setCartOpen(true)} aria-label={`${t.cart}: ${totals.itemCount} ${t.items}, ${formatMoney(totals.total)}`}>
        <span><small>{t.yourOrder.toLocaleUpperCase()}</small>{totals.itemCount ? `${totals.itemCount} ${t.items}` : t.empty}</span>
        <strong>{totals.itemCount ? formatMoney(totals.total) : t.cart} →</strong>
      </button>
      <p className="demo-note">{t.demo}</p>

      {openItem && (
        <ItemSheet
          key={openItem.editing?.key ?? openItem.item.id}
          item={openItem.item}
          editing={openItem.editing}
          t={t}
          language={language}
          onSave={saveChoice}
          onClose={() => setOpenItem(null)}
        />
      )}

      {cartOpen && (
        <CartSheet
          entries={entries}
          totals={totals}
          table={table}
          t={t}
          language={language}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={(key, delta) => cartStore.update((current) => changeLineQuantity(current, key, delta))}
          onEdit={editLine}
          onRemove={(key) => cartStore.update((current) => removeLine(current, key))}
          onPreview={() => { setCartOpen(false); setMessageOpen(true); }}
        />
      )}

      {messageOpen && (
        <MessageSheet
          message={orderMessage}
          t={t}
          onClose={() => setMessageOpen(false)}
          onSend={() => window.open(whatsappLink(orderMessage), '_blank', 'noopener,noreferrer')}
        />
      )}
    </main>
  );
}
