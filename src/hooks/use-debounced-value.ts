import { useEffect, useState } from 'react';

/** Debounce unstable text inputs bound for server-backed search queries. */
export function useDebouncedValue<T>(value: T, delayMs = 360): T {
  const [out, setOut] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setOut(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return out;
}
