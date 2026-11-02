import type { MenuItem, OptionGroup } from '../types';

// Edit this single list to change dishes, prices, photos/placeholders and availability.
// Option group and choice ids are saved in carts: keep them the same when renaming or reordering.
// This shop offers English and Malay only, so the Chinese ('zh') text is left empty.

// Groups used by several drinks, written once here.
const hotOrIced = (icedPrice: number): OptionGroup => ({
  id: 'temperature', label: { en: 'Hot or iced', zh: '', ms: 'Panas atau ais' }, choices: [
    { id: 'hot', label: { en: 'Hot', zh: '', ms: 'Panas' }, price: 0 },
    { id: 'iced', label: { en: 'Iced', zh: '', ms: 'Ais' }, price: icedPrice },
  ],
});
const milk: OptionGroup = {
  id: 'milk', label: { en: 'Milk', zh: '', ms: 'Susu' }, choices: [
    { id: 'fresh-milk', label: { en: 'Fresh milk', zh: '', ms: 'Susu segar' }, price: 0 },
    { id: 'oat-milk', label: { en: 'Oat milk', zh: '', ms: 'Susu oat' }, price: 2 },
  ],
};
const sweetness: OptionGroup = {
  id: 'sweetness', label: { en: 'Sweetness', zh: '', ms: 'Kemanisan' }, choices: [
    { id: 'regular-sweet', label: { en: 'Regular sweet', zh: '', ms: 'Manis biasa' }, price: 0 },
    { id: 'less-sweet', label: { en: 'Less sweet', zh: '', ms: 'Kurang manis' }, price: 0 },
    { id: 'no-sugar', label: { en: 'No sugar', zh: '', ms: 'Tanpa gula' }, price: 0 },
  ],
};

export const menuItems: MenuItem[] = [
  {
    id: 'house-latte', category: 'coffee', popular: true,
    name: { en: 'House Latte', zh: '', ms: 'Latte Rumah' },
    description: { en: 'Double espresso with silky steamed milk.', zh: '', ms: 'Espreso berganda dengan susu stim yang lembut.' },
    price: 11.00, available: true, imageEmoji: '☕', imageTone: 'gold',
    optionGroups: [hotOrIced(1), milk],
  },
  {
    id: 'flat-white', category: 'coffee',
    name: { en: 'Flat White', zh: '', ms: 'Flat White' },
    description: { en: 'A smaller, stronger milk coffee.', zh: '', ms: 'Kopi susu yang lebih kecil dan pekat.' },
    price: 10.50, available: true, imageEmoji: '☕', imageTone: 'clay',
    optionGroups: [milk],
  },
  {
    id: 'gula-melaka-latte', category: 'coffee', popular: true,
    name: { en: 'Gula Melaka Latte', zh: '', ms: 'Latte Gula Melaka' },
    description: { en: 'Latte sweetened with palm sugar syrup.', zh: '', ms: 'Latte dengan sirap gula melaka.' },
    price: 13.00, available: true, imageEmoji: '🥛', imageTone: 'gold',
    optionGroups: [hotOrIced(1), milk, sweetness],
  },
  {
    id: 'long-black', category: 'coffee',
    name: { en: 'Long Black', zh: '', ms: 'Long Black' },
    description: { en: 'Espresso over hot water. No milk.', zh: '', ms: 'Espreso dengan air panas. Tanpa susu.' },
    price: 8.50, available: true, imageEmoji: '☕', imageTone: 'plum',
    optionGroups: [hotOrIced(0)],
  },
  {
    id: 'matcha-latte', category: 'non-coffee', popular: true,
    name: { en: 'Matcha Latte', zh: '', ms: 'Latte Matcha' },
    description: { en: 'Stone-ground green tea with milk.', zh: '', ms: 'Teh hijau kisar dengan susu.' },
    price: 13.50, available: true, imageEmoji: '🍵', imageTone: 'jade',
    optionGroups: [hotOrIced(1), milk, sweetness],
  },
  {
    id: 'chocolate', category: 'non-coffee',
    name: { en: 'Dark Chocolate', zh: '', ms: 'Coklat Pekat' },
    description: { en: 'Rich cocoa with steamed milk.', zh: '', ms: 'Koko pekat dengan susu stim.' },
    price: 12.00, available: true, imageEmoji: '🍫', imageTone: 'clay',
    optionGroups: [hotOrIced(1), sweetness],
  },
  {
    id: 'lemon-soda', category: 'non-coffee',
    name: { en: 'Honey Lemon Soda', zh: '', ms: 'Soda Limau Madu' },
    description: { en: '', zh: '', ms: '' },
    price: 9.00, available: true, imageEmoji: '🍋', imageTone: 'tea',
  },
  {
    id: 'kaya-butter-toast', category: 'brunch', popular: true,
    name: { en: 'Kaya Butter Toast', zh: '', ms: 'Roti Bakar Kaya Mentega' },
    description: { en: 'Thick toast, house kaya and cold butter.', zh: '', ms: 'Roti tebal, kaya buatan sendiri dan mentega sejuk.' },
    price: 7.50, available: true, imageEmoji: '🍞', imageTone: 'gold',
    optionGroups: [
      { id: 'eggs', label: { en: 'Eggs', zh: '', ms: 'Telur' }, choices: [
        { id: 'no-eggs', label: { en: 'No eggs', zh: '', ms: 'Tanpa telur' }, price: 0 },
        { id: 'two-soft-eggs', label: { en: '2 soft-boiled eggs', zh: '', ms: '2 biji telur separuh masak' }, price: 3 },
      ] },
    ],
  },
  {
    id: 'big-breakfast', category: 'brunch',
    name: { en: 'Big Breakfast', zh: '', ms: 'Sarapan Besar' },
    description: { en: 'Eggs, chicken sausage, mushrooms, beans and sourdough.', zh: '', ms: 'Telur, sosej ayam, cendawan, kacang dan roti masam.' },
    price: 24.00, available: true, imageEmoji: '🍳', imageTone: 'clay',
    optionGroups: [
      { id: 'egg-style', label: { en: 'Eggs', zh: '', ms: 'Telur' }, choices: [
        { id: 'scrambled', label: { en: 'Scrambled', zh: '', ms: 'Hancur' }, price: 0 },
        { id: 'sunny-side-up', label: { en: 'Sunny side up', zh: '', ms: 'Mata kerbau' }, price: 0 },
        { id: 'poached', label: { en: 'Poached', zh: '', ms: 'Rebus tanpa kulit' }, price: 0 },
      ] },
    ],
  },
  {
    id: 'mushroom-toast', category: 'brunch',
    name: { en: 'Garlic Mushroom Toast', zh: '', ms: 'Roti Bakar Cendawan Bawang Putih' },
    description: { en: 'Sautéed mushrooms on sourdough. Vegetarian.', zh: '', ms: 'Cendawan tumis atas roti masam. Vegetarian.' },
    price: 18.00, available: false, imageEmoji: '🍄', imageTone: 'plum',
  },
  {
    id: 'burnt-cheesecake', category: 'cakes', popular: true,
    name: { en: 'Burnt Cheesecake', zh: '', ms: 'Kek Keju Bakar' },
    description: { en: 'Creamy inside, caramelised outside. One slice.', zh: '', ms: 'Lembut di dalam, karamel di luar. Satu hirisan.' },
    price: 14.00, available: true, imageEmoji: '🍰', imageTone: 'gold',
  },
  {
    id: 'pandan-chiffon', category: 'cakes',
    name: { en: 'Pandan Chiffon', zh: '', ms: 'Kek Span Pandan' },
    description: { en: 'Light and fluffy, with a pandan aroma.', zh: '', ms: 'Ringan dan gebu, dengan aroma pandan.' },
    price: 8.00, available: true, imageEmoji: '🧁', imageTone: 'tea',
  },
];
