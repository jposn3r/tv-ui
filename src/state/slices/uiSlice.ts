import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TileData } from './contentSlice';

export type PageId = 'home' | 'tvShows' | 'movies' | 'newPopular' | 'myList' | 'search' | 'settings';
export type InteractionMode = 'web' | 'tv';

interface UIState {
  interactionMode: InteractionMode;
  activePage: PageId;
  navFocused: boolean;
  navIndex: number;
  heroFocused: boolean;
  heroButtonIndex: number;
  detailOverlay: {
    open: boolean;
    tile: TileData | null;
    buttonIndex: number;
  };
  perfHudVisible: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  interactionMode: 'web',
  activePage: 'home',
  navFocused: false,
  navIndex: 0,
  heroFocused: false,
  heroButtonIndex: 0,
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
    setHeroFocused(state, action: PayloadAction<boolean>) {
      state.heroFocused = action.payload;
      if (action.payload) {
        state.heroButtonIndex = 0;
      }
    },
    setHeroButtonIndex(state, action: PayloadAction<number>) {
      state.heroButtonIndex = action.payload;
    },
    setInteractionMode(state, action: PayloadAction<InteractionMode>) {
      state.interactionMode = action.payload;
    },
  },
});

export const {
  openDetail, closeDetail, setDetailButtonIndex, togglePerfHud,
  setActivePage, setNavFocused, setNavIndex,
  setSearchQuery, appendSearchChar, deleteSearchChar, clearSearchQuery,
  setHeroFocused, setHeroButtonIndex, setInteractionMode,
} = uiSlice.actions;
export default uiSlice.reducer;
