import { useState } from 'react';
import type { Language } from '../data/config';
import type { MenuItem } from '../data/menu';
import { findOption, MAX_NOTE_LENGTH, MAX_QUANTITY, type CartLine } from '../lib/cart';
import { spiceLabels, type Copy } from '../lib/copy';
import { formatMoney, getUnitPrice } from '../lib/pricing';

// What the customer picked in this panel (everything in a cart line except its key and dish).
export type ItemChoice = Pick<CartLine, 'quantity' | 'optionId' | 'spice' | 'note'>;

type Props = {
  item: MenuItem;
  // The cart line being edited, or null when adding a new one.
  editing: CartLine | null;
  t: Copy;
  language: Language;
  onSave: (choice: ItemChoice) => void;
  onClose: () => void;
};

const spiceDots = (level: string) => level === 'None' ? '○' : level === 'Mild' ? '●' : level === 'Medium' ? '●●' : '●●●';

// The panel for choosing a dish's option, spice, note and quantity.
export function ItemSheet({ item, editing, t, language, onSave, onClose }: Props) {
  const [quantity, setQuantity] = useState(editing?.quantity ?? 1);
  const [optionId, setOptionId] = useState<string | null>(editing ? editing.optionId : item.options?.[0]?.id ?? null);
  const [spice, setSpice] = useState(editing?.spice ?? item.spiceLevels?.[0] ?? 'None');
  const [note, setNote] = useState(editing?.note ?? '');

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sheet item-sheet" role="dialog" aria-modal="true" aria-labelledby="item-title">
        <button className="close-button" type="button" onClick={onClose} aria-label={t.close}>×</button>
        <div className={`item-hero tone-${item.imageTone}`}><span>{item.imageEmoji}</span></div>
        <div className="sheet-body">
          <p className="eyebrow">{t.choose}</p>
          <h2 id="item-title">{item.name[language]}</h2>
          <p className="item-description">{item.description[language]}</p>
          {item.options && (
            <fieldset>
              <legend>{t.option}</legend>
              <div className="choice-list">
                {item.options.map((option) => (
                  <label className={optionId === option.id ? 'choice selected' : 'choice'} key={option.id}>
                    <input type="radio" name="option" checked={optionId === option.id} onChange={() => setOptionId(option.id)} />
                    <span>{option.label[language]}</span>
                    <strong>{option.price ? `+${formatMoney(option.price)}` : '—'}</strong>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {item.spiceLevels && (
            <fieldset>
              <legend>{t.spice}</legend>
              <div className="spice-list">
                {item.spiceLevels.map((level) => (
                  <button type="button" className={spice === level ? 'spice selected' : 'spice'} key={level} onClick={() => setSpice(level)} aria-pressed={spice === level}>
                    <span aria-hidden="true">{spiceDots(level)}</span>{spiceLabels[language][level]}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <label className="note-field">
            <span>{t.note}</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t.noteHint} maxLength={MAX_NOTE_LENGTH} />
          </label>
          <div className="quantity-row">
            <span>{t.quantity}</span>
            <div className="stepper">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
              <strong>{quantity}</strong>
              <button type="button" onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))} aria-label="Increase quantity">＋</button>
            </div>
          </div>
          <button className="primary-button" type="button" onClick={() => onSave({ quantity, optionId, spice, note: note.trim() })}>
            <span>{editing ? t.updateOrder : t.addToOrder}</span>
            <strong>{formatMoney(getUnitPrice(item, findOption(item, optionId)) * quantity)}</strong>
          </button>
        </div>
      </section>
    </div>
  );
}
