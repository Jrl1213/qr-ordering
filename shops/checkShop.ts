import { contrastRatio, luminance, parseHex } from './colors';
import { brandTextPairs, themeColors } from './theme';
import { ORDER_CHANNELS, POPULAR, type Language, type LocalText, type MenuItem, type ShopConfig } from './types';

// Checks a shop's config and menu for mistakes TypeScript can't catch (empty text, a dish in a
// missing category, a brand colour too light to scan...). Each problem is one plain-English sentence.
// Errors stop the build; warnings are only printed.

export type ShopProblems = { errors: string[]; warnings: string[] };

const ALL_LANGUAGES: Language[] = ['en', 'zh', 'ms'];
// Lowercase letters, digits and dashes, e.g. "noodles" or "add-chicken".
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// WCAG AA for normal text. For the QR codes it also keeps a margin for cheap printers and phone cameras.
const MIN_CONTRAST = 4.5;

export function checkShop(config: ShopConfig, menu: MenuItem[]): ShopProblems {
  const errors: string[] = [];
  const warnings: string[] = [];
  const languages = config.languages;
  // Unknown languages get one error below, not one per text.
  const knownLanguages = languages.filter((language) => ALL_LANGUAGES.includes(language));

  // Every language the shop offers must have text, or customers see a blank.
  const needText = (text: LocalText | null | undefined, where: string) => {
    if (!text) return errors.push(`${where} is missing.`);
    const missing = knownLanguages.filter((language) => !text[language]?.trim());
    if (missing.length) errors.push(`${where} has no text for ${missing.join(', ')}.`);
  };
  const needString = (value: string, where: string) => {
    if (!value?.trim()) errors.push(`${where} is empty.`);
  };
  const checkId = (id: string, where: string) => {
    if (!ID_PATTERN.test(id)) errors.push(`${where} id "${id}" must be lowercase letters, digits and dashes (e.g. "add-chicken").`);
  };
  const duplicates = (ids: string[]) => [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

  // --- Shop basics ---
  needString(config.name, 'The shop name (name)');
  needString(config.logoMark, 'The logo letter (logoMark)');
  needString(config.pageTitle, 'The page title (pageTitle)');
  needString(config.pageDescription, 'The link-preview description (pageDescription)');
  needString(config.currencyLabel, 'The currency label (currencyLabel)');
  needString(config.cartStorageKey, 'The cart key (cartStorageKey)');

  if (config.siteUrl && !/^https:\/\/[^\s/]+(\/[^\s]*)?$/.test(config.siteUrl)) {
    errors.push(`siteUrl "${config.siteUrl}" must start with https:// (or leave it empty to use Netlify's address).`);
  } else if (config.siteUrl.endsWith('/')) {
    errors.push(`siteUrl "${config.siteUrl}" must not end with "/".`);
  }

  // --- Languages ---
  if (!languages.length) errors.push('languages is empty: list at least one language, e.g. [\'en\'].');
  const unknown = languages.filter((language) => !ALL_LANGUAGES.includes(language));
  if (unknown.length) errors.push(`languages has ${unknown.join(', ')}, but the app only has text for ${ALL_LANGUAGES.join(', ')}.`);
  if (duplicates(languages).length) errors.push(`languages lists ${duplicates(languages).join(', ')} more than once.`);

  needText(config.hero?.heading, 'The hero heading (hero.heading)');
  needText(config.hero?.intro, 'The hero intro (hero.intro)');
  needText(config.searchHint, 'The search hint (searchHint)');
  if (config.waitTime) needText(config.waitTime, 'The wait time (waitTime)');

  // --- How orders are sent ---
  if (!(ORDER_CHANNELS as readonly string[]).includes(config.orderChannel)) {
    errors.push(`orderChannel "${config.orderChannel}" isn't one the app knows; use one of: ${ORDER_CHANNELS.join(', ')}.`);
  }
  if (config.orderChannel === 'whatsapp') {
    const number = config.whatsappNumber;
    if (!number) {
      if (!config.demoMode) errors.push('whatsappNumber is empty, but demoMode is false: a real shop needs its WhatsApp number, or orders go nowhere.');
    } else if (!/^\d+$/.test(number)) {
      errors.push(`whatsappNumber "${number}" must be digits only: no +, spaces or dashes (e.g. 60123456789).`);
    } else if (number.startsWith('0')) {
      errors.push(`whatsappNumber "${number}" starts with 0: start with the country code instead (Malaysia: 60, so 012… becomes 6012…).`);
    } else if (number.length < 8 || number.length > 15) {
      errors.push(`whatsappNumber "${number}" has ${number.length} digits; a phone number with country code has 8 to 15.`);
    }
  }

  // --- Tables and tax ---
  if (!Number.isInteger(config.maxTables) || config.maxTables < 1) {
    errors.push(`maxTables is ${config.maxTables}: it must be a whole number, 1 or more.`);
  }
  const rate = config.serviceTaxRate;
  if (!Number.isFinite(rate) || rate < 0 || rate >= 1) {
    errors.push(`serviceTaxRate is ${rate}: write it as a fraction, e.g. 0.06 for 6%.`);
  } else if (config.serviceTaxEnabled && rate === 0) {
    errors.push('serviceTaxEnabled is true but serviceTaxRate is 0: set the rate (e.g. 0.06) or turn tax off.');
  }

  // --- Colours ---
  // Each brand shade is tested where the page uses it; only the first problem is shown, as the fix is the same.
  const brandIsHex = parseHex(config.brandColor) !== null;
  const accentIsHex = parseHex(config.accentColor) !== null;
  if (!brandIsHex) errors.push(`brandColor "${config.brandColor}" must be a hex colour like "#123f34".`);
  if (!accentIsHex) errors.push(`accentColor "${config.accentColor}" must be a hex colour like "#d9e9a4".`);
  if (brandIsHex && accentIsHex) {
    const theme = themeColors(config.brandColor, config.accentColor);
    const tooLight = brandTextPairs(theme)
      .map((pair) => ({ ...pair, contrast: contrastRatio(pair.text, pair.background)! }))
      .find((pair) => pair.contrast < MIN_CONTRAST);
    if (tooLight) {
      errors.push(`brandColor "${config.brandColor}" is too light for ${tooLight.where}: contrast ${tooLight.contrast.toFixed(1)}:1, needs at least ${MIN_CONTRAST}:1. Pick a darker colour.`);
    } else if (luminance(config.accentColor)! <= luminance(config.brandColor)!) {
      // The accent is small text on the brand colour (logo letter, table number, cart bar label).
      errors.push(`accentColor "${config.accentColor}" must be lighter than brandColor "${config.brandColor}": it is used for small text on top of it.`);
    } else {
      const contrast = contrastRatio(config.accentColor, config.brandColor)!;
      if (contrast < MIN_CONTRAST) {
        errors.push(`accentColor "${config.accentColor}" is too close to brandColor (contrast ${contrast.toFixed(1)}:1, needs at least ${MIN_CONTRAST}:1), so text in it is hard to read. Pick a lighter accent.`);
      }
    }
  }

  // --- Categories ---
  const categoryIds = config.categories.map((category) => category.id);
  if (!categoryIds.length) errors.push('categories is empty: add at least one menu tab.');
  for (const category of config.categories) {
    checkId(category.id, 'Category');
    if (category.id === POPULAR) errors.push(`Category id "${POPULAR}" is reserved for the Popular tab: use showPopularTab instead.`);
    needText(category.label, `Category "${category.id}" label`);
  }
  for (const id of duplicates(categoryIds)) errors.push(`Category id "${id}" is used more than once.`);

  // --- Dishes ---
  if (!menu.length) errors.push('The menu has no dishes.');
  for (const id of duplicates(menu.map((item) => item.id))) errors.push(`Dish id "${id}" is used more than once: each dish needs its own id.`);

  for (const item of menu) {
    const dish = `Dish "${item.id}"`;
    checkId(item.id, 'Dish');
    needText(item.name, `${dish} name`);
    needString(item.imageEmoji, `${dish} picture emoji (imageEmoji)`);
    if (!categoryIds.includes(item.category)) {
      errors.push(`${dish} is in category "${item.category}", which isn't in categories (${categoryIds.join(', ') || 'none'}).`);
    }
    if (!Number.isFinite(item.price) || item.price < 0) errors.push(`${dish} price is ${item.price}: it must be 0 or more.`);

    const groups = item.optionGroups ?? [];
    for (const id of duplicates(groups.map((group) => group.id))) errors.push(`${dish} has two option groups with id "${id}".`);
    for (const group of groups) {
      const where = `${dish}, option group "${group.id}"`;
      checkId(group.id, `${dish} option group`);
      needText(group.label, `${where} label`);
      if (!group.choices.length) errors.push(`${where} has no choices: add at least one, or remove the group.`);
      for (const id of duplicates(group.choices.map((choice) => choice.id))) errors.push(`${where} has two choices with id "${id}".`);
      for (const choice of group.choices) {
        checkId(choice.id, `${where} choice`);
        needText(choice.label, `${where}, choice "${choice.id}" label`);
        if (!Number.isFinite(choice.price)) errors.push(`${where}, choice "${choice.id}" price is ${choice.price}: it must be a number.`);
      }
    }
    // Discounts from several groups add up, so check the cheapest choice of every group together.
    const cheapest = groups.reduce((sum, group) => {
      const prices = group.choices.map((choice) => choice.price).filter(Number.isFinite);
      return prices.length ? sum + Math.min(...prices) : sum;
    }, item.price);
    if (Number.isFinite(item.price) && cheapest < 0) {
      errors.push(`${dish} can cost ${cheapest.toFixed(2)} with its cheapest choices: the discounts take off more than the dish costs.`);
    }
  }

  // --- Warnings: allowed, but probably not what the shop wants ---
  for (const id of categoryIds) {
    if (!menu.some((item) => item.category === id)) warnings.push(`Category "${id}" has no dishes, so its tab will be empty.`);
  }
  if (config.showPopularTab && !menu.some((item) => item.popular)) {
    warnings.push('showPopularTab is true but no dish has popular: true, so the Popular tab will be empty.');
  }
  if (menu.length && !menu.some((item) => item.available)) warnings.push('Every dish is marked unavailable.');

  return { errors, warnings };
}

// Runs checkShop and stops with a readable list if anything is wrong. Used when the site is built.
export function assertShopIsValid(config: ShopConfig, menu: MenuItem[]) {
  const { errors, warnings } = checkShop(config, menu);
  if (warnings.length) console.warn(`Shop config warnings for "${config.name}":\n${warnings.map((line) => `  - ${line}`).join('\n')}`);
  if (errors.length) {
    throw new Error(`Shop config for "${config.name}" has ${errors.length} problem(s). Fix these in shops/<shop>/config.ts or menu.ts:\n${errors.map((line) => `  - ${line}`).join('\n')}`);
  }
}
