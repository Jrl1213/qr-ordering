import type { Language, MenuItem } from '../data/shop';
import type { Copy } from '../lib/copy';
import { categoryLabel } from '../lib/menuFilter';
import { formatMoney } from '../lib/pricing';

type Props = { item: MenuItem; t: Copy; language: Language; onAdd: (item: MenuItem) => void };

export function MenuCard({ item, t, language, onAdd }: Props) {
  return (
    <article className={`menu-card ${!item.available ? 'is-unavailable' : ''}`}>
      <div className={`dish-photo tone-${item.imageTone}`} role="img" aria-label={`Safe photo placeholder for ${item.name[language]}`}>
        <span className="food-emoji">{item.imageEmoji}</span>
        <small>{item.popular ? t.popular : categoryLabel(t, language, item.category)}</small>
      </div>
      <div className="dish-copy">
        <div>
          <div className="dish-title-row">
            <h3>{item.name[language]}</h3>
            {!item.available && <span className="sold-out">{t.unavailable}</span>}
          </div>
          <p>{item.description[language]}</p>
        </div>
        <div className="dish-footer">
          <strong>{formatMoney(item.price)}</strong>
          <button type="button" onClick={() => onAdd(item)} disabled={!item.available} aria-label={`${t.add} ${item.name[language]}`}>{item.available ? '＋' : '×'}</button>
        </div>
      </div>
    </article>
  );
}
