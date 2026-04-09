import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TileData } from './contentSlice';

interface WatchlistState {
  items: TileData[];
}

const initialState: WatchlistState = {
  items: [],
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    hydrateWatchlist(state, action: PayloadAction<TileData[]>) {
      state.items = action.payload;
    },
    toggleWatchlist(state, action: PayloadAction<TileData>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    clearWatchlist(state) {
      state.items = [];
    },
  },
});

export const { hydrateWatchlist, toggleWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
