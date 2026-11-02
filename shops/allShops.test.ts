import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkShop } from './checkShop';
import type { MenuItem, ShopConfig } from './types';

// The build only checks the shop it is built for (app/data/shop.ts). This test checks every
// shop folder in shops/, so a sample shop that isn't built today can't quietly break.

const folders = readdirSync(new URL('.', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

type Shop = { folder: string; shopConfig: ShopConfig; menuItems: MenuItem[] };
const shops: Shop[] = await Promise.all(folders.map(async (folder) => ({
  folder,
  shopConfig: (await import(`./${folder}/config.ts`)).shopConfig,
  menuItems: (await import(`./${folder}/menu.ts`)).menuItems,
})));

describe('every shop folder', () => {
  it('finds the sample shops', () => {
    expect(folders).toEqual(expect.arrayContaining(['jade-noodle-house', 'jrl-cafe']));
  });

  it.each(folders)('%s has a config.ts and menu.ts that pass the checker', (folder) => {
    const shop = shops.find((each) => each.folder === folder)!;
    expect(shop.shopConfig, `${folder}/config.ts must export shopConfig`).toBeDefined();
    expect(shop.menuItems, `${folder}/menu.ts must export menuItems`).toBeDefined();
    expect(checkShop(shop.shopConfig, shop.menuItems).errors).toEqual([]);
  });

  it('gives each shop its own saved-cart key', () => {
    // Two shops with the same key on one phone would load each other's carts.
    const keys = shops.map((shop) => shop.shopConfig.cartStorageKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
