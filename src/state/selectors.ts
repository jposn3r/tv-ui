import type { RootState } from './store';

export const selectFocus = (state: RootState) => state.focus;
export const selectRows = (state: RootState) => state.content.rows;
export const selectDetailOverlay = (state: RootState) => state.ui.detailOverlay;
export const selectPerfHudVisible = (state: RootState) => state.ui.perfHudVisible;
export const selectActivePage = (state: RootState) => state.ui.activePage;
export const selectNavFocused = (state: RootState) => state.ui.navFocused;
export const selectNavIndex = (state: RootState) => state.ui.navIndex;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
export const selectSearchResults = (state: RootState) => state.content.searchResults;
export const selectPageCache = (state: RootState) => state.content.pages;

export const selectFocusedTile = (state: RootState) => {
  const { rowIndex, tileIndex } = state.focus;
  const row = state.content.rows[rowIndex];
  return row?.tiles[tileIndex] ?? null;
};
