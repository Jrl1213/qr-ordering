import { describe, expect, it } from 'vitest';
import { menuItems, shopConfig } from '../app/data/shop';
import { assertShopIsValid, checkShop, contrastWithWhite } from './checkShop';
import type { MenuItem, ShopConfig } from './types';

const label = { en: 'JRL', zh: 'JRL', ms: 'JRL' };
const dish: MenuItem = {
  id: 'jrl-dish', category: 'noodles', popular: true, name: label, description: label,
  price: 10, available: true, imageEmoji: '🍜', imageTone: 'jade',
};

// Checks a changed copy of the demo shop and returns its errors.
const errorsFor = (config: Partial<ShopConfig> = {}, menu: MenuItem[] = [dish]) =>
  checkShop({ ...shopConfig, ...config }, menu).errors;

describe('checkShop', () => {
  it('passes the shop this site is built for', () => {
    expect(checkShop(shopConfig, menuItems)).toEqual({ errors: [], warnings: [] });
  });

  it('passes a small valid shop', () => {
    expect(errorsFor({ categories: [{ id: 'noodles', label }] })).toEqual([]);
  });

  it('needs a WhatsApp number when demo mode is off', () => {
    expect(errorsFor({ demoMode: false, whatsappNumber: '' })[0]).toMatch(/whatsappNumber is empty, but demoMode is false/);
    expect(errorsFor({ demoMode: false, whatsappNumber: '60123456789' })).toEqual([]);
    expect(errorsFor({ demoMode: true, whatsappNumber: '' })).toEqual([]);
  });

  it('rejects badly written WhatsApp numbers', () => {
    expect(errorsFor({ whatsappNumber: '+60 12-345 6789' })[0]).toMatch(/digits only/);
    expect(errorsFor({ whatsappNumber: '0123456789' })[0]).toMatch(/starts with 0/);
    expect(errorsFor({ whatsappNumber: '6012' })[0]).toMatch(/8 to 15/);
  });

  it('needs every dish category to exist', () => {
    expect(errorsFor({}, [{ ...dish, category: 'desserts' }])).toContainEqual(expect.stringMatching(/category "desserts", which isn't in categories/));
  });

  it('needs at least one table, as a whole number', () => {
    expect(errorsFor({ maxTables: 0 })[0]).toMatch(/maxTables is 0/);
    expect(errorsFor({ maxTables: 2.5 })[0]).toMatch(/whole number/);
  });

  it('needs a QR colour dark enough to scan', () => {
    expect(errorsFor({ qrColor: '#8fd3b0' })[0]).toMatch(/too light/);
    expect(errorsFor({ qrColor: 'green' })[0]).toMatch(/hex colour/);
    expect(errorsFor({ qrColor: '#000' })).toEqual([]);
  });

  it('works out contrast like WCAG', () => {
    expect(contrastWithWhite('#000000')).toBeCloseTo(21);
    expect(contrastWithWhite('#ffffff')).toBeCloseTo(1);
    expect(contrastWithWhite('#767676')).toBeCloseTo(4.54, 1);
  });

  it('catches a tax rate written as a percent', () => {
    expect(errorsFor({ serviceTaxRate: 6 })[0]).toMatch(/0\.06 for 6%/);
    expect(errorsFor({ serviceTaxEnabled: true, serviceTaxRate: 0 })[0]).toMatch(/serviceTaxRate is 0/);
  });

  it('needs text in every offered language', () => {
    const blankZh = { ...label, zh: ' ' };
    expect(errorsFor({}, [{ ...dish, name: blankZh }])).toEqual(['Dish "jrl-dish" name has no text for zh.']);
    // A language the shop doesn't offer can stay blank.
    expect(errorsFor({ languages: ['en', 'ms'] }, [{ ...dish, name: blankZh }])).toEqual([]);
  });

  it('catches duplicate and badly written ids', () => {
    expect(errorsFor({}, [dish, dish])).toContainEqual(expect.stringMatching(/Dish id "jrl-dish" is used more than once/));
    expect(errorsFor({ categories: [...shopConfig.categories, { id: 'Noodles', label }] })).toContainEqual(expect.stringMatching(/must be lowercase/));
    expect(errorsFor({ categories: [...shopConfig.categories, { id: 'popular', label }] })).toContainEqual(expect.stringMatching(/reserved for the Popular tab/));
  });

  it('checks option groups and choices', () => {
    const choice = { id: 'jrl-a', label, price: 0 };
    const group = { id: 'size', label, choices: [choice] };
    expect(errorsFor({}, [{ ...dish, optionGroups: [group, group] }])).toEqual(['Dish "jrl-dish" has two option groups with id "size".']);
    expect(errorsFor({}, [{ ...dish, optionGroups: [{ ...group, choices: [] }] }])).toEqual(['Dish "jrl-dish", option group "size" has no choices: add at least one, or remove the group.']);
    expect(errorsFor({}, [{ ...dish, optionGroups: [{ ...group, choices: [choice, choice] }] }])).toEqual(['Dish "jrl-dish", option group "size" has two choices with id "jrl-a".']);
    // A discount is fine, but not one bigger than the dish price.
    expect(errorsFor({}, [{ ...dish, optionGroups: [{ ...group, choices: [{ ...choice, price: -1 }] }] }])).toEqual([]);
    expect(errorsFor({}, [{ ...dish, optionGroups: [{ ...group, choices: [{ ...choice, price: -11 }] }] }])[0]).toMatch(/takes off more than the dish costs/);
  });

  it('warns about empty tabs but does not fail', () => {
    const { errors, warnings } = checkShop(shopConfig, [dish]);
    expect(errors).toEqual([]);
    expect(warnings).toContainEqual('Category "rice" has no dishes, so its tab will be empty.');
  });

  it('stops with every error listed', () => {
    expect(() => assertShopIsValid({ ...shopConfig, maxTables: 0, qrColor: '#fff' }, menuItems)).toThrow(/2 problem\(s\)[\s\S]*maxTables[\s\S]*qrColor/);
  });
});
