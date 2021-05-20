import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import articleListApis, { ArticleSummary } from './articleListApis';

const ACTION_NAME = 'articleList';

export interface ArticleListState {
  readonly articles: ArticleSummary[];
  readonly totalPages?: number;
}

export const fetchArticles = createAsyncThunk(`${ACTION_NAME}/fetch`, (page: number) => {
  return articleListApis.fetchArticles(page);
});

const initialState: ArticleListState = {
  articles: [],
};

const articleListSlice = createSlice({
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

export const selectArticleList = (state: RootState) => state.articleList;

export const selectArticleIds = (state: RootState) => selectArticleList(state).articles.map(({ id }) => id);

export const selectTotalPages = (state: RootState) => selectArticleList(state).totalPages;

export const selectArticleById = (state: RootState, id: string) =>
  selectArticleList(state).articles.find((article) => article.id === id);

export default articleListSlice.reducer;
