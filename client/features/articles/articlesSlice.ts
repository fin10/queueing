import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import articlesAPI, { ArticleSummary } from './articlesAPI';

const ACTION_NAME = 'articles';

export interface ArticlesState {
  readonly articles: ArticleSummary[];
  readonly totalPages?: number;
}

export const fetchArticles = createAsyncThunk(`${ACTION_NAME}/fetch`, (page: number) => {
  return articlesAPI.fetch(page);
});

const initialState: ArticlesState = {
  articles: [],
};

const articlesSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.articles = action.payload.notes;
      state.totalPages = action.payload.totalPages;
    });
  },
});

export const selectArticles = (state: RootState) => state.articles;

export const selectArticleIds = (state: RootState) => selectArticles(state).articles.map(({ id }) => id);

export const selectTotalPages = (state: RootState) => selectArticles(state).totalPages;

export const selectArticleById = (state: RootState, id: string) =>
  selectArticles(state).articles.find((article) => article.id === id);

export default articlesSlice.reducer;
