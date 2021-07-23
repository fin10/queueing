import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'underscore';
import { RootState } from '../../app/store';
import commentsAPI, { Comment } from './commentsAPI';

const ACTION_NAME = 'comments';

export interface CommentsState {
  readonly byId: { readonly [key: string]: Comment };
  readonly allIds: string[];
}

export const fetchComments = createAsyncThunk(
  `${ACTION_NAME}/fetch`,
  async (articleId: string, { rejectWithValue }) => {
    try {
      return await commentsAPI.fetch(articleId);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const initialState: CommentsState = {
  byId: {},
  allIds: [],
};

const articleSummarySlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      const ids = action.payload.map(({ id }) => id);
      state.byId = _.object(ids, action.payload);
      state.allIds = ids;
    });
  },
});

export const selectCommentIds = (state: RootState) => state.comments.allIds;

export const selectCommentById = (state: RootState, id: string) => state.comments.byId[id];

export default articleSummarySlice.reducer;
