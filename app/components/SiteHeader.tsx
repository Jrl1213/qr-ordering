import { shopConfig, type Language } from '../data/shop';
import { languageLabels, type Copy } from '../lib/copy';

type Props = { t: Copy; table: string | null; language: Language; onLanguageChange: (language: Language) => void };

export function SiteHeader({ t, table, language, onLanguageChange }: Props) {
  return (
    <header className="topbar">
      <a className="brand" href="#menu" aria-label={`${shopConfig.name} home`}>
        <span className="brand-mark" aria-hidden="true">{shopConfig.logoMark}</span>
        <span><strong>{shopConfig.name}</strong>{shopConfig.otherNames.length > 0 && <small>{shopConfig.otherNames.join(' · ')}</small>}</span>
      </a>
      <div className="top-actions">
        {table && <span className="table-pill">{t.table} {table}</span>}
        {shopConfig.languages.length > 1 && (
          <label className="language-select">
            <span className="sr-only">Language</span>
            <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} aria-label="Choose language">
              {shopConfig.languages.map((code) => <option value={code} key={code}>{languageLabels[code]}</option>)}
            </select>
          </label>
        )}
      </div>
    </header>
  );
}
