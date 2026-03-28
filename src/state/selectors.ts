import type { RootState } from './store';

export const selectFocus = (state: RootState) => state.focus;
export const selectRows = (state: RootState) => state.content.rows;
export const selectDetailOverlay = (state: RootState) => state.ui.detailOverlay;
export const selectPerfHudVisible = (state: RootState) => state.ui.perfHudVisible;

export const selectFocusedTile = (state: RootState) => {
  const { rowIndex, tileIndex } = state.focus;
  const row = state.content.rows[rowIndex];
  return row?.tiles[tileIndex] ?? null;
};
