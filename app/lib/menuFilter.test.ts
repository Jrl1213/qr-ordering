import { describe, expect, it } from 'vitest';
import { menuItems } from '../data/menu';
import { filterMenu } from './menuFilter';

const ids = (category: Parameters<typeof filterMenu>[1], search = '') => filterMenu(menuItems, category, search).map((item) => item.id);

describe('filterMenu', () => {
  it('shows popular dishes on the Popular tab', () => {
    expect(ids('Popular')).toEqual(menuItems.filter((item) => item.popular).map((item) => item.id));
  });

  it('shows only dishes from the chosen category', () => {
    expect(ids('Drinks')).toEqual(['jasmine-lime-tea', 'roasted-rice-tea', 'plum-soda']);
  });

  it('includes sold-out dishes (they are shown greyed out)', () => {
    expect(ids('Rice')).toContain('crispy-tofu-rice');
  });

  it('searches names and descriptions in every language, ignoring case and spaces', () => {
    expect(ids('Drinks', '  TEA ')).toEqual(['jasmine-lime-tea', 'roasted-rice-tea']);
    expect(ids('Drinks', '玄米')).toEqual(['roasted-rice-tea']);
    expect(ids('Drinks', 'asam boi')).toEqual(['plum-soda']);
  });

  it('searches only inside the chosen tab', () => {
    expect(ids('Noodles', 'tea')).toEqual([]);
  });

  it('returns nothing when no dish matches', () => {
    expect(ids('Popular', 'zzz')).toEqual([]);
  });
});
