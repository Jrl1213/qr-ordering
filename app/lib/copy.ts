import { shopConfig, type Language, type Weekday } from '../data/shop';

// The app's own text in each language (the same for every shop).
// A shop's own text (name, hero, categories…) is in its config in shops/.
const en = {
  table: 'Table', scanToOrder: 'Scan to order', dineIn: 'Dine in', open: 'Open now',
  popular: 'Popular', favourites: 'House favourites', items: 'items', unavailable: 'Sold out', from: 'from', add: 'Add',
  noTableTitle: 'No table number found', noTableBody: 'Please scan the QR code on your table.',
  choose: 'Make it yours', quantity: 'Quantity', note: 'Special note (optional)', noteHint: 'e.g. no spring onion', cancel: 'Cancel', addToOrder: 'Add to order', updateOrder: 'Update item',
  yourOrder: 'Your order', empty: 'Your cart is empty', emptyBody: 'Add a dish to start your table order.', cart: 'View cart', edit: 'Edit', remove: 'Remove', subtotal: 'Subtotal', serviceTax: 'Service tax', total: 'Total', continue: 'Continue browsing', preview: 'Preview order message',
  previewTitle: 'Check your WhatsApp message', previewBody: 'This is the exact message that will open in WhatsApp. Send it there to place your order.', sendsTo: 'Sends to', noNumber: 'Demo: no shop number is set, so WhatsApp will ask you to choose a chat.', openWhatsapp: 'Open WhatsApp', close: 'Close',
  demo: 'Demo only — orders are not actually submitted', privacy: 'No names, phone numbers or payment details are collected.', noResults: 'No dishes match your search.', clear: 'Clear search', qrManager: 'Staff QR cards', howItWorks: 'How it works',
  closed: 'Closed now', openUntil: 'until {time}', closedTitle: "We're closed right now", pausedBody: "We're not taking orders at the moment.",
  opensAt: 'We open again {day} at {time}.', browseOnly: 'You can still look through the menu.', hoursTitle: 'Opening hours', closedDay: 'Closed', today: 'today', tomorrow: 'tomorrow', nextWeekday: 'next {day}', midnight: 'midnight',
  days: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' } as Record<Weekday, string>,
};

export type Copy = typeof en;

export const copy: Record<Language, Copy> = {
  en,
  zh: {
    table: '桌號', scanToOrder: '掃碼點餐', dineIn: '堂食', open: '營業中',
    popular: '人氣', favourites: '店內人氣', items: '款', unavailable: '售罄', from: '起', add: '加入',
    noTableTitle: '找不到桌號', noTableBody: '請掃描桌上的 QR 碼。',
    choose: '選擇口味', quantity: '數量', note: '備註（選填）', noteHint: '例如：不要蔥', cancel: '取消', addToOrder: '加入訂單', updateOrder: '更新品項',
    yourOrder: '您的訂單', empty: '購物車是空的', emptyBody: '加入一道餐點開始點餐。', cart: '查看購物車', edit: '編輯', remove: '移除', subtotal: '小計', serviceTax: '服務稅', total: '總計', continue: '繼續選購', preview: '預覽訂單訊息',
    previewTitle: '檢查 WhatsApp 訊息', previewBody: '以下訊息將在 WhatsApp 中開啟。在 WhatsApp 發送即完成點餐。', sendsTo: '發送至', noNumber: '示範：未設定店家號碼，WhatsApp 會請您自行選擇聊天對象。', openWhatsapp: '開啟 WhatsApp', close: '關閉',
    demo: '僅供示範 — 訂單不會實際提交', privacy: '不會收集姓名、電話或付款資料。', noResults: '找不到符合的餐點。', clear: '清除搜尋', qrManager: '員工 QR 卡', howItWorks: '運作方式',
    closed: '休息中', openUntil: '營業至 {time}', closedTitle: '本店目前休息中', pausedBody: '目前暫停接單。',
    opensAt: '{day} {time} 恢復營業。', browseOnly: '您仍可瀏覽菜單。', hoursTitle: '營業時間', closedDay: '休息', today: '今天', tomorrow: '明天', nextWeekday: '下{day}', midnight: '午夜',
    days: { mon: '星期一', tue: '星期二', wed: '星期三', thu: '星期四', fri: '星期五', sat: '星期六', sun: '星期日' },
  },
  ms: {
    table: 'Meja', scanToOrder: 'Imbas untuk pesan', dineIn: 'Makan sini', open: 'Dibuka',
    popular: 'Popular', favourites: 'Kegemaran ramai', items: 'hidangan', unavailable: 'Habis', from: 'dari', add: 'Tambah',
    noTableTitle: 'Nombor meja tiada', noTableBody: 'Sila imbas kod QR di meja anda.',
    choose: 'Pilih citarasa anda', quantity: 'Kuantiti', note: 'Nota khas (pilihan)', noteHint: 'cth. tanpa daun bawang', cancel: 'Batal', addToOrder: 'Tambah ke pesanan', updateOrder: 'Kemas kini item',
    yourOrder: 'Pesanan anda', empty: 'Troli anda kosong', emptyBody: 'Tambah hidangan untuk mula memesan.', cart: 'Lihat troli', edit: 'Edit', remove: 'Buang', subtotal: 'Jumlah kecil', serviceTax: 'Cukai perkhidmatan', total: 'Jumlah', continue: 'Teruskan memilih', preview: 'Pratonton mesej pesanan',
    previewTitle: 'Semak mesej WhatsApp', previewBody: 'Inilah mesej yang akan dibuka dalam WhatsApp. Hantar di sana untuk membuat pesanan.', sendsTo: 'Dihantar ke', noNumber: 'Demo: tiada nombor kedai, jadi WhatsApp akan minta anda pilih sembang.', openWhatsapp: 'Buka WhatsApp', close: 'Tutup',
    demo: 'Demo sahaja — pesanan tidak dihantar', privacy: 'Nama, nombor telefon dan butiran pembayaran tidak dikumpul.', noResults: 'Tiada hidangan sepadan.', clear: 'Kosongkan carian', qrManager: 'Kad QR staf', howItWorks: 'Cara ia berfungsi',
    closed: 'Tutup sekarang', openUntil: 'hingga {time}', closedTitle: 'Kami sedang tutup', pausedBody: 'Kami tidak menerima pesanan buat masa ini.',
    opensAt: 'Kami buka semula {day}, jam {time}.', browseOnly: 'Anda masih boleh melihat menu.', hoursTitle: 'Waktu operasi', closedDay: 'Tutup', today: 'hari ini', tomorrow: 'esok', nextWeekday: '{day} depan', midnight: 'tengah malam',
    days: { mon: 'Isnin', tue: 'Selasa', wed: 'Rabu', thu: 'Khamis', fri: 'Jumaat', sat: 'Sabtu', sun: 'Ahad' },
  },
};

// In demo mode these sentences replace the real-shop ones above.
const demoCopy: Record<Language, Pick<Copy, 'noTableBody' | 'previewBody'>> = {
  en: { noTableBody: 'Please scan the QR code on your table, or add ?table=1 to the web address for this demo.', previewBody: 'This is the exact message that will open in WhatsApp. Nothing is submitted by this demo.' },
  zh: { noTableBody: '請掃描桌上的 QR 碼，或在示範網址後加入 ?table=1。', previewBody: '以下訊息將在 WhatsApp 中開啟。本示範不會實際提交訂單。' },
  ms: { noTableBody: 'Sila imbas kod QR di meja anda, atau tambah ?table=1 pada alamat web untuk demo ini.', previewBody: 'Inilah mesej yang akan dibuka dalam WhatsApp. Tiada pesanan dihantar oleh demo ini.' },
};

// The text for one language, with the demo sentences when the shop is in demo mode.
export const getCopy = (language: Language, demoMode: boolean = shopConfig.demoMode): Copy =>
  demoMode ? { ...copy[language], ...demoCopy[language] } : copy[language];

// How each language is named in the language picker.
export const languageLabels: Record<Language, string> = { en: 'EN', zh: '中文', ms: 'BM' };
