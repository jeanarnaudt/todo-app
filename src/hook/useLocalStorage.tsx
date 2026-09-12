import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

// A *custom hook* is just a function whose name starts with "use" and
// that calls other hooks. It lets us package stateful logic (state +
// persistence here) into a reusable unit.
//
// The generic <T> makes the hook reusable for any JSON-serializable
// value: Todo[], a Filter string, a settings object, ...
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Passing a *function* to useState is "lazy initialization": it runs
  // only on the very first render, so we hit localStorage + JSON.parse
  // exactly once instead of on every render.
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      // Missing key → fall back to the provided initial value.
      if (stored === null) return initialValue;
      return JSON.parse(stored) as T;
    } catch {
      // Corrupt JSON (or storage access denied) must never crash the
      // app — we just start fresh with the initial value.
      return initialValue;
    }
  });

  // useEffect runs *after* render. The dependency array [key, value]
  // tells React to re-run the effect only when one of them changes —
  // i.e., we write to localStorage exactly when there is something new
  // to save. (StrictMode may run it twice in dev; writing the same
  // string twice is harmless — the effect is idempotent.)
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Same tuple shape as useState, so it's a drop-in replacement.
  return [value, setValue];
}
