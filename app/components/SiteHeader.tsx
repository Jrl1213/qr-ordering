import { restaurantConfig, type Language } from '../data/config';
import type { Copy } from '../lib/copy';

type Props = { t: Copy; table: string | null; language: Language; onLanguageChange: (language: Language) => void };

export function SiteHeader({ t, table, language, onLanguageChange }: Props) {
  return (
    <header className="topbar">
      <a className="brand" href="#menu" aria-label={`${restaurantConfig.name} home`}>
        <span className="brand-mark" aria-hidden="true">玉</span>
        <span><strong>{restaurantConfig.name}</strong><small>{restaurantConfig.chineseName} · {restaurantConfig.malayName}</small></span>
      </a>
      <div className="top-actions">
        {table && <span className="table-pill">{t.table} {table}</span>}
        <label className="language-select">
          <span className="sr-only">Language</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} aria-label="Choose language">
            <option value="en">EN</option>
            <option value="zh">中文</option>
            <option value="ms">BM</option>
          </select>
        </label>
      </div>
    </header>
  );
}
