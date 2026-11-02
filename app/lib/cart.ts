import { menuItems, shopConfig, type Language, type MenuItem, type OptionChoice, type OptionGroup } from '../data/shop';

// What the customer picked in each of the dish's option groups: group id → choice id.
export type Choices = Record<string, string>;

export type CartLine = {
  key: string;
  itemId: string;
  quantity: number;
  choices: Choices;
  note: string;
};

// One picked answer, joined with its group (for the cart and the WhatsApp message).
export type PickedChoice = { group: OptionGroup; choice: OptionChoice };

export const MAX_QUANTITY = 20;
export const MAX_NOTE_LENGTH = 120;

export const findItem = (itemId: string) => menuItems.find((item) => item.id === itemId);

// The dish's option groups, skipping any group with no choices (nothing to pick, so it's ignored).
export const optionGroupsOf = (item: MenuItem): OptionGroup[] =>
  (item.optionGroups ?? []).filter((group) => group.choices.length > 0);

// The first choice of every group: what the panel shows before the customer changes anything.
export const defaultChoices = (item: MenuItem): Choices =>
  Object.fromEntries(optionGroupsOf(item).map((group) => [group.id, group.choices[0].id]));

// The picked choices in the dish's group order. Groups with no (or an unknown) choice are left out.
export const pickedChoices = (item: MenuItem, choices: Choices): PickedChoice[] =>
  optionGroupsOf(item).flatMap((group) => {
    const choice = group.choices.find((entry) => entry.id === choices[group.id]);
    return choice ? [{ group, choice }] : [];
  });

// "Group: choice" for each pick, e.g. ["Hot or iced: Iced", "Sweetness: Less sweet"].
export const describeChoices = (picked: PickedChoice[], language: Language) =>
  picked.map(({ group, choice }) => `${group.label[language]}: ${choice.label[language]}`);

// Cart changes as plain functions: they return a new list and never change the old one.

// Adds the line, or replaces the line with the same key (when editing).
export const saveLine = (cart: CartLine[], line: CartLine) =>
  cart.some((entry) => entry.key === line.key)
    ? cart.map((entry) => entry.key === line.key ? line : entry)
    : [...cart, line];

// Quantity stays between 1 and MAX_QUANTITY, the same limit a saved cart uses
// (use removeLine to take a dish out).
export const changeLineQuantity = (cart: CartLine[], key: string, delta: number) =>
  cart.map((line) => line.key === key ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(1, line.quantity + delta)) } : line);

export const removeLine = (cart: CartLine[], key: string) => cart.filter((line) => line.key !== key);

// Turns one saved cart line into a clean line, or null if it no longer fits the menu
// (dish removed or sold out, a picked choice removed, broken data).
// A group added to the dish after the cart was saved gets its first choice, the same as the panel,
// so the dish isn't silently lost; the customer still sees it in the cart before sending.
export function cleanLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== 'object') return null;
  const line = raw as Partial<Record<keyof CartLine, unknown>>;
  if (typeof line.key !== 'string' || typeof line.itemId !== 'string') return null;
  const item = findItem(line.itemId);
  if (!item || !item.available) return null;

  if (!line.choices || typeof line.choices !== 'object' || Array.isArray(line.choices)) return null;
  const saved = line.choices as Record<string, unknown>;
  const choices: Choices = {};
  for (const group of optionGroupsOf(item)) {
    const choiceId = saved[group.id];
    if (choiceId === undefined) {
      choices[group.id] = group.choices[0].id;
      continue;
    }
    if (typeof choiceId !== 'string' || !group.choices.some((choice) => choice.id === choiceId)) return null;
    choices[group.id] = choiceId;
  }

  const quantity = typeof line.quantity === 'number' && Number.isInteger(line.quantity)
    ? Math.min(MAX_QUANTITY, Math.max(1, line.quantity))
    : 1;
  const note = typeof line.note === 'string' ? line.note.slice(0, MAX_NOTE_LENGTH) : '';

  return { key: line.key, itemId: item.id, quantity, choices, note };
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
  return table >= 1 && table <= shopConfig.maxTables ? String(table) : null;
}

// A tiny store so React reads the saved cart with useSyncExternalStore
// instead of copying it into state inside an effect.
const EMPTY_CART: CartLine[] = [];
let cartCache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function readCart(): CartLine[] {
  if (cartCache === null) {
    try {
      cartCache = parseSavedCart(localStorage.getItem(shopConfig.cartStorageKey));
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
      localStorage.setItem(shopConfig.cartStorageKey, JSON.stringify(cartCache));
    } catch { /* Storage can be full or blocked; the cart still works for this visit. */ }
    listeners.forEach((listener) => listener());
  },
};
