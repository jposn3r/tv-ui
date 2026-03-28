import { configureStore } from '@reduxjs/toolkit';
import focusReducer from './slices/focusSlice';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    focus: focusReducer,
    content: contentReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
