import { useEffect, useRef } from 'react';

// Closes a pop-up when the Escape key is pressed (e.g. a laptop, or a tablet with a keyboard).
// Escape while typing Chinese with an input method only cancels the typing, so that is skipped.
export function useCloseOnEscape(onClose: () => void) {
  // Keep the newest onClose without re-adding the listener on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) return;
      event.preventDefault();
      onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);
}
