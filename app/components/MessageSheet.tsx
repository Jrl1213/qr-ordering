import { shopConfig } from '../data/shop';
import type { Copy } from '../lib/copy';

type Props = { message: string; t: Copy; onClose: () => void; onSend: () => void };

// Shows the exact WhatsApp message before the customer opens WhatsApp.
export function MessageSheet({ message, t, onClose, onSend }: Props) {
  return (
    <div className="overlay">
      <section className="sheet preview-sheet" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <div className="sheet-header">
          <div><p className="eyebrow">WHATSAPP</p><h2 id="preview-title">{t.previewTitle}</h2></div>
          <button className="close-button static" type="button" onClick={onClose} aria-label={t.close}>×</button>
        </div>
        <div className="sheet-body">
          <p className="preview-intro">{t.previewBody}</p>
          <div className="placeholder-number">
            {shopConfig.whatsappNumber ? <><span>{t.sendsTo}</span><strong>+{shopConfig.whatsappNumber}</strong></> : <span>{t.noNumber}</span>}
          </div>
          <pre className="message-preview">{message}</pre>
          <button className="whatsapp-button" type="button" onClick={onSend}><span aria-hidden="true">◉</span>{t.openWhatsapp}</button>
          {shopConfig.demoMode && <p className="final-demo">{t.demo}</p>}
        </div>
      </section>
    </div>
  );
}
