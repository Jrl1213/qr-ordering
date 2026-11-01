'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { menuItems, type Category, type MenuItem } from './data/menu';
import { restaurantConfig, type Language } from './data/config';
import { cartStore, findItem, findOption, getUnitPrice, MAX_NOTE_LENGTH, MAX_QUANTITY, parseTable, type CartLine } from './lib/cart';

// The address bar never changes while the menu is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

const categories: Category[] = ['Popular', 'Noodles', 'Rice', 'Skewers', 'Drinks'];

const copy = {
  en: {
    table: 'Table', dineIn: 'Dine in', hero: 'A bowl worth slowing down for.', intro: 'Hand-pulled noodles, sizzling skewers and comforting rice bowls—made fresh when you order.', open: 'Open now', time: '15–20 min',
    search: 'Search noodles, rice, drinks…', popular: 'Popular', noodles: 'Noodles', rice: 'Rice', skewers: 'Skewers', drinks: 'Drinks', favourites: 'House favourites', items: 'items', unavailable: 'Sold out', from: 'from', add: 'Add',
    noTableTitle: 'No table number found', noTableBody: 'Please scan the QR code on your table, or add ?table=1 to the web address for this demo.',
    choose: 'Make it yours', option: 'Option', spice: 'Spice level', quantity: 'Quantity', note: 'Special note (optional)', noteHint: 'e.g. no spring onion', cancel: 'Cancel', addToOrder: 'Add to order', updateOrder: 'Update item',
    yourOrder: 'Your order', empty: 'Your cart is empty', emptyBody: 'Add a dish to start your table order.', cart: 'View cart', edit: 'Edit', remove: 'Remove', subtotal: 'Subtotal', serviceTax: 'Service tax', total: 'Total', continue: 'Continue browsing', preview: 'Preview order message',
    previewTitle: 'Check your WhatsApp message', previewBody: 'This is the exact message that will open in WhatsApp. Nothing is submitted by this demo.', sendsTo: 'Sends to', noNumber: 'Demo: no shop number is set, so WhatsApp will ask you to choose a chat.', openWhatsapp: 'Open WhatsApp', close: 'Close',
    demo: 'Demo only — orders are not actually submitted', privacy: 'No names, phone numbers or payment details are collected.', noResults: 'No dishes match your search.', clear: 'Clear search', qrManager: 'Staff QR cards',
  },
  zh: {
    table: '桌號', dineIn: '堂食', hero: '值得慢慢品味的一碗。', intro: '手工麵、炭香串燒與暖心飯類，下單後新鮮製作。', open: '營業中', time: '15–20 分鐘',
    search: '搜尋麵、飯、飲料…', popular: '人氣', noodles: '麵類', rice: '飯類', skewers: '串燒', drinks: '飲料', favourites: '店內人氣', items: '款', unavailable: '售罄', from: '起', add: '加入',
    noTableTitle: '找不到桌號', noTableBody: '請掃描桌上的 QR 碼，或在示範網址後加入 ?table=1。',
    choose: '選擇口味', option: '選項', spice: '辣度', quantity: '數量', note: '備註（選填）', noteHint: '例如：不要蔥', cancel: '取消', addToOrder: '加入訂單', updateOrder: '更新品項',
    yourOrder: '您的訂單', empty: '購物車是空的', emptyBody: '加入一道餐點開始點餐。', cart: '查看購物車', edit: '編輯', remove: '移除', subtotal: '小計', serviceTax: '服務稅', total: '總計', continue: '繼續選購', preview: '預覽訂單訊息',
    previewTitle: '檢查 WhatsApp 訊息', previewBody: '以下訊息將在 WhatsApp 中開啟。本示範不會實際提交訂單。', sendsTo: '發送至', noNumber: '示範：未設定店家號碼，WhatsApp 會請您自行選擇聊天對象。', openWhatsapp: '開啟 WhatsApp', close: '關閉',
    demo: '僅供示範 — 訂單不會實際提交', privacy: '不會收集姓名、電話或付款資料。', noResults: '找不到符合的餐點。', clear: '清除搜尋', qrManager: '員工 QR 卡',
  },
  ms: {
    table: 'Meja', dineIn: 'Makan sini', hero: 'Semangkuk mi untuk dinikmati perlahan.', intro: 'Mi tarik, sate panas dan hidangan nasi yang menenangkan—disediakan segar selepas dipesan.', open: 'Dibuka', time: '15–20 min',
    search: 'Cari mi, nasi, minuman…', popular: 'Popular', noodles: 'Mi', rice: 'Nasi', skewers: 'Sate', drinks: 'Minuman', favourites: 'Kegemaran ramai', items: 'hidangan', unavailable: 'Habis', from: 'dari', add: 'Tambah',
    noTableTitle: 'Nombor meja tiada', noTableBody: 'Sila imbas kod QR di meja anda, atau tambah ?table=1 pada alamat web untuk demo ini.',
    choose: 'Pilih citarasa anda', option: 'Pilihan', spice: 'Tahap pedas', quantity: 'Kuantiti', note: 'Nota khas (pilihan)', noteHint: 'cth. tanpa daun bawang', cancel: 'Batal', addToOrder: 'Tambah ke pesanan', updateOrder: 'Kemas kini item',
    yourOrder: 'Pesanan anda', empty: 'Troli anda kosong', emptyBody: 'Tambah hidangan untuk mula memesan.', cart: 'Lihat troli', edit: 'Edit', remove: 'Buang', subtotal: 'Jumlah kecil', serviceTax: 'Cukai perkhidmatan', total: 'Jumlah', continue: 'Teruskan memilih', preview: 'Pratonton mesej pesanan',
    previewTitle: 'Semak mesej WhatsApp', previewBody: 'Inilah mesej yang akan dibuka dalam WhatsApp. Tiada pesanan dihantar oleh demo ini.', sendsTo: 'Dihantar ke', noNumber: 'Demo: tiada nombor kedai, jadi WhatsApp akan minta anda pilih sembang.', openWhatsapp: 'Buka WhatsApp', close: 'Tutup',
    demo: 'Demo sahaja — pesanan tidak dihantar', privacy: 'Nama, nombor telefon dan butiran pembayaran tidak dikumpul.', noResults: 'Tiada hidangan sepadan.', clear: 'Kosongkan carian', qrManager: 'Kad QR staf',
  },
} as const;

const spiceLabels: Record<Language, Record<string, string>> = {
  en: { None: 'No spice', Mild: 'Mild', Medium: 'Medium', Hot: 'Hot' },
  zh: { None: '不辣', Mild: '微辣', Medium: '中辣', Hot: '大辣' },
  ms: { None: 'Tidak pedas', Mild: 'Sedikit', Medium: 'Sederhana', Hot: 'Pedas' },
};

const formatMoney = (value: number) => `${restaurantConfig.currencyLabel} ${value.toFixed(2)}`;

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [category, setCategory] = useState<Category>('Popular');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [draftOption, setDraftOption] = useState<string | null>(null);
  const [draftSpice, setDraftSpice] = useState('None');
  const [draftNote, setDraftNote] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const t = copy[language];

  // null while rendering on the server, so the "no table" warning only appears once we know.
  const locationSearch = useSyncExternalStore(subscribeToNothing, () => window.location.search, () => null);
  const tableChecked = locationSearch !== null;
  const table = locationSearch === null ? null : parseTable(locationSearch);

  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const setCart = cartStore.update;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return menuItems.filter((item) => {
      const inCategory = category === 'Popular' ? item.popular : item.category === category;
      const searchable = `${item.name.en} ${item.name.zh} ${item.name.ms} ${item.description.en} ${item.description.zh} ${item.description.ms}`.toLocaleLowerCase();
      return inCategory && (!query || searchable.includes(query));
    });
  }, [category, search]);

  // Cart lines joined with their dish and option. Lines whose dish is missing are skipped.
  const cartLines = useMemo(() => cart.flatMap((line) => {
    const item = findItem(line.itemId);
    if (!item) return [];
    const option = findOption(item, line.optionId);
    return [{ line, item, option, lineTotal: getUnitPrice(item, option) * line.quantity }];
  }), [cart]);
  const subtotal = cartLines.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const tax = restaurantConfig.serviceTaxEnabled ? subtotal * restaurantConfig.serviceTaxRate : 0;
  const total = subtotal + tax;
  const cartCount = cartLines.reduce((sum, entry) => sum + entry.line.quantity, 0);

  const beginAdd = (item: MenuItem) => {
    setSelectedItem(item); setEditingKey(null); setDraftQuantity(1); setDraftOption(item.options?.[0]?.id ?? null);
    setDraftSpice(item.spiceLevels?.[0] ?? 'None'); setDraftNote('');
  };
  const beginEdit = (line: CartLine, item: MenuItem) => {
    setSelectedItem(item); setEditingKey(line.key); setDraftQuantity(line.quantity);
    setDraftOption(line.optionId); setDraftSpice(line.spice); setDraftNote(line.note); setCartOpen(false);
  };
  const saveDraft = () => {
    if (!selectedItem) return;
    const line: CartLine = { key: editingKey ?? `${selectedItem.id}-${Date.now()}`, itemId: selectedItem.id, quantity: draftQuantity, optionId: draftOption, spice: draftSpice, note: draftNote.trim() };
    setCart((current) => editingKey ? current.map((entry) => entry.key === editingKey ? line : entry) : [...current, line]);
    setSelectedItem(null); setEditingKey(null);
  };
  const changeQuantity = (key: string, delta: number) => setCart((current) => current.map((line) => line.key === key ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line));
  const categoryLabel = (value: Category) => t[value.toLocaleLowerCase() as 'popular' | 'noodles' | 'rice' | 'skewers' | 'drinks'];

  const orderMessage = useMemo(() => {
    const lines = cartLines.map(({ line, item, option, lineTotal }, index) => {
      const extras = [option?.label[language], item.spiceLevels ? `${t.spice}: ${spiceLabels[language][line.spice]}` : '', line.note ? `${t.note}: ${line.note}` : ''].filter(Boolean);
      return `${index + 1}. ${line.quantity}× ${item.name[language]} — ${formatMoney(lineTotal)}${extras.length ? `\n   ${extras.join(' · ')}` : ''}`;
    });
    return [`🍜 *${restaurantConfig.name}*`, `📍 ${t.table} ${table ?? '—'} · ${t.dineIn}`, '', ...lines, '', `${t.subtotal}: ${formatMoney(subtotal)}`, ...(restaurantConfig.serviceTaxEnabled ? [`${t.serviceTax} (${Math.round(restaurantConfig.serviceTaxRate * 100)}%): ${formatMoney(tax)}`] : []), `*${t.total}: ${formatMoney(total)}*`, '', `_${t.demo}_`].join('\n');
  }, [cartLines, language, subtotal, table, t, tax, total]);

  // With no number (demo), wa.me lets the customer pick the chat, so we never message a stranger.
  const openWhatsapp = () => window.open(`https://wa.me/${restaurantConfig.whatsappNumber}?text=${encodeURIComponent(orderMessage)}`, '_blank', 'noopener,noreferrer');

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#menu" aria-label={`${restaurantConfig.name} home`}>
          <span className="brand-mark" aria-hidden="true">玉</span>
          <span><strong>{restaurantConfig.name}</strong><small>{restaurantConfig.chineseName} · {restaurantConfig.malayName}</small></span>
        </a>
        <div className="top-actions">
          {table && <span className="table-pill">{t.table} {table}</span>}
          <label className="language-select"><span className="sr-only">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Choose language"><option value="en">EN</option><option value="zh">中文</option><option value="ms">BM</option></select></label>
        </div>
      </header>

      {tableChecked && !table && <section className="table-warning" role="alert"><span aria-hidden="true">!</span><div><strong>{t.noTableTitle}</strong><p>{t.noTableBody}</p></div></section>}

      <section className="hero" id="menu">
        <p className="eyebrow">{table ? `${t.table.toLocaleUpperCase()} ${table} · ` : ''}{t.dineIn.toLocaleUpperCase()}</p>
        <h1>{t.hero}</h1>
        <p>{t.intro}</p>
        <div className="service-row"><span className="open-dot" /> {t.open} <span>·</span> {t.time}</div>
      </section>

      <section className="menu-toolbar" aria-label="Browse menu">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder={t.search} aria-label={t.search} /></label>
        <nav className="category-list" aria-label="Menu categories">
          {categories.map((item) => <button className={category === item ? 'category active' : 'category'} type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{categoryLabel(item)}</button>)}
        </nav>
      </section>

      <section className="menu-section" aria-live="polite">
        <div className="section-heading"><div><p className="eyebrow">{t.favourites}</p><h2>{categoryLabel(category)}</h2></div><span>{filteredItems.length} {t.items}</span></div>
        {filteredItems.length ? <div className="menu-grid">{filteredItems.map((item) => (
          <article className={`menu-card ${!item.available ? 'is-unavailable' : ''}`} key={item.id}>
            <div className={`dish-photo tone-${item.imageTone}`} role="img" aria-label={`Safe photo placeholder for ${item.name[language]}`}><span className="food-emoji">{item.imageEmoji}</span><small>{item.popular ? t.popular : categoryLabel(item.category)}</small></div>
            <div className="dish-copy"><div><div className="dish-title-row"><h3>{item.name[language]}</h3>{!item.available && <span className="sold-out">{t.unavailable}</span>}</div><p>{item.description[language]}</p></div><div className="dish-footer"><strong>{formatMoney(item.price)}</strong><button type="button" onClick={() => beginAdd(item)} disabled={!item.available} aria-label={`${t.add} ${item.name[language]}`}>{item.available ? '＋' : '×'}</button></div></div>
          </article>
        ))}</div> : <div className="empty-state"><span aria-hidden="true">⌕</span><h3>{t.noResults}</h3><button type="button" onClick={() => setSearch('')}>{t.clear}</button></div>}
      </section>

      <footer><p>{t.privacy}</p><a href="/qr" rel="nofollow">{t.qrManager} →</a></footer>

      <button className="cart-bar" type="button" onClick={() => setCartOpen(true)} aria-label={`${t.cart}: ${cartCount} ${t.items}, ${formatMoney(total)}`}><span><small>{t.yourOrder.toLocaleUpperCase()}</small>{cartCount ? `${cartCount} ${t.items}` : t.empty}</span><strong>{cartCount ? formatMoney(total) : t.cart} →</strong></button>
      <p className="demo-note">{t.demo}</p>

      {selectedItem && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setSelectedItem(null)}><section className="sheet item-sheet" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close-button" type="button" onClick={() => setSelectedItem(null)} aria-label={t.close}>×</button><div className={`item-hero tone-${selectedItem.imageTone}`}><span>{selectedItem.imageEmoji}</span></div><div className="sheet-body"><p className="eyebrow">{t.choose}</p><h2 id="item-title">{selectedItem.name[language]}</h2><p className="item-description">{selectedItem.description[language]}</p>
        {selectedItem.options && <fieldset><legend>{t.option}</legend><div className="choice-list">{selectedItem.options.map((option) => <label className={draftOption === option.id ? 'choice selected' : 'choice'} key={option.id}><input type="radio" name="option" checked={draftOption === option.id} onChange={() => setDraftOption(option.id)} /><span>{option.label[language]}</span><strong>{option.price ? `+${formatMoney(option.price)}` : '—'}</strong></label>)}</div></fieldset>}
        {selectedItem.spiceLevels && <fieldset><legend>{t.spice}</legend><div className="spice-list">{selectedItem.spiceLevels.map((level) => <button type="button" className={draftSpice === level ? 'spice selected' : 'spice'} key={level} onClick={() => setDraftSpice(level)} aria-pressed={draftSpice === level}><span aria-hidden="true">{level === 'None' ? '○' : level === 'Mild' ? '●' : level === 'Medium' ? '●●' : '●●●'}</span>{spiceLabels[language][level]}</button>)}</div></fieldset>}
        <label className="note-field"><span>{t.note}</span><textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} placeholder={t.noteHint} maxLength={MAX_NOTE_LENGTH} /></label>
        <div className="quantity-row"><span>{t.quantity}</span><div className="stepper"><button type="button" onClick={() => setDraftQuantity(Math.max(1, draftQuantity - 1))} aria-label="Decrease quantity">−</button><strong>{draftQuantity}</strong><button type="button" onClick={() => setDraftQuantity(Math.min(MAX_QUANTITY, draftQuantity + 1))} aria-label="Increase quantity">＋</button></div></div>
        <button className="primary-button" type="button" onClick={saveDraft}><span>{editingKey ? t.updateOrder : t.addToOrder}</span><strong>{formatMoney(getUnitPrice(selectedItem, findOption(selectedItem, draftOption)) * draftQuantity)}</strong></button>
      </div></section></div>}

      {cartOpen && <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}><section className="sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="sheet-header"><div><p className="eyebrow">{table ? `${t.table} ${table}` : t.dineIn}</p><h2 id="cart-title">{t.yourOrder}</h2></div><button className="close-button static" type="button" onClick={() => setCartOpen(false)} aria-label={t.close}>×</button></div><div className="sheet-body cart-body">
        {!cartLines.length ? <div className="empty-cart"><span aria-hidden="true">🥢</span><h3>{t.empty}</h3><p>{t.emptyBody}</p><button type="button" onClick={() => setCartOpen(false)}>{t.continue}</button></div> : <><div className="cart-lines">{cartLines.map(({ line, item, option, lineTotal }) => <article className="cart-line" key={line.key}><div className={`cart-thumb tone-${item.imageTone}`} aria-hidden="true">{item.imageEmoji}</div><div className="cart-line-copy"><h3>{item.name[language]}</h3><p>{[option?.label[language], item.spiceLevels ? spiceLabels[language][line.spice] : '', line.note].filter(Boolean).join(' · ')}</p><div className="cart-line-actions"><div className="stepper small"><button type="button" onClick={() => changeQuantity(line.key, -1)} aria-label="Decrease quantity">−</button><strong>{line.quantity}</strong><button type="button" onClick={() => changeQuantity(line.key, 1)} aria-label="Increase quantity">＋</button></div><button type="button" className="text-button" onClick={() => beginEdit(line, item)}>{t.edit}</button><button type="button" className="text-button danger" onClick={() => setCart((current) => current.filter((entry) => entry.key !== line.key))}>{t.remove}</button></div></div><strong>{formatMoney(lineTotal)}</strong></article>)}</div>
        <dl className="totals"><div><dt>{t.subtotal}</dt><dd>{formatMoney(subtotal)}</dd></div>{restaurantConfig.serviceTaxEnabled && <div><dt>{t.serviceTax} ({Math.round(restaurantConfig.serviceTaxRate * 100)}%)</dt><dd>{formatMoney(tax)}</dd></div>}<div className="grand-total"><dt>{t.total}</dt><dd>{formatMoney(total)}</dd></div></dl>
        {!table && <div className="cart-warning">{t.noTableBody}</div>}<button className="primary-button" type="button" disabled={!table} onClick={() => { setCartOpen(false); setMessageOpen(true); }}><span>{t.preview}</span><strong>→</strong></button></>}
      </div></section></div>}

      {messageOpen && <div className="overlay"><section className="sheet preview-sheet" role="dialog" aria-modal="true" aria-labelledby="preview-title"><div className="sheet-header"><div><p className="eyebrow">WHATSAPP</p><h2 id="preview-title">{t.previewTitle}</h2></div><button className="close-button static" type="button" onClick={() => setMessageOpen(false)} aria-label={t.close}>×</button></div><div className="sheet-body"><p className="preview-intro">{t.previewBody}</p><div className="placeholder-number">{restaurantConfig.whatsappNumber ? <><span>{t.sendsTo}</span><strong>+{restaurantConfig.whatsappNumber}</strong></> : <span>{t.noNumber}</span>}</div><pre className="message-preview">{orderMessage}</pre><button className="whatsapp-button" type="button" onClick={openWhatsapp}><span aria-hidden="true">◉</span>{t.openWhatsapp}</button><p className="final-demo">{t.demo}</p></div></section></div>}
    </main>
  );
}
