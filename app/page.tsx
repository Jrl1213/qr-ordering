'use client';

import { Fragment, useMemo, useState, useSyncExternalStore } from 'react';
import { shopConfig, type Language, type MenuItem } from './data/shop';
import { cartStore, changeLineQuantity, parseTable, removeLine, saveLine, type CartLine } from './lib/cart';
import { getCopy, type Copy } from './lib/copy';
import { calculateTotals, formatMoney, priceCart } from './lib/pricing';
import { buildOrderMessage } from './lib/orderMessage';
import { buildOrder } from './lib/order';
import { sendOrder } from './lib/sendOrder';
import { SiteHeader } from './components/SiteHeader';
import { MenuBrowser } from './components/MenuBrowser';
import { ItemSheet, type ItemChoice } from './components/ItemSheet';
import { CartSheet } from './components/CartSheet';
import { MessageSheet } from './components/MessageSheet';

// The address bar never changes while the menu is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

// The dish panel that is open: a new dish, or a cart line being edited.
type OpenItem = { item: MenuItem; editing: CartLine | null };

// "Open now" and the wait time, each shown only if the shop sets it.
function ServiceRow({ t, language }: { t: Copy; language: Language }) {
  const parts = [shopConfig.showOpenNow ? t.open : null, shopConfig.waitTime?.[language] ?? null].filter((part) => part !== null);
  if (!parts.length) return null;
  return (
    <div className="service-row">
      {shopConfig.showOpenNow && <span className="open-dot" />}
      {parts.map((part, index) => <Fragment key={index}>{index > 0 && <> <span>·</span></>} {part}</Fragment>)}
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(shopConfig.languages[0]);
  const [openItem, setOpenItem] = useState<OpenItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const t = getCopy(language);

  // null while rendering on the server, so the "no table" warning only appears once we know.
  const locationSearch = useSyncExternalStore(subscribeToNothing, () => window.location.search, () => null);
  const tableChecked = locationSearch !== null;
  const table = locationSearch === null ? null : parseTable(locationSearch);

  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const entries = useMemo(() => priceCart(cart), [cart]);
  const totals = useMemo(() => calculateTotals(entries), [entries]);
  const order = useMemo(() => buildOrder(entries, totals, language, table), [entries, totals, language, table]);
  const orderMessage = useMemo(() => buildOrderMessage(order), [order]);

  const saveChoice = (choice: ItemChoice) => {
    if (!openItem) return;
    const { item, editing } = openItem;
    cartStore.update((current) => saveLine(current, { key: editing?.key ?? `${item.id}-${Date.now()}`, itemId: item.id, ...choice }));
    setOpenItem(null);
  };
  const editLine = (line: CartLine, item: MenuItem) => { setOpenItem({ item, editing: line }); setCartOpen(false); };
  // If the order can't be sent (empty cart, no table), go back to the cart, which shows why.
  const send = async () => {
    const result = await sendOrder(order);
    if (!result.ok) { setMessageOpen(false); setCartOpen(true); }
  };

  return (
    <main className="site-shell">
      <SiteHeader t={t} table={table} language={language} onLanguageChange={setLanguage} />

      {tableChecked && !table && <section className="table-warning" role="alert"><span aria-hidden="true">!</span><div><strong>{t.noTableTitle}</strong><p>{t.noTableBody}</p></div></section>}

      <section className="hero" id="menu">
        <p className="eyebrow">{table ? `${t.table.toLocaleUpperCase()} ${table} · ` : ''}{t.dineIn.toLocaleUpperCase()}</p>
        <h1>{shopConfig.hero.heading[language]}</h1>
        <p>{shopConfig.hero.intro[language]}</p>
        <ServiceRow t={t} language={language} />
      </section>

      <MenuBrowser t={t} language={language} onAdd={(item) => setOpenItem({ item, editing: null })} />

      {/* The staff QR page is only linked in demo mode, so a real shop's customers don't see it. */}
      <footer><p>{t.privacy}</p>{shopConfig.demoMode && <a href="/qr" rel="nofollow">{t.qrManager} →</a>}</footer>

      <button className="cart-bar" type="button" onClick={() => setCartOpen(true)} aria-label={`${t.cart}: ${totals.itemCount} ${t.items}, ${formatMoney(totals.total)}`}>
        <span><small>{t.yourOrder.toLocaleUpperCase()}</small>{totals.itemCount ? `${totals.itemCount} ${t.items}` : t.empty}</span>
        <strong>{totals.itemCount ? formatMoney(totals.total) : t.cart} →</strong>
      </button>
      {shopConfig.demoMode && <p className="demo-note">{t.demo}</p>}

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
          onSend={() => void send()}
        />
      )}
    </main>
  );
}
