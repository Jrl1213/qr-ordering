import type { Category } from '../data/menu';
import type { Language } from '../data/config';

// The menu tabs, in the order they appear.
export const categories: Category[] = ['Popular', 'Noodles', 'Rice', 'Skewers', 'Drinks'];

// All page text in each language.
export const copy = {
  en: {
    table: 'Table', dineIn: 'Dine in', hero: 'A bowl worth slowing down for.', intro: 'Hand-pulled noodles, sizzling skewers and comforting rice bowls—made fresh when you order.', open: 'Open now', time: '15–20 min',
    search: 'Search noodles, rice, drinks…', popular: 'Popular', noodles: 'Noodles', rice: 'Rice', skewers: 'Skewers', drinks: 'Drinks', favourites: 'House favourites', items: 'items', unavailable: 'Sold out', from: 'from', add: 'Add',
    noTableTitle: 'No table number found', noTableBody: 'Please scan the QR code on your table, or add ?table=1 to the web address for this demo.',
    choose: 'Make it yours', option: 'Option', spice: 'Spice level', quantity: 'Quantity', note: 'Special note (optional)', noteHint: 'e.g. no spring onion', cancel: 'Cancel', addToOrder: 'Add to order', updateOrder: 'Update item',
    yourOrder: 'Your order', empty: 'Your cart is empty', emptyBody: 'Add a dish to start your table order.', cart: 'View cart', edit: 'Edit', remove: 'Remove', subtotal: 'Subtotal', serviceTax: 'Service tax', total: 'Total', continue: 'Continue browsing', preview: 'Preview order message',
    previewTitle: 'Check your WhatsApp message', previewBody: 'This is the exact message that will open in WhatsApp. Nothing is submitted by this demo.', sendsTo: 'Sends to', noNumber: 'Demo: no shop number is set, so WhatsApp will ask you to choose a chat.', openWhatsapp: 'Open WhatsApp', close: 'Close',
    demo: 'Demo only — orders are not actually submitted', privacy: 'No names, phone numbers or payment details are collected.', noResults: 'No dishes match your search.', clear: 'Clear search', qrManager: 'Staff QR cards',
  },
  zh: {
    table: '桌號', dineIn: '堂食', hero: '值得慢慢品味的一碗。', intro: '手工麵、炭香串燒與暖心飯類，下單後新鮮製作。', open: '營業中', time: '15–20 分鐘',
    search: '搜尋麵、飯、飲料…', popular: '人氣', noodles: '麵類', rice: '飯類', skewers: '串燒', drinks: '飲料', favourites: '店內人氣', items: '款', unavailable: '售罄', from: '起', add: '加入',
    noTableTitle: '找不到桌號', noTableBody: '請掃描桌上的 QR 碼，或在示範網址後加入 ?table=1。',
    choose: '選擇口味', option: '選項', spice: '辣度', quantity: '數量', note: '備註（選填）', noteHint: '例如：不要蔥', cancel: '取消', addToOrder: '加入訂單', updateOrder: '更新品項',
    yourOrder: '您的訂單', empty: '購物車是空的', emptyBody: '加入一道餐點開始點餐。', cart: '查看購物車', edit: '編輯', remove: '移除', subtotal: '小計', serviceTax: '服務稅', total: '總計', continue: '繼續選購', preview: '預覽訂單訊息',
    previewTitle: '檢查 WhatsApp 訊息', previewBody: '以下訊息將在 WhatsApp 中開啟。本示範不會實際提交訂單。', sendsTo: '發送至', noNumber: '示範：未設定店家號碼，WhatsApp 會請您自行選擇聊天對象。', openWhatsapp: '開啟 WhatsApp', close: '關閉',
    demo: '僅供示範 — 訂單不會實際提交', privacy: '不會收集姓名、電話或付款資料。', noResults: '找不到符合的餐點。', clear: '清除搜尋', qrManager: '員工 QR 卡',
  },
  ms: {
    table: 'Meja', dineIn: 'Makan sini', hero: 'Semangkuk mi untuk dinikmati perlahan.', intro: 'Mi tarik, sate panas dan hidangan nasi yang menenangkan—disediakan segar selepas dipesan.', open: 'Dibuka', time: '15–20 min',
    search: 'Cari mi, nasi, minuman…', popular: 'Popular', noodles: 'Mi', rice: 'Nasi', skewers: 'Sate', drinks: 'Minuman', favourites: 'Kegemaran ramai', items: 'hidangan', unavailable: 'Habis', from: 'dari', add: 'Tambah',
    noTableTitle: 'Nombor meja tiada', noTableBody: 'Sila imbas kod QR di meja anda, atau tambah ?table=1 pada alamat web untuk demo ini.',
    choose: 'Pilih citarasa anda', option: 'Pilihan', spice: 'Tahap pedas', quantity: 'Kuantiti', note: 'Nota khas (pilihan)', noteHint: 'cth. tanpa daun bawang', cancel: 'Batal', addToOrder: 'Tambah ke pesanan', updateOrder: 'Kemas kini item',
    yourOrder: 'Pesanan anda', empty: 'Troli anda kosong', emptyBody: 'Tambah hidangan untuk mula memesan.', cart: 'Lihat troli', edit: 'Edit', remove: 'Buang', subtotal: 'Jumlah kecil', serviceTax: 'Cukai perkhidmatan', total: 'Jumlah', continue: 'Teruskan memilih', preview: 'Pratonton mesej pesanan',
    previewTitle: 'Semak mesej WhatsApp', previewBody: 'Inilah mesej yang akan dibuka dalam WhatsApp. Tiada pesanan dihantar oleh demo ini.', sendsTo: 'Dihantar ke', noNumber: 'Demo: tiada nombor kedai, jadi WhatsApp akan minta anda pilih sembang.', openWhatsapp: 'Buka WhatsApp', close: 'Tutup',
    demo: 'Demo sahaja — pesanan tidak dihantar', privacy: 'Nama, nombor telefon dan butiran pembayaran tidak dikumpul.', noResults: 'Tiada hidangan sepadan.', clear: 'Kosongkan carian', qrManager: 'Kad QR staf',
  },
} as const;

// The text for one language.
export type Copy = (typeof copy)[Language];

export const spiceLabels: Record<Language, Record<string, string>> = {
  en: { None: 'No spice', Mild: 'Mild', Medium: 'Medium', Hot: 'Hot' },
  zh: { None: '不辣', Mild: '微辣', Medium: '中辣', Hot: '大辣' },
  ms: { None: 'Tidak pedas', Mild: 'Sedikit', Medium: 'Sederhana', Hot: 'Pedas' },
};

export const categoryLabel = (t: Copy, category: Category) =>
  t[category.toLocaleLowerCase() as 'popular' | 'noodles' | 'rice' | 'skewers' | 'drinks'];
