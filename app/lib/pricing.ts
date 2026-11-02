import { shopConfig, type MenuItem } from '../data/shop';
import { findItem, findOption, type CartLine, type MenuOption } from './cart';

export const formatMoney = (value: number) => `${shopConfig.currencyLabel} ${value.toFixed(2)}`;

export const getUnitPrice = (item: MenuItem, option: MenuOption | undefined) => item.price + (option?.price ?? 0);

// One cart line joined with its dish and option, plus the line's price.
export type CartEntry = { line: CartLine; item: MenuItem; option: MenuOption | undefined; lineTotal: number };

// Joins cart lines with the menu. Lines whose dish is missing are skipped.
export function priceCart(cart: CartLine[]): CartEntry[] {
  return cart.flatMap((line) => {
    const item = findItem(line.itemId);
    if (!item) return [];
    const option = findOption(item, line.optionId);
    return [{ line, item, option, lineTotal: getUnitPrice(item, option) * line.quantity }];
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
