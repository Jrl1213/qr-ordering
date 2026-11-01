import { menuItems, type MenuItem } from '../data/menu';
import { restaurantConfig } from '../data/config';

export type CartLine = {
  key: string;
  itemId: string;
  quantity: number;
  optionId: string | null;
  spice: string;
  note: string;
};

export type MenuOption = NonNullable<MenuItem['options']>[number];

export const MAX_QUANTITY = 20;
export const MAX_NOTE_LENGTH = 120;

export const findItem = (itemId: string) => menuItems.find((item) => item.id === itemId);

export const findOption = (item: MenuItem, optionId: string | null) =>
  optionId === null ? undefined : item.options?.find((option) => option.id === optionId);

export const getUnitPrice = (item: MenuItem, option: MenuOption | undefined) => item.price + (option?.price ?? 0);

// Turns one saved cart line into a clean line, or null if it no longer fits the menu
// (dish removed or sold out, option or spice level removed, broken data).
export function cleanLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== 'object') return null;
  const line = raw as Partial<Record<keyof CartLine, unknown>>;
  if (typeof line.key !== 'string' || typeof line.itemId !== 'string') return null;
  const item = findItem(line.itemId);
  if (!item || !item.available) return null;

  let optionId: string | null = null;
  if (item.options?.length) {
    if (typeof line.optionId !== 'string' || !findOption(item, line.optionId)) return null;
    optionId = line.optionId;
  }

  let spice = 'None';
  if (item.spiceLevels?.length) {
    if (typeof line.spice !== 'string' || !(item.spiceLevels as string[]).includes(line.spice)) return null;
    spice = line.spice;
  }

  const quantity = typeof line.quantity === 'number' && Number.isInteger(line.quantity)
    ? Math.min(MAX_QUANTITY, Math.max(1, line.quantity))
    : 1;
  const note = typeof line.note === 'string' ? line.note.slice(0, MAX_NOTE_LENGTH) : '';

  return { key: line.key, itemId: item.id, quantity, optionId, spice, note };
}

export function parseSavedCart(saved: string | null): CartLine[] {
  if (!saved) return [];
  try {
    const data: unknown = JSON.parse(saved);
    if (!Array.isArray(data)) return [];
    return data.map(cleanLine).filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

// Reads ?table= from the address. Only whole numbers from 1 to maxTables count.
export function parseTable(search: string): string | null {
  const value = new URLSearchParams(search).get('table');
  if (!value || !/^\d{1,3}$/.test(value)) return null;
  const table = Number(value);
  return table >= 1 && table <= restaurantConfig.maxTables ? String(table) : null;
}

// A tiny store so React reads the saved cart with useSyncExternalStore
// instead of copying it into state inside an effect.
const EMPTY_CART: CartLine[] = [];
let cartCache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function readCart(): CartLine[] {
  if (cartCache === null) {
    try {
      cartCache = parseSavedCart(localStorage.getItem(restaurantConfig.cartStorageKey));
    } catch {
      cartCache = [];
    }
  }
  return cartCache;
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot: readCart,
  getServerSnapshot: () => EMPTY_CART,
  update(change: (current: CartLine[]) => CartLine[]) {
    cartCache = change(readCart());
    try {
      localStorage.setItem(restaurantConfig.cartStorageKey, JSON.stringify(cartCache));
    } catch { /* Storage can be full or blocked; the cart still works for this visit. */ }
    listeners.forEach((listener) => listener());
  },
};
