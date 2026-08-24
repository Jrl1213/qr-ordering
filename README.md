# Jade Noodle House QR Ordering Demo

A fictional, mobile-first student portfolio project for demonstrating table-side restaurant ordering. It does not collect personal information, process payments or submit real orders.

## Quick start

1. Install Node.js 22 or newer.
2. Run `npm install` in this folder.
3. Run `npm run dev`.
4. Open `http://localhost:3000/?table=1` (use the exact port printed by the terminal).

The ordering page reads the table number from `?table=1`. If it is missing, the customer sees a clear warning and cannot continue to WhatsApp.

## The three files beginners usually edit

- `app/data/menu.ts` — dish names in English, Chinese and Malay; descriptions; prices; categories; availability; spice levels; choices; and safe photo placeholders.
- `app/data/config.ts` — restaurant name, service-tax rate, currency, WhatsApp number and local-cart storage key. The included WhatsApp number is a demo placeholder and must be replaced before any real use.
- `app/globals.css` — site colours are at the very top under `:root`.

## Change a price or availability

Open `app/data/menu.ts`, find the item and change `price: 16.90`. Use `available: false` to show it as sold out. Keep prices as numbers without `RM`.

## Change service tax

Open `app/data/config.ts`. Set `serviceTaxEnabled` to `true` or `false`, and set `serviceTaxRate` as a decimal: `0.06` means 6%.

## Change the WhatsApp destination

Open `app/data/config.ts` and replace `whatsappNumber: '60123456789'`. Use international digits only—no `+`, spaces or dashes. Always send a test order before showing the site to a restaurant.

## Generate table QR cards

Open `/qr`, choose 1–20 tables and press **Print cards**. The cards automatically use the current site address, so published cards point to the published site and local test cards point to localhost.

## Test the unfinished-cart feature

Open `/?table=1`, add an item, then refresh. The cart remains on that device using browser local storage. No cart data is sent to a server.

## Validation

Run `npm run build`. A successful build confirms that the pages compile for deployment.
