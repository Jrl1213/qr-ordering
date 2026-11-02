import { describe, expect, it } from 'vitest';
import type { CartLine } from './cart';
import { findItem, findOption } from './cart';
import { calculateTotals, formatMoney, getUnitPrice, priceCart, taxPercent } from './pricing';

const noodles = findItem('jade-scallion-noodles')!;

describe('formatMoney', () => {
  it('shows the currency and 2 decimals', () => {
    expect(formatMoney(5)).toBe('RM 5.00');
    expect(formatMoney(3.486)).toBe('RM 3.49');
  });
});

describe('getUnitPrice', () => {
  it('adds the option price to the dish price', () => {
    expect(getUnitPrice(noodles, findOption(noodles, 'add-prawns'))).toBeCloseTo(22.9);
  });

  it('uses the dish price when there is no option', () => {
    expect(getUnitPrice(noodles, undefined)).toBe(16.9);
  });
});

describe('priceCart', () => {
  it('multiplies the unit price by the quantity', () => {
    const [entry] = priceCart([{ key: 'a', itemId: 'jade-scallion-noodles', quantity: 2, optionId: 'add-prawns', spice: 'Hot', note: '' }]);
    expect(entry.item.id).toBe('jade-scallion-noodles');
    expect(entry.option?.id).toBe('add-prawns');
    expect(entry.lineTotal).toBeCloseTo(45.8);
  });

  it('skips lines whose dish is not on the menu', () => {
    const entries = priceCart([{ key: 'x', itemId: 'no-such-dish', quantity: 1, optionId: null, spice: 'None', note: '' }]);
    expect(entries).toEqual([]);
  });
});

describe('calculateTotals', () => {
  const cart: CartLine[] = [
    { key: 'a', itemId: 'jade-scallion-noodles', quantity: 2, optionId: 'classic', spice: 'Mild', note: '' }, // 33.80
    { key: 'b', itemId: 'plum-soda', quantity: 2, optionId: null, spice: 'None', note: '' }, // 15.80
    { key: 'c', itemId: 'roasted-rice-tea', quantity: 1, optionId: 'iced', spice: 'None', note: '' }, // 8.50
  ];

  it('adds service tax when it is on', () => {
    const totals = calculateTotals(priceCart(cart), { serviceTaxEnabled: true, serviceTaxRate: 0.06 });
    expect(totals.subtotal).toBeCloseTo(58.1);
    expect(totals.tax).toBeCloseTo(3.486);
    expect(totals.total).toBeCloseTo(61.586);
    expect(totals.taxRate).toBe(0.06);
    expect(totals.itemCount).toBe(5);
  });

  it('adds no tax when it is off', () => {
    const totals = calculateTotals(priceCart(cart), { serviceTaxEnabled: false, serviceTaxRate: 0.06 });
    expect(totals.tax).toBe(0);
    expect(totals.total).toBeCloseTo(58.1);
    expect(totals.taxRate).toBeNull();
  });

  it('is all zero for an empty cart', () => {
    expect(calculateTotals([], { serviceTaxEnabled: true, serviceTaxRate: 0.06 })).toEqual({ subtotal: 0, tax: 0, total: 0, itemCount: 0, taxRate: 0.06 });
  });
});

describe('taxPercent', () => {
  it('turns a rate into a whole percent', () => {
    expect(taxPercent(0.06)).toBe(6);
    expect(taxPercent(0.08)).toBe(8);
  });
});
