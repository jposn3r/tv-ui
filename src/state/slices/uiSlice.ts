import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TileData } from './contentSlice';

interface UIState {
  detailOverlay: {
    open: boolean;
    tile: TileData | null;
    buttonIndex: number;
  };
  perfHudVisible: boolean;
}

const initialState: UIState = {
  detailOverlay: {
    open: false,
    tile: null,
    buttonIndex: 0,
  },
  perfHudVisible: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDetail(state, action: PayloadAction<TileData>) {
      state.detailOverlay.open = true;
      state.detailOverlay.tile = action.payload;
      state.detailOverlay.buttonIndex = 0;
    },
    closeDetail(state) {
      state.detailOverlay.open = false;
      state.detailOverlay.tile = null;
      state.detailOverlay.buttonIndex = 0;
    },
    setDetailButtonIndex(state, action: PayloadAction<number>) {
      state.detailOverlay.buttonIndex = action.payload;
    },
    togglePerfHud(state) {
      state.perfHudVisible = !state.perfHudVisible;
    },
  },
});

export const { openDetail, closeDetail, setDetailButtonIndex, togglePerfHud } =
  uiSlice.actions;
export default uiSlice.reducer;
