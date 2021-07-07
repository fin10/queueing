import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'underscore';
import { RootState } from '../../app/store';
import articlesAPI, { ArticleSummary } from './articlesAPI';

const ACTION_NAME = 'articles';

export interface ArticlesState {
  readonly byId: { readonly [key: string]: ArticleSummary };
  readonly allIds: string[];
  readonly totalPages?: number;
}

export const fetchArticles = createAsyncThunk(`${ACTION_NAME}/fetch`, async (page: number, { rejectWithValue }) => {
  try {
    return await articlesAPI.fetch(page);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const initialState: ArticlesState = {
  byId: {},
  allIds: [],
};

const articlesSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      const ids = action.payload.notes.map(({ id }) => id);
      state.byId = _.object(ids, action.payload.notes);
      state.allIds = ids;
      state.totalPages = action.payload.totalPages;
    });
  },
});

export const selectArticleIds = (state: RootState) => state.articles.allIds;

export const selectTotalPages = (state: RootState) => state.articles.totalPages;

export const selectArticleById = (state: RootState, id: string) => state.articles.byId[id];

export default articlesSlice.reducer;
