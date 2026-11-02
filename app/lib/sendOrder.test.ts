import { describe, expect, it, vi } from 'vitest';
import { shopConfig, type ShopConfig } from '../data/shop';
import type { CartLine } from './cart';
import { calculateTotals, priceCart } from './pricing';
import { buildOrder } from './order';
import { buildOrderMessage } from './orderMessage';
import { sendOrder } from './sendOrder';

const cart: CartLine[] = [
  { key: 'a', itemId: 'plum-soda', quantity: 2, choices: {}, note: 'JRL less ice' },
];
const entries = priceCart(cart);
const order = buildOrder(entries, calculateTotals(entries), 'en', '4');

// Collects the links sendOrder would open, instead of opening a browser tab.
function recorder() {
  const opened: string[] = [];
  return { opened, openUrl: (url: string) => { opened.push(url); } };
}

describe('buildOrder', () => {
  it('keeps the cart line ids, so a server could re-price the order later', () => {
    expect(order.entries[0].line).toMatchObject({ itemId: 'plum-soda', quantity: 2, note: 'JRL less ice' });
    expect(order).toMatchObject({ table: '4', language: 'en' });
  });
});

describe('sendOrder', () => {
  it('opens one WhatsApp link with the order message', async () => {
    const { opened, openUrl } = recorder();
    expect(await sendOrder(order, shopConfig, openUrl)).toEqual({ ok: true });
    expect(opened).toHaveLength(1);
    const url = new URL(opened[0]);
    expect(url.origin + url.pathname).toBe('https://wa.me/');
    expect(url.searchParams.get('text')).toContain('📍 Table 4 · Dine in');
    expect(url.searchParams.get('text')).toContain('2× Salted Plum Soda');
  });

  it('sends exactly the message the customer sees in the preview', async () => {
    const { opened, openUrl } = recorder();
    await sendOrder(order, shopConfig, openUrl);
    expect(new URL(opened[0]).searchParams.get('text')).toBe(buildOrderMessage(order));
  });

  it("sends to the shop's own number", async () => {
    const { opened, openUrl } = recorder();
    const shop: ShopConfig = { ...shopConfig, demoMode: false, whatsappNumber: '60000000000' };
    await sendOrder(order, shop, openUrl);
    expect(opened[0]).toMatch(/^https:\/\/wa\.me\/60000000000\?text=/);
  });

  it('opens the link straight away, inside the tap (pop-up blockers allow that)', () => {
    const { opened, openUrl } = recorder();
    void sendOrder(order, shopConfig, openUrl);
    expect(opened).toHaveLength(1);
  });

  it('refuses an empty cart', async () => {
    const { opened, openUrl } = recorder();
    const empty = buildOrder([], calculateTotals([]), 'en', '4');
    expect(await sendOrder(empty, shopConfig, openUrl)).toEqual({ ok: false, reason: 'empty-cart' });
    expect(opened).toEqual([]);
  });

  it('refuses an order with no table', async () => {
    const { opened, openUrl } = recorder();
    expect(await sendOrder({ ...order, table: null }, shopConfig, openUrl)).toEqual({ ok: false, reason: 'no-table' });
    expect(opened).toEqual([]);
  });

  it('refuses an unknown channel instead of throwing, so the page can react', async () => {
    const { opened, openUrl } = recorder();
    const shop = { ...shopConfig, orderChannel: 'whatsap' } as unknown as ShopConfig;
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await sendOrder(order, shop, openUrl)).toEqual({ ok: false, reason: 'unknown-channel' });
    expect(opened).toEqual([]);
    quiet.mockRestore();
  });
});
