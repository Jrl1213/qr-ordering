import { describe, expect, it } from 'vitest';
import { changeLineQuantity, cleanLine, MAX_NOTE_LENGTH, MAX_QUANTITY, parseSavedCart, parseTable, removeLine, saveLine, type CartLine } from './cart';

const line = (overrides: Partial<CartLine> = {}): CartLine => ({
  key: 'a', itemId: 'jade-scallion-noodles', quantity: 1, optionId: 'classic', spice: 'None', note: '', ...overrides,
});

describe('parseTable', () => {
  it.each([
    ['?table=5', '5'],
    ['?table=05', '5'],
    ['?table=1', '1'],
    ['?table=20', '20'],
  ])('accepts %s', (search, table) => {
    expect(parseTable(search)).toBe(table);
  });

  it.each(['', '?table=', '?table=0', '?table=21', '?table=999', '?table=1000', '?table=abc', '?table=-1', '?table=2.5'])('rejects "%s"', (search) => {
    expect(parseTable(search)).toBeNull();
  });
});

describe('cleanLine', () => {
  it('keeps a valid line', () => {
    expect(cleanLine(line({ optionId: 'add-prawns', spice: 'Hot', note: 'JRL test' }))).toEqual(line({ optionId: 'add-prawns', spice: 'Hot', note: 'JRL test' }));
  });

  it.each([
    ['not an object', 'garbage'],
    ['null', null],
    ['a removed dish', line({ itemId: 'dish-that-was-deleted' })],
    ['a sold-out dish', line({ itemId: 'crispy-tofu-rice', optionId: null })],
    ['a removed option', line({ optionId: 'option-removed' })],
    ['a spice level the dish does not have', line({ itemId: 'ginger-chicken-rice', optionId: 'steamed-chicken', spice: 'Hot' })],
    ['an old saved cart that used option positions', { key: 'e', itemId: 'chilli-beef-noodles', quantity: 1, optionIndex: 1, spice: 'Mild', note: '' }],
  ])('drops %s', (_name, raw) => {
    expect(cleanLine(raw)).toBeNull();
  });

  it('limits the quantity and note length', () => {
    const cleaned = cleanLine(line({ quantity: 999, note: 'x'.repeat(500) }));
    expect(cleaned?.quantity).toBe(MAX_QUANTITY);
    expect(cleaned?.note).toHaveLength(MAX_NOTE_LENGTH);
    expect(cleanLine(line({ quantity: 0 }))?.quantity).toBe(1);
  });
});

describe('parseSavedCart', () => {
  it('returns an empty cart for missing or broken data', () => {
    expect(parseSavedCart(null)).toEqual([]);
    expect(parseSavedCart('not json')).toEqual([]);
    expect(parseSavedCart('{"a":1}')).toEqual([]);
  });

  it('keeps only the valid lines', () => {
    const saved = JSON.stringify([line({ key: 'a' }), line({ key: 'b', itemId: 'gone' }), line({ key: 'c', itemId: 'plum-soda', optionId: null })]);
    expect(parseSavedCart(saved).map((entry) => entry.key)).toEqual(['a', 'c']);
  });
});

describe('cart changes', () => {
  const cart = [line({ key: 'a' }), line({ key: 'b', quantity: 3 })];

  it('adds a new line at the end', () => {
    expect(saveLine(cart, line({ key: 'c' })).map((entry) => entry.key)).toEqual(['a', 'b', 'c']);
  });

  it('replaces the line with the same key when editing', () => {
    const edited = saveLine(cart, line({ key: 'a', optionId: 'add-chicken' }));
    expect(edited).toHaveLength(2);
    expect(edited[0].optionId).toBe('add-chicken');
  });

  it('changes the quantity but never below 1', () => {
    expect(changeLineQuantity(cart, 'b', 1)[1].quantity).toBe(4);
    expect(changeLineQuantity(cart, 'a', -1)[0].quantity).toBe(1);
  });

  // A reload caps saved lines at MAX_QUANTITY, so the cart must not go higher either.
  it('never goes above the maximum quantity', () => {
    const full = [line({ key: 'a', quantity: MAX_QUANTITY })];
    expect(changeLineQuantity(full, 'a', 1)[0].quantity).toBe(MAX_QUANTITY);
  });

  it('removes a line', () => {
    expect(removeLine(cart, 'a').map((entry) => entry.key)).toEqual(['b']);
  });

  it('does not change the old cart', () => {
    changeLineQuantity(cart, 'b', 1);
    removeLine(cart, 'a');
    saveLine(cart, line({ key: 'c' }));
    expect(cart).toEqual([line({ key: 'a' }), line({ key: 'b', quantity: 3 })]);
  });
});
