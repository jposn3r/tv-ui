import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { hydrateWatchlist } from './slices/watchlistSlice';
import type { TileData } from './slices/contentSlice';

const STORAGE_KEY = 'tvui:watchlist:v1';

export function loadWatchlist(): TileData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function attachWatchlistPersistence(store: Store<RootState>) {
  // Hydrate on boot
  const initial = loadWatchlist();
  if (initial.length > 0) {
    store.dispatch(hydrateWatchlist(initial));
  }

  let last = store.getState().watchlist.items;
  store.subscribe(() => {
    const curr = store.getState().watchlist.items;
    if (curr !== last) {
      last = curr;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(curr));
      } catch {
        // quota / privacy mode — ignore
      }
    }
  });
}

/** Wipe all app data from localStorage and reload. */
export function clearAllAppData() {
  try {
    // Remove only our keys (defensive — don't nuke unrelated origins on this domain)
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('tvui:')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
  // Reload to reset all in-memory state cleanly
  window.location.reload();
}
