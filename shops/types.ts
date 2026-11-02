// The shape of one shop's settings and menu. Each shop has its own folder next to this file.

// Languages the app has text for. A shop picks which of these to offer.
export type Language = 'en' | 'zh' | 'ms';

// Text the shop writes in every language the app supports.
export type LocalText = Record<Language, string>;

// The id of the "Popular" tab. It isn't a real category: it shows dishes marked popular.
export const POPULAR = 'popular';

export type MenuCategory = { id: string; label: LocalText };

export type ShopConfig = {
  // Demo mode shows "demo only" notes, the ?table=1 hint and the staff QR link in the footer.
  // Set it to false for a real shop.
  demoMode: boolean;

  name: string;
  // Shown under the name, joined with " · " (e.g. the name in other languages).
  otherNames: string[];
  tagline: string;
  // One letter or character for the round logo (page header and QR cards).
  logoMark: string;
  // Emojis: the first line of the WhatsApp order, and the empty cart.
  orderEmoji: string;
  emptyCartEmoji: string;

  // Browser tab title and link-preview description.
  pageTitle: string;
  pageDescription: string;
  // The live site address, e.g. 'https://jade-demo.netlify.app' (no / at the end). Used for
  // link previews. Leave empty to use the address Netlify gives the build.
  siteUrl: string;

  // Languages offered in the picker. The first one is the default.
  languages: Language[];

  hero: { heading: LocalText; intro: LocalText };
  // Leave false/null to hide. (There are no real opening hours yet.)
  showOpenNow: boolean;
  waitTime: LocalText | null;
  searchHint: LocalText;

  // Menu tabs, in order. Every dish's `category` must be one of these ids.
  showPopularTab: boolean;
  categories: MenuCategory[];

  currencyLabel: string;
  serviceTaxEnabled: boolean;
  // 0.06 means 6%. Check the real rate with the shop.
  serviceTaxRate: number;

  // International digits only, no +, spaces or dashes. Leave empty for a demo: WhatsApp then
  // asks the customer to choose a chat, so a made-up number can never message a real person.
  whatsappNumber: string;

  maxTables: number;
  // Raise the version number (v2 → v3) when the cart's saved format changes; older carts are then ignored.
  cartStorageKey: string;

  // Colour of the printed QR codes. Keep it dark so phones can scan it.
  qrColor: string;
};

export type MenuItem = {
  id: string;
  // One of the shop's category ids.
  category: string;
  popular?: boolean;
  name: LocalText;
  description: LocalText;
  price: number;
  available: boolean;
  imageEmoji: string;
  imageTone: 'jade' | 'gold' | 'clay' | 'plum' | 'tea';
  spiceLevels?: Array<'None' | 'Mild' | 'Medium' | 'Hot'>;
  // Option ids are saved in carts, so keep them stable when renaming or reordering options.
  options?: Array<{ id: string; label: LocalText; price: number }>;
};
