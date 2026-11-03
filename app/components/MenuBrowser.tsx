import { useMemo, useState } from 'react';
import { menuItems, shopConfig, type Language, type MenuItem } from '../data/shop';
import type { Copy } from '../lib/copy';
import { categoryLabel, filterMenu, menuTabs } from '../lib/menuFilter';
import { MenuCard } from './MenuCard';

type Props = { t: Copy; language: Language; canOrder: boolean; onAdd: (item: MenuItem) => void };

// Search box, category tabs and the list of dishes.
export function MenuBrowser({ t, language, canOrder, onAdd }: Props) {
  const tabs = menuTabs(t, language);
  const [category, setCategory] = useState(tabs[0].id);
  const [search, setSearch] = useState('');
  const filteredItems = useMemo(() => filterMenu(menuItems, category, search), [category, search]);

  return (
    <>
      <section className="menu-toolbar" aria-label="Browse menu">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder={shopConfig.searchHint[language]} aria-label={shopConfig.searchHint[language]} />
        </label>
        <nav className="category-list" aria-label="Menu categories">
          {tabs.map((tab) => (
            <button className={category === tab.id ? 'category active' : 'category'} type="button" key={tab.id} onClick={() => setCategory(tab.id)} aria-pressed={category === tab.id}>{tab.label}</button>
          ))}
        </nav>
      </section>

      <section className="menu-section" aria-live="polite">
        <div className="section-heading">
          <div><p className="eyebrow">{t.favourites}</p><h2>{categoryLabel(t, language, category)}</h2></div>
          <span>{filteredItems.length} {t.items}</span>
        </div>
        {filteredItems.length ? (
          <div className="menu-grid">
            {filteredItems.map((item) => <MenuCard key={item.id} item={item} t={t} language={language} canOrder={canOrder} onAdd={onAdd} />)}
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
