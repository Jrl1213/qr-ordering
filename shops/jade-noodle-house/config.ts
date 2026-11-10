import type { ShopConfig } from '../types';

// A made-up demo shop. All names and dishes are fictional.
export const shopConfig: ShopConfig = {
  demoMode: true,

  name: 'Jade Noodle House',
  otherNames: ['玉麵館', 'Rumah Mi Jade'],
  tagline: 'Scan. Choose. Savour.',
  logoMark: '玉',
  orderEmoji: '🍜',
  emptyCartEmoji: '🥢',

  pageTitle: 'Jade Noodle House — QR Ordering Demo',
  pageDescription: 'A fictional mobile-first multilingual restaurant ordering demo with WhatsApp handoff and printable table QR cards.',
  siteUrl: '',

  languages: ['en', 'zh', 'ms'],

  hero: {
    heading: { en: 'A bowl worth slowing down for.', zh: '值得慢慢品味的一碗。', ms: 'Semangkuk mi untuk dinikmati perlahan.' },
    intro: {
      en: 'Hand-pulled noodles, sizzling skewers and comforting rice bowls—made fresh when you order.',
      zh: '手工麵、炭香串燒與暖心飯類，下單後新鮮製作。',
      ms: 'Mi tarik, sate panas dan hidangan nasi yang menenangkan—disediakan segar selepas dipesan.',
    },
  },
  // No fixed hours: the demo is always open, so it works whenever someone looks at it.
  openingHours: null,
  timeZone: 'Asia/Kuala_Lumpur',
  temporarilyClosed: false,
  closedNotice: null,
  showOpenNow: true,
  waitTime: { en: '15–20 min', zh: '15–20 分鐘', ms: '15–20 min' },
  searchHint: { en: 'Search noodles, rice, drinks…', zh: '搜尋麵、飯、飲料…', ms: 'Cari mi, nasi, minuman…' },

  showPopularTab: true,
  categories: [
    { id: 'noodles', label: { en: 'Noodles', zh: '麵類', ms: 'Mi' } },
    { id: 'rice', label: { en: 'Rice', zh: '飯類', ms: 'Nasi' } },
    { id: 'skewers', label: { en: 'Skewers', zh: '串燒', ms: 'Sate' } },
    { id: 'drinks', label: { en: 'Drinks', zh: '飲料', ms: 'Minuman' } },
  ],

  currencyLabel: 'RM',
  serviceTaxEnabled: true,
  serviceTaxRate: 0.06,

  orderChannel: 'whatsapp',
  whatsappNumber: '',

  maxTables: 20,
  // v3: cart lines store one choice per option group (v2 had one option id plus a spice level).
  cartStorageKey: 'jade-noodle-house-demo-cart-v3',

  brandColor: '#123f34',
  accentColor: '#d9e9a4',
};
