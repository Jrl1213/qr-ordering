import type { Category, MenuItem } from '../data/menu';

// Dishes in the chosen tab that match the search in any language.
export function filterMenu(items: MenuItem[], category: Category, search: string): MenuItem[] {
  const query = search.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const inCategory = category === 'Popular' ? item.popular : item.category === category;
    const searchable = `${item.name.en} ${item.name.zh} ${item.name.ms} ${item.description.en} ${item.description.zh} ${item.description.ms}`.toLocaleLowerCase();
    return inCategory && (!query || searchable.includes(query));
  });
}
