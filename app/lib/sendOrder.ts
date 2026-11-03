import { shopConfig, type ShopConfig } from '../data/shop';
import type { Order } from './order';
import { buildOrderMessage, whatsappLink } from './orderMessage';
import { shopStatus } from '../../shops/openingHours';

export type SendResult = { ok: true } | { ok: false; reason: 'closed' | 'empty-cart' | 'no-table' | 'unknown-channel' };

const openInNewTab = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };

// Sends the order through the shop's channel. It is async so a server channel can wait for its
// answer later; the WhatsApp tab still opens straight away, inside the customer's tap.
// It checks the time itself, so an order can't slip through just after closing time.
export async function sendOrder(order: Order, shop: ShopConfig = shopConfig, openUrl: (url: string) => void = openInNewTab, now: Date = new Date()): Promise<SendResult> {
  if (shopStatus(shop, now)?.open === false) return { ok: false, reason: 'closed' };
  if (!order.entries.length) return { ok: false, reason: 'empty-cart' };
  if (!order.table) return { ok: false, reason: 'no-table' };

  switch (shop.orderChannel) {
    case 'whatsapp':
      openUrl(whatsappLink(buildOrderMessage(order, shop), shop.whatsappNumber));
      return { ok: true };
    default: {
      // TypeScript stops the build here if a new channel is added without a case above.
      const unknownChannel: never = shop.orderChannel;
      // The config checker stops the build first, so this only happens if it was skipped.
      console.error(`Unknown order channel: ${String(unknownChannel)}`);
      return { ok: false, reason: 'unknown-channel' };
    }
  }
}
