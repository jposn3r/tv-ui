import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TileData } from './contentSlice';

export type PageId = 'home' | 'tvShows' | 'movies' | 'newPopular' | 'myList' | 'search';

interface UIState {
  activePage: PageId;
  navFocused: boolean;
  navIndex: number;
  detailOverlay: {
    open: boolean;
    tile: TileData | null;
    buttonIndex: number;
  };
  perfHudVisible: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  activePage: 'home',
  navFocused: false,
  navIndex: 0,
  detailOverlay: {
    open: false,
    tile: null,
    buttonIndex: 0,
  },
  perfHudVisible: false,
  searchQuery: '',
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
    setActivePage(state, action: PayloadAction<PageId>) {
      state.activePage = action.payload;
      state.searchQuery = '';
    },
    setNavFocused(state, action: PayloadAction<boolean>) {
      state.navFocused = action.payload;
    },
    setNavIndex(state, action: PayloadAction<number>) {
      state.navIndex = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    appendSearchChar(state, action: PayloadAction<string>) {
      state.searchQuery += action.payload;
    },
    deleteSearchChar(state) {
      state.searchQuery = state.searchQuery.slice(0, -1);
    },
    clearSearchQuery(state) {
      state.searchQuery = '';
    },
  },
});

export const {
  openDetail, closeDetail, setDetailButtonIndex, togglePerfHud,
  setActivePage, setNavFocused, setNavIndex,
  setSearchQuery, appendSearchChar, deleteSearchChar, clearSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
