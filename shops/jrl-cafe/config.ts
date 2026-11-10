import type { ShopConfig } from '../types';

// A second made-up sample shop: a small café. All names and dishes are fictional.
// It is set up differently from Jade Noodle House on purpose (two languages, no service tax,
// no wait time) so you can see what each setting does. Copy this folder to start a new shop.
export const shopConfig: ShopConfig = {
  demoMode: true,

  name: 'JRL Café',
  otherNames: ['Kafe JRL'],
  tagline: 'Good coffee, slow mornings.',
  logoMark: 'J',
  orderEmoji: '☕',
  emptyCartEmoji: '🥐',

  pageTitle: 'JRL Café — QR Ordering Demo',
  pageDescription: 'A fictional café ordering demo with WhatsApp handoff and printable table QR cards.',
  siteUrl: '',

  // Only English and Malay: the picker shows two buttons. Chinese text ('zh') can stay empty
  // because it isn't offered; the checker asks for it if you add 'zh' here.
  languages: ['en', 'ms'],

  hero: {
    heading: { en: 'Your corner for coffee and toast.', zh: '', ms: 'Sudut anda untuk kopi dan roti bakar.' },
    intro: {
      en: 'Espresso, fresh bakes and simple brunch plates, made when you order.',
      zh: '',
      ms: 'Espreso, kek segar dan hidangan sarapan ringkas, disediakan selepas dipesan.',
    },
  },
  // Sample hours: closed on Mondays, longer on weekends. Outside them the menu can be read but not ordered from.
  openingHours: {
    mon: [],
    tue: [{ open: '08:00', close: '17:00' }],
    wed: [{ open: '08:00', close: '17:00' }],
    thu: [{ open: '08:00', close: '17:00' }],
    fri: [{ open: '08:00', close: '17:00' }],
    sat: [{ open: '09:00', close: '18:00' }],
    sun: [{ open: '09:00', close: '18:00' }],
  },
  timeZone: 'Asia/Kuala_Lumpur',
  // The "shop is closed" switch, e.g. for a holiday. closedNotice can say why and when it reopens.
  temporarilyClosed: false,
  closedNotice: null,
  showOpenNow: true,
  waitTime: null,
  searchHint: { en: 'Search coffee, toast, cakes…', zh: '', ms: 'Cari kopi, roti bakar, kek…' },

  showPopularTab: true,
  categories: [
    { id: 'coffee', label: { en: 'Coffee', zh: '', ms: 'Kopi' } },
    { id: 'non-coffee', label: { en: 'Non-coffee', zh: '', ms: 'Bukan kopi' } },
    { id: 'brunch', label: { en: 'Brunch', zh: '', ms: 'Sarapan' } },
    { id: 'cakes', label: { en: 'Cakes', zh: '', ms: 'Kek' } },
  ],

  currencyLabel: 'RM',
  serviceTaxEnabled: false,
  serviceTaxRate: 0.06,

  orderChannel: 'whatsapp',
  whatsappNumber: '',

  maxTables: 12,
  cartStorageKey: 'jrl-cafe-demo-cart-v3',

  brandColor: '#5a3825',
  accentColor: '#f3d9b1',
};
