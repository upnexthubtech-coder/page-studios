import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedSectionId: string | null;
}

const initialState: UiState = {
  selectedSectionId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSectionId = action.payload;
    },
  },
});

export const { selectSection } = uiSlice.actions;
export default uiSlice.reducer;