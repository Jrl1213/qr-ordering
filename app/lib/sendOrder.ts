import { shopConfig, type Language, type ShopConfig } from '../data/shop';
import { buildOrderMessage, whatsappLink } from './orderMessage';
import type { CartEntry, Totals } from './pricing';

// One finished order, the same whichever way it is sent. Each entry keeps its cart line
// (dish id, choice ids, quantity, note), so a server can check and re-price it later (level B).
export type Order = {
  table: string | null;
  language: Language;
  entries: CartEntry[];
  totals: Totals;
};

export const buildOrder = (entries: CartEntry[], totals: Totals, language: Language, table: string | null): Order =>
  ({ table, language, entries, totals });

export type SendResult = { ok: true } | { ok: false; reason: 'empty-cart' | 'no-table' };

const openInNewTab = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };

// Sends the order through the shop's channel. It is async so a server channel can wait for its
// answer later; the WhatsApp tab still opens straight away, inside the customer's tap.
export async function sendOrder(order: Order, shop: ShopConfig = shopConfig, openUrl: (url: string) => void = openInNewTab): Promise<SendResult> {
  if (!order.entries.length) return { ok: false, reason: 'empty-cart' };
  if (!order.table) return { ok: false, reason: 'no-table' };

  switch (shop.orderChannel) {
    case 'whatsapp':
      openUrl(whatsappLink(buildOrderMessage(order, shop), shop.whatsappNumber));
      return { ok: true };
    default: {
      // TypeScript stops the build here if a new channel is added without a case above.
      const unknownChannel: never = shop.orderChannel;
      throw new Error(`Unknown order channel: ${String(unknownChannel)}`);
    }
  }
}
