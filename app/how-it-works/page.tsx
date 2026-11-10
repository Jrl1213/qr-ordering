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

// Simple outline icons in the shop's colour (currentColor), so they look the same on every phone.
const svgProps = { viewBox: '0 0 48 48', width: 48, height: 48, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const ScanIcon = () => (
  <svg {...svgProps}><rect x="12" y="4" width="24" height="40" rx="5" /><rect x="18" y="12" width="7" height="7" /><rect x="29" y="12" width="3" height="3" /><rect x="18" y="23" width="3" height="3" /><rect x="24" y="23" width="8" height="8" /></svg>
);
const ChooseIcon = () => (
  <svg {...svgProps}><rect x="9" y="6" width="30" height="36" rx="4" /><path d="M16 17h16M16 25h16M16 33h9" /></svg>
);
const SendIcon = () => (
  <svg {...svgProps}><path d="M8 10h32a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H24l-9 8v-8H8a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" /><path d="M14 18h20M14 25h12" /></svg>
);

// One line each: the diagram is for a quick look, the sample message below shows the detail.
const steps = [
  { side: 'Customer', Icon: ScanIcon, label: 'Scans the QR on the table', hint: 'Each table’s code already holds its table number.' },
  { side: 'Customer', Icon: ChooseIcon, label: 'Picks food and sends', hint: '' },
  { side: 'Your shop', Icon: SendIcon, label: 'Gets the order on WhatsApp', hint: '' },
];

export default function HowItWorks() {
  const message = sampleMessage();
  return (
    <main className="how-page">
      <header className="how-header">
        <span className="private-badge">FOR CAFÉ OWNERS</span>
        <h1>How QR ordering works</h1>
        <p>From the customer’s table to your WhatsApp, in three steps. The sample below uses the {shopConfig.name} menu.</p>
      </header>

      <ol className="how-flow" aria-label="The three steps">
        {steps.map(({ side, Icon, label, hint }) => (
          <li key={label} className={side === 'Your shop' ? 'is-shop' : undefined}>
            <span className="flow-side">{side}</span>
            <span className="flow-icon"><Icon /></span>
            <strong>{label}</strong>
            {hint && <small>{hint}</small>}
          </li>
        ))}
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
