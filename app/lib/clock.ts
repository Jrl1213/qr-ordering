// The current minute, for React's useSyncExternalStore. A whole minute (a number) is used so React
// only redraws when it changes. It is checked every second (cheap: a number compare) and when the
// customer comes back to the tab, so the page and sendOrder agree on open/closed within a second.
// null while the page is built (no clock yet).
export const clockStore = {
  subscribe(listener: () => void) {
    const timer = setInterval(listener, 1_000);
    document.addEventListener('visibilitychange', listener);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', listener);
    };
  },
  getSnapshot: () => Math.floor(Date.now() / 60_000),
  getServerSnapshot: (): number | null => null,
};

export const minuteToDate = (minute: number | null) => (minute === null ? null : new Date(minute * 60_000));
