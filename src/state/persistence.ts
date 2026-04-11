import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { hydrateWatchlist } from './slices/watchlistSlice';
import { setInteractionMode, type InteractionMode } from './slices/uiSlice';
import type { TileData } from './slices/contentSlice';

const STORAGE_KEY = 'tvui:watchlist:v1';
const MODE_KEY = 'tvui:mode:v1';

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

export function loadMode(): InteractionMode {
  try {
    const raw = localStorage.getItem(MODE_KEY);
    if (raw === 'tv' || raw === 'web') return raw;
    return 'web';
  } catch {
    return 'web';
  }
}

export function attachPersistence(store: Store<RootState>) {
  // Hydrate on boot
  const initial = loadWatchlist();
  if (initial.length > 0) {
    store.dispatch(hydrateWatchlist(initial));
  }

  const savedMode = loadMode();
  store.dispatch(setInteractionMode(savedMode));

  let lastWatchlist = store.getState().watchlist.items;
  let lastMode = store.getState().ui.interactionMode;
  store.subscribe(() => {
    const state = store.getState();
    const currWatchlist = state.watchlist.items;
    if (currWatchlist !== lastWatchlist) {
      lastWatchlist = currWatchlist;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currWatchlist));
      } catch { /* ignore */ }
    }
    const currMode = state.ui.interactionMode;
    if (currMode !== lastMode) {
      lastMode = currMode;
      try {
        localStorage.setItem(MODE_KEY, currMode);
      } catch { /* ignore */ }
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
