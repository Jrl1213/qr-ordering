# QR Table Ordering for Small Cafés

[![CI](https://github.com/Jrl1213/qr-ordering/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Jrl1213/qr-ordering/actions/workflows/ci.yml)

A mobile-first ordering page for small cafés and restaurants in Malaysia. Customers scan the QR code on their table, browse the menu in English, Chinese or Malay, pick their dishes and options, and the order arrives on the shop's WhatsApp, already tidied up with the table number and total. No app to install, no server and no customer data stored.

**Live demo:** https://jrl-qr-ordering-demo.netlify.app/?table=5 (a made-up shop, "Jade Noodle House"; no real orders are sent)

## Screenshots

| Menu | Choose options | 中文 | WhatsApp message |
|---|---|---|---|
| <img src="docs/screenshots/menu-en.png" alt="Menu page in English for table 5" width="200"> | <img src="docs/screenshots/dish-options.png" alt="Dish sheet with style and spice level choices" width="200"> | <img src="docs/screenshots/menu-zh.png" alt="Menu page in Chinese with two items in the cart" width="200"> | <img src="docs/screenshots/whatsapp-preview.png" alt="Preview of the WhatsApp order message with subtotal, tax and total" width="200"> |

## Features

- **Scan and order:** each table has its own QR code (`?table=5`); the table number goes into the order.
- **Three languages:** English, 中文 and Bahasa Malaysia, switchable at any time and remembered on the phone.
- **Dish options:** pick-one choices such as hot or iced, sweetness or spice level, with price changes, plus a special note.
- **WhatsApp hand-off:** the customer checks the exact message, then sends it to the shop's WhatsApp. Totals include service tax when the shop uses it.
- **Opening hours:** outside opening hours the menu stays readable but ordering is paused, and the page says when the shop opens again.
- **Printable QR cards:** a staff page (`/qr`) prints table cards on A4, 4 or 8 per page.
- **One folder per shop:** a new shop is a copy of a sample folder (`shops/`). A built-in checker stops the build with a plain-English list of mistakes (missing translation, colour too light to read, bad phone number…).

## Tech stack

Next.js 16 (static export, no backend) · React 19 · TypeScript · Tailwind CSS 4 · Vitest (unit tests) · ESLint · `qrcode` · WhatsApp click-to-chat links · Netlify hosting

## How it was built

Built by Jarrell (MMU Diploma in IT student) with AI coding assistants: OpenAI Codex for the first version, then Claude Code. I set the requirements and made the design decisions, reviewed every change through pull requests, and tested on desktop and phone.

## Licence

© 2026 Jarrell. All rights reserved. The code is public so it can be read as a portfolio piece; it is not open source. See [LICENSE](LICENSE).

## Quick start

1. Install Node.js 22 or newer.
2. Run `npm ci` in this folder.
3. Run `npm run dev`.
4. Open `http://localhost:3000/?table=1` (use the exact port printed by the terminal).

The ordering page reads the table number from `?table=1`. If it is missing, the customer sees a clear warning and cannot continue to WhatsApp.

## The files beginners usually edit

Each shop has its own folder in `shops/`. There are two made-up sample shops:

- `shops/jade-noodle-house/` — the demo the live site is built from (noodle shop, English/Chinese/Malay, 6% service tax).
- `shops/jrl-cafe/` — a small café set up differently on purpose (English and Malay only, no service tax, no wait time, brown theme). It is a good folder to copy.

- `shops/jade-noodle-house/menu.ts` — dish names in English, Chinese and Malay; descriptions; prices; categories; availability; option groups (e.g. hot or iced, sweetness, spice level); and safe photo placeholders.
- `shops/jade-noodle-house/config.ts` — everything else about the shop: name, logo letter, page title, languages offered, menu tabs, hero text, service tax, currency, WhatsApp number, number of tables, brand and accent colours (used for the menu page and the QR codes; the link-preview picture `public/og.png` is still the demo's), site address and demo mode. `shops/types.ts` explains every setting.
- `shops/theme.ts` — works out the lighter shades of the brand colour. `app/globals.css` has the neutral colours at the very top under `:root`.

`app/data/shop.ts` picks which shop folder the site is built from.

## Make your own shop

1. **Copy a sample folder.** Copy `shops/jrl-cafe/` and rename the copy, e.g. `shops/my-cafe/` (lowercase letters, digits and dashes).
2. **Fill in `config.ts`.** Change the name, logo letter, page title, hero text, categories and colours. `shops/types.ts` explains every setting. Give it its own `cartStorageKey` (e.g. `'my-cafe-cart-v3'`), otherwise a phone that visited another shop could load that shop's cart.
3. **Choose the languages.** List them in `languages` (the first is the default). Every text needs an entry for `en`, `zh` and `ms`, but a language you don't offer can stay `''`.
4. **Write the menu in `menu.ts`.** One entry per dish. Each `category` must be one of the ids in `config.ts`. See "Add choices to a dish" below for options such as hot or iced.
5. **Build it.** In `app/data/shop.ts`, change both lines from `jade-noodle-house` to your folder name. Run `npm run dev` and open `http://localhost:3000/?table=1`. If something is wrong, the terminal shows a plain-English list of problems (a missing translation, a colour too light to read, a dish in a missing category…). Fix them and save.
6. **Check it.** Add a few dishes to the cart, open the message preview, switch languages, and open `/qr`.
7. **Run the tests.** `npm test` checks every folder in `shops/` with the same rules as the build, so a broken sample shop is caught even when it isn't the one being built. The other tests are written for the demo shop, so **point `app/data/shop.ts` back at `jade-noodle-house` before running them** (or before committing to this repo).
8. **Before going live** (`demoMode: false`): set the shop's real WhatsApp number, check the tax rate with the shop, send a test order to that number, and replace `public/og.png` (the link-preview picture is still the demo's). Real shops' settings (phone number, prices) don't belong in a public repo.

## Demo mode

`demoMode: true` (the demo shop) shows "demo only" notes, the `?table=1` hint and a link to the staff QR page in the footer. Set it to `false` for a real shop: those disappear and the wording is for real customers. The WhatsApp number must be set before turning demo mode off.

## Opening hours and the "shop is closed" switch

Outside opening hours, customers can still read the menu, but the add buttons and the cart are hidden, and the page shows when the shop opens again and the week's hours. In the shop's `config.ts`:

```ts
openingHours: {
  mon: [],                                       // closed all day
  tue: [{ open: '08:00', close: '14:00' }, { open: '17:00', close: '21:00' }], // with a break
  // ...one line for every day, wed to sun
},
timeZone: 'Asia/Kuala_Lumpur',
temporarilyClosed: false,  // true = closed now, whatever the hours (a holiday, a busy day)
closedNotice: null,        // or text in each language, e.g. "Closed for Hari Raya, back on 2 April"
```

- Times are 24-hour `"HH:MM"` at the shop. `"24:00"` means midnight. For hours past midnight, split them over two days.
- `openingHours: null` means no fixed hours: always open (the demo shop uses this).
- The time comes from the customer's phone, so a phone with a wrong clock can see the wrong status. Orders still reach the shop by WhatsApp, so staff can always say no.
- `temporarilyClosed` is part of the site: changing it needs a new build and release.

## Change a price or availability

Open the shop's `menu.ts`, find the item and change `price: 16.90`. Use `available: false` to show it as sold out. Keep prices as numbers without `RM`.

## Add choices to a dish (option groups)

A dish can have several pick-one questions, called option groups (for example "Hot or iced" and "Sweetness"). The customer picks one choice in each group; the first choice is picked at the start. In the shop's `menu.ts`:

```ts
optionGroups: [
  { id: 'temperature', label: { en: 'Hot or iced', zh: '冷熱', ms: 'Panas atau ais' }, choices: [
    { id: 'iced', label: { en: 'Iced', zh: '冰', ms: 'Ais' }, price: 0 },
    { id: 'hot', label: { en: 'Hot', zh: '熱', ms: 'Panas' }, price: 0 },
  ] },
  spiceGroup(['none', 'mild', 'medium']),
],
```

- `price` is added to the dish price (`0` for no change).
- `spiceGroup([...])` (from `shops/optionGroups.ts`) adds a ready-made "Spice level" group with the levels you list.
- Saved carts use the `id`s, so keep them the same when you rename or reorder choices. If you add a group to a dish or remove a choice, carts saved before that drop the dish instead of guessing what the customer wanted.

## Change service tax

Open the shop's `config.ts`. Set `serviceTaxEnabled` to `true` or `false`, and set `serviceTaxRate` as a decimal: `0.06` means 6%.

## Change the WhatsApp destination

Orders go out through the shop's `orderChannel`; today the only choice is `'whatsapp'` (`app/lib/sendOrder.ts` builds one order and sends it, so a server channel can be added later). Open the shop's `config.ts` and set `whatsappNumber` to the shop's number. Use international digits only (country code first), with no `+`, spaces or dashes. The demo leaves it empty, so WhatsApp asks the customer to choose a chat instead of messaging a made-up number. Always send a test order before showing the site to a restaurant.

## Generate table QR cards

Open `/qr`, choose how many tables (up to the shop's `maxTables`) and how many cards per A4 page, then press **Print**. The cards automatically use the current site address, so published cards point to the published site and local test cards point to localhost.

- **4 per page:** A6 cards (105 × 148 mm) with a 60 mm code, sized for A6 table stands.
- **8 per page:** 105 × 74 mm cards with a 46 mm code, for stickers.

The page shows each A4 sheet as it will print. In the print window choose A4, scale 100% (not "fit to page") and the default margins, then cut along the dashed lines. The words "Table" and "Scan to order" appear in every language the shop offers. A long shop name stops at two lines ("…") on the cards. The zero page margin only applies to `/qr`, so printing other pages keeps normal margins. Scan one printed card with a real phone before printing them all.

## Test the unfinished-cart feature

Open `/?table=1`, add an item, then refresh. The cart remains on that device using browser local storage. No cart data is sent to a server.

## Validation

Run `npm test`, `npm run lint` and `npm run build`. The tests check prices, totals, the WhatsApp message and how it is sent, the cart, the menu tabs and search, the demo wording, and every shop folder in `shops/` (files ending in `.test.ts`). The build makes a plain static website in the `out/` folder. There is no server code, so any static host can serve it.

GitHub Actions runs the same checks (plus a TypeScript type check) on every pull request into `develop` and after each merge into it (`.github/workflows/ci.yml`); the badge at the top shows the latest result on `develop`.

## Publish on Netlify

`netlify.toml` already tells Netlify what to do (build with `npm run build`, publish the `out/` folder).

1. In Netlify, choose **Add new project → Import an existing project** and pick this GitHub repo.
2. Keep the settings it reads from `netlify.toml` and deploy.
3. Optional: put the final address in `siteUrl` in the shop's `config.ts` (used for link previews). If it is empty, the address Netlify gives the build is used.
4. Open `/qr` on the live site to print cards that point to the live address.
