import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'underscore';
import { RootState } from '../../app/store';
import articleSummaryAPI, { ArticleSummary } from './articleSummaryAPI';

const ACTION_NAME = 'articleSummary';

export interface ArticleSummaryState {
  readonly byId: { readonly [key: string]: ArticleSummary };
  readonly allIds: string[];
  readonly totalPages?: number;
}

export const fetchArticleSummaries = createAsyncThunk(
  `${ACTION_NAME}/fetch`,
  async (page: number, { rejectWithValue }) => {
    try {
      return await articleSummaryAPI.fetch(page);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const initialState: ArticleSummaryState = {
  byId: {},
  allIds: [],
};

const articleSummarySlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticleSummaries.fulfilled, (state, action) => {
      const ids = action.payload.summaries.map(({ id }) => id);
      state.byId = _.object(ids, action.payload.summaries);
      state.allIds = ids;
      state.totalPages = action.payload.totalPages;
    });
  },
});

export const selectArticleSummaryIds = (state: RootState) => state.articleSummary.allIds;

export const selectTotalPages = (state: RootState) => state.articleSummary.totalPages;

export const selectArticleSummaryById = (state: RootState, id: string) => state.articleSummary.byId[id];

export default articleSummarySlice.reducer;
