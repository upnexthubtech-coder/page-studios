import { configureStore } from '@reduxjs/toolkit';
import draftPageReducer from './slices/draftPageSlice';
import uiReducer from './slices/uiSlice';
import publishReducer from './slices/publishSlice';

export const store = configureStore({
  reducer: {
    draftPage: draftPageReducer,
    ui: uiReducer,
    publish: publishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;