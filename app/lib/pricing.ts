import { shopConfig, type MenuItem } from '../data/shop';
import { findItem, pickedChoices, type CartLine, type PickedChoice } from './cart';

export const formatMoney = (value: number) => `${shopConfig.currencyLabel} ${value.toFixed(2)}`;

// The dish price plus the price of every picked choice.
export const getUnitPrice = (item: MenuItem, picked: PickedChoice[]) =>
  picked.reduce((sum, { choice }) => sum + choice.price, item.price);

// One cart line joined with its dish and picked choices, plus the line's price.
export type CartEntry = { line: CartLine; item: MenuItem; picked: PickedChoice[]; lineTotal: number };

// Joins cart lines with the menu. Lines whose dish is missing are skipped.
export function priceCart(cart: CartLine[]): CartEntry[] {
  return cart.flatMap((line) => {
    const item = findItem(line.itemId);
    if (!item) return [];
    const picked = pickedChoices(item, line.choices);
    return [{ line, item, picked, lineTotal: getUnitPrice(item, picked) * line.quantity }];
  });
}

export type TaxSettings = { serviceTaxEnabled: boolean; serviceTaxRate: number };

// taxRate is null when the shop has no service tax, so the tax line is hidden.
export type Totals = { subtotal: number; tax: number; total: number; itemCount: number; taxRate: number | null };

export function calculateTotals(entries: CartEntry[], settings: TaxSettings = shopConfig): Totals {
  const subtotal = entries.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const taxRate = settings.serviceTaxEnabled ? settings.serviceTaxRate : null;
  const tax = taxRate === null ? 0 : subtotal * taxRate;
  const itemCount = entries.reduce((sum, entry) => sum + entry.line.quantity, 0);
  return { subtotal, tax, total: subtotal + tax, itemCount, taxRate };
}

// 0.06 → 6
export const taxPercent = (rate: number) => Math.round(rate * 100);
