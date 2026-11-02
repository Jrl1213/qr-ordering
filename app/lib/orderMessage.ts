import type { Language } from '../data/config';
import { restaurantConfig } from '../data/config';
import { copy, spiceLabels } from './copy';
import { formatMoney, taxPercent, type CartEntry, type Totals } from './pricing';

// The order text the customer sends to the shop on WhatsApp.
export function buildOrderMessage(entries: CartEntry[], totals: Totals, language: Language, table: string | null): string {
  const t = copy[language];
  const lines = entries.map(({ line, item, option, lineTotal }, index) => {
    const extras = [option?.label[language], item.spiceLevels ? `${t.spice}: ${spiceLabels[language][line.spice]}` : '', line.note ? `${t.note}: ${line.note}` : ''].filter(Boolean);
    return `${index + 1}. ${line.quantity}× ${item.name[language]} — ${formatMoney(lineTotal)}${extras.length ? `\n   ${extras.join(' · ')}` : ''}`;
  });
  return [
    `🍜 *${restaurantConfig.name}*`,
    `📍 ${t.table} ${table ?? '—'} · ${t.dineIn}`,
    '',
    ...lines,
    '',
    `${t.subtotal}: ${formatMoney(totals.subtotal)}`,
    ...(totals.taxRate === null ? [] : [`${t.serviceTax} (${taxPercent(totals.taxRate)}%): ${formatMoney(totals.tax)}`]),
    `*${t.total}: ${formatMoney(totals.total)}*`,
    '',
    `_${t.demo}_`,
  ].join('\n');
}

// With no number (demo), wa.me lets the customer pick the chat, so we never message a stranger.
export const whatsappLink = (message: string, number: string = restaurantConfig.whatsappNumber) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
