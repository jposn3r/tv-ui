import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TileData {
  id: string;
  title: string;
  year: number;
  rating: string;
  genre: string;
  synopsis: string;
  imageIndex: number;
  backdropPath?: string;
  logoPath?: string;
  tmdbId?: number;
  mediaType?: 'movie' | 'tv';
}

export interface RowData {
  id: string;
  title: string;
  tiles: TileData[];
}

interface ContentState {
  rows: RowData[];
}

const initialState: ContentState = {
  rows: [],
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContent(state, action: PayloadAction<RowData[]>) {
      state.rows = action.payload;
    },
  },
});

export const { setContent } = contentSlice.actions;
export default contentSlice.reducer;
