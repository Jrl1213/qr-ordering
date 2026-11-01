export const restaurantConfig = {
  name: 'Jade Noodle House',
  chineseName: '玉麵館',
  malayName: 'Rumah Mi Jade',
  tagline: 'Scan. Choose. Savour.',
  currency: 'MYR',
  currencyLabel: 'RM',
  serviceTaxRate: 0.06,
  serviceTaxEnabled: true,
  // The shop's WhatsApp number: international digits only, no +, spaces or dashes.
  // Leave it empty for the demo: WhatsApp then asks the customer to choose a chat,
  // so a made-up number can never message a real person.
  whatsappNumber: '' as string,
  // v2: cart lines store option ids instead of positions. Older saved carts are ignored.
  cartStorageKey: 'jade-noodle-house-demo-cart-v2',
  maxTables: 20,
  // The live site address, e.g. 'https://jade-demo.netlify.app' (no / at the end). Used for
  // link previews. Leave empty to use the address Netlify gives the build.
  siteUrl: '' as string,
} as const;

export type Language = 'en' | 'zh' | 'ms';
