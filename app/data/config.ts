export const restaurantConfig = {
  name: 'Jade Noodle House',
  chineseName: '玉麵館',
  malayName: 'Rumah Mi Jade',
  tagline: 'Scan. Choose. Savour.',
  currency: 'MYR',
  currencyLabel: 'RM',
  serviceTaxRate: 0.06,
  serviceTaxEnabled: true,
  // DEMO PLACEHOLDER — replace this with the restaurant's WhatsApp number.
  // Use international format without +, spaces, or dashes (example: 60123456789).
  whatsappNumber: '60123456789',
  // v2: cart lines store option ids instead of positions. Older saved carts are ignored.
  cartStorageKey: 'jade-noodle-house-demo-cart-v2',
  maxTables: 20,
} as const;

export type Language = 'en' | 'zh' | 'ms';
