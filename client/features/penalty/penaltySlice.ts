import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'client/app/store';
import penaltyAPI, { Penalty } from './penaltyAPI';

const ACTION_NAME = 'penalty';

export interface penaltyState {
  readonly byUserId: { readonly [key: string]: Penalty[] };
}

export const fetchPenalties = createAsyncThunk(`${ACTION_NAME}/fetch`, async (userId: string, { rejectWithValue }) => {
  try {
    return await penaltyAPI.fetchPenalties(userId);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState: penaltyState = {
  byUserId: {},
};

const penaltySlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPenalties.fulfilled, (state, action) => {
      state.byUserId[action.meta.arg] = action.payload;
    });
  },
});

export const selectPenaltiesByUserId = (state: RootState, userId: string) => state.penalty.byUserId[userId] || [];

export default penaltySlice.reducer;
