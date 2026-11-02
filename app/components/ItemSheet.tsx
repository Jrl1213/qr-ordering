import { useState } from 'react';
import type { Language, MenuItem } from '../data/shop';
import { defaultChoices, MAX_NOTE_LENGTH, MAX_QUANTITY, optionGroupsOf, pickedChoices, type CartLine } from '../lib/cart';
import type { Copy } from '../lib/copy';
import { formatChoicePrice, formatMoney, getUnitPrice } from '../lib/pricing';

// What the customer picked in this panel (everything in a cart line except its key and dish).
export type ItemChoice = Pick<CartLine, 'quantity' | 'choices' | 'note'>;

type Props = {
  item: MenuItem;
  // The cart line being edited, or null when adding a new one.
  editing: CartLine | null;
  t: Copy;
  language: Language;
  onSave: (choice: ItemChoice) => void;
  onClose: () => void;
};

// The panel for choosing a dish's options (one choice per group), note and quantity.
export function ItemSheet({ item, editing, t, language, onSave, onClose }: Props) {
  const [quantity, setQuantity] = useState(editing?.quantity ?? 1);
  const [choices, setChoices] = useState(() => editing?.choices ?? defaultChoices(item));
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
          {optionGroupsOf(item).map((group) => (
            <fieldset key={group.id}>
              <legend>{group.label[language]}</legend>
              <div className="choice-list">
                {group.choices.map((choice) => {
                  const selected = choices[group.id] === choice.id;
                  return (
                    <label className={selected ? 'choice selected' : 'choice'} key={choice.id}>
                      <input type="radio" name={`group-${group.id}`} checked={selected} onChange={() => setChoices((current) => ({ ...current, [group.id]: choice.id }))} />
                      <span>{choice.label[language]}</span>
                      <strong>{formatChoicePrice(choice.price)}</strong>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
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
          <button className="primary-button" type="button" onClick={() => onSave({ quantity, choices, note: note.trim() })}>
            <span>{editing ? t.updateOrder : t.addToOrder}</span>
            <strong>{formatMoney(getUnitPrice(item, pickedChoices(item, choices)) * quantity)}</strong>
          </button>
        </div>
      </section>
    </div>
  );
}
