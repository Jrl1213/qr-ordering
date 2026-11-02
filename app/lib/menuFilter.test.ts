import { describe, expect, it } from 'vitest';
import { menuItems, POPULAR, shopConfig } from '../data/shop';
import { copy } from './copy';
import { categoryLabel, filterMenu, menuTabs } from './menuFilter';

const ids = (category: Parameters<typeof filterMenu>[1], search = '') => filterMenu(menuItems, category, search).map((item) => item.id);

describe('filterMenu', () => {
  it('shows popular dishes on the Popular tab', () => {
    expect(ids(POPULAR)).toEqual(menuItems.filter((item) => item.popular).map((item) => item.id));
  });

  it('shows only dishes from the chosen category', () => {
    expect(ids('drinks')).toEqual(['jasmine-lime-tea', 'roasted-rice-tea', 'plum-soda']);
  });

  it('includes sold-out dishes (they are shown greyed out)', () => {
    expect(ids('rice')).toContain('crispy-tofu-rice');
  });

  it('searches names and descriptions in every language, ignoring case and spaces', () => {
    expect(ids('drinks', '  TEA ')).toEqual(['jasmine-lime-tea', 'roasted-rice-tea']);
    expect(ids('drinks', '玄米')).toEqual(['roasted-rice-tea']);
    expect(ids('drinks', 'asam boi')).toEqual(['plum-soda']);
  });

  it('searches only inside the chosen tab', () => {
    expect(ids('noodles', 'tea')).toEqual([]);
  });

  it('returns nothing when no dish matches', () => {
    expect(ids(POPULAR, 'zzz')).toEqual([]);
  });
});

describe('menuTabs', () => {
  it('starts with Popular, then the shop categories in order', () => {
    expect(menuTabs(copy.en, 'en').map((tab) => tab.label)).toEqual(['Popular', 'Noodles', 'Rice', 'Skewers', 'Drinks']);
    expect(menuTabs(copy.zh, 'zh').map((tab) => tab.label)).toEqual(['人氣', '麵類', '飯類', '串燒', '飲料']);
  });

  it('leaves out Popular when the shop turns it off', () => {
    const tabs = menuTabs(copy.en, 'en', { ...shopConfig, showPopularTab: false });
    expect(tabs.map((tab) => tab.id)).toEqual(['noodles', 'rice', 'skewers', 'drinks']);
  });
});

describe('categoryLabel', () => {
  it('names a category in the chosen language', () => {
    expect(categoryLabel(copy.ms, 'ms', 'skewers')).toBe('Sate');
    expect(categoryLabel(copy.ms, 'ms', POPULAR)).toBe('Popular');
  });
});
