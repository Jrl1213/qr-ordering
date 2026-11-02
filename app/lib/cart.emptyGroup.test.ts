import { describe, expect, it, vi } from 'vitest';
import { cleanLine, defaultChoices, findItem } from './cart';

// A test dish with a group that has no choices. Mocked in its own file because vi.mock applies to the whole file.
vi.mock('../data/shop', async (importOriginal) => {
  const real = await importOriginal<typeof import('../data/shop')>();
  const label = { en: 'JRL', zh: 'JRL', ms: 'JRL' };
  const noodles = real.menuItems.find((item) => item.id === 'jade-scallion-noodles')!;
  return { ...real, menuItems: [...real.menuItems, { ...noodles, id: 'jrl-empty-group', optionGroups: [{ id: 'size', label, choices: [] }, ...noodles.optionGroups!] }] };
});

describe('a dish with an empty option group', () => {
  // Nothing can be picked in an empty group, so it must not drop the dish from the cart.
  it('ignores the empty group', () => {
    expect(defaultChoices(findItem('jrl-empty-group')!)).toEqual({ topping: 'classic', spice: 'none' });
    const line = { key: 'a', itemId: 'jrl-empty-group', quantity: 1, choices: { topping: 'classic', spice: 'none' }, note: '' };
    expect(cleanLine(line)?.choices).toEqual({ topping: 'classic', spice: 'none' });
  });
});
