// Helpers for the staff QR card page (app/qr/page.tsx).

// How many cards fit on one A4 sheet. 4 = A6 cards (2 × 2) for table stands, 8 = 105 × 74 mm cards (2 × 4) for stickers.
export const CARDS_PER_PAGE_OPTIONS = [4, 8] as const;
export type CardsPerPage = (typeof CARDS_PER_PAGE_OPTIONS)[number];

// The link a table's QR code opens.
export const tableUrl = (origin: string, table: number): string => `${origin}/?table=${table}`;

// Table numbers 1…count, with count kept between 1 and the shop's maximum (junk input counts as 1).
export function tableNumbers(count: number, maxTables: number): number[] {
  const safe = Number.isFinite(count) ? Math.floor(count) : 1;
  const total = Math.min(maxTables, Math.max(1, safe));
  return Array.from({ length: total }, (_, index) => index + 1);
}

// Splits the cards into printed sheets, e.g. 10 tables at 4 per page → [[1,2,3,4], [5,6,7,8], [9,10]].
export function splitIntoSheets<T>(items: readonly T[], perPage: CardsPerPage): T[][] {
  const sheets: T[][] = [];
  for (let start = 0; start < items.length; start += perPage) sheets.push(items.slice(start, start + perPage));
  return sheets;
}
