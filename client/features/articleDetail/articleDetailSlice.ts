import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'client/app/store';
import { Logger } from 'client/utils/Logger';
import articleDetailAPI, { ArticleDetail } from './articleDetailAPI';

const ACTION_NAME = 'articleDetail';

export interface ArticleDetailState {
  readonly byId: { readonly [key: string]: ArticleDetail };
}

export const fetchArticleDetail = createAsyncThunk(`${ACTION_NAME}/fetch`, async (id: string, { rejectWithValue }) => {
  try {
    return await articleDetailAPI.fetch(id);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const likeArticle = createAsyncThunk(`${ACTION_NAME}/like`, async (id: string, { rejectWithValue }) => {
  try {
    return await articleDetailAPI.like(id);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const initialState: ArticleDetailState = {
  byId: {},
};

const articleDetailSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticleDetail.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
    });
    builder.addCase(likeArticle.fulfilled, (state, action) => {
      const article = state.byId[action.payload.id];
      if (!article) {
        Logger.warn(`Article Detail not loaded: ${action.payload.id}`);
        return;
      }
      article.like = action.payload.likes;
    });
  },
});

export const selectArticleDetailById = (state: RootState, id: string) => state.articleDetail.byId[id];

export default articleDetailSlice.reducer;
