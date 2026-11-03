import type { Metadata } from 'next';
import Link from 'next/link';
import { menuItems, shopConfig } from '../data/shop';
import { defaultChoices, type CartLine } from '../lib/cart';
import { buildOrder } from '../lib/order';
import { buildOrderMessage } from '../lib/orderMessage';
import { calculateTotals, priceCart } from '../lib/pricing';

export const metadata: Metadata = {
  title: `How it works — ${shopConfig.name}`,
  description: 'How QR table ordering works for a café: scan, choose, send on WhatsApp.',
};

// The sample is made by the same code the customer's phone uses, from this shop's first dishes,
// so it always matches the real message. It is shown without the demo line, as a real shop would get it.
function sampleMessage(): string {
  const dishes = menuItems.filter((item) => item.available).slice(0, 3);
  const cart: CartLine[] = dishes.map((item, index) => ({
    key: `sample-${item.id}`, itemId: item.id, quantity: index === 0 ? 2 : 1, choices: defaultChoices(item),
    note: index === 0 ? 'No peanuts please' : '',
  }));
  const entries = priceCart(cart);
  return buildOrderMessage(buildOrder(entries, calculateTotals(entries), 'en', '5'), { ...shopConfig, demoMode: false });
}

// WhatsApp shows *text* in bold; do the same here so the sample looks like the real chat.
const withBold = (line: string) =>
  line.split(/\*([^*]+)\*/).map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part));

const steps = [
  { title: 'The customer scans the code on the table', body: 'Each table has its own printed QR card. Scanning it opens your menu on their phone, with the table number already attached. No app to install and no sign-up.' },
  { title: 'They choose their food', body: 'They browse the menu in English, 中文 or Bahasa Malaysia, pick options such as spice level, add a note, and see the total with tax before they send anything.' },
  { title: 'The order arrives on your WhatsApp', body: 'One tap opens WhatsApp with the whole order written out, and they press send. It lands in the shop’s own WhatsApp chat, so there is no new screen for your team to learn.' },
];

export default function HowItWorks() {
  const message = sampleMessage();
  return (
    <main className="how-page">
      <header className="how-header">
        <span className="private-badge">FOR CAFÉ OWNERS</span>
        <h1>How QR ordering works</h1>
        <p>Three steps from the customer’s table to your counter. This is a sample using the {shopConfig.name} menu.</p>
      </header>

      <ol className="how-steps">
        {steps.map((step) => <li key={step.title}><h2>{step.title}</h2><p>{step.body}</p></li>)}
      </ol>

      <section className="how-sample" aria-labelledby="how-sample-title">
        <h2 id="how-sample-title">What your team receives</h2>
        <p>This is a sample order for table 5, written by the same code that customers use.</p>
        <div className="chat-bubble" role="img" aria-label="Sample WhatsApp order message">
          {message.split('\n').map((line, index) => <p key={index}>{line ? withBold(line) : ' '}</p>)}
        </div>
      </section>

      <section className="how-notes">
        <h2>Good to know</h2>
        <ul>
          <li>Customers pay the way they do now, at the counter. Online payment is not part of this.</li>
          <li>Orders come in on your WhatsApp. They are not saved on a server or shown on a separate order screen.</li>
          <li>The site collects no names, phone numbers or payment details.</li>
          <li>You can set your opening hours, and switch the shop to “closed” when you need to stop taking orders.</li>
        </ul>
      </section>

      <p className="how-back"><Link href="/?table=1">Try the sample menu as Table 1 →</Link></p>
    </main>
  );
}
