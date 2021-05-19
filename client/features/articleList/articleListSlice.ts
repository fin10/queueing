import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import articleListApis, { ArticleSummary } from './articleListApis';

export interface ArticleListState {
  readonly loading: boolean;
  readonly articles: ArticleSummary[];
  readonly totalPages?: number;
  readonly error?: SerializedError;
}

export const fetchArticles = createAsyncThunk('articleList/fetch', (page: number) => {
  return articleListApis.fetchArticles(page);
});

const initialState: ArticleListState = {
  loading: true,
  articles: [],
};

const articleListSlice = createSlice({
  name: 'articleList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.notes;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const selectArticleList = (state: { articleList: ArticleListState }) => state.articleList;

export default articleListSlice.reducer;
