import { POPULAR, shopConfig, type Language, type MenuItem, type ShopConfig } from '../data/shop';
import type { Copy } from './copy';

export type MenuTab = { id: string; label: string };

// The menu tabs, in order: "Popular" (if the shop shows it), then the shop's categories.
export const menuTabs = (t: Copy, language: Language, shop: ShopConfig = shopConfig): MenuTab[] => [
  ...(shop.showPopularTab ? [{ id: POPULAR, label: t.popular }] : []),
  ...shop.categories.map((category) => ({ id: category.id, label: category.label[language] })),
];

export const categoryLabel = (t: Copy, language: Language, categoryId: string, shop: ShopConfig = shopConfig) =>
  categoryId === POPULAR ? t.popular : shop.categories.find((category) => category.id === categoryId)?.label[language] ?? categoryId;

// Dishes in the chosen tab that match the search in any language.
export function filterMenu(items: MenuItem[], categoryId: string, search: string): MenuItem[] {
  const query = search.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const inCategory = categoryId === POPULAR ? item.popular : item.category === categoryId;
    const searchable = `${item.name.en} ${item.name.zh} ${item.name.ms} ${item.description.en} ${item.description.zh} ${item.description.ms}`.toLocaleLowerCase();
    return inCategory && (!query || searchable.includes(query));
  });
}
