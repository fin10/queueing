import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Logger } from 'client/utils/Logger';
import _ from 'underscore';
import { RootState } from '../../app/store';
import commentsAPI, { Comment } from './commentsAPI';
import actionAPI from '../action/actionAPI';

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

export const addComment = createAsyncThunk(
  `${ACTION_NAME}/add`,
  async ({ articleId, contents }: { articleId: string; contents: string }, { rejectWithValue }) => {
    try {
      return await commentsAPI.addComment(articleId, contents);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeComment = createAsyncThunk(`${ACTION_NAME}/remove`, async (id: string, { rejectWithValue }) => {
  try {
    return await commentsAPI.removeComment(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const likeComment = createAsyncThunk(`${ACTION_NAME}/like`, async (id: string, { rejectWithValue }) => {
  try {
    return await actionAPI.like(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const dislikeComment = createAsyncThunk(`${ACTION_NAME}/dislike`, async (id: string, { rejectWithValue }) => {
  try {
    return await actionAPI.dislike(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

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
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
      if (!state.allIds.find((id) => id === action.payload.id)) {
        state.allIds.push(action.payload.id);
      }
    });
    builder.addCase(removeComment.fulfilled, (state, action) => {
      if (!state.byId[action.payload]) {
        Logger.warn(`Comment not loaded: ${action.payload}`);
        return;
      }
      state.allIds = _.without(state.allIds, action.payload);
      delete state.byId[action.payload];
    });
    builder.addMatcher(
      (action) => action.type === likeComment.fulfilled.type || action.type === dislikeComment.fulfilled.type,
      (state, action) => {
        const comment = state.byId[action.payload.id];
        if (!comment) {
          Logger.warn(`Comment Detail not loaded: ${action.payload.id}`);
          return;
        }
        comment.likes = action.payload.likes;
        comment.dislikes = action.payload.dislikes;
      },
    );
  },
});

export const selectCommentIds = (state: RootState) => state.comments.allIds;

export const selectCommentById = (state: RootState, id: string) => state.comments.byId[id];

export default articleSummarySlice.reducer;
