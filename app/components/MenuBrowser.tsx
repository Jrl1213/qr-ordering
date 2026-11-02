import { useMemo, useState } from 'react';
import type { Language } from '../data/config';
import { menuItems, type Category, type MenuItem } from '../data/menu';
import { categories, categoryLabel, type Copy } from '../lib/copy';
import { filterMenu } from '../lib/menuFilter';
import { MenuCard } from './MenuCard';

type Props = { t: Copy; language: Language; onAdd: (item: MenuItem) => void };

// Search box, category tabs and the list of dishes.
export function MenuBrowser({ t, language, onAdd }: Props) {
  const [category, setCategory] = useState<Category>('Popular');
  const [search, setSearch] = useState('');
  const filteredItems = useMemo(() => filterMenu(menuItems, category, search), [category, search]);

  return (
    <>
      <section className="menu-toolbar" aria-label="Browse menu">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder={t.search} aria-label={t.search} />
        </label>
        <nav className="category-list" aria-label="Menu categories">
          {categories.map((item) => (
            <button className={category === item ? 'category active' : 'category'} type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{categoryLabel(t, item)}</button>
          ))}
        </nav>
      </section>

      <section className="menu-section" aria-live="polite">
        <div className="section-heading">
          <div><p className="eyebrow">{t.favourites}</p><h2>{categoryLabel(t, category)}</h2></div>
          <span>{filteredItems.length} {t.items}</span>
        </div>
        {filteredItems.length ? (
          <div className="menu-grid">
            {filteredItems.map((item) => <MenuCard key={item.id} item={item} t={t} language={language} onAdd={onAdd} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>{t.noResults}</h3>
            <button type="button" onClick={() => setSearch('')}>{t.clear}</button>
          </div>
        )}
      </section>
    </>
  );
}
