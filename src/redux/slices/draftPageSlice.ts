import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Section } from '@/lib/contentfulClient';

interface DraftPageState {
  title: string;
  slug: string;
  sections: Section[];
}

const initialState: DraftPageState = {
  title: '',
  slug: '',
  sections: [],
};

export const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    loadPage: (state, action: PayloadAction<DraftPageState>) => {
      state.title = action.payload.title;
      state.slug = action.payload.slug;
      state.sections = action.payload.sections;
    },
    addSection: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload);
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
    },
    reorderSections: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const moved = state.sections.splice(fromIndex, 1)[0];
      state.sections.splice(toIndex, 0, moved);
    },
    updateSectionProp: (
      state,
      action: PayloadAction<{
        sectionId: string;
        key: string;
        value: unknown;
      }>
    ) => {
      const { sectionId, key, value } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (section) {
        section.props[key] = value;
      }
    },
    updatePageTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const {
  loadPage,
  addSection,
  removeSection,
  reorderSections,
  updateSectionProp,
  updatePageTitle,
} = draftPageSlice.actions;
export default draftPageSlice.reducer;