import type { Language } from '../data/shop';
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
