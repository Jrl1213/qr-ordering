import { describe, expect, it } from 'vitest';
import type { CartLine } from './cart';
import { shopConfig } from '../data/shop';
import { buildOrderMessage, whatsappLink } from './orderMessage';
import { buildOrder } from './order';
import { calculateTotals, priceCart } from './pricing';

// The same order as the browser check: noodles with a note, 2 sodas, iced rice tea.
const cart: CartLine[] = [
  { key: 'a', itemId: 'jade-scallion-noodles', quantity: 2, choices: { topping: 'classic', spice: 'mild' }, note: 'JRL no onion' },
  { key: 'b', itemId: 'plum-soda', quantity: 2, choices: {}, note: '' },
  { key: 'c', itemId: 'roasted-rice-tea', quantity: 1, choices: { temperature: 'iced' }, note: '' },
];
const entries = priceCart(cart);
const withTax = calculateTotals(entries);

describe('buildOrderMessage', () => {
  // Each picked choice shows as "Group: choice" so staff know which question it answers.
  it('builds the English message', () => {
    expect(buildOrderMessage(buildOrder(entries, withTax, 'en', '5')).split('\n')).toEqual([
      '🍜 *Jade Noodle House*',
      '📍 Table 5 · Dine in',
      '',
      '1. 2× Jade Scallion Noodles — RM 33.80',
      '   Topping: Classic · Spice level: Mild · Special note (optional): JRL no onion',
      '2. 2× Salted Plum Soda — RM 15.80',
      '3. 1× Roasted Rice Tea — RM 8.50',
      '   Hot or iced: Iced',
      '',
      'Subtotal: RM 58.10',
      'Service tax (6%): RM 3.49',
      '*Total: RM 61.59*',
      '',
      '_Demo only — orders are not actually submitted_',
    ]);
  });

  it('builds the Chinese message', () => {
    expect(buildOrderMessage(buildOrder(entries, withTax, 'zh', '5')).split('\n')).toEqual([
      '🍜 *Jade Noodle House*',
      '📍 桌號 5 · 堂食',
      '',
      '1. 2× 翡翠蔥油麵 — RM 33.80',
      '   配料: 經典 · 辣度: 微辣 · 備註（選填）: JRL no onion',
      '2. 2× 鹹梅蘇打 — RM 15.80',
      '3. 1× 玄米茶 — RM 8.50',
      '   冷熱: 冰',
      '',
      '小計: RM 58.10',
      '服務稅 (6%): RM 3.49',
      '*總計: RM 61.59*',
      '',
      '_僅供示範 — 訂單不會實際提交_',
    ]);
  });

  it('uses Malay text', () => {
    const message = buildOrderMessage(buildOrder(entries, withTax, 'ms', '5'));
    expect(message).toContain('📍 Meja 5 · Makan sini');
    expect(message).toContain('Tahap pedas: Sedikit');
    expect(message).toContain('*Jumlah: RM 61.59*');
  });

  it('lists every group of a dish with two groups', () => {
    const tea = priceCart([{ key: 't', itemId: 'jasmine-lime-tea', quantity: 1, choices: { temperature: 'hot', sweetness: 'regular-sweet' }, note: '' }]);
    expect(buildOrderMessage(buildOrder(tea, calculateTotals(tea), 'en', '3')).split('\n').slice(3, 5)).toEqual([
      '1. 1× Jasmine Lime Tea — RM 6.90',
      '   Hot or iced: Hot · Sweetness: Regular sweet',
    ]);
  });

  it('shows a dash when there is no table', () => {
    expect(buildOrderMessage(buildOrder(entries, withTax, 'en', null))).toContain('📍 Table — · Dine in');
  });

  it('leaves out the tax line when the shop has no service tax', () => {
    const noTax = calculateTotals(entries, { serviceTaxEnabled: false, serviceTaxRate: 0.06 });
    const message = buildOrderMessage(buildOrder(entries, noTax, 'en', '5'));
    expect(message).not.toContain('Service tax');
    expect(message).toContain('*Total: RM 58.10*');
  });

  it('ends with the total and no demo line for a real shop', () => {
    const message = buildOrderMessage(buildOrder(entries, withTax, 'en', '5'), { ...shopConfig, demoMode: false, name: 'JRL Test Cafe', orderEmoji: '☕' });
    expect(message.split('\n')[0]).toBe('☕ *JRL Test Cafe*');
    expect(message.endsWith('*Total: RM 61.59*')).toBe(true);
    expect(message).not.toContain('Demo');
  });
});

describe('whatsappLink', () => {
  it('lets the customer choose a chat when no number is set', () => {
    expect(whatsappLink('Hi & bye', '')).toBe('https://wa.me/?text=Hi%20%26%20bye');
  });

  it('sends to the shop number when one is set', () => {
    expect(whatsappLink('Hi', '60000000000')).toBe('https://wa.me/60000000000?text=Hi');
  });
});
