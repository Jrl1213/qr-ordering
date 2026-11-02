import { shopConfig, type ShopConfig } from '../data/shop';
import { describeChoices } from './cart';
import { copy } from './copy';
import { formatMoney, taxPercent } from './pricing';
import type { Order } from './order';

// The order text the customer sends to the shop on WhatsApp.
export function buildOrderMessage({ entries, totals, language, table }: Order, shop: ShopConfig = shopConfig): string {
  const t = copy[language];
  const lines = entries.map(({ line, item, picked, lineTotal }, index) => {
    // "Group: choice" for each picked choice, so staff know which question it answers.
    const extras = [...describeChoices(picked, language), line.note ? `${t.note}: ${line.note}` : ''].filter(Boolean);
    return `${index + 1}. ${line.quantity}× ${item.name[language]} — ${formatMoney(lineTotal)}${extras.length ? `\n   ${extras.join(' · ')}` : ''}`;
  });
  return [
    `${shop.orderEmoji} *${shop.name}*`,
    `📍 ${t.table} ${table ?? '—'} · ${t.dineIn}`,
    '',
    ...lines,
    '',
    `${t.subtotal}: ${formatMoney(totals.subtotal)}`,
    ...(totals.taxRate === null ? [] : [`${t.serviceTax} (${taxPercent(totals.taxRate)}%): ${formatMoney(totals.tax)}`]),
    `*${t.total}: ${formatMoney(totals.total)}*`,
    ...(shop.demoMode ? ['', `_${t.demo}_`] : []),
  ].join('\n');
}

// With no number (demo), wa.me lets the customer pick the chat, so we never message a stranger.
export const whatsappLink = (message: string, number: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
