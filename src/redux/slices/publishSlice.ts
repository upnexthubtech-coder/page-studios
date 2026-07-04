import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PublishState {
  lastVersion: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: PublishState = {
  lastVersion: null,
  status: 'idle',
};

export const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    publishing: (state) => {
      state.status = 'loading';
    },
    publishSuccess: (state, action: PayloadAction<string>) => {
      state.status = 'success';
      state.lastVersion = action.payload;
    },
    publishError: (state) => {
      state.status = 'error';
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
});

export const { publishing, publishSuccess, publishError, resetStatus } =
  publishSlice.actions;
export default publishSlice.reducer;