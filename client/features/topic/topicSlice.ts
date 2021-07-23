import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'client/app/store';
import topicAPI, { Topic } from './topicAPI';

const ACTION_NAME = 'topic';

export interface TopicState {
  readonly topics: Topic[];
}

export const fetchTopic = createAsyncThunk(`${ACTION_NAME}/fetch`, async (_, { rejectWithValue }) => {
  try {
    return await topicAPI.fetch();
  } catch (err) {
    return rejectWithValue(err);
  }
});

const initialState: TopicState = {
  topics: [],
};

const topicSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTopic.fulfilled, (state, action) => {
      state.topics = action.payload;
    });
  },
});

export const selectTopics = (state: RootState) => state.topic.topics;

export default topicSlice.reducer;
